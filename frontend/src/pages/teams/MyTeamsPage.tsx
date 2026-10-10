import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Layers,
  Compass,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Crown,
  UserCheck,
  LogOut,
  AlertTriangle,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../../components/common/Modal';

export const MyTeamsPage: React.FC = () => {
  const { user, myOwnedTeams, myMemberTeams, leaveTeam } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [teamToLeave, setTeamToLeave] = useState<{ id: string; name: string } | null>(null);

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Please sign in to view your teams.</h3>
        <Link to="/login" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Go to Login
        </Link>
      </div>
    );
  }

  const handleConfirmLeave = () => {
    if (!teamToLeave) return;
    leaveTeam(teamToLeave.id);
    toast.success(`You have left ${teamToLeave.name}.`);
    setTeamToLeave(null);
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '1160px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Users size={16} /> My Teams Hub
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              My Teams
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginTop: '4px' }}>
              One SkillSync account. Seamlessly manage squads you created alongside teams you've joined across hackathons.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/build-team" className="btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={16} /> Create a Team
            </Link>
            <Link to="/find-team" className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={16} /> Explore Teams
            </Link>
          </div>
        </div>

        {/* ================= SECTION 1: TEAMS I OWN ================= */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={18} color="#2dd4bf" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                TEAMS I OWN
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: 'rgba(45, 212, 191, 0.15)',
                  color: '#2dd4bf',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                }}
              >
                {myOwnedTeams.length} {myOwnedTeams.length === 1 ? 'Team' : 'Teams'}
              </span>
            </div>

            <Link to="/build-team" style={{ fontSize: '0.85rem', color: '#2dd4bf', fontWeight: 600 }}>
              + Create Another Team
            </Link>
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
              <Crown size={40} color="#64748b" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700 }}>
                You haven't created any teams yet.
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px', maxWidth: '440px', margin: '4px auto 1.5rem' }}>
                Start a hackathon squad, define your required tech stack, and select candidates to invite.
              </p>
              <Link to="/build-team" className="btn-primary btn-sm">
                Create a Team →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {myOwnedTeams.map((team) => {
                const isFull = team.currentMemberCount >= team.maxTeamSize;

                return (
                  <motion.div
                    key={team.id}
                    whileHover={{ y: -4 }}
                    className="glass-card"
                    style={{
                      padding: '2rem',
                      borderRadius: '22px',
                      border: '1px solid rgba(45, 212, 191, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.9) 0%, rgba(13, 18, 32, 0.95) 100%)',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
                    }}
                  >
                    <div>
                      {/* Top Meta Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            background: 'rgba(45, 212, 191, 0.15)',
                            color: '#2dd4bf',
                            border: '1px solid rgba(45, 212, 191, 0.3)',
                          }}
                        >
                          Role: Team Owner
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: team.status === 'Recruiting' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: team.status === 'Recruiting' ? '#34d399' : '#fbbf24',
                            }}
                          >
                            Status: {team.status}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            {team.currentMemberCount} / {team.maxTeamSize} Members
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                        {team.name}
                      </h3>

                      <div style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.75rem' }}>
                        {team.hackathonName}
                      </div>

                      <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {team.description}
                      </p>

                      {/* Open Roles & Member Count */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Capacity & Positions:
                        </div>
                        <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                          {isFull ? (
                            <span style={{ color: '#10b981', fontWeight: 600 }}>All {team.maxTeamSize} positions filled</span>
                          ) : (
                            <span>
                              <strong style={{ color: '#f8fafc' }}>{team.openRoles.length}</strong> open role{team.openRoles.length !== 1 ? 's' : ''} remaining ({team.openRoles.join(', ')})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Available Team Actions */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Link
                        to={`/team/${team.id}`}
                        className="btn-primary btn-sm"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                        }}
                      >
                        Manage Team & Review Requests <ArrowRight size={15} />
                      </Link>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <Link
                          to={`/team/${team.id}/candidates`}
                          className="btn-secondary btn-sm"
                          style={{
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                          }}
                        >
                          <UserCheck size={14} /> Find Candidates
                        </Link>
                        <Link
                          to={`/team/${team.id}/settings`}
                          className="btn-secondary btn-sm"
                          style={{
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                          }}
                        >
                          <Settings size={14} /> Settings
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= SECTION 2: TEAMS I'VE JOINED ================= */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} color="#818cf8" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                TEAMS I'VE JOINED
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
              >
                {myMemberTeams.length} {myMemberTeams.length === 1 ? 'Team' : 'Teams'}
              </span>
            </div>

            <Link to="/find-team" style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600 }}>
              + Explore Open Teams
            </Link>
          </div>

          {myMemberTeams.length === 0 ? (
            <div
              className="glass-card"
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Users size={40} color="#64748b" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700 }}>
                You haven't joined any other teams yet.
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px', maxWidth: '440px', margin: '4px auto 1.5rem' }}>
                Browse teams recruiting your skills or accept pending invitations in your dashboard.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <Link to="/find-team" className="btn-primary btn-sm">
                  Find a Team →
                </Link>
                <Link to="/invitations" className="btn-secondary btn-sm">
                  View Invitations →
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {myMemberTeams.map((team) => {
                const memberRecord = team.members.find((m) => m.userId === user.id);
                const assignedRole = memberRecord?.assignedRole || 'Team Member';

                return (
                  <motion.div
                    key={team.id}
                    whileHover={{ y: -4 }}
                    className="glass-card"
                    style={{
                      padding: '2rem',
                      borderRadius: '22px',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.9) 0%, rgba(13, 18, 32, 0.95) 100%)',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
                    }}
                  >
                    <div>
                      {/* Top Meta Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#a5b4fc',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                          }}
                        >
                          Role: {assignedRole}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: team.status === 'Recruiting' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: team.status === 'Recruiting' ? '#34d399' : '#fbbf24',
                            }}
                          >
                            Status: {team.status}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            {team.currentMemberCount} / {team.maxTeamSize} Members
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                        {team.name}
                      </h3>

                      <div style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {team.hackathonName}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                        Created by <strong>{team.ownerName}</strong>
                      </div>

                      <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {team.description}
                      </p>

                      {/* Squad Members preview */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Squad Teammates ({team.members.length}):
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {team.members.map((m) => (
                            <span
                              key={m.id}
                              style={{
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: m.userId === user.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                color: m.userId === user.id ? '#a5b4fc' : '#cbd5e1',
                                border: m.userId === user.id ? '1px solid rgba(99, 102, 241, 0.3)' : 'none',
                              }}
                            >
                              {m.fullName} {m.userId === user.id ? '(You)' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Available Team Actions */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <Link
                        to={`/find-team/${team.id}`}
                        className="btn-secondary btn-sm"
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        View Squad Details <ArrowRight size={15} />
                      </Link>

                      <button
                        onClick={() => setTeamToLeave({ id: team.id, name: team.name })}
                        className="btn-secondary btn-sm"
                        style={{
                          color: '#f43f5e',
                          border: '1px solid rgba(244, 63, 94, 0.25)',
                          background: 'rgba(244, 63, 94, 0.08)',
                          fontSize: '0.8rem',
                          padding: '6px 12px',
                        }}
                      >
                        Leave
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirmation Modal for Leaving Team */}
        {teamToLeave && (
          <Modal
            isOpen={!!teamToLeave}
            onClose={() => setTeamToLeave(null)}
            title={`Leave Team "${teamToLeave.name}"?`}
            maxWidth="480px"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Are you sure you want to leave <strong>{teamToLeave.name}</strong>? Your position will be released back to the team's open roles for other candidates to apply.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setTeamToLeave(null)}
                  className="btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLeave}
                  className="btn-primary btn-sm"
                  style={{ background: '#e11d48' }}
                >
                  Confirm Leave
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
