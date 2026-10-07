export type ContextualRole = 'Looking for a Team' | 'Team Owner' | 'Team Member';

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  proficiency?: string;
}

export interface Role {
  id: string;
  name: string;
  category: string;
  description?: string;
  isPrimary?: boolean;
}

export interface ShowcaseRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  repoUrl: string;
  liveUrl?: string | null;
  isFork: boolean;
  updatedAt: string;
}

export interface GitHubMetrics {
  publicRepos: number;
  originalRepos: number;
  forkedRepos: number;
  totalStars: number;
  originalStars: number;
  totalForksCount: number;
  recentPushes90d: number;
  recentCommits90d: number;
  deployedProjectsCount: number;
  hasDocumentationRatio: number;
  accountAgeMonths: number;
  daysSinceLastPush: number;
}

export interface GitHubScoreBreakdown {
  repoBreadthScore: number;     // 0 - 25
  languageMasteryScore: number; // 0 - 25
  activityScore: number;        // 0 - 25
  documentationScore: number;   // 0 - 25
}

export interface GitHubAnalysis {
  id?: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  profileUrl?: string;
  publicRepos: number;
  totalStars: number;
  recentActivityLevel: 'High' | 'Moderate' | 'Low';
  readmeCoverage: 'Strong' | 'Moderate' | 'Basic';
  topLanguages: { name: string; percentage: number; count: number }[];
  technicalStrengths: string[];
  projectExperience: string[];
  detectedFrameworks?: string[];
  archetype?: string;
  summary?: string;
  highlights?: string[];
  growthAreas?: string[];
  showcaseRepos?: ShowcaseRepo[];
  metrics?: GitHubMetrics;
  breakdown?: GitHubScoreBreakdown;
  score: number;
  isFallback?: boolean;
  fallbackReason?: string;
  analyzedAt?: string;
}

export interface QuizTopicScore {
  topic: string;
  score: number;
}

export interface QuizResult {
  score: number;
  roleName: string;
  completedAt: string;
  totalQuestions: number;
  correctQuestions: number;
  topicBreakdown?: QuizTopicScore[];
  answers?: Record<string, string>;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export interface VerificationSteps {
  profile: boolean;
  skills: boolean;
  roles: boolean;
  github: boolean;
  githubAnalysis: boolean;
  quiz: boolean;
  quizResult: boolean;
}

/**
 * SINGLE USER / STUDENT MODEL
 * Every student creates one account and one profile.
 * The same student can find a team and build a team simultaneously.
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  college: string;
  department: string;
  year: number;
  gender?: string;
  bio?: string;
  availability: 'Available' | 'Busy' | 'Committed';
  hackathonsCount: number;
  skills: { id: string; name: string; category: string; proficiency?: string }[];
  preferredRoles: { id: string; name: string; category?: string; isPrimary: boolean }[];
  projects: ProjectItem[];
  achievements: string[];
  hackathonExperience: string;
  githubUsername?: string;
  githubAnalysis?: GitHubAnalysis | null;
  quizResults?: QuizResult | null;
  overallSkillScore: number;
  quizScore: number;
  githubScore: number;
  skillMatchScore: number;
  experienceScore: number;
  linkedIn?: string;
  isActivated: boolean;
  completionPercentage: number;
  verificationSteps: VerificationSteps;
  
  // Backward compatibility aliases if needed
  role?: string;
  candidateProfile?: any;
  leaderProfile?: any;
}

export interface TeamMember {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  assignedRole: string;
  isOwner: boolean;
  joinedAt: string;
  department?: string;
  year?: number;
  overallScore?: number;
  skills?: string[];
}

export interface Team {
  id: string;
  name: string;
  hackathonName: string;
  hackathonId?: string;
  description: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerAvatar?: string;
  maxTeamSize: number;
  currentMemberCount: number;
  minCandidateScore: number;
  requiredRoles: string[];
  requiredSkills: string[];
  optionalRequirements?: string;
  preferredDept?: string;
  availabilityReq?: string;
  status: 'Recruiting' | 'Full' | 'Complete';
  members: TeamMember[];
  openRoles: string[];
  createdAt: string;
}

export interface MatchAnalysis {
  matchScore: number;
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

export interface EnrichedCandidate {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  college: string;
  department: string;
  year: number;
  gender?: string;
  bio?: string;
  availability: string;
  hackathonsCount: number;
  overallScore: number;
  quizScore: number;
  githubScore: number;
  experienceScore: number;
  skillMatchScore: number;
  skills: { id: string; name: string; category: string; proficiency?: string }[];
  preferredRoles: { id: string; name: string; category?: string; isPrimary: boolean }[];
  projects?: ProjectItem[];
  githubAnalysis?: GitHubAnalysis | null;
  matchAnalysis: MatchAnalysis;
  isActivated: boolean;
  completionPercentage: number;
  invitationStatus?: string | null;
  isMemberOfTeam?: boolean;
  isMemberOfCurrentTeam?: boolean;
}

export interface Invitation {
  id: string;
  teamId: string;
  teamName: string;
  hackathonName: string;
  ownerId: string;
  ownerName: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  roleName: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  createdAt: string;
  respondedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INVITATION' | 'TEAM_UPDATE' | 'SELECTION_UPDATE' | 'SYSTEM';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  topic: string;
  explanation: string;
}
