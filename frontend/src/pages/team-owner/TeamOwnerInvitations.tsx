import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileCheck,
  ChevronLeft,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const TeamOwnerInvitations: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTeamById, user, mySentInvitations, cancelInvitation } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const team = getTeamById(id || '');

  if (!team) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Team not found.</h3>
        <Link to="/dashboard" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === team.ownerId;
  if (!isOwner) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Access Restricted: Team Owner Only</h3>
        <Link to={`/find-team/${team.id}`} className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          View Team Page
        </Link>
      </div>
    );
  }

  const sentInvites = mySentInvitations(team.id);

  const handleCancelInvite = (invitationId: string) => {
    cancelInvitation(invitationId);
    toast.info('Invitation cancelled.');
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Top Back Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(`/team/${team.id}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              color: '#94a3b8',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <ChevronLeft size={16} /> Back to Team Overview
          </button>

          <Link
            to={`/team/${team.id}/candidates`}
            className="btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem' }}
          >
            <UserCheck size={14} /> Invite More Candidates
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Sent Invitations: {team.name}
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '4px' }}>
            Track the status of candidate invitations for {team.hackathonName}.
          </p>
        </div>

        {sentInvites.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <FileCheck size={44} color="#6366f1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', fontWeight: 700 }}>
              No invitations sent yet
            </h3>
            <p style={{ color: '#94a3b8', marginTop: '4px', maxWidth: '440px', margin: '4px auto 1.5rem' }}>
              Head over to Candidate Discovery to match and invite verified students to your squad.
            </p>
            <Link to={`/team/${team.id}/candidates`} className="btn-primary btn-sm">
              Discover Candidates →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sentInvites.map((inv) => {
              const isPending = inv.status === 'PENDING';
              const isAccepted = inv.status === 'ACCEPTED';
              const isDeclined = inv.status === 'DECLINED';

              return (
                <motion.div
                  key={inv.id}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: isAccepted
                            ? 'rgba(16, 185, 129, 0.15)'
                            : isPending
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(244, 63, 94, 0.15)',
                          color: isAccepted ? '#34d399' : isPending ? '#fbbf24' : '#f43f5e',
                        }}
                      >
                        {inv.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        Sent {new Date(inv.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                      {inv.candidateName}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '2px' }}>
                      Proposed Role: <strong>{inv.roleName}</strong>
                    </div>

                    {inv.message && (
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '6px' }}>
                        "{inv.message}"
                      </p>
                    )}
                  </div>

                  <div>
                    {isPending && (
                      <button
                        onClick={() => handleCancelInvite(inv.id)}
                        className="btn-secondary btn-sm"
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        Cancel Invite
                      </button>
                    )}

                    {isAccepted && (
                      <span style={{ fontSize: '0.85rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle size={16} /> Joined Team Squad
                      </span>
                    )}

                    {isDeclined && (
                      <span style={{ fontSize: '0.85rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={16} /> Candidate Declined
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
