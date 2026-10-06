import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Navbar } from './components/common/Navbar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CandidateLogin } from './pages/auth/CandidateLogin';
import { CandidateRegister } from './pages/auth/CandidateRegister';
import { LeaderLogin } from './pages/auth/LeaderLogin';
import { LeaderRegister } from './pages/auth/LeaderRegister';
import { AdminLogin } from './pages/auth/AdminLogin';

import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { CandidateOnboarding } from './pages/candidate/CandidateOnboarding';
import { CandidateQuiz } from './pages/candidate/CandidateQuiz';
import { CandidateQuizResult } from './pages/candidate/CandidateQuizResult';
import { CandidateBrowseTeams } from './pages/candidate/CandidateBrowseTeams';
import { CandidateMyTeam } from './pages/candidate/CandidateMyTeam';
import { CandidateInvitations } from './pages/candidate/CandidateInvitations';

import { LeaderDashboard } from './pages/leader/LeaderDashboard';
import { LeaderCreateTeam } from './pages/leader/LeaderCreateTeam';
import { LeaderDiscovery } from './pages/leader/LeaderDiscovery';
import { LeaderTeamBuilder } from './pages/leader/LeaderTeamBuilder';
import { LeaderInvitations } from './pages/leader/LeaderInvitations';

import { AdminDashboard } from './pages/admin/AdminDashboard';

// Route Guards
const ProtectedCandidateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isCandidate, loading } = useAuth();
  if (loading) return null;
  if (!user || !isCandidate) return <Navigate to="/candidate/login" replace />;
  return <>{children}</>;
};

const ProtectedLeaderRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLeader, loading } = useAuth();
  if (loading) return null;
  if (!user || !isLeader) return <Navigate to="/leader/login" replace />;
  return <>{children}</>;
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
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
                {/* Public Landing & Auth Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/candidate/login" element={<CandidateLogin />} />
                <Route path="/candidate/register" element={<CandidateRegister />} />
                <Route path="/leader/login" element={<LeaderLogin />} />
                <Route path="/leader/register" element={<LeaderRegister />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Candidate Portal Routes */}
                <Route
                  path="/candidate/dashboard"
                  element={
                    <ProtectedCandidateRoute>
                      <CandidateDashboard />
                    </ProtectedCandidateRoute>
                  }
                />
                <Route
                  path="/candidate/onboarding"
                  element={
                    <ProtectedCandidateRoute>
                      <CandidateOnboarding />
                    </ProtectedCandidateRoute>
                  }
                />
                <Route
                  path="/candidate/quiz"
                  element={
                    <ProtectedCandidateRoute>
                      <CandidateQuiz />
                    </ProtectedCandidateRoute>
                  }
                />
                <Route
                  path="/candidate/quiz-result"
                  element={
                    <ProtectedCandidateRoute>
                      <CandidateQuizResult />
                    </ProtectedCandidateRoute>
                  }
                />
                <Route
                  path="/candidate/teams"
                  element={
                    <ProtectedCandidateRoute>
                      <CandidateBrowseTeams />
                    </ProtectedCandidateRoute>
                  }
                />
                <Route
                  path="/candidate/my-team"
                  element={
                    <ProtectedCandidateRoute>
                      <CandidateMyTeam />
                    </ProtectedCandidateRoute>
                  }
                />
                <Route
                  path="/candidate/invitations"
                  element={
                    <ProtectedCandidateRoute>
                      <CandidateInvitations />
                    </ProtectedCandidateRoute>
                  }
                />

                {/* Team Leader Portal Routes */}
                <Route
                  path="/leader/dashboard"
                  element={
                    <ProtectedLeaderRoute>
                      <LeaderDashboard />
                    </ProtectedLeaderRoute>
                  }
                />
                <Route
                  path="/leader/create-team"
                  element={
                    <ProtectedLeaderRoute>
                      <LeaderCreateTeam />
                    </ProtectedLeaderRoute>
                  }
                />
                <Route
                  path="/leader/discover"
                  element={
                    <ProtectedLeaderRoute>
                      <LeaderDiscovery />
                    </ProtectedLeaderRoute>
                  }
                />
                <Route
                  path="/leader/team"
                  element={
                    <ProtectedLeaderRoute>
                      <LeaderTeamBuilder />
                    </ProtectedLeaderRoute>
                  }
                />
                <Route
                  path="/leader/invitations"
                  element={
                    <ProtectedLeaderRoute>
                      <LeaderInvitations />
                    </ProtectedLeaderRoute>
                  }
                />

                {/* Admin Portal Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />

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
