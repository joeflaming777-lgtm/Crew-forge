import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Sparkles, Check, X, Shield, Clock, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiClient } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

export const CandidateInvitations: React.FC = () => {
  const toast = useToast();
  const { refreshUser } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/invitations');
      if (res.data.success) {
        setInvitations(res.data.invitations || []);
      }
    } catch {
      toast.error('Failed to load invitations.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string, teamName: string) => {
    try {
      const res = await apiClient.post(`/invitations/${id}/accept`);
      if (res.data.success) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
        toast.success(res.data.message);
        await fetchInvitations();
        await refreshUser();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not accept invitation.');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const res = await apiClient.post(`/invitations/${id}/decline`);
      if (res.data.success) {
        toast.info('Invitation declined.');
        await fetchInvitations();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not decline invitation.');
    }
  };

  const pendingList = invitations.filter((i) => i.status === 'PENDING');
  const historyList = invitations.filter((i) => i.status !== 'PENDING');

  return (
    <div className="container" style={{ maxWidth: '880px', padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Team Invitations
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '4px' }}>
          Review official invitations sent by Team Leaders. Accepting an invitation confirms your spot on the squad.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
          Loading your invitations...
        </div>
      ) : (
        <>
          {/* Active Pending Invitations */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#f59e0b" /> Pending Invitations ({pendingList.length})
            </h3>

            {pendingList.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '20px' }}>
                <FileCheck size={40} color="#6366f1" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>
                  You don't have any team invitations yet.
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                  Complete your profile and assessment score to become discoverable to recruiting Team Leaders.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {pendingList.map((inv) => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{
                      padding: '2rem',
                      borderRadius: '20px',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(19, 27, 46, 0.95) 100%)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span className="badge badge-primary">{inv.team.hackathon?.name}</span>
                          <span className="badge badge-warning">Role: {inv.roleName}</span>
                        </div>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                          Team: {inv.team.name}
                        </h3>

                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                          Team Leader: <strong>{inv.team.leader?.fullName}</strong> ({inv.team.leader?.college})
                        </p>

                        <div
                          style={{
                            marginTop: '1rem',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#cbd5e1',
                            fontSize: '0.925rem',
                            fontStyle: 'italic',
                          }}
                        >
                          "{inv.message}"
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                        <button
                          onClick={() => handleAccept(inv.id, inv.team.name)}
                          className="btn-primary"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                          }}
                        >
                          <Check size={18} /> Accept Invitation
                        </button>

                        <button
                          onClick={() => handleDecline(inv.id)}
                          className="btn-secondary"
                        >
                          <X size={18} /> Decline
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Invitation History */}
          {historyList.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
                Past Invitations History
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {historyList.map((inv) => (
                  <div
                    key={inv.id}
                    className="glass-card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
                        {inv.team.name} • {inv.roleName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                        Leader: {inv.team.leader?.fullName} ({inv.team.hackathon?.name})
                      </div>
                    </div>

                    <span
                      className={`badge ${
                        inv.status === 'ACCEPTED'
                          ? 'badge-success'
                          : inv.status === 'DECLINED'
                          ? 'badge-danger'
                          : 'badge-neutral'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
