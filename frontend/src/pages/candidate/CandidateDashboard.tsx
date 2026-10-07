import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  Github,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  Info,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
  Star,
  Globe,
  RefreshCw,
  X,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ScoreRing } from '../../components/common/ScoreRing';
import confetti from 'canvas-confetti';

export const CandidateDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<any>(null);
  const [recommendedTeams, setRecommendedTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showScoreFormula, setShowScoreFormula] = useState<boolean>(false);
  const [updatingAvailability, setUpdatingAvailability] = useState<boolean>(false);
  const [showGithubModal, setShowGithubModal] = useState<boolean>(false);
  const [resyncingGithub, setResyncingGithub] = useState<boolean>(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, teamsRes] = await Promise.all([
        apiClient.get('/candidate/profile'),
        apiClient.get('/teams'),
      ]);

      if (profileRes.data.success) {
        setProfileData(profileRes.data.profile);
      }

      if (teamsRes.data.success) {
        setRecommendedTeams(teamsRes.data.teams.slice(0, 3));
      }
    } catch (err: any) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!profileData) return;
    const newStatus = profileData.availability === 'Available' ? 'Busy' : 'Available';

    try {
      setUpdatingAvailability(true);
      const res = await apiClient.put('/candidate/availability', { availability: newStatus });
      if (res.data.success) {
        setProfileData({ ...profileData, availability: newStatus });
        toast.success(`Availability updated to: ${newStatus}`);
      }
    } catch {
      toast.error('Could not update availability.');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleAcceptInvite = async (invitationId: string, teamName: string) => {
    try {
      const res = await apiClient.post(`/invitations/${invitationId}/accept`);
      if (res.data.success) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        toast.success(res.data.message);
        await loadDashboardData();
        await refreshUser();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not accept invitation.');
    }
  };

  const handleDeclineInvite = async (invitationId: string) => {
    try {
      const res = await apiClient.post(`/invitations/${invitationId}/decline`);
      if (res.data.success) {
        toast.info('Invitation declined.');
        await loadDashboardData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not decline invitation.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Loading Candidate Portal...</h3>
      </div>
    );
  }

  const profile = profileData || user?.candidateProfile;
  const fullName = profile?.fullName || 'Hacker';
  const joinedTeam = profile?.teamMemberships && profile?.teamMemberships[0]?.team;
  const pendingInvitations = profile?.invitations || [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      {/* Top Welcome Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Welcome back, {fullName} 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginTop: '4px' }}>
            {profile?.department} • {profile?.college}
          </p>
        </div>

        {/* Availability Status Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Status:</span>
          <button
            onClick={handleToggleAvailability}
            disabled={updatingAvailability}
            className={`badge ${profile?.availability === 'Available' ? 'badge-success' : 'badge-warning'}`}
            style={{ padding: '6px 14px', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: profile?.availability === 'Available' ? '#10b981' : '#f59e0b',
                display: 'inline-block',
                marginRight: '6px',
              }}
            />
            {profile?.availability || 'Available'} (Click to toggle)
          </button>
        </div>
      </div>

      {/* 4 Score Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Profile Completion */}
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px', textAlign: 'center' }}>
          <ScoreRing score={profile?.profileCompleted ? 95 : 60} size={76} label="Profile Complete" />
        </div>

        {/* Assessment Score */}
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px', textAlign: 'center' }}>
          <ScoreRing score={profile?.quizScore || 0} size={76} label="Assessment Score" />
        </div>

        {/* GitHub Score */}
        <div
          className="glass-card"
          onClick={() => setShowGithubModal(true)}
          style={{
            padding: '1.5rem',
            borderRadius: '18px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            border: '1px solid rgba(99, 102, 241, 0.25)',
          }}
          title="Click to view full GitHub technical audit & re-sync score"
        >
          <ScoreRing score={profile?.githubScore || 0} size={76} label="GitHub Score" />
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: 600 }}>
            <Github size={12} /> View Audit & Re-sync →
          </div>
        </div>

        {/* Overall Score with Explainable Button */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: '18px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <ScoreRing score={profile?.overallScore || 0} size={76} label="Overall Score" />
          <button
            onClick={() => setShowScoreFormula(!showScoreFormula)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: '#818cf8',
              display: 'flex',
            }}
            title="Explain Score Formula"
          >
            <Info size={16} />
          </button>
        </div>
      </div>

      {/* Expandable Overall Score Formula Breakdown */}
      <AnimatePresence>
        {showScoreFormula && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card"
            style={{
              padding: '1.5rem 2rem',
              borderRadius: '18px',
              marginBottom: '2.5rem',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              background: 'rgba(99, 102, 241, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#818cf8" />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                Explainable Candidate Score Formula
              </h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Overall Score = (<strong>Quiz Performance × 50%</strong>) + (<strong>GitHub Analysis × 25%</strong>) + (<strong>Skill Match × 15%</strong>) + (<strong>Experience × 10%</strong>).
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <span style={{ color: '#cbd5e1' }}>Quiz: <strong>{profile?.quizScore || 0}%</strong></span>
              <span style={{ color: '#cbd5e1' }}>GitHub: <strong>{profile?.githubScore || 0}%</strong></span>
              <span style={{ color: '#cbd5e1' }}>Skills Baseline: <strong>{profile?.skillMatchScore || 0}%</strong></span>
              <span style={{ color: '#cbd5e1' }}>Experience: <strong>{profile?.experienceScore || 0}%</strong></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVE INVITATIONS SECTION */}
      {pendingInvitations.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Sparkles size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              Active Team Invitations ({pendingInvitations.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingInvitations.map((inv: any) => (
              <div
                key={inv.id}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(16, 23, 38, 0.9))',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                      {inv.team.name}
                    </span>
                    <span className="badge badge-primary">{inv.team.hackathon.name}</span>
                    <span className="badge badge-warning">Invited as: {inv.roleName}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', fontStyle: 'italic', margin: '6px 0' }}>
                    "{inv.message}"
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Leader: {inv.team.leader.fullName} ({inv.team.leader.college})
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleAcceptInvite(inv.id, inv.team.name)}
                    className="btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    Accept Invitation
                  </button>
                  <button
                    onClick={() => handleDeclineInvite(inv.id)}
                    className="btn-secondary"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MY TEAM SECTION */}
      {joinedTeam ? (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
            My Hackathon Team 🎉
          </h3>
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 23, 38, 0.95))',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-success" style={{ marginBottom: '8px' }}>
                  Official Member
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
                  {joinedTeam.name}
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '4px 0 1rem' }}>
                  {joinedTeam.description}
                </p>
                <div style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
                  Hackathon: <strong>{joinedTeam.hackathon?.name}</strong> • Leader: <strong>{joinedTeam.leader?.fullName}</strong>
                </div>
              </div>

              <button
                onClick={() => navigate('/candidate/my-team')}
                className="btn-secondary"
              >
                View Full Team Canvas <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '3rem' }}>
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
            }}
          >
            <Users size={36} color="#6366f1" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              You haven't joined a team yet
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '480px', margin: '6px auto 1.5rem' }}>
              Browse available hackathon teams and express interest, or wait for Team Leaders to review your profile and send invitations.
            </p>
            <button onClick={() => navigate('/candidate/teams')} className="btn-primary">
              <Compass size={16} /> Browse Hackathon Teams
            </button>
          </div>
        </div>
      )}

      {/* RECOMMENDED TEAMS SECTION */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
            Recommended Teams Matching Your Profile
          </h3>
          <button
            onClick={() => navigate('/candidate/teams')}
            style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View all <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid-cols-auto">
          {recommendedTeams.map((team) => (
            <div
              key={team.id}
              className="glass-card glass-card-interactive"
              style={{
                padding: '1.75rem',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge badge-primary">{team.hackathon?.name || 'Hackathon'}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {team.currentMemberCount} / {team.maxTeamSize} Members
                  </span>
                </div>

                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
                  {team.name}
                </h4>

                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {team.description}
                </p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Open Roles:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {(team.openRoles || ['Developer', 'Designer']).map((r: string) => (
                      <span key={r} className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/candidate/teams')}
                className="btn-secondary"
                style={{ width: '100%', fontSize: '0.875rem' }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* GITHUB TECHNICAL AUDIT MODAL */}
      <AnimatePresence>
        {showGithubModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.82)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              overflowY: 'auto',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '780px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                borderRadius: '24px',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                background: 'linear-gradient(145deg, rgba(24, 32, 47, 0.95), rgba(15, 23, 42, 0.98))',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    <Github size={24} color="#818cf8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      GitHub Technical Evidence Audit
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        @{profile?.githubAnalysis?.username || 'candidate'}
                      </span>
                      {profile?.githubAnalysis?.archetype && (
                        <span
                          className="badge"
                          style={{
                            background: 'rgba(99, 102, 241, 0.25)',
                            color: '#a5b4fc',
                            border: '1px solid rgba(99, 102, 241, 0.4)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          {profile?.githubAnalysis?.archetype}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={async () => {
                      const username = profile?.githubAnalysis?.username;
                      if (!username) {
                        toast.error('No GitHub username found on profile.');
                        return;
                      }
                      try {
                        setResyncingGithub(true);
                        const res = await apiClient.post('/github/analyze', { username });
                        if (res.data.success) {
                          toast.success(`GitHub re-synced! Score: ${res.data.analysis.score}/100`);
                          await loadDashboardData();
                        }
                      } catch (err: any) {
                        toast.error(err.response?.data?.message || 'Could not re-sync GitHub.');
                      } finally {
                        setResyncingGithub(false);
                      }
                    }}
                    disabled={resyncingGithub}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    title="Fetch latest commits & repos from GitHub"
                  >
                    <RefreshCw size={14} className={resyncingGithub ? 'spin' : ''} />
                    {resyncingGithub ? 'Re-syncing...' : 'Re-sync'}
                  </button>
                  <button
                    onClick={() => setShowGithubModal(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#94a3b8',
                      padding: '6px',
                      display: 'flex',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Main Score & Summary Callout */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  margin: '1.5rem 0',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Executive Technical Evaluation
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    {profile?.githubAnalysis?.summary ||
                      `GitHub profile @${profile?.githubAnalysis?.username || ''} with ${profile?.githubAnalysis?.publicRepos || 0} public repositories.`}
                  </p>
                </div>
                <ScoreRing score={profile?.githubAnalysis?.score || profile?.githubScore || 0} size={84} label="GitHub Score" />
              </div>

              {/* 4-Pillar Score Breakdown */}
              {profile?.githubAnalysis?.breakdown && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '10px' }}>
                    4-Pillar Scoring Weights
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                        <span style={{ color: '#cbd5e1' }}>Repo Substance</span>
                        <strong style={{ color: '#818cf8' }}>{profile.githubAnalysis.breakdown.repoBreadthScore}/25</strong>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                        <div style={{ width: `${(profile.githubAnalysis.breakdown.repoBreadthScore / 25) * 100}%`, height: '100%', background: '#818cf8', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                        <span style={{ color: '#cbd5e1' }}>Stack & Languages</span>
                        <strong style={{ color: '#38bdf8' }}>{profile.githubAnalysis.breakdown.languageMasteryScore}/25</strong>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                        <div style={{ width: `${(profile.githubAnalysis.breakdown.languageMasteryScore / 25) * 100}%`, height: '100%', background: '#38bdf8', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                        <span style={{ color: '#cbd5e1' }}>Commit Velocity</span>
                        <strong style={{ color: '#10b981' }}>{profile.githubAnalysis.breakdown.activityScore}/25</strong>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                        <div style={{ width: `${(profile.githubAnalysis.breakdown.activityScore / 25) * 100}%`, height: '100%', background: '#10b981', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                        <span style={{ color: '#cbd5e1' }}>Rigor & Live Demos</span>
                        <strong style={{ color: '#f59e0b' }}>{profile.githubAnalysis.breakdown.documentationScore}/25</strong>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                        <div style={{ width: `${(profile.githubAnalysis.breakdown.documentationScore / 25) * 100}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Core Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                    {profile?.githubAnalysis?.metrics?.originalRepos ?? profile?.githubAnalysis?.publicRepos ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Original Repos</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                    {profile?.githubAnalysis?.metrics?.recentPushes90d ?? (profile?.githubAnalysis?.recentActivityLevel === 'High' ? '10+' : 'Active')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recent Pushes (90d)</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>
                    {profile?.githubAnalysis?.metrics?.deployedProjectsCount ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Live Deployed Apps</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>
                    {profile?.githubAnalysis?.metrics?.originalStars ?? profile?.githubAnalysis?.totalStars ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Original Stars</div>
                </div>
              </div>

              {/* Showcase Repositories */}
              {profile?.githubAnalysis?.showcaseRepos && profile?.githubAnalysis?.showcaseRepos.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '10px' }}>
                    Top Showcase Repositories
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                    {profile.githubAnalysis.showcaseRepos.map((repo: any) => (
                      <div
                        key={repo.name}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.07)',
                          borderRadius: '12px',
                          padding: '12px 14px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <a
                            href={repo.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem', textDecoration: 'none' }}
                          >
                            {repo.name}
                          </a>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                            {repo.stars > 0 && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#fbbf24' }}>
                                <Star size={12} fill="#fbbf24" /> {repo.stars}
                              </span>
                            )}
                            {repo.language && (
                              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                                {repo.language}
                              </span>
                            )}
                          </div>
                        </div>
                        {repo.description && (
                          <p style={{ margin: '4px 0 8px', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                            {repo.description.length > 80 ? repo.description.slice(0, 80) + '...' : repo.description}
                          </p>
                        )}
                        {repo.liveUrl && (
                          <a
                            href={repo.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                              color: '#38bdf8',
                              textDecoration: 'none',
                            }}
                          >
                            <Globe size={12} /> Live Demonstration →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights & Growth Areas */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '12px',
                  marginBottom: '1.25rem',
                }}
              >
                {profile?.githubAnalysis?.highlights && profile?.githubAnalysis?.highlights.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.05)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
                      <CheckCircle2 size={15} /> Verified Strengths
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                      {profile.githubAnalysis.highlights.map((h: string, i: number) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {profile?.githubAnalysis?.growthAreas && profile?.githubAnalysis?.growthAreas.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>
                      <AlertCircle size={15} /> Growth Opportunities
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                      {profile.githubAnalysis.growthAreas.map((g: string, i: number) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>Languages & Detected Stacks:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profile?.githubAnalysis?.topLanguages?.map((l: any) => (
                    <span key={l.name} className="badge badge-primary" style={{ fontSize: '0.725rem' }}>
                      {l.name} ({l.percentage}%)
                    </span>
                  ))}
                  {profile?.githubAnalysis?.detectedFrameworks?.map((f: string) => (
                    <span key={f} className="badge badge-neutral" style={{ fontSize: '0.725rem' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
