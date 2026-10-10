import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Layers,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Github,
  CheckCircle2,
  Clock,
  Shield,
  FileCheck,
  Bell,
  Check,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ScoreRing } from '../../components/common/ScoreRing';
import confetti from 'canvas-confetti';

export const UserDashboard: React.FC = () => {
  const {
    user,
    myOwnedTeams,
    myMemberTeams,
    myAllTeams,
    myReceivedInvitations,
    acceptInvitation,
    declineInvitation,
    notifications,
    updateProfile,
  } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [togglingAvailability, setTogglingAvailability] = useState(false);

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Please log in to access your dashboard.</h3>
        <Link to="/login" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Go to Login
        </Link>
      </div>
    );
  }

  const pendingInvites = myReceivedInvitations.filter((i) => i.status === 'PENDING');

  const handleToggleAvailability = () => {
    setTogglingAvailability(true);
    const nextAvail = user.availability === 'Available' ? 'Busy' : 'Available';
    updateProfile({ availability: nextAvail });
    toast.success(`Availability changed to: ${nextAvail}`);
    setTogglingAvailability(false);
  };

  const handleAcceptInvite = (invitationId: string, teamName: string) => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    acceptInvitation(invitationId);
    toast.success(`You're officially part of ${teamName} 🎉`);
  };

  const handleDeclineInvite = (invitationId: string) => {
    declineInvitation(invitationId);
    toast.info('Invitation declined.');
  };

  // Verification steps definition
  const steps = [
    { key: 'profile', label: 'Profile', link: '/profile/edit', completed: !!(user.fullName && user.college) },
    { key: 'skills', label: 'Skills', link: '/profile/edit', completed: user.skills && user.skills.length >= 2 },
    { key: 'roles', label: 'Preferred Roles', link: '/profile/edit', completed: user.preferredRoles && user.preferredRoles.length >= 1 },
    { key: 'github', label: 'GitHub Username', link: '/github', completed: !!user.githubUsername },
    { key: 'githubAnalysis', label: 'GitHub Analysis', link: '/github', completed: !!user.githubAnalysis },
  ];

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* ================= HEADER SECTION ================= */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: 800,
                  color: '#f8fafc',
                  letterSpacing: '-0.02em',
                }}
              >
                Welcome back, {user.fullName}!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  fontSize: '1.1rem',
                  color: '#94a3b8',
                  marginTop: '6px',
                  fontWeight: 500,
                }}
              >
                One profile. Multiple possibilities.
              </motion.p>
            </div>

            {/* Quick Availability Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleToggleAvailability}
                disabled={togglingAvailability}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  background: user.availability === 'Available' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  border: user.availability === 'Available' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                  color: user.availability === 'Available' ? '#34d399' : '#fbbf24',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: user.availability === 'Available' ? '#10b981' : '#f59e0b',
                    boxShadow: user.availability === 'Available' ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
                  }}
                />
                Status: {user.availability}
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '4px' }}>(Click to switch)</span>
              </button>
            </div>
          </div>

          {/* ================= MANDATORY PROFILE VERIFICATION FLOW ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card"
            style={{
              marginTop: '1.75rem',
              padding: '1.5rem',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} color="#818cf8" />
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>
                  Student Profile Verification Flow
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: user.isActivated ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: user.isActivated ? '#34d399' : '#fbbf24',
                  }}
                >
                  {user.isActivated ? 'Profile Activated ✨' : 'Incomplete'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  Profile Complete: {user.completionPercentage}%
                </span>
                <div style={{ width: '120px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${user.completionPercentage}%`,
                      background: 'linear-gradient(90deg, #6366f1, #06b6d4, #10b981)',
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Stepper Steps */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
              }}
            >
              {steps.map((st, idx) => (
                <React.Fragment key={st.key}>
                  <Link
                    to={st.link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      background: st.completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: st.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: st.completed ? '#34d399' : '#94a3b8',
                      transition: 'all 0.2s',
                    }}
                  >
                    {st.completed ? <CheckCircle size={14} color="#34d399" /> : <Clock size={14} color="#64748b" />}
                    <span>{st.label}</span>
                  </Link>
                  {idx < steps.length - 1 && (
                    <ChevronRight size={14} color="#475569" style={{ flexShrink: 0 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ================= TWO MAJOR ACTION CARDS ================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          {/* Card 1: FIND A TEAM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-card"
            style={{
              padding: '2.5rem',
              borderRadius: '24px',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.85) 0%, rgba(13, 18, 32, 0.95) 100%)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(99, 102, 241, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
                  marginBottom: '1.5rem',
                }}
              >
                <Compass size={32} color="#ffffff" />
              </div>

              <h2
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.02em',
                }}
              >
                FIND A TEAM
              </h2>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}
              >
                Discover hackathon teams looking for your skills and experience.
              </p>
            </div>

            <Link
              to="/find-team"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textAlign: 'center',
              }}
            >
              Explore Teams
            </Link>
          </motion.div>

          {/* Card 2: CREATE A TEAM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-card"
            style={{
              padding: '2.5rem',
              borderRadius: '24px',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.85) 0%, rgba(13, 18, 32, 0.95) 100%)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(6, 182, 212, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
                  marginBottom: '1.5rem',
                }}
              >
                <Layers size={32} color="#ffffff" />
              </div>

              <h2
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.02em',
                }}
              >
                CREATE A TEAM
              </h2>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}
              >
                Start a hackathon team, define the required skills and select your teammates.
              </p>
            </div>

            <Link
              to="/build-team"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #10b981 100%)',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)',
              }}
            >
              Create a Team
            </Link>
          </motion.div>
        </div>

        {/* ================= DASHBOARD CONTENT GRID ================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* 1. MY PROFILE */}
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                  My Profile
                </h3>
                <Link to="/profile" style={{ fontSize: '0.825rem', color: '#818cf8', fontWeight: 600 }}>
                  View Full Profile →
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <ScoreRing score={user.overallSkillScore} size={92} strokeWidth={8} label="Overall Score" />
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {user.fullName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {user.college} • Year {user.year}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    {user.department}
                  </div>
                </div>
              </div>

              {/* Sub-Scores */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Verified Skills</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                    {user.skills && user.skills.length > 0 ? `${user.skills.length} Skills` : 'None Added'}
                  </div>
                </div>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>GitHub Score</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>
                    {user.githubScore > 0 ? `${user.githubScore}/100` : 'Not Linked'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Profile Completion</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>{user.completionPercentage}%</span>
            </div>
          </div>

          {/* 2. MY HACKATHON ACTIVITY */}
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                  My Hackathon Activity
                </h3>
                <Link to="/my-teams" style={{ fontSize: '0.825rem', color: '#2dd4bf', fontWeight: 600 }}>
                  Manage Teams →
                </Link>
              </div>

              {/* 4 Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Teams Created</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2dd4bf', marginTop: '4px' }}>
                    {myOwnedTeams.length}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b' }}>As Team Owner</div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Teams Joined</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
                    {myMemberTeams.length}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b' }}>As Team Member</div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Pending Invites</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                    {pendingInvites.length}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Awaiting response</div>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Active Teams</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                    {myAllTeams.length}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Across all hackathons</div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {myOwnedTeams.length > 0 && (
                <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '9999px', background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', fontWeight: 600 }}>
                  Team Owner in {myOwnedTeams.length}
                </span>
              )}
              {myMemberTeams.length > 0 && (
                <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', fontWeight: 600 }}>
                  Team Member in {myMemberTeams.length}
                </span>
              )}
              <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
                Looking for new squads
              </span>
            </div>
          </div>
        </div>

        {/* ================= NOTIFICATIONS & INVITATIONS ROW ================= */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} color="#6366f1" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                  Recent Notifications & Invitations
                </h3>
              </div>
              <Link to="/invitations" style={{ fontSize: '0.825rem', color: '#818cf8', fontWeight: 600 }}>
                View All Invitations ({pendingInvites.length} pending) →
              </Link>
            </div>

            {/* Pending Invitations Banner if any */}
            {pendingInvites.length > 0 && (
              <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pendingInvites.map((inv) => (
                  <div
                    key={inv.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                          Pending Squad Invite
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          From {inv.ownerName}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                        Join team "{inv.teamName}" for {inv.hackathonName}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '2px' }}>
                        Proposed Role: <strong style={{ color: '#38bdf8' }}>{inv.roleName}</strong> • "{inv.message}"
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => handleAcceptInvite(inv.id, inv.teamName)}
                        className="btn-primary btn-sm"
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                      >
                        <Check size={16} /> Accept Invitation
                      </button>
                      <button
                        onClick={() => handleDeclineInvite(inv.id)}
                        className="btn-secondary btn-sm"
                        style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Notifications List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      {notif.message}
                    </div>
                  </div>
                  {notif.link && (
                    <Link to={notif.link} style={{ fontSize: '0.78rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CURRENT TEAMS SECTION ================= */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                Current Teams
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
                All teams where you are currently participating as a Team Owner or Team Member across hackathons.
              </p>
            </div>

            <Link to="/build-team" className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={16} /> Create Another Team
            </Link>
          </div>

          {myAllTeams.length === 0 ? (
            <div
              className="glass-card"
              style={{
                padding: '3rem',
                textAlign: 'center',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Users size={40} color="#64748b" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700 }}>
                You haven't joined or created any teams yet.
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '6px', maxWidth: '440px', margin: '6px auto 1.5rem' }}>
                Explore open teams looking for your skills, or create your own squad and invite peers.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link to="/find-team" className="btn-primary btn-sm">
                  Find a Team →
                </Link>
                <Link to="/build-team" className="btn-secondary btn-sm">
                  Build a Team →
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {myAllTeams.map((team) => {
                const isOwner = team.ownerId === user.id;
                const memberRecord = team.members.find((m) => m.userId === user.id);
                const assignedRole = memberRecord?.assignedRole || (isOwner ? 'Team Owner' : 'Member');

                return (
                  <motion.div
                    key={team.id}
                    whileHover={{ y: -4 }}
                    className="glass-card"
                    style={{
                      padding: '1.75rem',
                      borderRadius: '20px',
                      border: isOwner
                        ? '1px solid rgba(45, 212, 191, 0.3)'
                        : '1px solid rgba(99, 102, 241, 0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'linear-gradient(180deg, rgba(19, 27, 46, 0.8) 0%, rgba(13, 18, 32, 0.9) 100%)',
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            background: isOwner ? 'rgba(45, 212, 191, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                            color: isOwner ? '#2dd4bf' : '#a5b4fc',
                            border: isOwner ? '1px solid rgba(45, 212, 191, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                          }}
                        >
                          Role: {isOwner ? 'Team Owner' : `Team Member (${assignedRole})`}
                        </span>

                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {team.currentMemberCount} / {team.maxTeamSize} Members
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                        {team.name}
                      </h3>

                      <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.75rem' }}>
                        {team.hackathonName}
                      </div>

                      <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {team.description}
                      </p>

                      {/* Open Roles Preview */}
                      {team.openRoles && team.openRoles.length > 0 && (
                        <div style={{ marginBottom: '1.25rem' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                            OPEN ROLES ({team.openRoles.length}):
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {team.openRoles.map((r, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '0.725rem',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: 'rgba(255,255,255,0.05)',
                                  color: '#cbd5e1',
                                }}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Owner: {team.ownerName}
                      </div>

                      {isOwner ? (
                        <Link
                          to={`/team/${team.id}`}
                          className="btn-primary btn-sm"
                          style={{
                            fontSize: '0.825rem',
                            padding: '6px 14px',
                            background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                          }}
                        >
                          Manage Team →
                        </Link>
                      ) : (
                        <Link
                          to={`/find-team/${team.id}`}
                          className="btn-secondary btn-sm"
                          style={{ fontSize: '0.825rem', padding: '6px 14px' }}
                        >
                          View Squad →
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
