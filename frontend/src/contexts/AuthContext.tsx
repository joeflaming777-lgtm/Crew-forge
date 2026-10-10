import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Team,
  TeamMember,
  Invitation,
  JoinRequest,
  Notification,
  GitHubAnalysis,
  QuizResult,
  EnrichedCandidate,
  MatchAnalysis,
} from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email?: string, password?: string, intent?: string) => Promise<boolean>;
  register: (data: Partial<User>, intent?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  
  // Teams State & Actions
  teams: Team[];
  myOwnedTeams: Team[];
  myMemberTeams: Team[];
  myAllTeams: Team[];
  isTeamOwner: boolean;
  createTeam: (teamData: {
    name: string;
    hackathonName: string;
    description: string;
    maxTeamSize: number;
    requiredRoles: string[];
    requiredSkills: string[];
    optionalRequirements?: string;
    minCandidateScore?: number;
  }) => Team;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  getTeamById: (teamId: string) => Team | undefined;
  removeTeamMember: (teamId: string, memberUserId: string) => void;
  leaveTeam: (teamId: string) => void;

  // Join Requests
  joinRequests: JoinRequest[];
  mySentJoinRequests: JoinRequest[];
  getJoinRequestsForTeam: (teamId: string) => JoinRequest[];
  allMyReceivedJoinRequests: JoinRequest[];
  createJoinRequest: (teamId: string, roleName: string, message?: string) => { success: boolean; message: string };
  approveJoinRequest: (requestId: string) => { success: boolean; message: string };
  declineJoinRequest: (requestId: string) => void;
  cancelJoinRequest: (requestId: string) => void;

  // Invitations
  invitations: Invitation[];
  myReceivedInvitations: Invitation[];
  mySentInvitations: (teamId?: string) => Invitation[];
  sendInvitation: (teamId: string, candidateId: string, roleName: string, message: string) => boolean;
  acceptInvitation: (invitationId: string) => { success: boolean; message: string };
  declineInvitation: (invitationId: string) => void;
  cancelInvitation: (invitationId: string) => void;

  // Candidate Discovery
  allCandidates: EnrichedCandidate[];
  getCandidateById: (candidateId: string) => EnrichedCandidate | undefined;

  // Verification & Assessment
  runGitHubAnalysis: (username: string) => Promise<GitHubAnalysis>;
  submitQuiz: (roleName: string, answers: Record<string, string>, score?: number) => QuizResult;

  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Switch demo account
  switchDemoUser: (userId: string) => void;

  // Backward compatibility getters
  isCandidate: boolean;
  isLeader: boolean;
  isAdmin: boolean;
}

const STORAGE_KEY = 'skillsync_app_state_v1';

// INITIAL SEED DATA
const SEED_USERS: User[] = [
  {
    id: 'user-arjun',
    email: 'arjun@skillsync.dev',
    fullName: 'Arjun Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    college: 'IIT Bombay',
    department: 'Computer Science and Engineering',
    year: 3,
    gender: 'Male',
    bio: 'Passionate about distributed systems, edge AI inference, and hackathon architectures. Built 4 production hackathon wins.',
    availability: 'Available',
    hackathonsCount: 4,
    skills: [
      { id: 'sk-1', name: 'React', category: 'Frontend', proficiency: 'Advanced' },
      { id: 'sk-2', name: 'TypeScript', category: 'Languages', proficiency: 'Advanced' },
      { id: 'sk-3', name: 'Python', category: 'Languages', proficiency: 'Expert' },
      { id: 'sk-4', name: 'PyTorch', category: 'AI/ML', proficiency: 'Advanced' },
      { id: 'sk-5', name: 'Node.js', category: 'Backend', proficiency: 'Advanced' },
      { id: 'sk-6', name: 'Docker', category: 'DevOps', proficiency: 'Intermediate' },
      { id: 'sk-7', name: 'GraphQL', category: 'Backend', proficiency: 'Intermediate' },
    ],
    preferredRoles: [
      { id: 'r-1', name: 'AI/ML Developer', category: 'AI/ML', isPrimary: true },
      { id: 'r-2', name: 'Full Stack Developer', category: 'Engineering', isPrimary: false },
    ],
    projects: [
      {
        id: 'p-1',
        title: 'AgriVision AI',
        description: 'Multi-lingual real-time plant pathology diagnosis using lightweight vision transformers and quantization.',
        techStack: ['Python', 'PyTorch', 'FastAPI', 'React'],
        repoUrl: 'https://github.com/arjun-codes/agrivision-ai',
        liveUrl: 'https://agrivision.ai.preview',
      },
      {
        id: 'p-2',
        title: 'PeerSync Escrow',
        description: 'Decentralized micro-escrow protocol for campus peer book exchanges.',
        techStack: ['Solidity', 'TypeScript', 'Next.js'],
        repoUrl: 'https://github.com/arjun-codes/peersync',
      },
    ],
    achievements: [
      'Winner - Smart India Hackathon 2024 (Ministry of Agriculture Track)',
      '1st Place - Inter-IIT Tech Meet Hackathon 2025',
      'Published author on arXiv for Efficient Transformer Pruning',
    ],
    hackathonExperience: 'Participated in 4 national hackathons, winning 2 grand prizes. Led cross-functional teams of up to 6 developers.',
    githubUsername: 'arjun-codes',
    overallSkillScore: 88,
    quizScore: 92,
    githubScore: 86,
    skillMatchScore: 90,
    experienceScore: 84,
    linkedIn: 'https://linkedin.com/in/arjun-sharma-skillsync',
    isActivated: true,
    completionPercentage: 94,
    verificationSteps: {
      profile: true,
      skills: true,
      roles: true,
      github: true,
      githubAnalysis: true,
      quiz: true,
      quizResult: true,
    },
    githubAnalysis: {
      username: 'arjun-codes',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Open source contributor & ML enthusiast | IIT Bombay CSE',
      publicRepos: 28,
      totalStars: 142,
      recentActivityLevel: 'High',
      readmeCoverage: 'Strong',
      topLanguages: [
        { name: 'Python', percentage: 48, count: 14 },
        { name: 'TypeScript', percentage: 32, count: 9 },
        { name: 'Rust', percentage: 12, count: 3 },
        { name: 'HTML/CSS', percentage: 8, count: 2 },
      ],
      technicalStrengths: ['PyTorch Model Optimization', 'Clean React Architecture', 'CI/CD Workflows', 'RESTful API Engineering'],
      projectExperience: ['Production Microservices', 'Transformer Deployments', 'Hackathon MVPs'],
      archetype: 'Pragmatic AI Systems Architect',
      summary: 'High commit consistency with deep repository documentation and production deployments.',
      highlights: ['Active commit streak in last 90 days', 'Comprehensive READMEs with architecture diagrams', '142 total repository stars'],
      growthAreas: ['Container orchestration on bare metal', 'Unit test coverage on backend APIs'],
      score: 86,
      breakdown: {
        repoBreadthScore: 22,
        languageMasteryScore: 23,
        activityScore: 21,
        documentationScore: 20,
      },
    },
    quizResults: {
      score: 92,
      roleName: 'AI/ML Developer',
      completedAt: '2026-03-15T10:30:00Z',
      totalQuestions: 10,
      correctQuestions: 9,
      topicBreakdown: [
        { topic: 'Deep Learning & PyTorch', score: 95 },
        { topic: 'Data Preprocessing', score: 90 },
        { topic: 'Model Evaluation Metrics', score: 100 },
        { topic: 'System Design for ML', score: 85 },
      ],
    },
  },
  {
    id: 'user-priya',
    email: 'priya@skillsync.dev',
    fullName: 'Priya Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98111 22334',
    college: 'BITS Pilani',
    department: 'Information Technology',
    year: 3,
    gender: 'Female',
    bio: 'Product-minded Frontend Engineer & UI/UX Specialist. Obsessed with framer-motion micro-interactions and high aesthetic finishes.',
    availability: 'Available',
    hackathonsCount: 3,
    skills: [
      { id: 'sk-11', name: 'React', category: 'Frontend', proficiency: 'Expert' },
      { id: 'sk-12', name: 'Next.js', category: 'Frontend', proficiency: 'Advanced' },
      { id: 'sk-13', name: 'Tailwind CSS', category: 'Styling', proficiency: 'Expert' },
      { id: 'sk-14', name: 'Figma', category: 'Design', proficiency: 'Expert' },
      { id: 'sk-15', name: 'TypeScript', category: 'Languages', proficiency: 'Advanced' },
      { id: 'sk-16', name: 'Three.js', category: 'Graphics', proficiency: 'Intermediate' },
    ],
    preferredRoles: [
      { id: 'r-11', name: 'UI/UX Designer', category: 'Design', isPrimary: true },
      { id: 'r-12', name: 'Frontend Developer', category: 'Engineering', isPrimary: false },
    ],
    projects: [
      {
        id: 'p-11',
        title: 'CanvasCraft UI',
        description: 'Design system library with 40+ accessible, animated interactive web components.',
        techStack: ['React', 'Framer Motion', 'Tailwind CSS'],
        repoUrl: 'https://github.com/priyapatel/canvascraft',
        liveUrl: 'https://canvascraft.design.demo',
      },
    ],
    achievements: ['Best Design Award - HackCBS 2025', 'Google Women Techmakers Scholar 2025'],
    hackathonExperience: 'Designed and engineered user-facing experiences for 3 collegiate hackathons.',
    githubUsername: 'priya-ui',
    overallSkillScore: 85,
    quizScore: 88,
    githubScore: 82,
    skillMatchScore: 89,
    experienceScore: 80,
    linkedIn: 'https://linkedin.com/in/priya-patel-design',
    isActivated: true,
    completionPercentage: 92,
    verificationSteps: {
      profile: true,
      skills: true,
      roles: true,
      github: true,
      githubAnalysis: true,
      quiz: true,
      quizResult: true,
    },
    githubAnalysis: {
      username: 'priya-ui',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio: 'Design Systems & Frontend Craftsman',
      publicRepos: 18,
      totalStars: 95,
      recentActivityLevel: 'High',
      readmeCoverage: 'Strong',
      topLanguages: [
        { name: 'TypeScript', percentage: 65, count: 11 },
        { name: 'CSS/HTML', percentage: 25, count: 5 },
        { name: 'JavaScript', percentage: 10, count: 2 },
      ],
      technicalStrengths: ['Accessible UI Design', 'State Management', 'Interactive Web Animations'],
      projectExperience: ['Component Libraries', 'SaaS Dashboards'],
      score: 82,
      breakdown: {
        repoBreadthScore: 20,
        languageMasteryScore: 21,
        activityScore: 20,
        documentationScore: 21,
      },
    },
    quizResults: {
      score: 88,
      roleName: 'UI/UX Designer',
      completedAt: '2026-03-20T14:15:00Z',
      totalQuestions: 10,
      correctQuestions: 9,
      topicBreakdown: [
        { topic: 'Visual Hierarchy & Typography', score: 95 },
        { topic: 'Design Systems & Tokens', score: 90 },
        { topic: 'Component Accessibility', score: 85 },
      ],
    },
  },
  {
    id: 'user-aarav',
    email: 'aarav@skillsync.dev',
    fullName: 'Aarav Mehta',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 99887 76655',
    college: 'Delhi Technological University (DTU)',
    department: 'Software Engineering',
    year: 4,
    gender: 'Male',
    bio: 'Cloud architecture & DevOps specialist. Built automated multi-cloud clusters and high-concurrency microservices.',
    availability: 'Available',
    hackathonsCount: 5,
    skills: [
      { id: 'sk-21', name: 'Go', category: 'Languages', proficiency: 'Expert' },
      { id: 'sk-22', name: 'Kubernetes', category: 'DevOps', proficiency: 'Advanced' },
      { id: 'sk-23', name: 'Docker', category: 'DevOps', proficiency: 'Expert' },
      { id: 'sk-24', name: 'AWS', category: 'Cloud', proficiency: 'Advanced' },
      { id: 'sk-25', name: 'Terraform', category: 'DevOps', proficiency: 'Intermediate' },
      { id: 'sk-26', name: 'Python', category: 'Languages', proficiency: 'Advanced' },
    ],
    preferredRoles: [
      { id: 'r-21', name: 'DevOps Engineer', category: 'DevOps', isPrimary: true },
      { id: 'r-22', name: 'Backend Developer', category: 'Engineering', isPrimary: false },
    ],
    projects: [
      {
        id: 'p-21',
        title: 'ClusterMesh CLI',
        description: 'Zero-config local Kubernetes multi-cluster mesh emulator with live metric dashboard.',
        techStack: ['Go', 'Docker', 'eBPF'],
        repoUrl: 'https://github.com/aaravmehta/clustermesh',
      },
    ],
    achievements: ['Certified Kubernetes Administrator (CKA)', 'Top 5 HackMIT 2025 DevOps track'],
    hackathonExperience: 'Handled cloud deployments and high availability infrastructure for 5 collegiate hackathons.',
    githubUsername: 'aarav-cloud',
    overallSkillScore: 87,
    quizScore: 90,
    githubScore: 85,
    skillMatchScore: 88,
    experienceScore: 86,
    linkedIn: 'https://linkedin.com/in/aarav-mehta-devops',
    isActivated: true,
    completionPercentage: 89,
    verificationSteps: {
      profile: true,
      skills: true,
      roles: true,
      github: true,
      githubAnalysis: true,
      quiz: true,
      quizResult: true,
    },
    githubAnalysis: {
      username: 'aarav-cloud',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      publicRepos: 22,
      totalStars: 110,
      recentActivityLevel: 'High',
      readmeCoverage: 'Strong',
      topLanguages: [
        { name: 'Go', percentage: 55, count: 12 },
        { name: 'HCL/Terraform', percentage: 25, count: 5 },
        { name: 'Python', percentage: 20, count: 5 },
      ],
      technicalStrengths: ['Cloud Automation', 'Container Orchestration', 'Infrastructure as Code'],
      projectExperience: ['Distributed Storage', 'Cloud CLI Tooling'],
      score: 85,
      breakdown: {
        repoBreadthScore: 21,
        languageMasteryScore: 22,
        activityScore: 21,
        documentationScore: 21,
      },
    },
    quizResults: {
      score: 90,
      roleName: 'DevOps Engineer',
      completedAt: '2026-03-10T11:00:00Z',
      totalQuestions: 10,
      correctQuestions: 9,
    },
  },
  {
    id: 'user-sneha',
    email: 'sneha@skillsync.dev',
    fullName: 'Sneha Rao',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    college: 'IIIT Hyderabad',
    department: 'Computer Science',
    year: 3,
    gender: 'Female',
    bio: 'Mobile and cross-platform developer specializing in Flutter and React Native. Keen eye for performance profiling.',
    availability: 'Available',
    hackathonsCount: 2,
    skills: [
      { id: 'sk-31', name: 'Flutter', category: 'Mobile', proficiency: 'Expert' },
      { id: 'sk-32', name: 'React Native', category: 'Mobile', proficiency: 'Advanced' },
      { id: 'sk-33', name: 'Kotlin', category: 'Languages', proficiency: 'Intermediate' },
      { id: 'sk-34', name: 'Firebase', category: 'Backend', proficiency: 'Advanced' },
    ],
    preferredRoles: [
      { id: 'r-31', name: 'Mobile Developer', category: 'Engineering', isPrimary: true },
      { id: 'r-32', name: 'Frontend Developer', category: 'Engineering', isPrimary: false },
    ],
    projects: [],
    achievements: ['Finalist - Smart India Hackathon 2025 Mobile Track'],
    hackathonExperience: 'Delivered fast mobile client apps for 2 multi-track hackathons.',
    githubUsername: 'sneha-dev',
    overallSkillScore: 82,
    quizScore: 85,
    githubScore: 80,
    skillMatchScore: 84,
    experienceScore: 78,
    isActivated: true,
    completionPercentage: 86,
    verificationSteps: {
      profile: true,
      skills: true,
      roles: true,
      github: true,
      githubAnalysis: true,
      quiz: true,
      quizResult: true,
    },
  },
  {
    id: 'user-vikram',
    email: 'vikram@skillsync.dev',
    fullName: 'Vikram Desai',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    college: 'NIT Trichy',
    department: 'Electrical and Electronics',
    year: 4,
    gender: 'Male',
    bio: 'Smart contract security enthusiast and Web3 backend engineer. Audited 8 student protocols.',
    availability: 'Available',
    hackathonsCount: 3,
    skills: [
      { id: 'sk-41', name: 'Solidity', category: 'Blockchain', proficiency: 'Expert' },
      { id: 'sk-42', name: 'Rust', category: 'Languages', proficiency: 'Intermediate' },
      { id: 'sk-43', name: 'Ethereum / Hardhat', category: 'Blockchain', proficiency: 'Advanced' },
      { id: 'sk-44', name: 'Node.js', category: 'Backend', proficiency: 'Advanced' },
    ],
    preferredRoles: [
      { id: 'r-41', name: 'Smart Contract Engineer', category: 'Blockchain', isPrimary: true },
      { id: 'r-42', name: 'Backend Developer', category: 'Engineering', isPrimary: false },
    ],
    projects: [],
    achievements: ['ETHIndia 2024 Pool Prize Winner'],
    hackathonExperience: 'Engineered on-chain voting and automated liquidity protocols.',
    githubUsername: 'vikram-crypto',
    overallSkillScore: 81,
    quizScore: 84,
    githubScore: 79,
    skillMatchScore: 82,
    experienceScore: 79,
    isActivated: true,
    completionPercentage: 85,
    verificationSteps: {
      profile: true,
      skills: true,
      roles: true,
      github: true,
      githubAnalysis: true,
      quiz: true,
      quizResult: true,
    },
  },
];

const SEED_TEAMS: Team[] = [
  {
    id: 'team-innovators',
    name: 'Innovators',
    hackathonName: 'Smart India Hackathon 2026',
    hackathonId: 'sih-2026',
    description: 'Developing an automated AI-driven multi-lingual crop disease detection & advisory system for rural farmers.',
    ownerId: 'user-arjun',
    ownerName: 'Arjun Sharma',
    ownerEmail: 'arjun@skillsync.dev',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    maxTeamSize: 6,
    currentMemberCount: 3,
    minCandidateScore: 75,
    requiredRoles: ['UI/UX Designer', 'Frontend Developer', 'IoT Specialist'],
    requiredSkills: ['React', 'Figma', 'TypeScript', 'Python', 'Tailwind CSS'],
    optionalRequirements: 'Open to 2nd to 4th year students with prior hackathon interest.',
    preferredDept: 'Computer Science, IT, or Electronics',
    status: 'Recruiting',
    openRoles: ['UI/UX Designer', 'Frontend Developer', 'IoT Specialist'],
    createdAt: '2026-03-10T08:00:00Z',
    members: [
      {
        id: 'tm-1',
        userId: 'user-arjun',
        fullName: 'Arjun Sharma',
        email: 'arjun@skillsync.dev',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        assignedRole: 'Team Owner & AI Lead',
        isOwner: true,
        joinedAt: '2026-03-10T08:00:00Z',
        department: 'CSE',
        year: 3,
        overallScore: 88,
      },
      {
        id: 'tm-2',
        userId: 'user-sneha',
        fullName: 'Sneha Rao',
        email: 'sneha@skillsync.dev',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        assignedRole: 'Mobile Developer',
        isOwner: false,
        joinedAt: '2026-03-12T14:30:00Z',
        department: 'CSE',
        year: 3,
        overallScore: 82,
      },
      {
        id: 'tm-3',
        userId: 'user-vikram',
        fullName: 'Vikram Desai',
        email: 'vikram@skillsync.dev',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        assignedRole: 'Backend Engineer',
        isOwner: false,
        joinedAt: '2026-03-14T09:15:00Z',
        department: 'EEE',
        year: 4,
        overallScore: 81,
      },
    ],
  },
  {
    id: 'team-byteforce',
    name: 'ByteForce',
    hackathonName: 'Campus Innovation Hackathon 2026',
    hackathonId: 'campus-2026',
    description: 'Next-gen peer-to-peer campus marketplace and textbook exchange with cryptographic escrow.',
    ownerId: 'user-rohan-seed',
    ownerName: 'Rohan Kapoor',
    ownerEmail: 'rohan@campus.edu',
    ownerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    maxTeamSize: 4,
    currentMemberCount: 3,
    minCandidateScore: 70,
    requiredRoles: ['Smart Contract Auditor', 'Security Specialist'],
    requiredSkills: ['Solidity', 'Web3.js', 'Node.js', 'Security'],
    status: 'Recruiting',
    openRoles: ['Smart Contract Auditor'],
    createdAt: '2026-03-01T12:00:00Z',
    members: [
      {
        id: 'tm-bf-1',
        userId: 'user-rohan-seed',
        fullName: 'Rohan Kapoor',
        email: 'rohan@campus.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        assignedRole: 'Team Owner & Lead',
        isOwner: true,
        joinedAt: '2026-03-01T12:00:00Z',
      },
      {
        id: 'tm-bf-2',
        userId: 'user-arjun',
        fullName: 'Arjun Sharma',
        email: 'arjun@skillsync.dev',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        assignedRole: 'Full Stack Developer',
        isOwner: false,
        joinedAt: '2026-03-05T16:20:00Z',
        department: 'CSE',
        year: 3,
        overallScore: 88,
      },
      {
        id: 'tm-bf-3',
        userId: 'user-sneha',
        fullName: 'Sneha Rao',
        email: 'sneha@skillsync.dev',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        assignedRole: 'Mobile Architect',
        isOwner: false,
        joinedAt: '2026-03-06T11:45:00Z',
      },
    ],
  },
  {
    id: 'team-neuralnomads',
    name: 'NeuralNomads',
    hackathonName: 'HackMIT 2026',
    hackathonId: 'hackmit-2026',
    description: 'Low-latency distributed vector search indexing engine optimized for edge devices and Raspberry Pi clusters.',
    ownerId: 'user-aarav',
    ownerName: 'Aarav Mehta',
    ownerEmail: 'aarav@skillsync.dev',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    maxTeamSize: 4,
    currentMemberCount: 2,
    minCandidateScore: 80,
    requiredRoles: ['Rust Systems Engineer', 'API Developer'],
    requiredSkills: ['Rust', 'C++', 'Go', 'Distributed Systems'],
    status: 'Recruiting',
    openRoles: ['Rust Systems Engineer', 'API Developer'],
    createdAt: '2026-03-18T10:00:00Z',
    members: [
      {
        id: 'tm-nn-1',
        userId: 'user-aarav',
        fullName: 'Aarav Mehta',
        email: 'aarav@skillsync.dev',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        assignedRole: 'Team Owner & DevOps Lead',
        isOwner: true,
        joinedAt: '2026-03-18T10:00:00Z',
      },
    ],
  },
  {
    id: 'team-cyberpulse',
    name: 'CyberPulse',
    hackathonName: 'ETHIndia 2026',
    hackathonId: 'ethindia-2026',
    description: 'Privacy-preserving zero-knowledge identity verification protocol with anonymous credential issuance for DAOs.',
    ownerId: 'user-maya-seed',
    ownerName: 'Maya Iyer',
    ownerEmail: 'maya@web3.org',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    maxTeamSize: 5,
    currentMemberCount: 2,
    minCandidateScore: 78,
    requiredRoles: ['AI / Backend Developer', 'Smart Contract Engineer', 'Frontend Developer'],
    requiredSkills: ['Solidity', 'Circom', 'Python', 'React', 'ZK-Proofs'],
    status: 'Recruiting',
    openRoles: ['AI / Backend Developer', 'Frontend Developer'],
    createdAt: '2026-03-15T07:30:00Z',
    members: [
      {
        id: 'tm-cp-1',
        userId: 'user-maya-seed',
        fullName: 'Maya Iyer',
        email: 'maya@web3.org',
        assignedRole: 'Team Owner & Cryptographer',
        isOwner: true,
        joinedAt: '2026-03-15T07:30:00Z',
      },
    ],
  },
];

const SEED_INVITATIONS: Invitation[] = [
  {
    id: 'inv-1',
    teamId: 'team-innovators',
    teamName: 'Innovators',
    hackathonName: 'Smart India Hackathon 2026',
    ownerId: 'user-arjun',
    ownerName: 'Arjun Sharma',
    candidateId: 'user-priya',
    candidateName: 'Priya Patel',
    candidateEmail: 'priya@skillsync.dev',
    roleName: 'UI/UX Designer',
    message: 'Hey Priya! We loved your CanvasCraft portfolio and would love for you to head UI/UX and interactive frontend for our SIH agriculture platform.',
    status: 'PENDING',
    createdAt: '2026-03-22T11:20:00Z',
  },
  {
    id: 'inv-2',
    teamId: 'team-cyberpulse',
    teamName: 'CyberPulse',
    hackathonName: 'ETHIndia 2026',
    ownerId: 'user-maya-seed',
    ownerName: 'Maya Iyer',
    candidateId: 'user-arjun',
    candidateName: 'Arjun Sharma',
    candidateEmail: 'arjun@skillsync.dev',
    roleName: 'AI / Backend Developer',
    message: 'Hi Arjun, we saw your ML pruning paper and stellar score on SkillSync. Would you be open to collaborating on our ZK identity engine?',
    status: 'PENDING',
    createdAt: '2026-03-24T15:45:00Z',
  },
];

const SEED_JOIN_REQUESTS: JoinRequest[] = [
  {
    id: 'req-1',
    teamId: 'team-innovators',
    teamName: 'Innovators',
    hackathonName: 'Smart India Hackathon 2026',
    ownerId: 'user-arjun',
    candidateId: 'user-priya',
    candidateName: 'Priya Patel',
    candidateEmail: 'priya@skillsync.dev',
    candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    candidateDepartment: 'Information Technology',
    candidateCollege: 'BITS Pilani',
    candidateScore: 85,
    candidateSkills: ['React', 'Figma', 'TypeScript', 'Tailwind CSS'],
    roleName: 'UI/UX Designer',
    message: 'I have extensive experience designing interactive UI components and would love to collaborate on Innovators for SIH!',
    status: 'PENDING',
    createdAt: '2026-03-23T14:20:00Z',
  },
  {
    id: 'req-2',
    teamId: 'team-neuralnomads',
    teamName: 'NeuralNomads',
    hackathonName: 'HackMIT 2026',
    ownerId: 'user-aarav',
    candidateId: 'user-arjun',
    candidateName: 'Arjun Sharma',
    candidateEmail: 'arjun@skillsync.dev',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    candidateDepartment: 'Computer Science and Engineering',
    candidateCollege: 'IIT Bombay',
    candidateScore: 88,
    candidateSkills: ['Python', 'PyTorch', 'Rust', 'Docker'],
    roleName: 'Rust Systems Engineer',
    message: 'Excited about edge vector search. I have worked on distributed systems and would love to contribute to NeuralNomads.',
    status: 'PENDING',
    createdAt: '2026-03-24T09:15:00Z',
  },
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-arjun',
    title: 'New Team Invitation Received! 📩',
    message: 'Maya Iyer invited you to join team CyberPulse for ETHIndia 2026 as an AI / Backend Developer.',
    type: 'INVITATION',
    link: '/invitations',
    isRead: false,
    createdAt: '2026-03-24T15:45:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-arjun',
    title: 'Team Update: ByteForce 🚀',
    message: 'ByteForce scheduled a sync meeting for Campus Hackathon milestone check-in.',
    type: 'TEAM_UPDATE',
    link: '/my-teams',
    isRead: true,
    createdAt: '2026-03-21T09:00:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-priya',
    title: 'New Team Invitation Received! 📩',
    message: 'Arjun Sharma invited you to join Innovators for Smart India Hackathon 2026.',
    type: 'INVITATION',
    link: '/invitations',
    isRead: false,
    createdAt: '2026-03-22T11:20:00Z',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [allUsers, setAllUsers] = useState<User[]>(SEED_USERS);
  const [teams, setTeams] = useState<Team[]>(SEED_TEAMS);
  const [invitations, setInvitations] = useState<Invitation[]>(SEED_INVITATIONS);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(SEED_JOIN_REQUESTS);
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);

  // Initialize or restore state from localStorage
  useEffect(() => {
    try {
      // Clear legacy storage tokens and sessions
      localStorage.removeItem('skillsync_token');
      localStorage.removeItem('skillsync_user');
      localStorage.removeItem('hackmate_token');
      localStorage.removeItem('hackmate_user');
      localStorage.removeItem('hackmate_app_state_v2');

      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.allUsers) setAllUsers(parsed.allUsers);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.invitations) setInvitations(parsed.invitations);
        if (parsed.joinRequests) setJoinRequests(parsed.joinRequests);
        if (parsed.notifications) setNotifications(parsed.notifications);
        // Clean already logged-in account from saved state
        if (parsed.currentUser) {
          delete parsed.currentUser;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      }
      // Start in a clean logged-out state
      setUser(null);
      setToken(null);
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            allUsers,
            teams,
            invitations,
            joinRequests,
            notifications,
            currentUser: user,
          })
        );
      } catch (e) {
        console.warn('Failed to save SkillSync state to localStorage', e);
      }
    }
  }, [allUsers, teams, invitations, joinRequests, notifications, user, loading]);

  const login = async (email?: string, password?: string, intent?: string): Promise<boolean> => {
    // If no email given or demo clicked, match user by email or fallback to Arjun
    const targetEmail = email ? email.trim().toLowerCase() : 'arjun@skillsync.dev';
    const matched = allUsers.find((u) => u.email.toLowerCase() === targetEmail) || allUsers[0];

    setUser(matched);
    setToken('mock-jwt-token-' + matched.id);
    return true;
  };

  const register = async (data: Partial<User>, intent?: string): Promise<boolean> => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      email: data.email || 'student@college.edu',
      fullName: data.fullName || 'New Student',
      avatarUrl:
        data.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      college: data.college || 'IIT Delhi',
      department: data.department || 'Computer Science',
      year: data.year || 2,
      gender: data.gender || 'Not specified',
      bio: data.bio || 'Eager to build innovative projects in upcoming hackathons.',
      availability: 'Available',
      hackathonsCount: 0,
      skills: data.skills || [
        { id: 'sk-init-1', name: 'JavaScript', category: 'Languages', proficiency: 'Intermediate' },
        { id: 'sk-init-2', name: 'React', category: 'Frontend', proficiency: 'Beginner' },
      ],
      preferredRoles: data.preferredRoles || [
        { id: 'r-init-1', name: 'Frontend Developer', category: 'Engineering', isPrimary: true },
      ],
      projects: [],
      achievements: [],
      hackathonExperience: 'Excited to participate in my first hackathons!',
      githubUsername: data.githubUsername || '',
      overallSkillScore: 72,
      quizScore: 0,
      githubScore: 0,
      skillMatchScore: 70,
      experienceScore: 65,
      isActivated: false,
      completionPercentage: 45,
      verificationSteps: {
        profile: true,
        skills: true,
        roles: true,
        github: false,
        githubAnalysis: false,
        quiz: false,
        quizResult: false,
      },
    };

    setAllUsers((prev) => [newUser, ...prev]);
    setUser(newUser);
    setToken('mock-jwt-token-' + newUser.id);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('skillsync_token');
      localStorage.removeItem('skillsync_user');
      localStorage.removeItem('hackmate_token');
      localStorage.removeItem('hackmate_user');
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        delete parsed.currentUser;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch (e) {
      console.warn('Failed to clean auth state on logout', e);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };

    // recalculate completion percentage without quiz requirement
    let comp = 0;
    if (updated.fullName && updated.college && updated.department) comp += 30;
    if (updated.skills && updated.skills.length >= 2) comp += 25;
    if (updated.preferredRoles && updated.preferredRoles.length >= 1) comp += 20;
    if (updated.githubUsername) comp += 10;
    if (updated.githubAnalysis) comp += 15;

    updated.completionPercentage = Math.min(100, comp);
    if (updated.completionPercentage >= 70) {
      updated.isActivated = true;
    }

    setUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  const refreshUser = async () => {
    if (!user) return;
    const fresh = allUsers.find((u) => u.id === user.id);
    if (fresh) setUser(fresh);
  };

  const switchDemoUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setUser(target);
      setToken('mock-jwt-token-' + target.id);
    }
  };

  // Team creation & management
  const createTeam = (teamData: {
    name: string;
    hackathonName: string;
    description: string;
    maxTeamSize: number;
    requiredRoles: string[];
    requiredSkills: string[];
    optionalRequirements?: string;
    minCandidateScore?: number;
  }): Team => {
    if (!user) throw new Error('User must be logged in to build a team');

    const newTeam: Team = {
      id: 'team-' + Date.now(),
      name: teamData.name,
      hackathonName: teamData.hackathonName,
      description: teamData.description,
      ownerId: user.id,
      ownerName: user.fullName,
      ownerEmail: user.email,
      ownerAvatar: user.avatarUrl,
      maxTeamSize: teamData.maxTeamSize || 4,
      currentMemberCount: 1,
      minCandidateScore: teamData.minCandidateScore || 70,
      requiredRoles: teamData.requiredRoles,
      requiredSkills: teamData.requiredSkills,
      optionalRequirements: teamData.optionalRequirements,
      status: 'Recruiting',
      openRoles: [...teamData.requiredRoles],
      createdAt: new Date().toISOString(),
      members: [
        {
          id: 'tm-' + Date.now(),
          userId: user.id,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          assignedRole: 'Team Owner',
          isOwner: true,
          joinedAt: new Date().toISOString(),
          department: user.department,
          year: user.year,
          overallScore: user.overallSkillScore,
        },
      ],
    };

    setTeams((prev) => [newTeam, ...prev]);

    // Add notification
    const notif: Notification = {
      id: 'notif-' + Date.now(),
      userId: user.id,
      title: 'Hackathon Team Created! 🎉',
      message: `Team "${teamData.name}" has been created for ${teamData.hackathonName}. Start finding candidates!`,
      type: 'TEAM_UPDATE',
      link: `/team/${newTeam.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return newTeam;
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, ...updates } : t))
    );
  };

  const getTeamById = (teamId: string) => {
    return teams.find((t) => t.id === teamId);
  };

  const removeTeamMember = (teamId: string, memberUserId: string) => {
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam || !user) return;
    if (targetTeam.ownerId !== user.id) return;

    const memberToRemove = targetTeam.members.find((m) => m.userId === memberUserId);
    if (!memberToRemove || memberToRemove.isOwner) return;

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const updatedMembers = t.members.filter((m) => m.userId !== memberUserId);
          const restoredRole = memberToRemove.assignedRole;
          const openRoles =
            restoredRole && !t.openRoles.includes(restoredRole)
              ? [...t.openRoles, restoredRole]
              : t.openRoles;
          return {
            ...t,
            members: updatedMembers,
            currentMemberCount: updatedMembers.length,
            openRoles,
            status: 'Recruiting',
          };
        }
        return t;
      })
    );

    // Notify removed member
    const notif: Notification = {
      id: 'notif-' + Date.now(),
      userId: memberUserId,
      title: 'Team Membership Update',
      message: `You have been removed from team "${targetTeam.name}".`,
      type: 'TEAM_UPDATE',
      link: '/my-teams',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const leaveTeam = (teamId: string) => {
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam || !user) return;

    const memberRecord = targetTeam.members.find((m) => m.userId === user.id);
    if (!memberRecord || memberRecord.isOwner) return;

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const updatedMembers = t.members.filter((m) => m.userId !== user.id);
          const restoredRole = memberRecord.assignedRole;
          const openRoles =
            restoredRole && !t.openRoles.includes(restoredRole)
              ? [...t.openRoles, restoredRole]
              : t.openRoles;
          return {
            ...t,
            members: updatedMembers,
            currentMemberCount: updatedMembers.length,
            openRoles,
            status: 'Recruiting',
          };
        }
        return t;
      })
    );

    // Notify owner
    const ownerNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: targetTeam.ownerId,
      title: 'Team Member Left',
      message: `${user.fullName} has left team "${targetTeam.name}".`,
      type: 'TEAM_UPDATE',
      link: `/team/${targetTeam.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [ownerNotif, ...prev]);
  };

  // Join Requests
  const createJoinRequest = (
    teamId: string,
    roleName: string,
    message?: string
  ): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'You must be logged in to request to join a team.' };

    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam) return { success: false, message: 'Team not found.' };

    if (targetTeam.members.some((m) => m.userId === user.id)) {
      return { success: false, message: 'You are already a member of this team.' };
    }

    if (targetTeam.members.length >= targetTeam.maxTeamSize) {
      return { success: false, message: 'This team has already reached its maximum member limit.' };
    }

    const existingPending = joinRequests.find(
      (r) => r.teamId === teamId && r.candidateId === user.id && r.status === 'PENDING'
    );
    if (existingPending) {
      return { success: false, message: 'You already have an active pending join request for this team.' };
    }

    const assignedRole = roleName || targetTeam.openRoles[0] || 'Member';

    const newReq: JoinRequest = {
      id: 'req-' + Date.now(),
      teamId: targetTeam.id,
      teamName: targetTeam.name,
      hackathonName: targetTeam.hackathonName,
      ownerId: targetTeam.ownerId,
      candidateId: user.id,
      candidateName: user.fullName,
      candidateEmail: user.email,
      candidateAvatar: user.avatarUrl,
      candidateDepartment: user.department,
      candidateCollege: user.college,
      candidateScore: user.overallSkillScore,
      candidateSkills: user.skills ? user.skills.map((s) => s.name) : [],
      roleName: assignedRole,
      message: message || `Hi! I would love to join ${targetTeam.name} as a ${assignedRole}.`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setJoinRequests((prev) => [newReq, ...prev]);

    // Send notification to team owner
    const ownerNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: targetTeam.ownerId,
      title: 'New Join Request Received! 🙋',
      message: `${user.fullName} requested to join "${targetTeam.name}" as ${assignedRole}.`,
      type: 'JOIN_REQUEST',
      link: `/team/${targetTeam.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [ownerNotif, ...prev]);

    return { success: true, message: `Your join request for ${targetTeam.name} has been sent to the team owner!` };
  };

  const approveJoinRequest = (requestId: string): { success: boolean; message: string } => {
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req || !user) return { success: false, message: 'Request not found.' };

    const targetTeam = teams.find((t) => t.id === req.teamId);
    if (!targetTeam) return { success: false, message: 'Team not found.' };

    if (targetTeam.ownerId !== user.id) {
      return { success: false, message: 'Only the team owner can approve join requests.' };
    }

    if (targetTeam.members.length >= targetTeam.maxTeamSize) {
      return { success: false, message: 'Cannot approve request: Team is already at maximum capacity.' };
    }

    if (targetTeam.members.some((m) => m.userId === req.candidateId)) {
      setJoinRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'APPROVED', respondedAt: new Date().toISOString() } : r))
      );
      return { success: false, message: 'Student is already a member of this team.' };
    }

    // Update request status
    setJoinRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'APPROVED', respondedAt: new Date().toISOString() } : r
      )
    );

    // Add candidate to team members
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === req.teamId) {
          const updatedMembers: TeamMember[] = [
            ...t.members,
            {
              id: 'tm-' + Date.now(),
              userId: req.candidateId,
              fullName: req.candidateName,
              email: req.candidateEmail,
              avatarUrl: req.candidateAvatar,
              assignedRole: req.roleName,
              isOwner: false,
              joinedAt: new Date().toISOString(),
              department: req.candidateDepartment,
              overallScore: req.candidateScore,
            },
          ];

          const remainingOpenRoles = t.openRoles.filter((r) => r !== req.roleName);

          return {
            ...t,
            members: updatedMembers,
            currentMemberCount: updatedMembers.length,
            openRoles: remainingOpenRoles,
            status: updatedMembers.length >= t.maxTeamSize ? 'Full' : 'Recruiting',
          };
        }
        return t;
      })
    );

    // Send notification to candidate
    const candNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: req.candidateId,
      title: 'Join Request Approved! 🎉',
      message: `Your request to join "${req.teamName}" as ${req.roleName} has been approved! You are now an official team member.`,
      type: 'JOIN_APPROVED',
      link: '/my-teams',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [candNotif, ...prev]);

    return { success: true, message: `${req.candidateName} has been added to the team!` };
  };

  const declineJoinRequest = (requestId: string) => {
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req) return;

    setJoinRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'DECLINED', respondedAt: new Date().toISOString() } : r
      )
    );

    // Send notification to candidate
    const candNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: req.candidateId,
      title: 'Join Request Update',
      message: `Your request to join team "${req.teamName}" as ${req.roleName} was declined by the team owner.`,
      type: 'JOIN_DECLINED',
      link: '/find-team',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [candNotif, ...prev]);
  };

  const cancelJoinRequest = (requestId: string) => {
    setJoinRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'CANCELLED' } : r))
    );
  };

  // Invitations
  const sendInvitation = (
    teamId: string,
    candidateId: string,
    roleName: string,
    message: string
  ): boolean => {
    const targetTeam = teams.find((t) => t.id === teamId);
    const candidate = allUsers.find((u) => u.id === candidateId);
    if (!targetTeam || !candidate || !user) return false;

    // Check if already invited
    const existing = invitations.find(
      (inv) =>
        inv.teamId === teamId &&
        inv.candidateId === candidateId &&
        inv.status === 'PENDING'
    );
    if (existing) return false;

    const newInv: Invitation = {
      id: 'inv-' + Date.now(),
      teamId: targetTeam.id,
      teamName: targetTeam.name,
      hackathonName: targetTeam.hackathonName,
      ownerId: user.id,
      ownerName: user.fullName,
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      candidateEmail: candidate.email,
      roleName: roleName || targetTeam.requiredRoles[0] || 'Member',
      message: message || `We would love to have you on team ${targetTeam.name}!`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setInvitations((prev) => [newInv, ...prev]);

    // Send notification to candidate
    const candNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: candidate.id,
      title: 'New Team Invitation Received! 📩',
      message: `${user.fullName} invited you to join team "${targetTeam.name}" for ${targetTeam.hackathonName} as ${newInv.roleName}.`,
      type: 'INVITATION',
      link: '/invitations',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [candNotif, ...prev]);

    return true;
  };

  const acceptInvitation = (invitationId: string): { success: boolean; message: string } => {
    const inv = invitations.find((i) => i.id === invitationId);
    if (!inv || !user) return { success: false, message: 'Invitation not found' };

    const targetTeam = teams.find((t) => t.id === inv.teamId);
    if (!targetTeam) return { success: false, message: 'Team no longer exists' };

    if (targetTeam.members.length >= targetTeam.maxTeamSize) {
      return { success: false, message: 'Cannot accept invitation: Team has already reached maximum capacity.' };
    }

    if (targetTeam.members.some((m) => m.userId === user.id)) {
      setInvitations((prev) =>
        prev.map((i) =>
          i.id === invitationId
            ? { ...i, status: 'ACCEPTED', respondedAt: new Date().toISOString() }
            : i
        )
      );
      return { success: true, message: 'You are already an official member of this team.' };
    }

    // Update invitation status
    setInvitations((prev) =>
      prev.map((i) =>
        i.id === invitationId
          ? { ...i, status: 'ACCEPTED', respondedAt: new Date().toISOString() }
          : i
      )
    );

    // Add candidate to team members
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === inv.teamId) {
          const updatedMembers = [
            ...t.members,
            {
              id: 'tm-' + Date.now(),
              userId: user.id,
              fullName: user.fullName,
              email: user.email,
              avatarUrl: user.avatarUrl,
              assignedRole: inv.roleName,
              isOwner: false,
              joinedAt: new Date().toISOString(),
              department: user.department,
              year: user.year,
              overallScore: user.overallSkillScore,
            },
          ];

          const remainingOpenRoles = t.openRoles.filter((r) => r !== inv.roleName);

          return {
            ...t,
            members: updatedMembers,
            currentMemberCount: updatedMembers.length,
            openRoles: remainingOpenRoles,
            status: updatedMembers.length >= t.maxTeamSize ? 'Full' : 'Recruiting',
          };
        }
        return t;
      })
    );

    // Notify team owner
    const ownerNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: inv.ownerId,
      title: 'Invitation Accepted! 🎉',
      message: `${user.fullName} accepted your invitation to join ${inv.teamName} as ${inv.roleName}!`,
      type: 'INVITATION_ACCEPTED',
      link: `/team/${inv.teamId}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [ownerNotif, ...prev]);

    return { success: true, message: `You have successfully joined ${inv.teamName}!` };
  };

  const declineInvitation = (invitationId: string) => {
    const inv = invitations.find((i) => i.id === invitationId);
    if (!inv) return;

    setInvitations((prev) =>
      prev.map((i) =>
        i.id === invitationId
          ? { ...i, status: 'DECLINED', respondedAt: new Date().toISOString() }
          : i
      )
    );

    // Notify team owner
    const ownerNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: inv.ownerId,
      title: 'Invitation Declined',
      message: `${user?.fullName || 'Candidate'} declined the invitation to join ${inv.teamName} as ${inv.roleName}.`,
      type: 'INVITATION_DECLINED',
      link: `/team/${inv.teamId}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [ownerNotif, ...prev]);
  };

  const cancelInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((i) => (i.id === invitationId ? { ...i, status: 'CANCELLED' } : i))
    );
  };

  // GitHub Analysis Simulation
  const runGitHubAnalysis = async (username: string): Promise<GitHubAnalysis> => {
    const analysis: GitHubAnalysis = {
      username,
      avatarUrl: user?.avatarUrl,
      bio: `Active GitHub developer | ${username}`,
      publicRepos: 24,
      totalStars: 88,
      recentActivityLevel: 'High',
      readmeCoverage: 'Strong',
      topLanguages: [
        { name: 'TypeScript', percentage: 46, count: 11 },
        { name: 'Python', percentage: 34, count: 8 },
        { name: 'JavaScript', percentage: 20, count: 5 },
      ],
      technicalStrengths: [
        'Component Modularization',
        'State Architecture',
        'Automated CI/CD',
        'Documentation Standards',
      ],
      projectExperience: ['Full Stack Web Applications', 'API Integrations'],
      score: 85,
      breakdown: {
        repoBreadthScore: 21,
        languageMasteryScore: 22,
        activityScore: 21,
        documentationScore: 21,
      },
    };

    if (user) {
      updateProfile({
        githubUsername: username,
        githubAnalysis: analysis,
        githubScore: 85,
        verificationSteps: {
          ...user.verificationSteps,
          github: true,
          githubAnalysis: true,
        },
      });
    }

    return analysis;
  };

  // Quiz submission
  const submitQuiz = (
    roleName: string,
    answers: Record<string, string>,
    scoreOverride?: number
  ): QuizResult => {
    const score = scoreOverride !== undefined ? scoreOverride : 90;
    const result: QuizResult = {
      score,
      roleName: roleName || user?.preferredRoles[0]?.name || 'Full Stack Developer',
      completedAt: new Date().toISOString(),
      totalQuestions: Object.keys(answers).length || 10,
      correctQuestions: Math.round(((score / 100) * (Object.keys(answers).length || 10))),
      answers,
      topicBreakdown: [
        { topic: 'Core Architecture', score: Math.min(100, score + 4) },
        { topic: 'Problem Solving & Algorithms', score: Math.min(100, score - 2) },
        { topic: 'Framework Capabilities', score: Math.min(100, score + 2) },
      ],
    };

    if (user) {
      const overall = Math.round((score + (user.githubScore || 80) + 85) / 3);
      updateProfile({
        quizResults: result,
        quizScore: score,
        overallSkillScore: overall,
        isActivated: true,
        verificationSteps: {
          ...user.verificationSteps,
          quiz: true,
          quizResult: true,
        },
      });
    }

    return result;
  };

  // Notifications helpers
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    if (!user) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === user.id ? { ...n, isRead: true } : n))
    );
  };

  // Computed Team Memberships
  const myOwnedTeams = user ? teams.filter((t) => t.ownerId === user.id) : [];
  const myMemberTeams = user
    ? teams.filter((t) => t.members.some((m) => m.userId === user.id && !m.isOwner))
    : [];
  const myAllTeams = user
    ? teams.filter((t) => t.members.some((m) => m.userId === user.id))
    : [];
  const isTeamOwner = myOwnedTeams.length > 0;

  // Computed Invitations
  const myReceivedInvitations = user
    ? invitations.filter((i) => i.candidateId === user.id)
    : [];
  const mySentInvitations = (teamId?: string) => {
    if (!user) return [];
    if (teamId) return invitations.filter((i) => i.teamId === teamId);
    return invitations.filter((i) => i.ownerId === user.id);
  };

  // Computed Join Requests
  const mySentJoinRequests = user
    ? joinRequests.filter((r) => r.candidateId === user.id)
    : [];
  const getJoinRequestsForTeam = (teamId: string) => {
    return joinRequests.filter((r) => r.teamId === teamId);
  };
  const allMyReceivedJoinRequests = user
    ? joinRequests.filter((r) => r.ownerId === user.id)
    : [];

  // Computed Notifications
  const userNotifications = user
    ? notifications.filter((n) => n.userId === user.id)
    : [];
  const unreadNotificationsCount = userNotifications.filter((n) => !n.isRead).length;

  // Candidate Discovery formatted list
  const allCandidates: EnrichedCandidate[] = allUsers.map((u) => {
    const matchAnalysis: MatchAnalysis = {
      matchScore: u.overallSkillScore,
      breakdown: {
        roleMatch: 88,
        skillMatch: u.skillMatchScore || 85,
        quizScore: u.quizScore || 85,
        githubScore: u.githubScore || 80,
        experienceScore: u.experienceScore || 80,
        availabilityScore: u.availability === 'Available' ? 100 : 50,
      },
      reasons: [
        'Strong matching skill profile and project work',
        'Verified skills via GitHub & Skill Assessment',
        'Demonstrated hackathon track record',
      ],
      gaps: [],
      tier: u.overallSkillScore >= 85 ? 'Excellent' : 'Strong',
      isEligible: true,
    };

    return {
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      avatarUrl: u.avatarUrl,
      college: u.college,
      department: u.department,
      year: u.year,
      gender: u.gender,
      bio: u.bio,
      availability: u.availability,
      hackathonsCount: u.hackathonsCount,
      overallScore: u.overallSkillScore,
      quizScore: u.quizScore,
      githubScore: u.githubScore,
      experienceScore: u.experienceScore,
      skillMatchScore: u.skillMatchScore,
      skills: u.skills,
      preferredRoles: u.preferredRoles,
      projects: u.projects,
      githubAnalysis: u.githubAnalysis,
      matchAnalysis,
      isActivated: u.isActivated,
      completionPercentage: u.completionPercentage,
    };
  });

  const getCandidateById = (candidateId: string) => {
    return allCandidates.find((c) => c.id === candidateId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        teams,
        myOwnedTeams,
        myMemberTeams,
        myAllTeams,
        isTeamOwner,
        createTeam,
        updateTeam,
        getTeamById,
        removeTeamMember,
        leaveTeam,
        joinRequests,
        mySentJoinRequests,
        getJoinRequestsForTeam,
        allMyReceivedJoinRequests,
        createJoinRequest,
        approveJoinRequest,
        declineJoinRequest,
        cancelJoinRequest,
        invitations,
        myReceivedInvitations,
        mySentInvitations,
        sendInvitation,
        acceptInvitation,
        declineInvitation,
        cancelInvitation,
        allCandidates,
        getCandidateById,
        runGitHubAnalysis,
        submitQuiz,
        notifications: userNotifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        switchDemoUser,
        isCandidate: true, // both capabilities available to all students
        isLeader: isTeamOwner,
        isAdmin: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
