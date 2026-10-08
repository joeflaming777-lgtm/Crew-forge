import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { signToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  // CANDIDATE REGISTRATION
  public static async candidateRegister(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        password,
        fullName,
        avatarUrl,
        phone,
        college,
        department,
        year,
        gender,
        bio,
      } = req.body;

      if (!email || !password || !fullName || !college || !department) {
        res.status(400).json({
          success: false,
          message: 'Email, password, full name, college, and department are required.',
        });
        return;
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ success: false, message: 'Email is already registered.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: 'candidate',
          candidateProfile: {
            create: {
              fullName,
              avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
              phone: phone || null,
              college,
              department,
              year: Number(year) || 3,
              gender: gender || 'Prefer not to say',
              bio: bio || '',
              availability: 'Available',
              profileCompleted: false,
            },
          },
        },
        include: { candidateProfile: true },
      });

      const token = signToken({
        userId: user.id,
        email: user.email,
        role: 'candidate',
      });

      res.status(201).json({
        success: true,
        message: 'Candidate account created successfully.',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          candidateProfile: user.candidateProfile,
        },
      });
    } catch (error: any) {
      console.error('Candidate register error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // UNIFIED USER LOGIN - ONE LOGIN FOR ALL USERS
  public static async userLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          candidateProfile: {
            include: {
              skills: { include: { skill: true } },
              preferredRoles: { include: { role: true } },
              githubAnalysis: true,
            },
          },
          leaderProfile: {
            include: {
              teams: {
                include: {
                  hackathon: true,
                  members: {
                    include: {
                      candidate: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role as 'candidate' | 'team_leader' | 'admin',
      });

      res.json({
        success: true,
        message: 'User login successful.',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          candidateProfile: user.candidateProfile,
          leaderProfile: user.leaderProfile,
        },
      });
    } catch (error: any) {
      console.error('User login error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // UNIFIED USER REGISTRATION
  public static async userRegister(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        password,
        fullName,
        avatarUrl,
        phone,
        college,
        department,
        year,
        gender,
        bio,
      } = req.body;

      if (!email || !password || !fullName) {
        res.status(400).json({
          success: false,
          message: 'Email, password, and full name are required.',
        });
        return;
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ success: false, message: 'Email is already registered.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: 'candidate',
          candidateProfile: {
            create: {
              fullName,
              avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
              phone: phone || null,
              college: college || 'University',
              department: department || 'Engineering',
              year: Number(year) || 3,
              gender: gender || 'Prefer not to say',
              bio: bio || '',
              availability: 'Available',
              profileCompleted: false,
            },
          },
          leaderProfile: {
            create: {
              fullName,
              avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
              college: college || 'University',
              department: department || 'Engineering',
              year: Number(year) || 3,
              bio: bio || '',
            },
          },
        },
        include: { candidateProfile: true, leaderProfile: true },
      });

      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role as 'candidate' | 'team_leader' | 'admin',
      });

      res.status(201).json({
        success: true,
        message: 'User account created successfully.',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          candidateProfile: user.candidateProfile,
          leaderProfile: user.leaderProfile,
        },
      });
    } catch (error: any) {
      console.error('User register error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // CANDIDATE LOGIN (delegates to unified user login)
  public static async candidateLogin(req: Request, res: Response): Promise<void> {
    return AuthController.userLogin(req, res);
  }

  // LEADER REGISTRATION
  public static async leaderRegister(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        password,
        fullName,
        college,
        department,
        year,
        avatarUrl,
        bio,
      } = req.body;

      if (!email || !password || !fullName || !college || !department) {
        res.status(400).json({
          success: false,
          message: 'Email, password, full name, college, and department are required.',
        });
        return;
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ success: false, message: 'Email is already registered.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: 'team_leader',
          leaderProfile: {
            create: {
              fullName,
              avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
              college,
              department,
              year: Number(year) || 3,
              bio: bio || '',
            },
          },
        },
        include: { leaderProfile: true },
      });

      const token = signToken({
        userId: user.id,
        email: user.email,
        role: 'team_leader',
      });

      res.status(201).json({
        success: true,
        message: 'Team Leader account created successfully.',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          leaderProfile: user.leaderProfile,
        },
      });
    } catch (error: any) {
      console.error('Leader register error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // LEADER LOGIN (delegates to unified user login)
  public static async leaderLogin(req: Request, res: Response): Promise<void> {
    return AuthController.userLogin(req, res);
  }

  // ADMIN LOGIN
  public static async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || user.role !== 'admin') {
        res.status(401).json({ success: false, message: 'Invalid credentials or not an admin account.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
        return;
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        role: 'admin',
      });

      res.json({
        success: true,
        message: 'Admin login successful.',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error('Admin login error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET CURRENT AUTHENTICATED USER
  public static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          role: true,
          candidateProfile: {
            include: {
              skills: { include: { skill: true } },
              preferredRoles: { include: { role: true } },
              githubAnalysis: true,
              quizAttempts: {
                orderBy: { completedAt: 'desc' },
                take: 1,
              },
              teamMemberships: {
                include: {
                  team: {
                    include: {
                      hackathon: true,
                      leader: true,
                      members: { include: { candidate: true } },
                    },
                  },
                },
              },
            },
          },
          leaderProfile: {
            include: {
              teams: {
                include: {
                  hackathon: true,
                  requirements: true,
                  members: { include: { candidate: true } },
                  invitations: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Get me error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
}
