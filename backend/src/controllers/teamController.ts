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
}
