import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck,
  Check,
  X,
  Users,
  Compass,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  UserCheck,
  Send,
  Inbox,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import confetti from 'canvas-confetti';

type TabKey = 'invitations' | 'sent-requests' | 'received-requests';

export const InvitationsPage: React.FC = () => {
  const {
    user,
    myReceivedInvitations,
    acceptInvitation,
    declineInvitation,
    mySentJoinRequests,
    allMyReceivedJoinRequests,
    approveJoinRequest,
    declineJoinRequest,
    cancelJoinRequest,
    myOwnedTeams,
  } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<TabKey>('invitations');
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Please sign in to view your invitations and requests.</h3>
        <Link to="/login" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Go to Login
        </Link>
      </div>
    );
  }

  // Pending counts
  const pendingInvites = myReceivedInvitations.filter((i) => i.status === 'PENDING');
  const pastInvites = myReceivedInvitations.filter((i) => i.status !== 'PENDING');

  const pendingSentReqs = mySentJoinRequests.filter((r) => r.status === 'PENDING');
  const pastSentReqs = mySentJoinRequests.filter((r) => r.status !== 'PENDING');

  const pendingReceivedReqs = allMyReceivedJoinRequests.filter((r) => r.status === 'PENDING');
  const pastReceivedReqs = allMyReceivedJoinRequests.filter((r) => r.status !== 'PENDING');

  const handleAcceptInvite = (invitationId: string, teamName: string) => {
    const res = acceptInvitation(invitationId);
    if (res.success) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setCelebrationMessage(`You're officially part of ${teamName} 🎉`);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleDeclineInvite = (invitationId: string) => {
    declineInvitation(invitationId);
    toast.info('Invitation declined.');
  };

  const handleApproveJoinReq = (requestId: string, candidateName: string, teamName: string) => {
    const res = approveJoinRequest(requestId);
    if (res.success) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(`Approved! ${candidateName} has joined ${teamName} 🎉`);
    } else {
      toast.error(res.message);
    }
  };

  const handleDeclineJoinReq = (requestId: string) => {
    declineJoinRequest(requestId);
    toast.info('Join request declined.');
  };

  const handleCancelJoinReq = (requestId: string) => {
    cancelJoinRequest(requestId);
    toast.info('Join request cancelled.');
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Celebration Banner */}
        <AnimatePresence>
          {celebrationMessage && (
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
                {celebrationMessage}
              </h2>
              <p style={{ color: '#a7f3d0', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                Your student profile is registered as an official squad member. Collaborate and prepare for your hackathon!
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link to="/my-teams" className="btn-primary btn-sm">
                  View in My Teams →
                </Link>
                <button
                  onClick={() => setCelebrationMessage(null)}
                  className="btn-secondary btn-sm"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <FileCheck size={16} /> Squad Recruitment & Requests
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Invitations & Join Requests
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginTop: '4px' }}>
            Manage incoming team invitations, track your submitted join requests, and review candidates applying to teams you lead.
          </p>
        </div>

        {/* Multi-Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.65)',
            padding: '6px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '2.5rem',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('invitations')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'invitations' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
              color: activeTab === 'invitations' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <Inbox size={16} />
            <span>Invitations Received</span>
            {pendingInvites.length > 0 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: activeTab === 'invitations' ? 'rgba(255,255,255,0.25)' : '#fbbf24',
                  color: activeTab === 'invitations' ? '#fff' : '#0f172a',
                  fontWeight: 800,
                }}
              >
                {pendingInvites.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent-requests')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'sent-requests' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
              color: activeTab === 'sent-requests' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <Send size={16} />
            <span>My Sent Requests</span>
            {pendingSentReqs.length > 0 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: activeTab === 'sent-requests' ? 'rgba(255,255,255,0.25)' : '#38bdf8',
                  color: activeTab === 'sent-requests' ? '#fff' : '#0f172a',
                  fontWeight: 800,
                }}
              >
                {pendingSentReqs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('received-requests')}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'received-requests' ? 'linear-gradient(135deg, #0d9488, #059669)' : 'transparent',
              color: activeTab === 'received-requests' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <UserCheck size={16} />
            <span>Owner: Join Requests</span>
            {pendingReceivedReqs.length > 0 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: activeTab === 'received-requests' ? 'rgba(255,255,255,0.25)' : '#2dd4bf',
                  color: activeTab === 'received-requests' ? '#fff' : '#0f172a',
                  fontWeight: 800,
                }}
              >
                {pendingReceivedReqs.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: INVITATIONS RECEIVED */}
        {activeTab === 'invitations' && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
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
                    Keep your profile and skills updated to increase your visibility among recruiting team owners.
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
                          onClick={() => handleAcceptInvite(inv.id, inv.teamName)}
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
                          onClick={() => handleDeclineInvite(inv.id)}
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

            {/* Past Invitations */}
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
        )}

        {/* TAB 2: MY SENT JOIN REQUESTS */}
        {activeTab === 'sent-requests' && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Active Sent Requests</span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: pendingSentReqs.length > 0 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: pendingSentReqs.length > 0 ? '#38bdf8' : '#94a3b8',
                    }}
                  >
                    {pendingSentReqs.length}
                  </span>
                </h2>
                <Link to="/find-team" className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={14} /> Find More Teams
                </Link>
              </div>

              {pendingSentReqs.length === 0 ? (
                <div
                  className="glass-card"
                  style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Send size={36} color="#64748b" style={{ margin: '0 auto 10px' }} />
                  <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>
                    No pending join requests
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px', maxWidth: '420px', margin: '4px auto 1rem' }}>
                    Browse hackathons to find squads looking for your exact tech stack and send a join request.
                  </p>
                  <Link to="/find-team" className="btn-primary btn-sm">
                    Explore Teams →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {pendingSentReqs.map((req) => (
                    <motion.div
                      key={req.id}
                      whileHover={{ y: -3 }}
                      className="glass-card"
                      style={{
                        padding: '2rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'linear-gradient(135deg, rgba(16, 27, 44, 0.85) 0%, rgba(13, 18, 32, 0.95) 100%)',
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
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: '#38bdf8',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                            }}
                          >
                            ⏳ Pending Owner Review
                          </span>
                          <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                            {req.hackathonName}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                          {req.teamName}
                        </h3>

                        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '4px' }}>
                          Applied for role: <strong style={{ color: '#a78bfa' }}>{req.roleName}</strong>
                        </div>

                        {req.message && (
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
                            "{req.message}"
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                        <button
                          onClick={() => handleCancelJoinReq(req.id)}
                          className="btn-secondary btn-sm"
                          style={{
                            padding: '8px 16px',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            borderColor: 'rgba(244, 63, 94, 0.4)',
                            color: '#fb7185',
                          }}
                        >
                          <X size={15} /> Cancel Request
                        </button>

                        <Link
                          to={`/find-team/${req.teamId}`}
                          style={{
                            textAlign: 'center',
                            fontSize: '0.78rem',
                            color: '#818cf8',
                            marginTop: '4px',
                          }}
                        >
                          View Team Page →
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Sent Requests */}
            {pastSentReqs.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
                  Request History ({pastSentReqs.length})
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pastSentReqs.map((req) => {
                    const isApproved = req.status === 'APPROVED';
                    const isCancelled = req.status === 'CANCELLED';

                    return (
                      <div
                        key={req.id}
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
                              {req.teamName}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                              ({req.hackathonName})
                            </span>
                          </div>
                          <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
                            Target Role: {req.roleName}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '6px',
                              background: isApproved
                                ? 'rgba(16, 185, 129, 0.15)'
                                : isCancelled
                                ? 'rgba(148, 163, 184, 0.15)'
                                : 'rgba(244, 63, 94, 0.15)',
                              color: isApproved ? '#34d399' : isCancelled ? '#94a3b8' : '#f43f5e',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {isApproved ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {isApproved ? 'Approved & Joined' : isCancelled ? 'Cancelled' : 'Declined'}
                          </span>

                          {isApproved && (
                            <Link to="/my-teams" className="btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                              View Team →
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RECEIVED JOIN REQUESTS (FOR TEAMS USER OWNS) */}
        {activeTab === 'received-requests' && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Candidates Requesting to Join Your Teams</span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: pendingReceivedReqs.length > 0 ? 'rgba(45, 212, 191, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: pendingReceivedReqs.length > 0 ? '#2dd4bf' : '#94a3b8',
                    }}
                  >
                    {pendingReceivedReqs.length}
                  </span>
                </h2>
                {myOwnedTeams.length > 0 && (
                  <Link to="/build-team" className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <PlusCircle size={14} /> Create Another Team
                  </Link>
                )}
              </div>

              {myOwnedTeams.length === 0 ? (
                <div
                  className="glass-card"
                  style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Users size={36} color="#64748b" style={{ margin: '0 auto 10px' }} />
                  <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>
                    You haven't created any teams yet
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px', maxWidth: '440px', margin: '4px auto 1rem' }}>
                    Every student on CrewForge can build and lead teams! Define required roles, publish your squad, and candidates will apply directly.
                  </p>
                  <Link to="/build-team" className="btn-primary btn-sm">
                    Start a Hackathon Team →
                  </Link>
                </div>
              ) : pendingReceivedReqs.length === 0 ? (
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
                    No pending join requests
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px', maxWidth: '420px', margin: '4px auto 1rem' }}>
                    You can also discover and invite candidate profiles directly from your team management dashboard.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    {myOwnedTeams.map((team) => (
                      <Link key={team.id} to={`/team/${team.id}#candidates`} className="btn-secondary btn-sm">
                        Find Candidates for {team.name} →
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {pendingReceivedReqs.map((req) => (
                    <motion.div
                      key={req.id}
                      whileHover={{ y: -3 }}
                      className="glass-card"
                      style={{
                        padding: '2rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(45, 212, 191, 0.3)',
                        background: 'linear-gradient(135deg, rgba(16, 32, 38, 0.85) 0%, rgba(13, 18, 32, 0.95) 100%)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.5rem',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              background: 'rgba(45, 212, 191, 0.15)',
                              color: '#2dd4bf',
                              border: '1px solid rgba(45, 212, 191, 0.3)',
                            }}
                          >
                            Request for: {req.teamName}
                          </span>
                          <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                            {req.hackathonName}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                          {req.candidateAvatar ? (
                            <img
                              src={req.candidateAvatar}
                              alt={req.candidateName}
                              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                color: '#fff',
                              }}
                            >
                              {req.candidateName.charAt(0)}
                            </div>
                          )}

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                                {req.candidateName}
                              </h3>
                              {req.candidateScore && (
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    background: 'rgba(99, 102, 241, 0.2)',
                                    color: '#818cf8',
                                  }}
                                >
                                  Score: {req.candidateScore}%
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '2px' }}>
                              {req.candidateCollege} • {req.candidateDepartment}
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '12px' }}>
                          Applying to fill: <strong style={{ color: '#2dd4bf' }}>{req.roleName}</strong>
                        </div>

                        {req.message && (
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
                            "{req.message}"
                          </div>
                        )}

                        {req.candidateSkills && req.candidateSkills.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                            {req.candidateSkills.map((sk, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: 'rgba(255,255,255,0.05)',
                                  color: '#cbd5e1',
                                }}
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
                        <button
                          onClick={() => handleApproveJoinReq(req.id, req.candidateName, req.teamName)}
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
                          <Check size={16} /> Approve & Add
                        </button>

                        <button
                          onClick={() => handleDeclineJoinReq(req.id)}
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
                          to={`/team/${req.teamId}`}
                          style={{
                            textAlign: 'center',
                            fontSize: '0.78rem',
                            color: '#2dd4bf',
                            marginTop: '4px',
                          }}
                        >
                          Go to Team Manager →
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Handled Join Requests */}
            {pastReceivedReqs.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
                  Handled Requests History ({pastReceivedReqs.length})
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pastReceivedReqs.map((req) => {
                    const isApproved = req.status === 'APPROVED';

                    return (
                      <div
                        key={req.id}
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
                              {req.candidateName}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                              for {req.teamName} ({req.roleName})
                            </span>
                          </div>
                          <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
                            {req.candidateCollege} • {req.candidateDepartment}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '6px',
                              background: isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                              color: isApproved ? '#34d399' : '#f43f5e',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {isApproved ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {isApproved ? 'Approved & Enrolled' : 'Declined'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
