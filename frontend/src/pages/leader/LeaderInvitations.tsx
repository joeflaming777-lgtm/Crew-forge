import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Sparkles, X, Check, Clock, UserCheck } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';

export const LeaderInvitations: React.FC = () => {
  const toast = useToast();
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
      toast.error('Could not load sent invitations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvite = async (id: string) => {
    try {
      const res = await apiClient.post(`/invitations/${id}/cancel`);
      if (res.data.success) {
        toast.info('Invitation cancelled.');
        await fetchInvitations();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not cancel invitation.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px', padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Sent Team Invitations
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '4px' }}>
          Monitor response status for all invitations issued by your hackathon squad.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
          Loading sent invitations...
        </div>
      ) : invitations.length === 0 ? (
        <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: '20px' }}>
          <FileCheck size={44} color="#06b6d4" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.35rem', color: '#f8fafc' }}>No Invitations Sent Yet</h3>
          <p style={{ color: '#94a3b8', marginTop: '6px' }}>
            Discover and invite candidates from the Candidate Discovery catalog.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {invitations.map((inv) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
              style={{
                padding: '1.5rem 2rem',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                    {inv.candidate?.fullName}
                  </span>
                  <span className="badge badge-primary">Invited Role: {inv.roleName}</span>
                  <span
                    className={`badge ${
                      inv.status === 'ACCEPTED'
                        ? 'badge-success'
                        : inv.status === 'PENDING'
                        ? 'badge-warning'
                        : inv.status === 'DECLINED'
                        ? 'badge-danger'
                        : 'badge-neutral'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  {inv.candidate?.department} • {inv.candidate?.college} (Year {inv.candidate?.year})
                </p>

                {inv.message && (
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic', marginTop: '6px' }}>
                    "{inv.message}"
                  </p>
                )}
              </div>

              {inv.status === 'PENDING' && (
                <button
                  onClick={() => handleCancelInvite(inv.id)}
                  className="btn-danger btn-sm"
                >
                  <X size={14} /> Cancel Invite
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
