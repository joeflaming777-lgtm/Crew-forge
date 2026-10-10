import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export class TeamController {
  // CREATE TEAM (TEAM LEADER)
  public static async createTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const leaderProfileId = req.user?.leaderProfileId;
      if (!leaderProfileId) {
        res.status(403).json({ success: false, message: 'Only team leaders can create teams.' });
        return;
      }

      const {
        name,
        description,
        hackathonId,
        maxTeamSize,
        minCandidateScore,
        preferredDept,
        availabilityReq,
        requiredRoles, // Array of { roleName: string; skillNames?: string[]; neededCount?: number }
      } = req.body;

      if (!name || !description || !hackathonId) {
        res.status(400).json({
          success: false,
          message: 'Team name, description, and hackathon are required.',
        });
        return;
      }

      const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
      if (!hackathon) {
        res.status(404).json({ success: false, message: 'Hackathon not found.' });
        return;
      }

      // Check if leader already has a team for this hackathon
      const existingTeam = await prisma.team.findFirst({
        where: { leaderProfileId, hackathonId },
      });
      if (existingTeam) {
        res.status(400).json({
          success: false,
          message: `You already have a team ('${existingTeam.name}') registered for this hackathon.`,
        });
        return;
      }

      const team = await prisma.team.create({
        data: {
          name,
          description,
          hackathonId,
          leaderProfileId,
          maxTeamSize: Number(maxTeamSize) || 6,
          minCandidateScore: Number(minCandidateScore) || 75.0,
          preferredDept: preferredDept || null,
          availabilityReq: availabilityReq || 'Full-time during hackathon',
          status: 'RECRUITING',
          requirements: {
            create: Array.isArray(requiredRoles)
              ? requiredRoles.map((r: any) => ({
                  roleName: typeof r === 'string' ? r : r.roleName,
                  skillNames: r.skillNames ? JSON.stringify(r.skillNames) : null,
                  neededCount: r.neededCount || 1,
                  isRequired: true,
                }))
              : [],
          },
        },
        include: {
          requirements: true,
          hackathon: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Hackathon team created successfully!',
        team,
      });
    } catch (error: any) {
      console.error('Create team error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET ALL TEAMS (PUBLIC / CANDIDATE BROWSE)
  public static async getAllTeams(req: Request, res: Response): Promise<void> {
    try {
      const { hackathonId, search } = req.query;

      const where: any = {};
      if (hackathonId) where.hackathonId = String(hackathonId);
      if (search) {
        where.OR = [
          { name: { contains: String(search) } },
          { description: { contains: String(search) } },
        ];
      }

      const teams = await prisma.team.findMany({
        where,
        include: {
          hackathon: true,
          leader: true,
          requirements: true,
          members: {
            include: {
              candidate: {
                select: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                  department: true,
                  college: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Format team summaries with member count, open roles
      const formatted = teams.map((team) => {
        const filledRoles = team.members.map((m) => m.assignedRole.toLowerCase());
        const openRoles = team.requirements.filter(
          (req) => !filledRoles.includes(req.roleName.toLowerCase())
        );

        return {
          id: team.id,
          name: team.name,
          description: team.description,
          hackathon: team.hackathon,
          leader: team.leader,
          maxTeamSize: team.maxTeamSize,
          currentMemberCount: team.members.length + 1, // +1 for the Team Leader
          minCandidateScore: team.minCandidateScore,
          status: team.status,
          requirements: team.requirements,
          openRoles: openRoles.map((r) => r.roleName),
          members: team.members,
        };
      });

      res.json({ success: true, teams: formatted });
    } catch (error: any) {
      console.error('Get all teams error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET LEADER'S OWN TEAM
  public static async getMyTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const leaderProfileId = req.user?.leaderProfileId;
      if (!leaderProfileId) {
        res.status(403).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const team = await prisma.team.findFirst({
        where: { leaderProfileId },
        include: {
          hackathon: true,
          leader: true,
          requirements: true,
          members: {
            include: {
              candidate: {
                include: {
                  skills: { include: { skill: true } },
                  githubAnalysis: true,
                },
              },
            },
          },
          invitations: {
            include: {
              candidate: {
                select: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                  department: true,
                  overallScore: true,
                },
              },
            },
          },
        },
      });

      if (!team) {
        res.json({ success: true, team: null, message: 'No team created yet.' });
        return;
      }

      // Compute role progress
      const filledRoles = team.members.map((m) => m.assignedRole.toLowerCase());
      const roleStatus = team.requirements.map((req) => ({
        roleName: req.roleName,
        isFilled: filledRoles.includes(req.roleName.toLowerCase()),
      }));

      const missingRoles = roleStatus.filter((r) => !r.isFilled).map((r) => r.roleName);

      res.json({
        success: true,
        team,
        progress: {
          currentMembers: team.members.length + 1, // Leader + members
          maxMembers: team.maxTeamSize,
          roleStatus,
          missingRoles,
          isFull: team.members.length + 1 >= team.maxTeamSize,
        },
      });
    } catch (error: any) {
      console.error('Get my team error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET TEAM BY ID
  public static async getTeamById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const team = await prisma.team.findUnique({
        where: { id },
        include: {
          hackathon: true,
          leader: true,
          requirements: true,
          members: {
            include: {
              candidate: {
                include: {
                  skills: { include: { skill: true } },
                  preferredRoles: { include: { role: true } },
                  githubAnalysis: true,
                },
              },
            },
          },
        },
      });

      if (!team) {
        res.status(404).json({ success: false, message: 'Team not found.' });
        return;
      }

      res.json({ success: true, team });
    } catch (error: any) {
      console.error('Get team by id error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // CREATE JOIN REQUEST (CANDIDATE/STUDENT EXPRESS INTEREST)
  public static async createJoinRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(400).json({ success: false, message: 'Candidate profile required to request to join a team.' });
        return;
      }

      const teamId = req.params.id as string;
      const { roleName, message } = req.body;

      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: true,
          leader: { include: { user: true } },
          hackathon: true,
        },
      });

      if (!team) {
        res.status(404).json({ success: false, message: 'Team not found.' });
        return;
      }

      // Check if user is the team leader
      if (req.user?.leaderProfileId && team.leaderProfileId === req.user.leaderProfileId) {
        res.status(400).json({ success: false, message: 'You are the owner of this team.' });
        return;
      }

      // Check if already a member
      const isAlreadyMember = team.members.some((m) => m.candidateProfileId === candidateProfileId);
      if (isAlreadyMember) {
        res.status(400).json({ success: false, message: 'You are already a member of this team.' });
        return;
      }

      // Check capacity
      if (team.members.length + 1 >= team.maxTeamSize) {
        res.status(400).json({ success: false, message: 'This team has already reached its maximum member limit.' });
        return;
      }

      // Check existing pending request
      const existingReq = await (prisma as any).joinRequest.findFirst({
        where: {
          teamId,
          candidateProfileId,
          status: 'PENDING',
        },
      });

      if (existingReq) {
        res.status(400).json({ success: false, message: 'You already have an active pending join request for this team.' });
        return;
      }

      const candidate = await prisma.candidateProfile.findUnique({
        where: { id: candidateProfileId },
        select: { fullName: true, userId: true },
      });

      const joinRequest = await (prisma as any).joinRequest.create({
        data: {
          teamId,
          candidateProfileId,
          roleName: roleName || 'Member',
          message: message || `Hi! I would love to join ${team.name} as a ${roleName || 'Member'}.`,
          status: 'PENDING',
        },
      });

      // Send notification to team leader
      if (team.leader?.user?.id) {
        await prisma.notification.create({
          data: {
            userId: team.leader.user.id,
            title: `New Join Request: ${team.name} 🙋`,
            message: `${candidate?.fullName || 'A student'} requested to join "${team.name}" as ${roleName || 'Member'}.`,
            type: 'JOIN_REQUEST',
            link: `/team/${team.id}`,
          },
        });
      }

      res.status(201).json({
        success: true,
        message: `Your request to join ${team.name} has been submitted!`,
        joinRequest,
      });
    } catch (error: any) {
      console.error('Create join request error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET JOIN REQUESTS FOR A TEAM (TEAM OWNER)
  public static async getTeamJoinRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const teamId = req.params.id as string;
      const leaderProfileId = req.user?.leaderProfileId;

      const team = await prisma.team.findUnique({ where: { id: teamId } });
      if (!team) {
        res.status(404).json({ success: false, message: 'Team not found.' });
        return;
      }

      if (team.leaderProfileId !== leaderProfileId && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Only the team owner can review join requests.' });
        return;
      }

      const requests = await (prisma as any).joinRequest.findMany({
        where: { teamId },
        include: {
          candidate: {
            include: {
              skills: { include: { skill: true } },
              githubAnalysis: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, requests });
    } catch (error: any) {
      console.error('Get team join requests error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET MY SENT JOIN REQUESTS (STUDENT)
  public static async getMySentJoinRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.json({ success: true, requests: [] });
        return;
      }

      const requests = await (prisma as any).joinRequest.findMany({
        where: { candidateProfileId },
        include: {
          team: {
            include: {
              hackathon: true,
              leader: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, requests });
    } catch (error: any) {
      console.error('Get my sent join requests error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // APPROVE JOIN REQUEST (TEAM OWNER)
  public static async approveJoinRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const requestId = req.params.id as string;
      const leaderProfileId = req.user?.leaderProfileId;

      const joinRequest = await (prisma as any).joinRequest.findUnique({
        where: { id: requestId },
        include: {
          team: {
            include: {
              members: true,
              hackathon: true,
            },
          },
          candidate: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!joinRequest) {
        res.status(404).json({ success: false, message: 'Join request not found.' });
        return;
      }

      if (joinRequest.team.leaderProfileId !== leaderProfileId && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Only the team owner can approve join requests.' });
        return;
      }

      // Check team capacity
      if (joinRequest.team.members.length + 1 >= joinRequest.team.maxTeamSize) {
        res.status(400).json({ success: false, message: 'Cannot approve: Team has already reached maximum capacity.' });
        return;
      }

      // Check if already a member
      const isAlreadyMember = joinRequest.team.members.some(
        (m: any) => m.candidateProfileId === joinRequest.candidateProfileId
      );
      if (isAlreadyMember) {
        await (prisma as any).joinRequest.update({
          where: { id: requestId },
          data: { status: 'APPROVED', respondedAt: new Date() },
        });
        res.status(400).json({ success: false, message: 'Student is already a member of this team.' });
        return;
      }

      // Mark request as approved
      await (prisma as any).joinRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED', respondedAt: new Date() },
      });

      // Add to team members
      await (prisma.teamMember as any).create({
        data: {
          teamId: joinRequest.teamId,
          candidateProfileId: joinRequest.candidateProfileId,
          assignedRole: joinRequest.roleName,
          isOwner: false,
        },
      });

      // Update team status if now full
      if (joinRequest.team.members.length + 2 >= joinRequest.team.maxTeamSize) {
        await prisma.team.update({
          where: { id: joinRequest.teamId },
          data: { status: 'FULL' },
        });
      }

      // Send notification to candidate
      await prisma.notification.create({
        data: {
          userId: joinRequest.candidate.userId,
          title: `Join Request Approved! 🎉`,
          message: `Your request to join "${joinRequest.team.name}" as ${joinRequest.roleName} was approved! You are now an official team member.`,
          type: 'JOIN_APPROVED',
          link: '/my-teams',
        },
      });

      res.json({
        success: true,
        message: `Approved! ${joinRequest.candidate.fullName} is now an official member of ${joinRequest.team.name}.`,
      });
    } catch (error: any) {
      console.error('Approve join request error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // DECLINE JOIN REQUEST (TEAM OWNER)
  public static async declineJoinRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const requestId = req.params.id as string;
      const leaderProfileId = req.user?.leaderProfileId;

      const joinRequest = await (prisma as any).joinRequest.findUnique({
        where: { id: requestId },
        include: {
          team: true,
          candidate: { include: { user: true } },
        },
      });

      if (!joinRequest) {
        res.status(404).json({ success: false, message: 'Join request not found.' });
        return;
      }

      if (joinRequest.team.leaderProfileId !== leaderProfileId && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Only the team owner can decline join requests.' });
        return;
      }

      await (prisma as any).joinRequest.update({
        where: { id: requestId },
        data: { status: 'DECLINED', respondedAt: new Date() },
      });

      // Send notification to candidate
      await prisma.notification.create({
        data: {
          userId: joinRequest.candidate.userId,
          title: `Join Request Update: ${joinRequest.team.name}`,
          message: `Your request to join "${joinRequest.team.name}" was declined by the team owner.`,
          type: 'JOIN_DECLINED',
          link: '/find-team',
        },
      });

      res.json({ success: true, message: 'Join request declined.' });
    } catch (error: any) {
      console.error('Decline join request error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // CANCEL JOIN REQUEST (STUDENT)
  public static async cancelJoinRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const requestId = req.params.id as string;
      const candidateProfileId = req.user?.candidateProfileId;

      const joinRequest = await (prisma as any).joinRequest.findUnique({
        where: { id: requestId },
      });

      if (!joinRequest) {
        res.status(404).json({ success: false, message: 'Join request not found.' });
        return;
      }

      if (joinRequest.candidateProfileId !== candidateProfileId && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'You can only cancel your own join requests.' });
        return;
      }

      await (prisma as any).joinRequest.update({
        where: { id: requestId },
        data: { status: 'CANCELLED', respondedAt: new Date() },
      });

      res.json({ success: true, message: 'Join request cancelled.' });
    } catch (error: any) {
      console.error('Cancel join request error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // REMOVE MEMBER OR LEAVE TEAM
  public static async removeTeamMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const teamId = req.params.id as string;
      const memberCandidateId = req.params.memberId as string;
      const currentLeaderProfileId = req.user?.leaderProfileId;
      const currentCandidateProfileId = req.user?.candidateProfileId;

      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { members: true },
      });

      if (!team) {
        res.status(404).json({ success: false, message: 'Team not found.' });
        return;
      }

      const isLeader = team.leaderProfileId === currentLeaderProfileId;
      const isSelf = currentCandidateProfileId === memberCandidateId;

      if (!isLeader && !isSelf && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Unauthorized to remove this member.' });
        return;
      }

      const membership = await prisma.teamMember.findFirst({
        where: {
          teamId,
          candidateProfileId: memberCandidateId,
        },
      });

      if (!membership) {
        res.status(404).json({ success: false, message: 'Member not found in team.' });
        return;
      }

      await prisma.teamMember.delete({
        where: { id: membership.id },
      });

      // Update team status back to RECRUITING if was full
      if (team.status === 'FULL') {
        await prisma.team.update({
          where: { id: teamId },
          data: { status: 'RECRUITING' },
        });
      }

      res.json({
        success: true,
        message: isSelf ? 'You have left the team.' : 'Member removed from team.',
      });
    } catch (error: any) {
      console.error('Remove team member error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
}
