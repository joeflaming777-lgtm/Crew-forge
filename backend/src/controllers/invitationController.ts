import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export class InvitationController {
  // SEND INVITATION (TEAM LEADER)
  public static async sendInvitation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const leaderProfileId = req.user?.leaderProfileId;
      if (!leaderProfileId) {
        res.status(403).json({ success: false, message: 'Only team leaders can send invitations.' });
        return;
      }

      const { candidateProfileId, roleName, message } = req.body;
      if (!candidateProfileId || !roleName) {
        res.status(400).json({
          success: false,
          message: 'Candidate ID and invited role name are required.',
        });
        return;
      }

      // Find leader's team
      const team = await prisma.team.findFirst({
        where: { leaderProfileId },
        include: { members: true, hackathon: true },
      });

      if (!team) {
        res.status(400).json({
          success: false,
          message: 'You must create a team before inviting candidates.',
        });
        return;
      }

      // Check slot capacity (members + leader)
      if (team.members.length + 1 >= team.maxTeamSize) {
        res.status(400).json({
          success: false,
          message: `Team '${team.name}' has reached its maximum size of ${team.maxTeamSize} members.`,
        });
        return;
      }

      // Check if candidate is already in this team
      const isAlreadyMember = team.members.some((m) => m.candidateProfileId === candidateProfileId);
      if (isAlreadyMember) {
        res.status(400).json({
          success: false,
          message: 'This candidate is already a member of your team.',
        });
        return;
      }

      // Check existing pending invitation
      const existingInvitation = await prisma.invitation.findFirst({
        where: {
          teamId: team.id,
          candidateProfileId,
          status: 'PENDING',
        },
      });

      if (existingInvitation) {
        res.status(400).json({
          success: false,
          message: 'An active invitation has already been sent to this candidate.',
        });
        return;
      }

      // Create invitation
      const invitation = await prisma.invitation.create({
        data: {
          teamId: team.id,
          candidateProfileId,
          leaderProfileId,
          roleName,
          message: message || `We reviewed your profile and would love for you to join ${team.name} as a ${roleName}!`,
          status: 'PENDING',
        },
        include: {
          team: { include: { hackathon: true } },
          candidate: { include: { user: true } },
        },
      });

      // Notify candidate
      await prisma.notification.create({
        data: {
          userId: invitation.candidate.userId,
          title: `New Team Invitation: ${team.name} 🚀`,
          message: `Team Leader invited you to join '${team.name}' for ${team.hackathon.name} as a ${roleName}.`,
          type: 'INVITATION',
          link: '/candidate/invitations',
        },
      });

      res.status(201).json({
        success: true,
        message: `Invitation successfully sent to ${invitation.candidate.fullName}!`,
        invitation,
      });
    } catch (error: any) {
      console.error('Send invitation error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET INVITATIONS (CANDIDATE OR LEADER)
  public static async getInvitations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { role, candidateProfileId, leaderProfileId } = req.user!;

      if (role === 'candidate' && candidateProfileId) {
        const invitations = await prisma.invitation.findMany({
          where: { candidateProfileId },
          include: {
            team: {
              include: {
                hackathon: true,
                leader: true,
                members: { include: { candidate: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        res.json({ success: true, invitations });
        return;
      }

      if (role === 'team_leader' && leaderProfileId) {
        const invitations = await prisma.invitation.findMany({
          where: { leaderProfileId },
          include: {
            candidate: {
              include: {
                skills: { include: { skill: true } },
                preferredRoles: { include: { role: true } },
              },
            },
            team: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        res.json({ success: true, invitations });
        return;
      }

      res.status(403).json({ success: false, message: 'Unauthorized role' });
    } catch (error: any) {
      console.error('Get invitations error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // ACCEPT INVITATION (CANDIDATE)
  public static async acceptInvitation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(403).json({ success: false, message: 'Only candidates can accept invitations.' });
        return;
      }

      const id = req.params.id as string;

      const invitation: any = await prisma.invitation.findUnique({
        where: { id },
        include: {
          team: {
            include: {
              members: true,
              leader: { include: { user: true } },
            },
          },
          candidate: true,
        },
      });

      if (!invitation || invitation.candidateProfileId !== candidateProfileId) {
        res.status(404).json({ success: false, message: 'Invitation not found.' });
        return;
      }

      if (invitation.status !== 'PENDING') {
        res.status(400).json({
          success: false,
          message: `Cannot accept invitation that is already ${invitation.status.toLowerCase()}.`,
        });
        return;
      }

      // Check slot availability in team (Leader + current members)
      const currentCount = invitation.team.members.length + 1;
      if (currentCount >= invitation.team.maxTeamSize) {
        res.status(400).json({
          success: false,
          message: `Unfortunately, ${invitation.team.name} has already reached its full capacity.`,
        });
        return;
      }

      // Perform transaction: add TeamMember, update invitation, create notifications
      await prisma.$transaction(async (tx) => {
        // 1. Create TeamMember record
        await tx.teamMember.create({
          data: {
            teamId: invitation.teamId,
            candidateProfileId,
            assignedRole: invitation.roleName,
          },
        });

        // 2. Mark Invitation as ACCEPTED
        await tx.invitation.update({
          where: { id: invitation.id },
          data: {
            status: 'ACCEPTED',
            respondedAt: new Date(),
          },
        });

        // 3. Update candidate availability to 'Committed'
        await tx.candidateProfile.update({
          where: { id: candidateProfileId },
          data: { availability: 'Committed' },
        });

        // 4. Update team status if now full
        if (currentCount + 1 >= invitation.team.maxTeamSize) {
          await tx.team.update({
            where: { id: invitation.teamId },
            data: { status: 'FULL' },
          });
        }

        // 5. Notify Team Leader
        await tx.notification.create({
          data: {
            userId: invitation.team.leader.userId,
            title: `Invitation Accepted! 🎉`,
            message: `${invitation.candidate.fullName} accepted your invitation to join ${invitation.team.name} as ${invitation.roleName}.`,
            type: 'ACCEPTED',
            link: '/leader/team',
          },
        });

        // 6. Notify Candidate
        await tx.notification.create({
          data: {
            userId: req.user!.userId,
            title: `Welcome to ${invitation.team.name}! 🎉`,
            message: `You are officially a member of ${invitation.team.name} for the hackathon.`,
            type: 'SYSTEM',
            link: '/candidate/team',
          },
        });
      });

      res.json({
        success: true,
        message: `You're officially part of ${invitation.team.name} 🎉`,
        teamName: invitation.team.name,
      });
    } catch (error: any) {
      console.error('Accept invitation error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // DECLINE INVITATION (CANDIDATE)
  public static async declineInvitation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(403).json({ success: false, message: 'Only candidates can decline invitations.' });
        return;
      }

      const id = req.params.id as string;

      const invitation: any = await prisma.invitation.findUnique({
        where: { id },
        include: {
          team: { include: { leader: true } },
          candidate: true,
        },
      });

      if (!invitation || invitation.candidateProfileId !== candidateProfileId) {
        res.status(404).json({ success: false, message: 'Invitation not found.' });
        return;
      }

      if (invitation.status !== 'PENDING') {
        res.status(400).json({
          success: false,
          message: `Cannot decline invitation that is already ${invitation.status.toLowerCase()}.`,
        });
        return;
      }

      await prisma.invitation.update({
        where: { id },
        data: {
          status: 'DECLINED',
          respondedAt: new Date(),
        },
      });

      // Notify Leader
      await prisma.notification.create({
        data: {
          userId: invitation.team.leader.userId,
          title: `Invitation Declined`,
          message: `${invitation.candidate.fullName} declined your invitation to join ${invitation.team.name}.`,
          type: 'DECLINED',
          link: '/leader/team',
        },
      });

      res.json({ success: true, message: 'Invitation declined.' });
    } catch (error: any) {
      console.error('Decline invitation error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // CANCEL INVITATION (TEAM LEADER)
  public static async cancelInvitation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const leaderProfileId = req.user?.leaderProfileId;
      if (!leaderProfileId) {
        res.status(403).json({ success: false, message: 'Only team leaders can cancel invitations.' });
        return;
      }

      const id = req.params.id as string;

      const invitation = await prisma.invitation.findUnique({
        where: { id },
      });

      if (!invitation || invitation.leaderProfileId !== leaderProfileId) {
        res.status(404).json({ success: false, message: 'Invitation not found.' });
        return;
      }

      if (invitation.status !== 'PENDING') {
        res.status(400).json({ success: false, message: 'Only pending invitations can be cancelled.' });
        return;
      }

      await prisma.invitation.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      res.json({ success: true, message: 'Invitation cancelled.' });
    } catch (error: any) {
      console.error('Cancel invitation error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
}
