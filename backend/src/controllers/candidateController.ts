import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { CandidateScoringService } from '../services/candidateScoringService';

export class CandidateController {
  // GET CANDIDATE PROFILE
  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found' });
        return;
      }

      const profile = await prisma.candidateProfile.findUnique({
        where: { id: candidateProfileId },
        include: {
          user: { select: { email: true } },
          skills: { include: { skill: true } },
          preferredRoles: { include: { role: true } },
          githubAnalysis: true,
          quizAttempts: {
            orderBy: { completedAt: 'desc' },
            take: 3,
            include: {
              answers: {
                include: { question: true, selectedOption: true },
              },
            },
          },
          teamMemberships: {
            include: {
              team: {
                include: {
                  hackathon: true,
                  leader: true,
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
          },
          invitations: {
            where: { status: 'PENDING' },
            include: {
              team: {
                include: {
                  hackathon: true,
                  leader: true,
                },
              },
            },
          },
        },
      });

      if (!profile) {
        res.status(404).json({ success: false, message: 'Candidate profile not found' });
        return;
      }

      let formattedGithubAnalysis: any = null;
      if (profile.githubAnalysis) {
        let parsedRaw: Record<string, any> = {};
        if (profile.githubAnalysis.rawData) {
          try {
            parsedRaw = JSON.parse(profile.githubAnalysis.rawData);
          } catch (_) {}
        }
        const topLanguages = JSON.parse(profile.githubAnalysis.topLanguages || '[]');
        const technicalStrengths = JSON.parse(profile.githubAnalysis.technicalStrengths || '[]');
        const projectExperience = JSON.parse(profile.githubAnalysis.projectExperience || '[]');

        formattedGithubAnalysis = {
          ...profile.githubAnalysis,
          topLanguages,
          technicalStrengths,
          projectExperience,
          archetype: parsedRaw.archetype || (projectExperience[0] || 'Software Engineer'),
          summary: parsedRaw.summary || `GitHub profile @${profile.githubAnalysis.username} with ${profile.githubAnalysis.publicRepos} public repositories.`,
          highlights: parsedRaw.highlights || [
            `Public repositories verified: ${profile.githubAnalysis.publicRepos}`,
            `Recent activity level rated ${profile.githubAnalysis.recentActivityLevel}`,
            `Documentation coverage rated ${profile.githubAnalysis.readmeCoverage}`,
          ],
          growthAreas: parsedRaw.growthAreas || [
            'Add descriptive READMEs and problem overviews to public repositories',
            'Deploy working web demonstrations with accessible live links',
          ],
          showcaseRepos: parsedRaw.showcaseRepos || [],
          detectedFrameworks: parsedRaw.detectedFrameworks || technicalStrengths,
          metrics: parsedRaw.metrics || {
            publicRepos: profile.githubAnalysis.publicRepos,
            originalRepos: Math.max(1, profile.githubAnalysis.publicRepos - 2),
            forkedRepos: 2,
            totalStars: profile.githubAnalysis.totalStars,
            originalStars: profile.githubAnalysis.totalStars,
            totalForksCount: 0,
            recentPushes90d: profile.githubAnalysis.recentActivityLevel === 'High' ? 12 : 3,
            recentCommits90d: profile.githubAnalysis.recentActivityLevel === 'High' ? 24 : 6,
            deployedProjectsCount: 1,
            hasDocumentationRatio: profile.githubAnalysis.readmeCoverage === 'Strong' ? 80 : 45,
            accountAgeMonths: 18,
            daysSinceLastPush: profile.githubAnalysis.recentActivityLevel === 'High' ? 4 : 25,
          },
          breakdown: parsedRaw.breakdown || {
            repoBreadthScore: Math.round(profile.githubAnalysis.score * 0.25),
            languageMasteryScore: Math.round(profile.githubAnalysis.score * 0.25),
            activityScore: Math.round(profile.githubAnalysis.score * 0.25),
            documentationScore: Math.round(profile.githubAnalysis.score * 0.25),
          },
          avatarUrl: parsedRaw.avatarUrl,
          bio: parsedRaw.bio,
          profileUrl: parsedRaw.profileUrl || `https://github.com/${profile.githubAnalysis.username}`,
          isFallback: parsedRaw.isFallback || false,
        };
      }

      res.json({
        success: true,
        profile: {
          ...profile,
          githubAnalysis: formattedGithubAnalysis,
        },
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // UPDATE PERSONAL & EXPERIENCE INFORMATION
  public static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found' });
        return;
      }

      const {
        fullName,
        avatarUrl,
        phone,
        college,
        department,
        year,
        gender,
        bio,
        availability,
        hackathonsCount,
        projects,
        achievements,
        certifications,
        previousExperience,
        preferredCategories,
      } = req.body;

      const updated = await prisma.candidateProfile.update({
        where: { id: candidateProfileId },
        data: {
          ...(fullName && { fullName }),
          ...(avatarUrl && { avatarUrl }),
          ...(phone !== undefined && { phone }),
          ...(college && { college }),
          ...(department && { department }),
          ...(year !== undefined && { year: Number(year) }),
          ...(gender && { gender }),
          ...(bio !== undefined && { bio }),
          ...(availability && { availability }),
          ...(hackathonsCount !== undefined && { hackathonsCount: Number(hackathonsCount) }),
          ...(projects !== undefined && { projects: typeof projects === 'string' ? projects : JSON.stringify(projects) }),
          ...(achievements !== undefined && { achievements: typeof achievements === 'string' ? achievements : JSON.stringify(achievements) }),
          ...(certifications !== undefined && { certifications: typeof certifications === 'string' ? certifications : JSON.stringify(certifications) }),
          ...(previousExperience !== undefined && { previousExperience }),
          ...(preferredCategories !== undefined && { preferredCategories: typeof preferredCategories === 'string' ? preferredCategories : JSON.stringify(preferredCategories) }),
        },
      });

      // Recalculate candidate score
      await CandidateScoringService.recalculateScore(candidateProfileId);

      res.json({ success: true, message: 'Profile updated successfully', profile: updated });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // UPDATE SKILLS
  public static async updateSkills(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found' });
        return;
      }

      const { skillIds } = req.body; // Array of skill IDs or names
      if (!Array.isArray(skillIds)) {
        res.status(400).json({ success: false, message: 'skillIds must be an array' });
        return;
      }

      // Remove existing candidate skills
      await prisma.candidateSkill.deleteMany({
        where: { candidateProfileId },
      });

      // Create new candidate skills
      for (const skillIdOrName of skillIds) {
        // Resolve skill by id or by name
        let skill = await prisma.skill.findFirst({
          where: {
            OR: [{ id: skillIdOrName }, { name: skillIdOrName }],
          },
        });

        if (!skill) {
          skill = await prisma.skill.create({
            data: { name: skillIdOrName, category: 'Other' },
          });
        }

        await prisma.candidateSkill.create({
          data: {
            candidateProfileId,
            skillId: skill.id,
            proficiency: 'Intermediate',
          },
        });
      }

      // Recalculate score
      await CandidateScoringService.recalculateScore(candidateProfileId);

      res.json({ success: true, message: 'Skills updated successfully' });
    } catch (error: any) {
      console.error('Update skills error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // UPDATE PREFERRED ROLES
  public static async updateRoles(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found' });
        return;
      }

      const { roleIds } = req.body; // Array of role IDs or role names
      if (!Array.isArray(roleIds)) {
        res.status(400).json({ success: false, message: 'roleIds must be an array' });
        return;
      }

      // Remove existing candidate roles
      await prisma.candidateRole.deleteMany({
        where: { candidateProfileId },
      });

      for (let i = 0; i < roleIds.length; i++) {
        const roleIdOrName = roleIds[i];
        let role = await prisma.role.findFirst({
          where: {
            OR: [{ id: roleIdOrName }, { name: roleIdOrName }],
          },
        });

        if (!role) {
          role = await prisma.role.create({
            data: { name: roleIdOrName, category: 'Engineering' },
          });
        }

        await prisma.candidateRole.create({
          data: {
            candidateProfileId,
            roleId: role.id,
            isPrimary: i === 0,
          },
        });
      }

      res.json({ success: true, message: 'Preferred roles updated successfully' });
    } catch (error: any) {
      console.error('Update roles error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // COMPLETE ONBOARDING
  public static async completeOnboarding(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found' });
        return;
      }

      await prisma.candidateProfile.update({
        where: { id: candidateProfileId },
        data: { profileCompleted: true },
      });

      const scoreData = await CandidateScoringService.recalculateScore(candidateProfileId);

      res.json({
        success: true,
        message: 'Onboarding completed successfully!',
        scores: scoreData,
      });
    } catch (error: any) {
      console.error('Complete onboarding error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET SCORE BREAKDOWN
  public static async getScore(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found' });
        return;
      }

      const scoreData = await CandidateScoringService.recalculateScore(candidateProfileId);
      res.json({ success: true, ...scoreData });
    } catch (error: any) {
      console.error('Get score error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // TOGGLE AVAILABILITY
  public static async toggleAvailability(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found' });
        return;
      }

      const { availability } = req.body;
      const valid = ['Available', 'Busy', 'Committed'];
      if (!valid.includes(availability)) {
        res.status(400).json({ success: false, message: 'Invalid availability status' });
        return;
      }

      const profile = await prisma.candidateProfile.update({
        where: { id: candidateProfileId },
        data: { availability },
      });

      res.json({ success: true, availability: profile.availability });
    } catch (error: any) {
      console.error('Toggle availability error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
}
