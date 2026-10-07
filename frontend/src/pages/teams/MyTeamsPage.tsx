import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Layers,
  Compass,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const MyTeamsPage: React.FC = () => {
  const { user, myOwnedTeams, myMemberTeams, myAllTeams } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'owner' | 'member'>('all');

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

  const displayedTeams =
    activeTab === 'owner'
      ? myOwnedTeams
      : activeTab === 'member'
      ? myMemberTeams
      : myAllTeams;

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Users size={16} /> Team Membership Hub
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              My Hackathon Teams
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginTop: '4px' }}>
              One student profile across all hackathons. Own squads, contribute as a member, and manage multi-hackathon participation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/build-team" className="btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={16} /> Create Team
            </Link>
            <Link to="/find-team" className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={16} /> Find Teams
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: activeTab === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'all' ? '#f8fafc' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            All Teams ({myAllTeams.length})
          </button>
          <button
            onClick={() => setActiveTab('owner')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: activeTab === 'owner' ? 'rgba(45, 212, 191, 0.2)' : 'transparent',
              color: activeTab === 'owner' ? '#2dd4bf' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Teams You Own ({myOwnedTeams.length})
          </button>
          <button
            onClick={() => setActiveTab('member')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: activeTab === 'member' ? 'rgba(129, 140, 248, 0.2)' : 'transparent',
              color: activeTab === 'member' ? '#a5b4fc' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Teams You Joined ({myMemberTeams.length})
          </button>
        </div>

        {/* Teams List */}
        {displayedTeams.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Users size={48} color="#6366f1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.35rem', color: '#f8fafc', fontWeight: 700 }}>
              No teams in this view
            </h3>
            <p style={{ color: '#94a3b8', marginTop: '6px', maxWidth: '440px', margin: '6px auto 1.5rem' }}>
              {activeTab === 'owner'
                ? "You haven't created any teams yet. Create a team to recruit peers for an upcoming hackathon!"
                : activeTab === 'member'
                ? "You haven't joined other squads yet. Explore open teams or accept invitations in your inbox!"
                : "You haven't joined or created any hackathon teams yet."}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link to="/build-team" className="btn-primary btn-sm">
                Create a Team →
              </Link>
              <Link to="/find-team" className="btn-secondary btn-sm">
                Explore Open Teams →
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {displayedTeams.map((team) => {
              const isOwner = team.ownerId === user.id;
              const memberInfo = team.members.find((m) => m.userId === user.id);
              const assignedRole = memberInfo?.assignedRole || (isOwner ? 'Team Owner' : 'Member');

              return (
                <motion.div
                  key={team.id}
                  whileHover={{ y: -4 }}
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    borderRadius: '22px',
                    border: isOwner
                      ? '1px solid rgba(45, 212, 191, 0.3)'
                      : '1px solid rgba(99, 102, 241, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.85) 0%, rgba(13, 18, 32, 0.95) 100%)',
                  }}
                >
                  <div>
                    {/* Top Role Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          background: isOwner ? 'rgba(45, 212, 191, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: isOwner ? '#2dd4bf' : '#a5b4fc',
                          border: isOwner ? '1px solid rgba(45, 212, 191, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                        }}
                      >
                        {isOwner ? '★ Role: Team Owner' : `Role: Team Member (${assignedRole})`}
                      </span>

                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {team.currentMemberCount} / {team.maxTeamSize} Members
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                      {team.name}
                    </h3>

                    <div style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 600, marginBottom: '1rem' }}>
                      {team.hackathonName}
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                      {team.description}
                    </p>

                    {/* Squad Members */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Squad Members:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {team.members.map((m) => (
                          <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                            <span style={{ color: '#f8fafc', fontWeight: 500 }}>
                              {m.fullName} {m.userId === user.id && <span style={{ color: '#818cf8' }}>(You)</span>}
                            </span>
                            <span style={{ color: m.isOwner ? '#2dd4bf' : '#94a3b8' }}>
                              {m.assignedRole}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
                    {isOwner ? (
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
                        Manage Team as Owner <ArrowRight size={16} />
                      </Link>
                    ) : (
                      <Link
                        to={`/find-team/${team.id}`}
                        className="btn-secondary btn-sm"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        View Team Squad <ArrowRight size={16} />
                      </Link>
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
