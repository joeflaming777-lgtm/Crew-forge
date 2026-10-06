import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class AdminController {
  // GET SYSTEM ANALYTICS & REPORTS
  public static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalUsers,
        totalCandidates,
        totalLeaders,
        totalTeams,
        totalInvitations,
        acceptedInvitations,
        declinedInvitations,
        pendingInvitations,
        skillsCount,
        rolesCount,
        questionsCount,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.candidateProfile.count(),
        prisma.leaderProfile.count(),
        prisma.team.count(),
        prisma.invitation.count(),
        prisma.invitation.count({ where: { status: 'ACCEPTED' } }),
        prisma.invitation.count({ where: { status: 'DECLINED' } }),
        prisma.invitation.count({ where: { status: 'PENDING' } }),
        prisma.skill.count(),
        prisma.role.count(),
        prisma.question.count(),
      ]);

      // Most popular skills among candidates
      const topSkills = await prisma.candidateSkill.groupBy({
        by: ['skillId'],
        _count: { skillId: true },
        orderBy: { _count: { skillId: 'desc' } },
        take: 8,
      });

      const skillDetails = await prisma.skill.findMany({
        where: { id: { in: topSkills.map((s) => s.skillId) } },
      });

      const popularSkills = topSkills.map((ts) => {
        const found = skillDetails.find((s) => s.id === ts.skillId);
        return {
          name: found?.name || 'Unknown',
          count: ts._count.skillId,
        };
      });

      // Most popular roles
      const topRoles = await prisma.candidateRole.groupBy({
        by: ['roleId'],
        _count: { roleId: true },
        orderBy: { _count: { roleId: 'desc' } },
        take: 8,
      });

      const roleDetails = await prisma.role.findMany({
        where: { id: { in: topRoles.map((r) => r.roleId) } },
      });

      const popularRoles = topRoles.map((tr) => {
        const found = roleDetails.find((r) => r.id === tr.roleId);
        return {
          name: found?.name || 'Unknown',
          count: tr._count.roleId,
        };
      });

      // Scoring configuration
      const scoringConfig = await prisma.scoringConfiguration.findUnique({
        where: { id: 'default' },
      });

      res.json({
        success: true,
        stats: {
          totalUsers,
          totalCandidates,
          totalLeaders,
          totalTeams,
          totalInvitations,
          acceptedInvitations,
          declinedInvitations,
          pendingInvitations,
          acceptanceRate: totalInvitations > 0 ? Math.round((acceptedInvitations / totalInvitations) * 100) : 0,
          skillsCount,
          rolesCount,
          questionsCount,
        },
        popularSkills,
        popularRoles,
        scoringConfig: scoringConfig || {
          quizWeight: 0.50,
          githubWeight: 0.25,
          skillMatchWeight: 0.15,
          experienceWeight: 0.10,
        },
      });
    } catch (error: any) {
      console.error('Get admin analytics error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET ALL USERS (CANDIDATES & LEADERS)
  public static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        include: {
          candidateProfile: true,
          leaderProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const formatted = users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        name: u.candidateProfile?.fullName || u.leaderProfile?.fullName || 'Admin',
        college: u.candidateProfile?.college || u.leaderProfile?.college || 'N/A',
        department: u.candidateProfile?.department || u.leaderProfile?.department || 'N/A',
        overallScore: u.candidateProfile?.overallScore || null,
        createdAt: u.createdAt,
      }));

      res.json({ success: true, users: formatted });
    } catch (error: any) {
      console.error('Get users error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET & UPDATE SCORING CONFIGURATION
  public static async getScoringConfig(req: Request, res: Response): Promise<void> {
    try {
      const config = await prisma.scoringConfiguration.findUnique({
        where: { id: 'default' },
      });

      res.json({
        success: true,
        config: config || {
          id: 'default',
          quizWeight: 0.50,
          githubWeight: 0.25,
          skillMatchWeight: 0.15,
          experienceWeight: 0.10,
        },
      });
    } catch (error: any) {
      console.error('Get scoring config error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  public static async updateScoringConfig(req: Request, res: Response): Promise<void> {
    try {
      const { quizWeight, githubWeight, skillMatchWeight, experienceWeight } = req.body;

      const sum = Number(quizWeight) + Number(githubWeight) + Number(skillMatchWeight) + Number(experienceWeight);
      if (Math.abs(sum - 1.0) > 0.05) {
        res.status(400).json({
          success: false,
          message: `The sum of weights must equal 1.0 (currently ${sum.toFixed(2)})`,
        });
        return;
      }

      const updated = await prisma.scoringConfiguration.upsert({
        where: { id: 'default' },
        update: {
          quizWeight: Number(quizWeight),
          githubWeight: Number(githubWeight),
          skillMatchWeight: Number(skillMatchWeight),
          experienceWeight: Number(experienceWeight),
        },
        create: {
          id: 'default',
          quizWeight: Number(quizWeight),
          githubWeight: Number(githubWeight),
          skillMatchWeight: Number(skillMatchWeight),
          experienceWeight: Number(experienceWeight),
        },
      });

      res.json({
        success: true,
        message: 'Scoring configuration updated successfully.',
        config: updated,
      });
    } catch (error: any) {
      console.error('Update scoring config error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // SKILLS CRUD
  public static async getSkills(req: Request, res: Response): Promise<void> {
    try {
      const skills = await prisma.skill.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { candidates: true } } },
      });
      res.json({ success: true, skills });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async createSkill(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, description } = req.body;
      if (!name || !category) {
        res.status(400).json({ success: false, message: 'Name and category are required.' });
        return;
      }

      const skill = await prisma.skill.create({
        data: { name, category, description },
      });

      res.status(201).json({ success: true, skill });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async deleteSkill(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await prisma.skill.delete({ where: { id } });
      res.json({ success: true, message: 'Skill deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ROLES CRUD
  public static async getRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await prisma.role.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { candidates: true } } },
      });
      res.json({ success: true, roles });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async createRole(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, description } = req.body;
      if (!name) {
        res.status(400).json({ success: false, message: 'Name is required.' });
        return;
      }

      const role = await prisma.role.create({
        data: { name, category: category || 'Engineering', description },
      });

      res.status(201).json({ success: true, role });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await prisma.role.delete({ where: { id } });
      res.json({ success: true, message: 'Role deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // HACKATHONS CRUD
  public static async createHackathon(req: Request, res: Response): Promise<void> {
    try {
      const { name, slug, description, organizer, registrationDeadline, minTeamSize, maxTeamSize, problemStatements, rules } = req.body;

      const hackathon = await prisma.hackathon.create({
        data: {
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description,
          organizer,
          registrationDeadline: new Date(registrationDeadline),
          minTeamSize: Number(minTeamSize) || 3,
          maxTeamSize: Number(maxTeamSize) || 6,
          problemStatements: typeof problemStatements === 'string' ? problemStatements : JSON.stringify(problemStatements || []),
          rules: rules || '',
          status: 'ACTIVE',
        },
      });

      res.status(201).json({ success: true, hackathon });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // QUIZ QUESTIONS CRUD
  public static async getQuestions(req: Request, res: Response): Promise<void> {
    try {
      const questions = await prisma.question.findMany({
        include: {
          options: true,
          skill: true,
          role: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, questions });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async createQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { text, explanation, difficulty, topic, skillId, roleId, options } = req.body;
      if (!text || !explanation || !Array.isArray(options) || options.length < 2) {
        res.status(400).json({ success: false, message: 'Question text, explanation, and at least 2 options are required.' });
        return;
      }

      const question = await prisma.question.create({
        data: {
          text,
          explanation,
          difficulty: difficulty || 'MEDIUM',
          topic: topic || 'General',
          skillId: skillId || null,
          roleId: roleId || null,
          options: {
            create: options.map((opt: any) => ({
              text: opt.text,
              isCorrect: Boolean(opt.isCorrect),
            })),
          },
        },
        include: { options: true },
      });

      res.status(201).json({ success: true, question });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async deleteQuestion(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await prisma.question.delete({ where: { id } });
      res.json({ success: true, message: 'Question deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
