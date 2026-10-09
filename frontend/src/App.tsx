import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Navbar } from './components/common/Navbar';

// Landing & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// User / Student Pages
import { UserDashboard } from './pages/dashboard/UserDashboard';
import { UserProfileView } from './pages/profile/UserProfileView';
import { UserProfileEdit } from './pages/profile/UserProfileEdit';
import { GitHubVerificationPage } from './pages/verification/GitHubVerificationPage';

import { FindTeamPage } from './pages/teams/FindTeamPage';
import { TeamDetailPage } from './pages/teams/TeamDetailPage';
import { InvitationsPage } from './pages/invitations/InvitationsPage';
import { MyTeamsPage } from './pages/teams/MyTeamsPage';

// Team Owner Pages
import { BuildTeamPage } from './pages/teams/BuildTeamPage';
import { TeamOwnerDashboard } from './pages/team-owner/TeamOwnerDashboard';
import { TeamCandidatesDiscovery } from './pages/team-owner/TeamCandidatesDiscovery';
import { TeamOwnerInvitations } from './pages/team-owner/TeamOwnerInvitations';
import { TeamOwnerSettings } from './pages/team-owner/TeamOwnerSettings';

// Unified Student Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="app-layout">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<LandingPage />} />
                <Route path="/portal" element={<Navigate to="/dashboard" replace />} />

                {/* SINGLE AUTHENTICATION ROUTES */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* USER / STUDENT ROUTES */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfileView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute>
                      <UserProfileEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/github"
                  element={
                    <ProtectedRoute>
                      <GitHubVerificationPage />
                    </ProtectedRoute>
                  }
                />
                {/* QUIZ REDIRECTS */}
                <Route path="/quiz" element={<Navigate to="/dashboard" replace />} />
                <Route path="/quiz/result" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/find-team"
                  element={
                    <ProtectedRoute>
                      <FindTeamPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/find-team/:id"
                  element={
                    <ProtectedRoute>
                      <TeamDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invitations"
                  element={
                    <ProtectedRoute>
                      <InvitationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-teams"
                  element={
                    <ProtectedRoute>
                      <MyTeamsPage />
                    </ProtectedRoute>
                  }
                />

                {/* TEAM OWNER ROUTES */}
                <Route
                  path="/build-team"
                  element={
                    <ProtectedRoute>
                      <BuildTeamPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team/:id"
                  element={
                    <ProtectedRoute>
                      <TeamOwnerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team/:id/candidates"
                  element={
                    <ProtectedRoute>
                      <TeamCandidatesDiscovery />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team/:id/candidates/:candidateId"
                  element={
                    <ProtectedRoute>
                      <TeamCandidatesDiscovery />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team/:id/invitations"
                  element={
                    <ProtectedRoute>
                      <TeamOwnerInvitations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team/:id/settings"
                  element={
                    <ProtectedRoute>
                      <TeamOwnerSettings />
                    </ProtectedRoute>
                  }
                />

                {/* LEGACY REDIRECTS: Forward any old paths directly to the single User Login & Registration */}
                <Route path="/candidate/login" element={<Navigate to="/login" replace />} />
                <Route path="/candidate/register" element={<Navigate to="/register" replace />} />
                <Route path="/leader/login" element={<Navigate to="/login" replace />} />
                <Route path="/leader/register" element={<Navigate to="/register" replace />} />
                <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                <Route path="/candidate/dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/leader/dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/candidate/teams" element={<Navigate to="/find-team" replace />} />
                <Route path="/candidate/my-team" element={<Navigate to="/my-teams" replace />} />
                <Route path="/candidate/invitations" element={<Navigate to="/invitations" replace />} />
                <Route path="/candidate/onboarding" element={<Navigate to="/profile/edit" replace />} />
                <Route path="/candidate/quiz" element={<Navigate to="/dashboard" replace />} />
                <Route path="/candidate/quiz-result" element={<Navigate to="/dashboard" replace />} />
                <Route path="/leader/create-team" element={<Navigate to="/build-team" replace />} />
                <Route path="/leader/discover" element={<Navigate to="/find-team" replace />} />
                <Route path="/leader/team" element={<Navigate to="/my-teams" replace />} />
                <Route path="/leader/invitations" element={<Navigate to="/invitations" replace />} />

                {/* Catch all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
