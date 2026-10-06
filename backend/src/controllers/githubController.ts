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

      // Parse JSON strings
      const formatted = {
        id: analysis.id,
        username: analysis.username,
        publicRepos: analysis.publicRepos,
        totalStars: analysis.totalStars,
        topLanguages: JSON.parse(analysis.topLanguages || '[]'),
        recentActivityLevel: analysis.recentActivityLevel,
        readmeCoverage: analysis.readmeCoverage,
        technicalStrengths: JSON.parse(analysis.technicalStrengths || '[]'),
        projectExperience: JSON.parse(analysis.projectExperience || '[]'),
        score: analysis.score,
        analyzedAt: analysis.analyzedAt,
      };

      res.json({ success: true, analysis: formatted });
    } catch (error: any) {
      console.error('Get GitHub analysis error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
}
