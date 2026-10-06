import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Search,
  PlusCircle,
  FileCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const LeaderDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [teamData, setTeamData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadLeaderData();
  }, []);

  const loadLeaderData = async () => {
    try {
      setLoading(true);
      const [teamRes, candidatesRes] = await Promise.all([
        apiClient.get('/teams/my-team'),
        apiClient.get('/candidates'),
      ]);

      if (teamRes.data.success) {
        setTeamData(teamRes.data);
      }
      if (candidatesRes.data.success) {
        setStats(candidatesRes.data.stats);
      }
    } catch {
      toast.error('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem', color: '#94a3b8' }}>
        Loading Team Leader dashboard...
      </div>
    );
  }

  const leaderName = user?.leaderProfile?.fullName || 'Leader';
  const team = teamData?.team;
  const progress = teamData?.progress;
  const missingRoles = progress?.missingRoles || [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Welcome, {leaderName} 🚀
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginTop: '4px' }}>
            {team ? `${team.name} • ${team.hackathon?.name}` : 'Ready to create your hackathon squad'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/leader/discover')} className="btn-primary">
            <Search size={16} /> Discover Candidates
          </button>
          {!team && (
            <button onClick={() => navigate('/leader/create-team')} className="btn-secondary">
              <PlusCircle size={16} /> Create Team
            </button>
          )}
        </div>
      </div>

      {/* MISSING ROLES ALERT BANNER (Sections 18 & 23) */}
      {team && missingRoles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '1.5rem 2rem',
            borderRadius: '20px',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(19, 27, 46, 0.95) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={22} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                Your team is missing {missingRoles.length} {missingRoles.length === 1 ? 'role' : 'roles'}.
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '2px' }}>
                Needed to complete lineup: <strong>{missingRoles.join(', ')}</strong>
              </p>
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
        </motion.div>
      )}

      {/* CANDIDATE STATISTICS (Section 18) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Candidates
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {stats?.totalCandidates || 32}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>In candidate pool</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Eligible (≥{team?.minCandidateScore || 75}%)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {stats?.eligibleCandidates || 24}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Meet threshold</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Top Matches (≥85%)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
            {stats?.topMatches || 12}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>High compatibility</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Invitations Sent
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {stats?.invitationsSent || 2}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Track responses</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Accepted Members
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
            {stats?.acceptedCount || (team?.members?.length || 3)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>On official roster</div>
        </div>
      </div>

      {/* TEAM STATUS & REQUIRED ROLES PROGRESS */}
      {team ? (
        <div className="grid-cols-2" style={{ marginBottom: '2.5rem' }}>
          {/* Team Progress Card */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                Team Progress
              </h3>
              <span className="badge badge-primary">
                {progress?.currentMembers} / {progress?.maxMembers} Members
              </span>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {team.description}
            </p>

            {/* Member count visual bar */}
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: `${Math.round((progress?.currentMembers / progress?.maxMembers) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => navigate('/leader/team')} className="btn-secondary btn-sm">
                Open Team Builder Canvas <ChevronRight size={16} />
              </button>
              <button onClick={() => navigate('/leader/invitations')} className="btn-secondary btn-sm">
                View Sent Invites
              </button>
            </div>
          </div>

          {/* Required Roles Checkmark List (Section 18) */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
              Required Roles Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(progress?.roleStatus || []).map((r: any) => (
                <div
                  key={r.roleName}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: r.isFilled ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                    border: r.isFilled ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>
                    {r.roleName}
                  </span>
                  {r.isFilled ? (
                    <span className="badge badge-success">
                      <CheckCircle2 size={14} /> Filled
                    </span>
                  ) : (
                    <span className="badge badge-warning">
                      <AlertTriangle size={14} /> Missing
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '20px', marginBottom: '2.5rem' }}>
          <Layers size={48} color="#06b6d4" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
            No Hackathon Team Registered
          </h3>
          <p style={{ color: '#94a3b8', maxWidth: '480px', margin: '6px auto 1.5rem' }}>
            Create your hackathon team to specify required technical roles and discover candidates.
          </p>
          <button onClick={() => navigate('/leader/create-team')} className="btn-primary">
            Create Team Now
          </button>
        </div>
      )}
    </div>
  );
};
