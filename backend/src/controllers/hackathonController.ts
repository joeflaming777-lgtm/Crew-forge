import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class HackathonController {
  // GET ALL HACKATHONS
  public static async getAllHackathons(req: Request, res: Response): Promise<void> {
    try {
      const hackathons = await prisma.hackathon.findMany({
        include: {
          teams: {
            include: {
              leader: true,
              members: true,
            },
          },
        },
        orderBy: { registrationDeadline: 'asc' },
      });

      const formatted = hackathons.map((h) => ({
        id: h.id,
        name: h.name,
        slug: h.slug,
        description: h.description,
        organizer: h.organizer,
        registrationDeadline: h.registrationDeadline,
        minTeamSize: h.minTeamSize,
        maxTeamSize: h.maxTeamSize,
        bannerUrl: h.bannerUrl,
        status: h.status,
        rules: h.rules,
        problemStatements: h.problemStatements ? JSON.parse(h.problemStatements) : [],
        totalTeams: h.teams.length,
        teams: h.teams.map((t) => ({
          id: t.id,
          name: t.name,
          leaderName: t.leader.fullName,
          memberCount: t.members.length + 1,
          maxTeamSize: t.maxTeamSize,
          status: t.status,
        })),
      }));

      res.json({ success: true, hackathons: formatted });
    } catch (error: any) {
      console.error('Get all hackathons error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET HACKATHON BY ID OR SLUG
  public static async getHackathonById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const hackathon = await prisma.hackathon.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: {
          teams: {
            include: {
              leader: true,
              requirements: true,
              members: {
                include: {
                  candidate: {
                    select: { id: true, fullName: true, avatarUrl: true, department: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!hackathon) {
        res.status(404).json({ success: false, message: 'Hackathon not found.' });
        return;
      }

      res.json({
        success: true,
        hackathon: {
          ...hackathon,
          problemStatements: hackathon.problemStatements ? JSON.parse(hackathon.problemStatements) : [],
        },
      });
    } catch (error: any) {
      console.error('Get hackathon by id error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
}
