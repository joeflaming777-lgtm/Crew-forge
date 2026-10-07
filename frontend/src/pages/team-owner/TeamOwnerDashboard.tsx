import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Users,
  UserCheck,
  FileCheck,
  Settings,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const TeamOwnerDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTeamById, user, mySentInvitations } = useAuth();
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
  const sentInvites = mySentInvitations(team.id);
  const pendingSentCount = sentInvites.filter((i) => i.status === 'PENDING').length;

  if (!isOwner) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <ShieldAlert size={48} color="#f43f5e" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', fontWeight: 700 }}>
          Access Restricted: Team Owner Only
        </h3>
        <p style={{ color: '#94a3b8', marginTop: '6px', maxWidth: '460px', margin: '6px auto 1.5rem' }}>
          Only the creator of "{team.name}" can access team management and selection controls.
        </p>
        <Link to={`/find-team/${team.id}`} className="btn-primary">
          View Public Team Details
        </Link>
      </div>
    );
  }

  const progressPercent = Math.round((team.currentMemberCount / team.maxTeamSize) * 100);

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '1140px' }}>
        {/* Breadcrumb / Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#94a3b8' }}>
            <Link to="/dashboard" style={{ color: '#94a3b8' }}>Dashboard</Link>
            <ChevronRight size={14} />
            <Link to="/my-teams" style={{ color: '#94a3b8' }}>My Teams</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>{team.name}</span>
          </div>

          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(45, 212, 191, 0.15)',
              color: '#2dd4bf',
              border: '1px solid rgba(45, 212, 191, 0.3)',
            }}
          >
            ★ You are Team Owner
          </span>
        </div>

        {/* Team Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '2.25rem',
            borderRadius: '24px',
            border: '1px solid rgba(45, 212, 191, 0.25)',
            background: 'linear-gradient(135deg, rgba(20, 28, 48, 0.9) 0%, rgba(13, 18, 32, 0.95) 100%)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                {team.hackathonName}
              </span>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                {team.name}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                to={`/team/${team.id}/candidates`}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                  padding: '0.75rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <UserCheck size={18} /> Discover Candidates
              </Link>
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '800px', marginBottom: '1.75rem' }}>
            {team.description}
          </p>

          {/* Team Formation Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                Squad Formation Progress: {team.currentMemberCount} / {team.maxTeamSize} Members
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#2dd4bf' }}>
                {progressPercent}% Complete
              </span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* 3 Quick Navigation Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <Link
            to={`/team/${team.id}/candidates`}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={22} color="#22d3ee" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>Candidate Discovery</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Search, compare & invite peers</div>
              </div>
            </div>
            <ArrowRight size={18} color="#94a3b8" />
          </Link>

          <Link
            to={`/team/${team.id}/invitations`}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck size={22} color="#818cf8" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>Sent Invitations</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {pendingSentCount} pending out of {sentInvites.length}
                </div>
              </div>
            </div>
            <ArrowRight size={18} color="#94a3b8" />
          </Link>

          <Link
            to={`/team/${team.id}/settings`}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={22} color="#cbd5e1" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>Team Settings</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Roles, threshold & details</div>
              </div>
            </div>
            <ArrowRight size={18} color="#94a3b8" />
          </Link>
        </div>

        {/* Current Squad & Open Positions Two-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Current Members */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                Current Members ({team.members.length})
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Max capacity: {team.maxTeamSize}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {team.members.map((member) => (
                <div
                  key={member.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.fullName}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: member.isOwner ? '#06b6d4' : '#6366f1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: '#fff',
                        }}
                      >
                        {member.fullName[0]}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.925rem' }}>
                        {member.fullName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: member.isOwner ? '#2dd4bf' : '#38bdf8' }}>
                        {member.assignedRole}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: member.isOwner ? 'rgba(45, 212, 191, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: member.isOwner ? '#2dd4bf' : '#a5b4fc',
                    }}
                  >
                    {member.isOwner ? 'Owner' : 'Member'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions & Required Skills */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                Open Positions to Fill ({team.openRoles.length})
              </h3>
              <Link to={`/team/${team.id}/candidates`} style={{ fontSize: '0.825rem', color: '#2dd4bf', fontWeight: 600 }}>
                Find Matches →
              </Link>
            </div>

            {team.openRoles.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                <p>All positions are filled! Your squad is complete.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                {team.openRoles.map((role, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(6, 182, 212, 0.08)',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#22d3ee', fontSize: '0.925rem' }}>
                        {role}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                        Min candidate score: {team.minCandidateScore}%
                      </div>
                    </div>

                    <Link
                      to={`/team/${team.id}/candidates?role=${encodeURIComponent(role)}`}
                      className="btn-secondary btn-sm"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      Find Candidate →
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Required Skills Chips */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                Required Skills
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {team.requiredSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#cbd5e1',
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
