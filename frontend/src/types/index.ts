export type UserRole = 'candidate' | 'team_leader' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  candidateProfile?: CandidateProfile;
  leaderProfile?: LeaderProfile;
}

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

export interface CandidateProfile {
  id: string;
  userId: string;
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
  projects?: string | any[];
  achievements?: string | any[];
  certifications?: string | any[];
  previousExperience?: string;
  preferredCategories?: string | any[];
  profileCompleted: boolean;
  overallScore: number;
  quizScore: number;
  githubScore: number;
  skillMatchScore: number;
  experienceScore: number;
  skills?: { id: string; skill: Skill; proficiency?: string }[];
  preferredRoles?: { id: string; role: Role; isPrimary: boolean }[];
  githubAnalysis?: GitHubAnalysis;
  teamMemberships?: any[];
  invitations?: any[];
}

export interface LeaderProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  college: string;
  department: string;
  year: number;
  bio?: string;
  teams?: Team[];
}

export interface Hackathon {
  id: string;
  name: string;
  slug: string;
  description: string;
  organizer: string;
  registrationDeadline: string;
  minTeamSize: number;
  maxTeamSize: number;
  rules?: string;
  bannerUrl?: string;
  problemStatements?: { id: string; title: string; category: string }[];
  status: string;
  totalTeams?: number;
}

export interface TeamRequirement {
  id?: string;
  roleName: string;
  skillNames?: string;
  neededCount?: number;
  filledCount?: number;
  isRequired?: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  hackathonId: string;
  hackathon?: Hackathon;
  leaderProfileId: string;
  leader?: LeaderProfile;
  maxTeamSize: number;
  minCandidateScore: number;
  preferredDept?: string;
  availabilityReq?: string;
  status: string;
  requirements?: TeamRequirement[];
  members?: {
    id: string;
    candidateProfileId: string;
    assignedRole: string;
    joinedAt: string;
    candidate: CandidateProfile;
  }[];
  openRoles?: string[];
  currentMemberCount?: number;
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
  preferredRoles: { id: string; name: string; isPrimary: boolean }[];
  githubAnalysis?: GitHubAnalysis | null;
  matchAnalysis: MatchAnalysis;
  invitationStatus?: string | null;
  invitationRole?: string | null;
  isMemberOfCurrentTeam?: boolean;
}

export interface Invitation {
  id: string;
  teamId: string;
  team: Team;
  candidateProfileId: string;
  candidate?: CandidateProfile;
  leaderProfileId: string;
  leader?: LeaderProfile;
  roleName: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  createdAt: string;
  respondedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
