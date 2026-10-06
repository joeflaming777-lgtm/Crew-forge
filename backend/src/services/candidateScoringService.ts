import { prisma } from '../config/prisma';

export interface ScoringWeights {
  quizWeight: number;
  githubWeight: number;
  skillMatchWeight: number;
  experienceWeight: number;
}

export class CandidateScoringService {
  /**
   * Fetches configurable scoring weights from DB or returns default 50/25/15/10
   */
  public static async getWeights(): Promise<ScoringWeights> {
    const config = await prisma.scoringConfiguration.findUnique({
      where: { id: 'default' },
    });

    if (config) {
      return {
        quizWeight: config.quizWeight,
        githubWeight: config.githubWeight,
        skillMatchWeight: config.skillMatchWeight,
        experienceWeight: config.experienceWeight,
      };
    }

    return {
      quizWeight: 0.50,
      githubWeight: 0.25,
      skillMatchWeight: 0.15,
      experienceWeight: 0.10,
    };
  }

  /**
   * Evaluates candidate's experience score (0-100) based on hackathons, projects, achievements
   */
  public static calculateExperienceScore(profile: {
    hackathonsCount: number;
    projects?: string | null;
    achievements?: string | null;
    certifications?: string | null;
  }): number {
    let score = 30; // base score

    // Hackathons attended: 10 pts per hackathon up to 40 pts
    score += Math.min(40, profile.hackathonsCount * 10);

    // Projects: if provided
    if (profile.projects && profile.projects.length > 20) {
      score += 15;
    }

    // Achievements & certifications
    if (profile.achievements && profile.achievements.length > 10) {
      score += 10;
    }
    if (profile.certifications && profile.certifications.length > 10) {
      score += 5;
    }

    return Math.min(100, Math.max(20, score));
  }

  /**
   * Evaluates candidate's baseline skill score (0-100) based on selected skills count and proficiencies
   */
  public static calculateSkillBaselineScore(skills: { proficiency?: string | null }[]): number {
    if (!skills || skills.length === 0) return 40;

    let score = 40;
    for (const s of skills) {
      if (s.proficiency === 'Advanced') score += 12;
      else if (s.proficiency === 'Intermediate') score += 8;
      else score += 5;
    }
    return Math.min(100, Math.max(30, score));
  }

  /**
   * Recalculates and persists the overall score for a candidate profile
   */
  public static async recalculateScore(candidateProfileId: string): Promise<{
    overallScore: number;
    quizScore: number;
    githubScore: number;
    skillMatchScore: number;
    experienceScore: number;
    weights: ScoringWeights;
  }> {
    const profile = await prisma.candidateProfile.findUnique({
      where: { id: candidateProfileId },
      include: {
        skills: true,
        githubAnalysis: true,
        quizAttempts: {
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    const weights = await this.getWeights();

    // Latest quiz score if available
    const latestAttempt = profile.quizAttempts[0];
    const quizScore = latestAttempt ? latestAttempt.scorePercentage : profile.quizScore;

    // Latest github score if available
    const githubScore = profile.githubAnalysis ? profile.githubAnalysis.score : profile.githubScore;

    // Experience score
    const experienceScore = this.calculateExperienceScore(profile);

    // Skill baseline score
    const skillMatchScore = this.calculateSkillBaselineScore(profile.skills);

    // Formula calculation
    const overallScore = Math.round(
      quizScore * weights.quizWeight +
      githubScore * weights.githubWeight +
      skillMatchScore * weights.skillMatchWeight +
      experienceScore * weights.experienceWeight
    );

    const clampedOverall = Math.min(100, Math.max(0, overallScore));

    await prisma.candidateProfile.update({
      where: { id: candidateProfileId },
      data: {
        quizScore: Math.round(quizScore),
        githubScore: Math.round(githubScore),
        skillMatchScore: Math.round(skillMatchScore),
        experienceScore: Math.round(experienceScore),
        overallScore: clampedOverall,
      },
    });

    return {
      overallScore: clampedOverall,
      quizScore: Math.round(quizScore),
      githubScore: Math.round(githubScore),
      skillMatchScore: Math.round(skillMatchScore),
      experienceScore: Math.round(experienceScore),
      weights,
    };
  }
}
