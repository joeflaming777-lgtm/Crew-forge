import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck,
  Check,
  X,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import confetti from 'canvas-confetti';

export const InvitationsPage: React.FC = () => {
  const { user, myReceivedInvitations, acceptInvitation, declineInvitation } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [acceptedTeamCelebration, setAcceptedTeamCelebration] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Please sign in to view your invitations.</h3>
        <Link to="/login" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Go to Login
        </Link>
      </div>
    );
  }

  const pendingInvites = myReceivedInvitations.filter((i) => i.status === 'PENDING');
  const pastInvites = myReceivedInvitations.filter((i) => i.status !== 'PENDING');

  const handleAccept = (invitationId: string, teamName: string) => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    acceptInvitation(invitationId);
    setAcceptedTeamCelebration(teamName);
    toast.success(`You're officially part of ${teamName} 🎉`);
  };

  const handleDecline = (invitationId: string) => {
    declineInvitation(invitationId);
    toast.info('Invitation declined.');
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Celebration Banner when an invite is accepted */}
        <AnimatePresence>
          {acceptedTeamCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                marginBottom: '2rem',
                padding: '1.5rem 2rem',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
              }}
            >
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
                You're officially part of {acceptedTeamCelebration} 🎉
              </h2>
              <p style={{ color: '#a7f3d0', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                Your student profile is now registered as an active squad member. Collaborate and prepare for your hackathon!
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link to="/my-teams" className="btn-primary btn-sm">
                  View in My Teams →
                </Link>
                <button
                  onClick={() => setAcceptedTeamCelebration(null)}
                  className="btn-secondary btn-sm"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <FileCheck size={16} /> Official Squad Invitations
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Team Invitations
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginTop: '4px' }}>
            Team Owners recruit members by reviewing student profiles and sending direct invitations. Accept to become a full Team Member.
          </p>
        </div>

        {/* Pending Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Pending Invitations</span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                background: pendingInvites.length > 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: pendingInvites.length > 0 ? '#fbbf24' : '#94a3b8',
              }}
            >
              {pendingInvites.length}
            </span>
          </h2>

          {pendingInvites.length === 0 ? (
            <div
              className="glass-card"
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Clock size={36} color="#64748b" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>
                No pending invitations
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px', maxWidth: '420px', margin: '4px auto 1rem' }}>
                Keep your profile and skills updated to increase visibility among recruiting Team Owners.
              </p>
              <Link to="/find-team" className="btn-secondary btn-sm">
                Explore Active Teams →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pendingInvites.map((inv) => (
                <motion.div
                  key={inv.id}
                  whileHover={{ y: -3 }}
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    background: 'linear-gradient(135deg, rgba(20, 28, 48, 0.85) 0%, rgba(13, 18, 32, 0.95) 100%)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        Action Required
                      </span>
                      <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                        {inv.hackathonName}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                      {inv.teamName}
                    </h3>

                    <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '4px' }}>
                      Invited by <strong style={{ color: '#fff' }}>{inv.ownerName}</strong> to join as{' '}
                      <strong style={{ color: '#38bdf8' }}>{inv.roleName}</strong>
                    </div>

                    {inv.message && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          fontSize: '0.85rem',
                          color: '#94a3b8',
                          fontStyle: 'italic',
                        }}
                      >
                        "{inv.message}"
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
                    <button
                      onClick={() => handleAccept(inv.id, inv.teamName)}
                      className="btn-primary btn-sm"
                      style={{
                        padding: '10px 18px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                      }}
                    >
                      <Check size={16} /> Accept & Join Team
                    </button>

                    <button
                      onClick={() => handleDecline(inv.id)}
                      className="btn-secondary btn-sm"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <X size={15} /> Decline
                    </button>

                    <Link
                      to={`/find-team/${inv.teamId}`}
                      style={{
                        textAlign: 'center',
                        fontSize: '0.78rem',
                        color: '#818cf8',
                        marginTop: '4px',
                      }}
                    >
                      View Team Details →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* History Section */}
        {pastInvites.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
              Invitation History ({pastInvites.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pastInvites.map((inv) => {
                const isAccepted = inv.status === 'ACCEPTED';

                return (
                  <div
                    key={inv.id}
                    className="glass-card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '14px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
                          {inv.teamName}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          ({inv.hackathonName})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
                        Role: {inv.roleName} • Inviter: {inv.ownerName}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '6px',
                          background: isAccepted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                          color: isAccepted ? '#34d399' : '#f43f5e',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {isAccepted ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {isAccepted ? 'Accepted & Joined' : 'Declined'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
