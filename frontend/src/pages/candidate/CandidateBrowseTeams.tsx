import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Users, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../../components/common/Modal';

export const CandidateBrowseTeams: React.FC = () => {
  const toast = useToast();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [expressedInterest, setExpressedInterest] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTeams();
  }, [search]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/teams', { params: { search } });
      if (res.data.success) {
        setTeams(res.data.teams || []);
      }
    } catch {
      toast.error('Failed to load teams.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = (teamId: string, teamName: string) => {
    setExpressedInterest((prev) => ({ ...prev, [teamId]: true }));
    toast.success(`Interest expressed to ${teamName}! The Team Leader can now review your profile.`);
    setSelectedTeam(null);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Browse Hackathon Teams
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '4px' }}>
          Explore squads currently recruiting members. Candidates can express interest, but final membership is confirmed via Team Leader invitation.
        </p>
      </div>

      {/* Search Input Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search teams by name, description, or stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
          <Search
            size={18}
            color="#64748b"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
          Loading hackathon teams...
        </div>
      ) : teams.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '20px' }}>
          <Compass size={40} color="#6366f1" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>No teams found</h3>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid-cols-auto">
          {teams.map((team) => {
            const hasExpressed = expressedInterest[team.id];

            return (
              <motion.div
                key={team.id}
                whileHover={{ y: -4 }}
                className="glass-card glass-card-interactive"
                style={{
                  padding: '1.75rem',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="badge badge-primary">{team.hackathon?.name || 'SIH 2026'}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {team.currentMemberCount} / {team.maxTeamSize} Members
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
                    {team.name}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {team.description}
                  </p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Open Roles Needed:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                      {(team.openRoles && team.openRoles.length > 0 ? team.openRoles : ['All roles filled']).map((r: string) => (
                        <span key={r} className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    Leader: <strong style={{ color: '#cbd5e1' }}>{team.leader?.fullName}</strong> ({team.leader?.college})
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedTeam(team)}
                    className="btn-secondary"
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleExpressInterest(team.id, team.name)}
                    disabled={hasExpressed}
                    className="btn-primary"
                    style={{
                      fontSize: '0.85rem',
                      padding: '0.6rem 1rem',
                      background: hasExpressed ? 'rgba(16, 185, 129, 0.2)' : undefined,
                      borderColor: hasExpressed ? '#10b981' : undefined,
                    }}
                  >
                    {hasExpressed ? <><Check size={14} /> Interested</> : 'Express Interest'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* TEAM DETAILS MODAL */}
      {selectedTeam && (
        <Modal
          isOpen={Boolean(selectedTeam)}
          onClose={() => setSelectedTeam(null)}
          title={selectedTeam.name}
          subtitle={`${selectedTeam.hackathon?.name} • Led by ${selectedTeam.leader?.fullName}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span className="form-label">Team Mission / Description</span>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginTop: '4px' }}>
                {selectedTeam.description}
              </p>
            </div>

            <div>
              <span className="form-label">Required Roles & Quotas</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {selectedTeam.requirements?.map((req: any) => (
                  <div
                    key={req.id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                      {req.roleName}
                    </span>
                    <span className="badge badge-neutral">Required</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <div style={{ fontSize: '0.85rem', color: '#a5b4fc', lineHeight: 1.5 }}>
                💡 <strong>How Joining Works:</strong> In accordance with SkillSync governance, clicking "Express Interest" notifies the Team Leader. The Team Leader will review your verified quiz and GitHub evidence to issue an official invitation.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
              <button onClick={() => setSelectedTeam(null)} className="btn-secondary">
                Close
              </button>
              <button
                onClick={() => handleExpressInterest(selectedTeam.id, selectedTeam.name)}
                className="btn-primary"
              >
                Express Interest to Join
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
