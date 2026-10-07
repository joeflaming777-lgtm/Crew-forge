import { prisma } from '../config/prisma';

export interface MatchAnalysisResult {
  matchScore: number; // 0 - 100
  breakdown: {
    roleMatch: number;
    skillMatch: number;
    quizScore: number;
    githubScore: number;
    experienceScore: number;
    availabilityScore: number;
  };
  reasons: string[];
  gaps: string[];
  tier: 'Excellent' | 'Strong' | 'Eligible' | 'Below Requirement' | 'Not Qualified';
  isEligible: boolean;
}

export class MatchingService {
  /**
   * Computes compatibility between a team and a candidate profile
   */
  public static calculateTeamCandidateMatch(
    team: {
      minCandidateScore: number;
      preferredDept?: string | null;
      requirements: { roleName: string; skillNames?: string | null }[];
    },
    candidate: {
      department: string;
      availability: string;
      hackathonsCount: number;
      quizScore: number;
      githubScore: number;
      experienceScore: number;
      overallScore: number;
      preferredRoles: { role: { name: string } }[];
      skills: { skill: { name: string } }[];
      githubAnalysis?: { recentActivityLevel?: string; publicRepos?: number; archetype?: string; metrics?: any } | null;
    }
  ): MatchAnalysisResult {
    const reasons: string[] = [];
    const gaps: string[] = [];

    // 1. Role Match
    const teamRequiredRoles = team.requirements.map((r) => r.roleName.toLowerCase());
    const candidateRoles = candidate.preferredRoles.map((r) => r.role.name.toLowerCase());
    const matchingRoles = teamRequiredRoles.filter((tr) => candidateRoles.includes(tr));

    let roleMatch = 40;
    if (teamRequiredRoles.length === 0) {
      roleMatch = 80;
    } else if (matchingRoles.length > 0) {
      roleMatch = 100;
      const matchedRoleName = candidate.preferredRoles.find((r) =>
        teamRequiredRoles.includes(r.role.name.toLowerCase())
      )?.role.name;
      if (matchedRoleName) {
        reasons.push(`✓ Matches required role: ${matchedRoleName}`);
      }
    } else {
      roleMatch = 20;
      gaps.push(`⚠ Candidate's preferred roles do not directly match open team roles`);
    }

    // 2. Skill Match & Gaps
    const teamRequiredSkills: string[] = [];
    for (const req of team.requirements) {
      if (req.skillNames) {
        try {
          const parsed = JSON.parse(req.skillNames);
          if (Array.isArray(parsed)) {
            teamRequiredSkills.push(...parsed);
          }
        } catch {
          // If comma-separated or plain
          teamRequiredSkills.push(...req.skillNames.split(',').map((s) => s.trim()));
        }
      }
    }

    const candidateSkillNames = candidate.skills.map((s) => s.skill.name.toLowerCase());
    let skillMatch = 75;

    if (teamRequiredSkills.length > 0) {
      const uniqueReqSkills = Array.from(new Set(teamRequiredSkills));
      const matchedSkills = uniqueReqSkills.filter((s) =>
        candidateSkillNames.includes(s.toLowerCase())
      );
      const missingSkills = uniqueReqSkills.filter(
        (s) => !candidateSkillNames.includes(s.toLowerCase())
      );

      skillMatch = Math.round((matchedSkills.length / uniqueReqSkills.length) * 100);

      matchedSkills.slice(0, 4).forEach((s) => {
        reasons.push(`✓ Proficient in required skill: ${s}`);
      });

      missingSkills.slice(0, 3).forEach((s) => {
        gaps.push(`⚠ Missing required skill: ${s}`);
      });
    } else {
      // Highlight candidate's top skills
      candidate.skills.slice(0, 3).forEach((s) => {
        reasons.push(`✓ Skilled in ${s.skill.name}`);
      });
    }

    // 3. Quiz & GitHub Performance reasons
    if (candidate.quizScore >= 80) {
      reasons.push(`✓ Strong assessment score (${candidate.quizScore}%)`);
    } else if (candidate.quizScore < 60 && candidate.quizScore > 0) {
      gaps.push(`⚠ Moderate assessment score (${candidate.quizScore}%)`);
    }

    if (candidate.githubScore >= 75) {
      reasons.push(`✓ Proven GitHub technical evidence (${Math.round(candidate.githubScore)}/100)`);
    } else if (candidate.githubScore > 0 && candidate.githubScore < 50) {
      gaps.push(`⚠ Limited public GitHub code evidence (${Math.round(candidate.githubScore)}/100)`);
    }

    if (candidate.githubAnalysis?.archetype) {
      reasons.push(`✓ Identified as ${candidate.githubAnalysis.archetype}`);
    } else if (candidate.githubAnalysis?.recentActivityLevel === 'High') {
      reasons.push(`✓ High recent GitHub commit activity`);
    }

    if (candidate.githubAnalysis?.metrics?.deployedProjectsCount > 0) {
      reasons.push(`✓ Has deployed live application(s) with public demonstrations`);
    }

    // 4. Availability
    let availabilityScore = 100;
    if (candidate.availability === 'Available') {
      availabilityScore = 100;
      reasons.push(`✓ Full availability confirmed for hackathon`);
    } else if (candidate.availability === 'Busy') {
      availabilityScore = 50;
      gaps.push(`⚠ Status marked as Busy / Limited time`);
    } else {
      availabilityScore = 20;
      gaps.push(`⚠ Candidate currently committed to another activity`);
    }

    // 5. Experience
    let experienceScore = candidate.experienceScore || 50;
    if (candidate.hackathonsCount >= 2) {
      reasons.push(`✓ Veteran hacker: ${candidate.hackathonsCount} previous hackathons attended`);
    } else if (candidate.hackathonsCount === 1) {
      reasons.push(`✓ Prior hackathon team experience`);
    }

    // 6. Department match bonus
    if (team.preferredDept && candidate.department) {
      if (team.preferredDept.toLowerCase() === candidate.department.toLowerCase()) {
        reasons.push(`✓ Preferred department match (${candidate.department})`);
      }
    }

    // Weighted compatibility calculation:
    // Role Match: 30%
    // Skill Match: 25%
    // Quiz Score: 20%
    // GitHub Score: 15%
    // Experience & Availability: 10%
    const computedScore = Math.round(
      roleMatch * 0.30 +
      skillMatch * 0.25 +
      (candidate.quizScore || 60) * 0.20 +
      (candidate.githubScore || 60) * 0.15 +
      ((availabilityScore * 0.5 + experienceScore * 0.5)) * 0.10
    );

    const matchScore = Math.min(100, Math.max(15, computedScore));

    // Determine Tier based on team leader's selection threshold
    let tier: 'Excellent' | 'Strong' | 'Eligible' | 'Below Requirement' | 'Not Qualified' = 'Not Qualified';
    if (matchScore >= 90) {
      tier = 'Excellent';
    } else if (matchScore >= 80) {
      tier = 'Strong';
    } else if (matchScore >= team.minCandidateScore) {
      tier = 'Eligible';
    } else if (matchScore >= 60) {
      tier = 'Below Requirement';
    } else {
      tier = 'Not Qualified';
    }

    const isEligible = matchScore >= team.minCandidateScore;

    return {
      matchScore,
      breakdown: {
        roleMatch,
        skillMatch,
        quizScore: Math.round(candidate.quizScore),
        githubScore: Math.round(candidate.githubScore),
        experienceScore: Math.round(experienceScore),
        availabilityScore: Math.round(availabilityScore),
      },
      reasons: reasons.slice(0, 6),
      gaps: gaps.slice(0, 4),
      tier,
      isEligible,
    };
  }
}
