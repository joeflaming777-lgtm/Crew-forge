import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { MatchingService } from '../services/matchingService';

function formatGitHubAnalysis(ga: any) {
  if (!ga) return null;
  let parsedRaw: Record<string, any> = {};
  if (ga.rawData) {
    try {
      parsedRaw = JSON.parse(ga.rawData);
    } catch (_) {}
  }
  const topLanguages = JSON.parse(ga.topLanguages || '[]');
  const technicalStrengths = JSON.parse(ga.technicalStrengths || '[]');
  const projectExperience = JSON.parse(ga.projectExperience || '[]');

  return {
    id: ga.id,
    username: ga.username,
    publicRepos: ga.publicRepos,
    totalStars: ga.totalStars,
    score: ga.score,
    recentActivityLevel: ga.recentActivityLevel,
    readmeCoverage: ga.readmeCoverage,
    topLanguages,
    technicalStrengths,
    projectExperience,
    analyzedAt: ga.analyzedAt,
    archetype: parsedRaw.archetype || (projectExperience[0] || 'Software Engineer'),
    summary: parsedRaw.summary || `GitHub profile @${ga.username} with ${ga.publicRepos} public repositories and technical score ${ga.score}/100.`,
    highlights: parsedRaw.highlights || [
      `Public repositories verified: ${ga.publicRepos}`,
      `Recent activity level rated ${ga.recentActivityLevel}`,
      `Documentation coverage rated ${ga.readmeCoverage}`,
    ],
    growthAreas: parsedRaw.growthAreas || [
      'Add descriptive READMEs and problem overviews to public repositories',
      'Deploy working web demonstrations with accessible live links',
    ],
    showcaseRepos: parsedRaw.showcaseRepos || [],
    detectedFrameworks: parsedRaw.detectedFrameworks || technicalStrengths,
    metrics: parsedRaw.metrics || {
      publicRepos: ga.publicRepos,
      originalRepos: Math.max(1, ga.publicRepos - 2),
      forkedRepos: 2,
      totalStars: ga.totalStars,
      originalStars: ga.totalStars,
      totalForksCount: 0,
      recentPushes90d: ga.recentActivityLevel === 'High' ? 12 : 3,
      recentCommits90d: ga.recentActivityLevel === 'High' ? 24 : 6,
      deployedProjectsCount: 1,
      hasDocumentationRatio: ga.readmeCoverage === 'Strong' ? 80 : 45,
      accountAgeMonths: 18,
      daysSinceLastPush: ga.recentActivityLevel === 'High' ? 4 : 25,
    },
    breakdown: parsedRaw.breakdown || {
      repoBreadthScore: Math.round(ga.score * 0.25),
      languageMasteryScore: Math.round(ga.score * 0.25),
      activityScore: Math.round(ga.score * 0.25),
      documentationScore: Math.round(ga.score * 0.25),
    },
    avatarUrl: parsedRaw.avatarUrl,
    bio: parsedRaw.bio,
    profileUrl: parsedRaw.profileUrl || `https://github.com/${ga.username}`,
    isFallback: parsedRaw.isFallback || false,
  };
}

export class DiscoveryController {
  // DISCOVER CANDIDATES WITH ADVANCED FILTERS, SORTING & MATCH SCORING
  public static async discoverCandidates(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const leaderProfileId = req.user?.leaderProfileId;

      // Fetch leader's active team to compute matching scores
      let leaderTeam: any = null;
      if (leaderProfileId) {
        leaderTeam = await prisma.team.findFirst({
          where: { leaderProfileId },
          include: { requirements: true, members: true },
        });
      }

      const {
        search,
        role,
        skill,
        department,
        year,
        gender,
        minQuizScore,
        minGithubScore,
        minOverallScore,
        availability,
        minHackathons,
        sortBy = 'matchScore', // matchScore | overallScore | quizScore | githubScore | experience
        sortOrder = 'desc',
      } = req.query;

      // Prisma where clause
      const where: any = {};

      if (department) {
        where.department = String(department);
      }
      if (year) {
        where.year = Number(year);
      }
      if (gender) {
        where.gender = String(gender);
      }
      if (availability) {
        where.availability = String(availability);
      }
      if (minQuizScore) {
        where.quizScore = { gte: Number(minQuizScore) };
      }
      if (minGithubScore) {
        where.githubScore = { gte: Number(minGithubScore) };
      }
      if (minOverallScore) {
        where.overallScore = { gte: Number(minOverallScore) };
      }
      if (minHackathons) {
        where.hackathonsCount = { gte: Number(minHackathons) };
      }

      // Search across name, college, department, bio
      if (search) {
        const queryStr = String(search).toLowerCase();
        where.OR = [
          { fullName: { contains: queryStr } },
          { college: { contains: queryStr } },
          { department: { contains: queryStr } },
          { bio: { contains: queryStr } },
        ];
      }

      // Role filter
      if (role) {
        where.preferredRoles = {
          some: {
            role: { name: { contains: String(role) } },
          },
        };
      }

      // Skill filter
      if (skill) {
        where.skills = {
          some: {
            skill: { name: { contains: String(skill) } },
          },
        };
      }

      // Fetch candidates
      const rawCandidates = await prisma.candidateProfile.findMany({
        where,
        include: {
          user: { select: { email: true } },
          skills: { include: { skill: true } },
          preferredRoles: { include: { role: true } },
          githubAnalysis: true,
          invitations: {
            where: leaderTeam ? { teamId: leaderTeam.id } : undefined,
            select: { id: true, status: true, roleName: true },
          },
          teamMemberships: {
            include: { team: { select: { id: true, name: true } } },
          },
        },
      });

      // Default team criteria if leader has not created a team yet
      const fallbackTeamCriteria = {
        minCandidateScore: 70,
        preferredDept: null,
        requirements: [
          { roleName: 'Frontend Developer', skillNames: '["React", "JavaScript"]' },
          { roleName: 'Backend Developer', skillNames: '["Node.js", "Python"]' },
        ],
      };

      const targetTeam = leaderTeam || fallbackTeamCriteria;

      // Calculate matching analysis for each candidate
      let enrichedCandidates = rawCandidates.map((cand) => {
        const matchResult = MatchingService.calculateTeamCandidateMatch(targetTeam, cand);
        const existingInvitation = cand.invitations && cand.invitations.length > 0 ? cand.invitations[0] : null;
        const isMemberOfCurrentTeam = Boolean(
          leaderTeam && cand.teamMemberships.some((tm) => tm.team.id === leaderTeam.id)
        );

        return {
          id: cand.id,
          fullName: cand.fullName,
          avatarUrl: cand.avatarUrl,
          college: cand.college,
          department: cand.department,
          year: cand.year,
          gender: cand.gender,
          bio: cand.bio,
          availability: cand.availability,
          hackathonsCount: cand.hackathonsCount,
          overallScore: cand.overallScore,
          quizScore: cand.quizScore,
          githubScore: cand.githubScore,
          experienceScore: cand.experienceScore,
          skillMatchScore: cand.skillMatchScore,
          skills: cand.skills.map((s) => ({
            id: s.skill.id,
            name: s.skill.name,
            category: s.skill.category,
            proficiency: s.proficiency,
          })),
          preferredRoles: cand.preferredRoles.map((r) => ({
            id: r.role.id,
            name: r.role.name,
            isPrimary: r.isPrimary,
          })),
          githubAnalysis: formatGitHubAnalysis(cand.githubAnalysis),
          matchAnalysis: matchResult,
          invitationStatus: existingInvitation ? existingInvitation.status : null,
          invitationRole: existingInvitation ? existingInvitation.roleName : null,
          isMemberOfCurrentTeam,
        };
      });

      // Sort
      enrichedCandidates.sort((a, b) => {
        let diff = 0;
        if (sortBy === 'matchScore') {
          diff = a.matchAnalysis.matchScore - b.matchAnalysis.matchScore;
        } else if (sortBy === 'quizScore') {
          diff = a.quizScore - b.quizScore;
        } else if (sortBy === 'githubScore') {
          diff = a.githubScore - b.githubScore;
        } else if (sortBy === 'experience') {
          diff = a.hackathonsCount - b.hackathonsCount;
        } else {
          diff = a.overallScore - b.overallScore;
        }
        return sortOrder === 'asc' ? diff : -diff;
      });

      // Calculate statistics
      const totalCandidates = enrichedCandidates.length;
      const minScoreThreshold = targetTeam.minCandidateScore || 70;
      const eligibleCandidates = enrichedCandidates.filter(
        (c) => c.matchAnalysis.matchScore >= minScoreThreshold
      ).length;
      const topMatches = enrichedCandidates.filter((c) => c.matchAnalysis.matchScore >= 85).length;

      // Count invitations sent by this leader
      let invitationsSent = 0;
      let acceptedCount = 0;
      if (leaderTeam) {
        invitationsSent = await prisma.invitation.count({
          where: { teamId: leaderTeam.id },
        });
        acceptedCount = await prisma.invitation.count({
          where: { teamId: leaderTeam.id, status: 'ACCEPTED' },
        });
      }

      res.json({
        success: true,
        stats: {
          totalCandidates,
          eligibleCandidates,
          topMatches,
          invitationsSent,
          acceptedCount,
          threshold: minScoreThreshold,
        },
        candidates: enrichedCandidates,
      });
    } catch (error: any) {
      console.error('Discover candidates error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // GET DETAILED CANDIDATE PROFILE (LEADER VIEW)
  public static async getCandidateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const leaderProfileId = req.user?.leaderProfileId;

      const candidate: any = await prisma.candidateProfile.findUnique({
        where: { id },
        include: {
          user: { select: { email: true } },
          skills: { include: { skill: true } },
          preferredRoles: { include: { role: true } },
          githubAnalysis: true,
          quizAttempts: {
            orderBy: { completedAt: 'desc' },
            take: 1,
            include: {
              answers: {
                include: { question: true, selectedOption: true },
              },
            },
          },
          teamMemberships: {
            include: { team: { include: { hackathon: true } } },
          },
        },
      });

      if (!candidate) {
        res.status(404).json({ success: false, message: 'Candidate not found.' });
        return;
      }

      // Check leader's team
      let leaderTeam: any = null;
      if (leaderProfileId) {
        leaderTeam = await prisma.team.findFirst({
          where: { leaderProfileId },
          include: { requirements: true },
        });
      }

      const targetTeam = leaderTeam || {
        minCandidateScore: 70,
        preferredDept: null,
        requirements: [{ roleName: 'Developer', skillNames: '["JavaScript"]' }],
      };

      const matchAnalysis = MatchingService.calculateTeamCandidateMatch(targetTeam, candidate);

      // Check existing invitation
      let existingInvitation: any = null;
      if (leaderTeam) {
        existingInvitation = await prisma.invitation.findFirst({
          where: { teamId: leaderTeam.id, candidateProfileId: candidate.id },
        });
      }

      res.json({
        success: true,
        candidate: {
          ...candidate,
          projects: candidate.projects ? JSON.parse(candidate.projects) : [],
          achievements: candidate.achievements ? JSON.parse(candidate.achievements) : [],
          certifications: candidate.certifications ? JSON.parse(candidate.certifications) : [],
          preferredCategories: candidate.preferredCategories ? JSON.parse(candidate.preferredCategories) : [],
          githubAnalysis: formatGitHubAnalysis(candidate.githubAnalysis),
          latestQuizAttempt: candidate.quizAttempts[0]
            ? {
                ...candidate.quizAttempts[0],
                skillBreakdown: JSON.parse(candidate.quizAttempts[0].skillBreakdown || '[]'),
                difficultyBreakdown: JSON.parse(candidate.quizAttempts[0].difficultyBreakdown || '[]'),
              }
            : null,
          matchAnalysis,
          existingInvitation,
        },
      });
    } catch (error: any) {
      console.error('Get candidate profile error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }

  // COMPARE CANDIDATES SIDE-BY-SIDE
  public static async compareCandidates(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { candidateIds } = req.body;
      if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
        res.status(400).json({ success: false, message: 'candidateIds array is required.' });
        return;
      }

      const leaderProfileId = req.user?.leaderProfileId;
      let leaderTeam: any = null;
      if (leaderProfileId) {
        leaderTeam = await prisma.team.findFirst({
          where: { leaderProfileId },
          include: { requirements: true },
        });
      }

      const targetTeam = leaderTeam || {
        minCandidateScore: 70,
        requirements: [],
      };

      const candidates = await prisma.candidateProfile.findMany({
        where: { id: { in: candidateIds.slice(0, 4) } },
        include: {
          skills: { include: { skill: true } },
          preferredRoles: { include: { role: true } },
          githubAnalysis: true,
        },
      });

      const compared = candidates.map((cand) => {
        const matchResult = MatchingService.calculateTeamCandidateMatch(targetTeam, cand);
        return {
          id: cand.id,
          fullName: cand.fullName,
          avatarUrl: cand.avatarUrl,
          department: cand.department,
          year: cand.year,
          college: cand.college,
          availability: cand.availability,
          hackathonsCount: cand.hackathonsCount,
          overallScore: cand.overallScore,
          quizScore: cand.quizScore,
          githubScore: cand.githubScore,
          experienceScore: cand.experienceScore,
          matchAnalysis: matchResult,
          skills: cand.skills.map((s) => s.skill.name),
          roles: cand.preferredRoles.map((r) => r.role.name),
        };
      });

      res.json({ success: true, comparison: compared });
    } catch (error: any) {
      console.error('Compare candidates error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
}
