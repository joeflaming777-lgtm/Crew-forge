import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { CandidateController } from '../controllers/candidateController';
import { GitHubController } from '../controllers/githubController';
import { QuizController } from '../controllers/quizController';
import { TeamController } from '../controllers/teamController';
import { DiscoveryController } from '../controllers/discoveryController';
import { InvitationController } from '../controllers/invitationController';
import { NotificationController } from '../controllers/notificationController';
import { HackathonController } from '../controllers/hackathonController';
import { AdminController } from '../controllers/adminController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

// ==================== AUTH ROUTES ====================
// Unified single user login & registration for all users
router.post('/auth/login', AuthController.userLogin);
router.post('/auth/register', AuthController.userRegister);

// Backward compatibility endpoints (all route to unified user auth)
router.post('/auth/candidate/register', AuthController.userRegister);
router.post('/auth/candidate/login', AuthController.userLogin);
router.post('/auth/leader/register', AuthController.userRegister);
router.post('/auth/leader/login', AuthController.userLogin);
router.post('/auth/admin/login', AuthController.adminLogin);
router.get('/auth/me', authenticate, AuthController.getMe);

// ==================== CANDIDATE ROUTES ====================
router.get('/candidate/profile', authenticate, authorizeRoles('candidate'), CandidateController.getProfile);
router.put('/candidate/profile', authenticate, authorizeRoles('candidate'), CandidateController.updateProfile);
router.put('/candidate/skills', authenticate, authorizeRoles('candidate'), CandidateController.updateSkills);
router.put('/candidate/roles', authenticate, authorizeRoles('candidate'), CandidateController.updateRoles);
router.post('/candidate/complete-onboarding', authenticate, authorizeRoles('candidate'), CandidateController.completeOnboarding);
router.get('/candidate/score', authenticate, authorizeRoles('candidate'), CandidateController.getScore);
router.put('/candidate/availability', authenticate, authorizeRoles('candidate'), CandidateController.toggleAvailability);

// ==================== GITHUB ANALYSIS ====================
router.post('/github/analyze', authenticate, authorizeRoles('candidate'), GitHubController.analyzeGitHub);
router.get('/github/analysis', authenticate, authorizeRoles('candidate'), GitHubController.getAnalysis);

// ==================== QUIZ ROUTES ====================
router.get('/quiz/start', authenticate, authorizeRoles('candidate'), QuizController.startQuiz);
router.post('/quiz/submit', authenticate, authorizeRoles('candidate'), QuizController.submitQuiz);
router.get('/quiz/result', authenticate, authorizeRoles('candidate'), QuizController.getLatestResult);

// ==================== TEAMS ROUTES ====================
router.post('/teams', authenticate, authorizeRoles('team_leader'), TeamController.createTeam);
router.get('/teams', TeamController.getAllTeams);
router.get('/teams/my-team', authenticate, authorizeRoles('team_leader'), TeamController.getMyTeam);
router.get('/teams/:id', TeamController.getTeamById);

// ==================== CANDIDATE DISCOVERY (LEADER) ====================
router.get('/candidates', authenticate, DiscoveryController.discoverCandidates);
router.get('/candidates/:id', authenticate, DiscoveryController.getCandidateProfile);
router.post('/candidates/compare', authenticate, authorizeRoles('team_leader'), DiscoveryController.compareCandidates);

// ==================== INVITATIONS ====================
router.post('/invitations', authenticate, authorizeRoles('team_leader'), InvitationController.sendInvitation);
router.get('/invitations', authenticate, InvitationController.getInvitations);
router.post('/invitations/:id/accept', authenticate, authorizeRoles('candidate'), InvitationController.acceptInvitation);
router.post('/invitations/:id/decline', authenticate, authorizeRoles('candidate'), InvitationController.declineInvitation);
router.post('/invitations/:id/cancel', authenticate, authorizeRoles('team_leader'), InvitationController.cancelInvitation);

// ==================== NOTIFICATIONS ====================
router.get('/notifications', authenticate, NotificationController.getNotifications);
router.put('/notifications/:id/read', authenticate, NotificationController.markRead);
router.put('/notifications/mark-all-read', authenticate, NotificationController.markAllRead);

// ==================== HACKATHONS ====================
router.get('/hackathons', HackathonController.getAllHackathons);
router.get('/hackathons/:id', HackathonController.getHackathonById);

// ==================== ADMIN ROUTES ====================
router.get('/admin/analytics', authenticate, authorizeRoles('admin'), AdminController.getAnalytics);
router.get('/admin/users', authenticate, authorizeRoles('admin'), AdminController.getUsers);
router.get('/admin/scoring-config', authenticate, AdminController.getScoringConfig);
router.put('/admin/scoring-config', authenticate, authorizeRoles('admin'), AdminController.updateScoringConfig);
router.get('/admin/skills', AdminController.getSkills);
router.post('/admin/skills', authenticate, authorizeRoles('admin'), AdminController.createSkill);
router.delete('/admin/skills/:id', authenticate, authorizeRoles('admin'), AdminController.deleteSkill);
router.get('/admin/roles', AdminController.getRoles);
router.post('/admin/roles', authenticate, authorizeRoles('admin'), AdminController.createRole);
router.delete('/admin/roles/:id', authenticate, authorizeRoles('admin'), AdminController.deleteRole);
router.post('/admin/hackathons', authenticate, authorizeRoles('admin'), AdminController.createHackathon);
router.get('/admin/questions', authenticate, authorizeRoles('admin'), AdminController.getQuestions);
router.post('/admin/questions', authenticate, authorizeRoles('admin'), AdminController.createQuestion);
router.delete('/admin/questions/:id', authenticate, authorizeRoles('admin'), AdminController.deleteQuestion);

export default router;
