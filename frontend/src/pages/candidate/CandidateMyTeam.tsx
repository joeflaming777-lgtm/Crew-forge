import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Crown, Compass, Shield, Calendar, ArrowRight } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';

export const CandidateMyTeam: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMyTeam();
  }, []);

  const fetchMyTeam = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/candidate/profile');
      if (res.data.success) {
        const teamMembership = res.data.profile?.teamMemberships?.[0];
        if (teamMembership?.team) {
          // Fetch full team data
          const teamRes = await apiClient.get(`/teams/${teamMembership.team.id}`);
          if (teamRes.data.success) {
            setTeam(teamRes.data.team);
          }
        }
      }
    } catch {
      toast.error('Could not fetch team details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem', color: '#94a3b8' }}>
        Loading team canvas...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container" style={{ maxWidth: '650px', textAlign: 'center', padding: '6rem 1.5rem' }}>
        <div className="glass-card" style={{ padding: '3.5rem 2rem', borderRadius: '24px' }}>
          <Users size={48} color="#6366f1" style={{ margin: '0 auto 1.25rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            No Team Membership Yet
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            You haven't joined a hackathon team yet. You become an official member after a Team Leader issues an invitation and you explicitly accept it.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/candidate/teams')} className="btn-primary">
              <Compass size={18} /> Browse Teams
            </button>
            <button onClick={() => navigate('/candidate/invitations')} className="btn-secondary">
              View Invitations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '960px', padding: '2.5rem 1.5rem 4rem' }}>
      {/* Top Team Header */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          borderRadius: '24px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(19, 27, 46, 0.95) 100%)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge badge-success">Official Squad Member</span>
              <span className="badge badge-primary">{team.hackathon?.name}</span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              {team.name}
            </h1>

            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, marginTop: '8px', maxWidth: '720px' }}>
              {team.description}
            </p>
          </div>

          <div
            style={{
              padding: '12px 18px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Team Capacity
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
              {team.members.length + 1} / {team.maxTeamSize}
            </div>
          </div>
        </div>
      </div>

      {/* Roster: Leader + Teammates */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
        Team Roster & Roles
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Team Leader Card */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(16, 23, 38, 0.9))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <img
              src={team.leader?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${team.leader?.fullName}`}
              alt={team.leader?.fullName}
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #f59e0b' }}
            />
            <div>
              <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {team.leader?.fullName} <Crown size={16} color="#f59e0b" />
              </div>
              <span className="badge badge-warning" style={{ marginTop: '2px' }}>Team Leader</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {team.leader?.department} • {team.leader?.college}
          </p>
        </div>

        {/* Member Cards */}
        {team.members.map((m: any) => (
          <div
            key={m.id}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <img
                src={m.candidate?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.candidate?.fullName}`}
                alt={m.candidate?.fullName}
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #6366f1' }}
              />
              <div>
                <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.05rem' }}>
                  {m.candidate?.fullName}
                </div>
                <span className="badge badge-primary" style={{ marginTop: '2px' }}>
                  {m.assignedRole}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {m.candidate?.department} • {m.candidate?.college}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
