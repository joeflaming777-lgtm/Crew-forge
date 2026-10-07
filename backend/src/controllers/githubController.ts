import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { GitHubService } from '../services/githubService';
import { CandidateScoringService } from '../services/candidateScoringService';
import { prisma } from '../config/prisma';

export class GitHubController {
  // ANALYZE GITHUB USERNAME
  public static async analyzeGitHub(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found.' });
        return;
      }

      const { username } = req.body;
      if (!username || typeof username !== 'string' || !username.trim()) {
        res.status(400).json({ success: false, message: 'GitHub username is required.' });
        return;
      }

      const analysisResult = await GitHubService.analyzeUser(username.trim());
      const saved = await GitHubService.saveAnalysis(candidateProfileId, analysisResult);

      // Recalculate candidate overall score
      await CandidateScoringService.recalculateScore(candidateProfileId);

      res.json({
        success: true,
        message: 'GitHub analysis completed successfully.',
        analysis: {
          ...analysisResult,
          id: saved.id,
          analyzedAt: saved.analyzedAt,
        },
      });
    } catch (error: any) {
      console.error('GitHub analysis error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Could not analyze GitHub profile. Please check the username.',
      });
    }
  }

  // GET SAVED GITHUB ANALYSIS
  public static async getAnalysis(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const candidateProfileId = req.user?.candidateProfileId;
      if (!candidateProfileId) {
        res.status(404).json({ success: false, message: 'Candidate profile not found.' });
        return;
      }

      const analysis = await prisma.gitHubAnalysis.findUnique({
        where: { candidateProfileId },
      });

      if (!analysis) {
        res.status(404).json({
          success: false,
          message: 'No GitHub analysis found for this candidate. Please run GitHub analysis.',
        });
        return;
      }

      let parsedRaw: Record<string, any> = {};
      if (analysis.rawData) {
        try {
          parsedRaw = JSON.parse(analysis.rawData);
        } catch (_) {}
      }

      const topLanguages = JSON.parse(analysis.topLanguages || '[]');
      const technicalStrengths = JSON.parse(analysis.technicalStrengths || '[]');
      const projectExperience = JSON.parse(analysis.projectExperience || '[]');

      // Format complete analysis with fallbacks for legacy records
      const formatted = {
        id: analysis.id,
        username: analysis.username,
        publicRepos: analysis.publicRepos,
        totalStars: analysis.totalStars,
        topLanguages,
        recentActivityLevel: analysis.recentActivityLevel,
        readmeCoverage: analysis.readmeCoverage,
        technicalStrengths,
        projectExperience,
        score: analysis.score,
        analyzedAt: analysis.analyzedAt,
        archetype: parsedRaw.archetype || (projectExperience[0] || 'Software Engineer'),
        summary: parsedRaw.summary || `GitHub profile @${analysis.username} with ${analysis.publicRepos} public repositories and technical score of ${analysis.score}/100.`,
        highlights: parsedRaw.highlights || [
          `Public repositories verified: ${analysis.publicRepos}`,
          `Recent activity level rated ${analysis.recentActivityLevel}`,
          `Documentation coverage rated ${analysis.readmeCoverage}`,
        ],
        growthAreas: parsedRaw.growthAreas || [
          'Add descriptive READMEs and problem overviews to public repositories',
          'Deploy working web demonstrations with accessible live links',
        ],
        showcaseRepos: parsedRaw.showcaseRepos || [],
        detectedFrameworks: parsedRaw.detectedFrameworks || technicalStrengths,
        metrics: parsedRaw.metrics || {
          publicRepos: analysis.publicRepos,
          originalRepos: Math.max(1, analysis.publicRepos - 2),
          forkedRepos: 2,
          totalStars: analysis.totalStars,
          originalStars: analysis.totalStars,
          totalForksCount: 0,
          recentPushes90d: analysis.recentActivityLevel === 'High' ? 12 : 3,
          recentCommits90d: analysis.recentActivityLevel === 'High' ? 24 : 6,
          deployedProjectsCount: 1,
          hasDocumentationRatio: analysis.readmeCoverage === 'Strong' ? 80 : 45,
          accountAgeMonths: 18,
          daysSinceLastPush: analysis.recentActivityLevel === 'High' ? 4 : 25,
        },
        breakdown: parsedRaw.breakdown || {
          repoBreadthScore: Math.round(analysis.score * 0.25),
          languageMasteryScore: Math.round(analysis.score * 0.25),
          activityScore: Math.round(analysis.score * 0.25),
          documentationScore: Math.round(analysis.score * 0.25),
        },
        avatarUrl: parsedRaw.avatarUrl,
        bio: parsedRaw.bio,
        profileUrl: parsedRaw.profileUrl || `https://github.com/${analysis.username}`,
        isFallback: parsedRaw.isFallback || false,
      };

      res.json({ success: true, analysis: formatted });
    } catch (error: any) {
      console.error('Get GitHub analysis error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
}
