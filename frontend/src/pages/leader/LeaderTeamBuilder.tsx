import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Crown,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';

export const LeaderTeamBuilder: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/teams/my-team');
      if (res.data.success) {
        setTeamData(res.data);
      }
    } catch {
      toast.error('Could not fetch team builder data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem', color: '#94a3b8' }}>
        Loading team composition canvas...
      </div>
    );
  }

  if (!teamData?.team) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: '#f8fafc', marginBottom: '1rem' }}>
          No Active Team Found
        </h2>
        <button onClick={() => navigate('/leader/create-team')} className="btn-primary">
          Create Team Now
        </button>
      </div>
    );
  }

  const team = teamData.team;
  const progress = teamData.progress;
  const roleStatus = progress?.roleStatus || [];
  const missingRoles = progress?.missingRoles || [];

  return (
    <div className="container" style={{ maxWidth: '980px', padding: '2.5rem 1.5rem 4rem' }}>
      {/* Top Canvas Header */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          borderRadius: '24px',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(19, 27, 46, 0.95) 100%)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">{team.hackathon?.name}</span>
              <span className="badge badge-neutral">Max {team.maxTeamSize} Members</span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              TEAM: {team.name.toUpperCase()}
            </h1>

            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '6px', maxWidth: '640px' }}>
              {team.description}
            </p>
          </div>

          <div
            style={{
              padding: '12px 20px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Lineup Progress
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
              {progress?.currentMembers} / {team.maxTeamSize}
            </div>
          </div>
        </div>
      </div>

      {/* MISSING ROLES HIGHLIGHT (Section 23) */}
      {missingRoles.length > 0 && (
        <div
          className="glass-card"
          style={{
            padding: '1.5rem 2rem',
            borderRadius: '20px',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(16, 23, 38, 0.9) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Your team is missing {missingRoles.length} {missingRoles.length === 1 ? 'role' : 'roles'}.
            </h3>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              {missingRoles.map((r: string) => (
                <span key={r} className="badge badge-warning">
                  {r} Needed
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate(`/leader/discover?role=${encodeURIComponent(missingRoles[0])}`)}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
            }}
          >
            Find Matching Candidates <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* VISUAL TEAM COMPOSITION GRID (Section 23) */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
        Visual Team Composition Canvas
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Team Leader Slot */}
        <div
          className="glass-card"
          style={{
            padding: '1.75rem',
            borderRadius: '20px',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(19, 27, 46, 0.95) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-warning">Slot 1: Leader</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={team.leader?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${team.leader?.fullName}`}
              alt={team.leader?.fullName}
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #f59e0b' }}
            />
            <div>
              <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {team.leader?.fullName} <Crown size={15} color="#f59e0b" />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {team.leader?.department}
              </p>
            </div>
          </div>
        </div>

        {/* Required Roles Slots (Filled vs Vacant) */}
        {roleStatus.map((role: any, idx: number) => {
          // Find matching member assigned to this role
          const assignedMember = team.members.find(
            (m: any) => m.assignedRole.toLowerCase() === role.roleName.toLowerCase()
          );

          if (role.isFilled && assignedMember) {
            return (
              <div
                key={role.roleName}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(19, 27, 46, 0.95) 100%)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="badge badge-success">{role.roleName}</span>
                  <CheckCircle2 size={18} color="#10b981" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={assignedMember.candidate?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${assignedMember.candidate?.fullName}`}
                    alt={assignedMember.candidate?.fullName}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #10b981' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.05rem' }}>
                      {assignedMember.candidate?.fullName}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {assignedMember.candidate?.department}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          // Vacant Missing Slot
          return (
            <div
              key={role.roleName}
              className="glass-card"
              style={{
                padding: '1.75rem',
                borderRadius: '20px',
                border: '1px dashed rgba(245, 158, 11, 0.35)',
                background: 'rgba(245, 158, 11, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="badge badge-warning">{role.roleName}</span>
                  <AlertTriangle size={18} color="#f59e0b" />
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                  Slot Open: {role.roleName}
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  This role is currently vacant. Discover and invite candidates with matching skills.
                </p>
              </div>

              <button
                onClick={() => navigate(`/leader/discover?role=${encodeURIComponent(role.roleName)}`)}
                className="btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Search size={14} /> Find {role.roleName}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
