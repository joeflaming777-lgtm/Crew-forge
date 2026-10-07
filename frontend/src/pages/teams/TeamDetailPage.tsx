import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Users,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Info,
  Sparkles,
  Layers,
  Award,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTeamById, user } = useAuth();
  const navigate = useNavigate();

  const team = getTeamById(id || '');

  if (!team) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Team not found.</h3>
        <Link to="/find-team" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to Find Teams
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === team.ownerId;
  const isMember = team.members.some((m) => m.userId === user?.id);

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Back navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/find-team')}
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
            <ChevronLeft size={16} /> Back to Find a Team
          </button>
        </div>

        {/* Team Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.9) 0%, rgba(13, 18, 32, 0.95) 100%)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              {team.hackathonName}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: team.status === 'Recruiting' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: team.status === 'Recruiting' ? '#34d399' : '#fbbf24',
                }}
              >
                {team.status === 'Recruiting' ? '● Currently Recruiting' : '● Squad Full'}
              </span>

              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {team.currentMemberCount} / {team.maxTeamSize} Members
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            {team.name}
          </h1>

          {/* Team Leader Contact / Credit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            {team.ownerAvatar ? (
              <img
                src={team.ownerAvatar}
                alt={team.ownerName}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {team.ownerName[0]}
              </div>
            )}
            <span style={{ fontSize: '0.925rem', color: '#cbd5e1' }}>
              Team Owner: <strong style={{ color: '#f8fafc' }}>{team.ownerName}</strong> ({team.ownerEmail})
            </span>
          </div>

          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '2rem' }}>
            {team.description}
          </p>

          {/* If the current viewer is the owner */}
          {isOwner && (
            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(45, 212, 191, 0.1)',
                border: '1px solid rgba(45, 212, 191, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.9rem', color: '#2dd4bf', fontWeight: 600 }}>
                You are the Team Owner of {team.name}.
              </span>
              <Link to={`/team/${team.id}`} className="btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)' }}>
                Open Team Management →
              </Link>
            </div>
          )}

          {isMember && !isOwner && (
            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                fontSize: '0.9rem',
                color: '#a5b4fc',
                fontWeight: 600,
              }}
            >
              You are an active Team Member of this squad! 🎉
            </div>
          )}
        </motion.div>

        {/* Requirements & Open Roles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Open Roles & Requirements */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
              Required Roles & Positions
            </h3>

            {team.openRoles && team.openRoles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                {team.openRoles.map((role, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.9rem' }}>{role}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                      Open
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>No open roles currently.</p>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Minimum Candidate Score:</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                {team.minCandidateScore}% overall skill score
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
              Required Tech Stack & Skills
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
              {(team.requiredSkills || []).map((sk, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {sk}
                </span>
              ))}
            </div>

            {team.optionalRequirements && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>Optional Requirements:</div>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{team.optionalRequirements}</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Squad Members */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
            Current Squad Members ({team.members.length} / {team.maxTeamSize})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {team.members.map((member) => (
              <div
                key={member.id}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.fullName}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
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
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                    {member.fullName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: member.isOwner ? '#2dd4bf' : '#38bdf8' }}>
                    {member.assignedRole}
                  </div>
                  {member.overallScore && (
                    <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                      Skill Score: {member.overallScore}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanatory Footer Banner */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto' }}>
            Interested in joining {team.name}? Ensure your student profile, GitHub analysis, and skill assessment are complete and set to <strong>Available</strong>. Team Owners discover and invite matching candidates directly.
          </p>
        </div>
      </div>
    </div>
  );
};
