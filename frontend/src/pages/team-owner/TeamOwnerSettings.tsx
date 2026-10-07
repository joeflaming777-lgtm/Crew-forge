import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings,
  ChevronLeft,
  Save,
  Trash2,
  Plus,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const TeamOwnerSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTeamById, user, updateTeam } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const team = getTeamById(id || '');

  const [name, setName] = useState(team?.name || '');
  const [description, setDescription] = useState(team?.description || '');
  const [maxTeamSize, setMaxTeamSize] = useState(team?.maxTeamSize || 4);
  const [minCandidateScore, setMinCandidateScore] = useState(team?.minCandidateScore || 75);
  const [openRoles, setOpenRoles] = useState<string[]>(team?.openRoles || []);
  const [newRole, setNewRole] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(team?.requiredSkills || []);
  const [newSkill, setNewSkill] = useState('');

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
  if (!isOwner) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Access Restricted: Team Owner Only</h3>
        <Link to={`/find-team/${team.id}`} className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          View Team Page
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Team name cannot be empty.');
      return;
    }

    updateTeam(team.id, {
      name: name.trim(),
      description: description.trim(),
      maxTeamSize: Number(maxTeamSize),
      minCandidateScore: Number(minCandidateScore),
      openRoles,
      requiredSkills,
    });

    toast.success('Team settings updated successfully!');
    navigate(`/team/${team.id}`);
  };

  const addRole = () => {
    if (newRole.trim() && !openRoles.includes(newRole.trim())) {
      setOpenRoles([...openRoles, newRole.trim()]);
      setNewRole('');
    }
  };

  const removeRole = (role: string) => {
    setOpenRoles(openRoles.filter((r) => r !== role));
  };

  const addSkill = () => {
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      setRequiredSkills([...requiredSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(`/team/${team.id}`)}
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
            <ChevronLeft size={16} /> Back to Team Overview
          </button>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Team Settings: {team.name}
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '4px' }}>
            Configure team information, candidate requirements, and open positions for {team.hackathonName}.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Team Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Description & Project Vision
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                    Maximum Team Size
                  </label>
                  <select
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: '#131b2e',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  >
                    <option value={2}>2 Members</option>
                    <option value={3}>3 Members</option>
                    <option value={4}>4 Members</option>
                    <option value={5}>5 Members</option>
                    <option value={6}>6 Members</option>
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                      Min Candidate Score
                    </label>
                    <span style={{ fontWeight: 800, color: '#2dd4bf' }}>{minCandidateScore}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={95}
                    value={minCandidateScore}
                    onChange={(e) => setMinCandidateScore(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#2dd4bf', marginTop: '0.75rem' }}
                  />
                </div>
              </div>

              {/* Open Roles to Recruit */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '6px' }}>
                  Open Positions
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.75rem' }}>
                  {openRoles.map((r) => (
                    <span
                      key={r}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'rgba(6,182,212,0.15)',
                        border: '1px solid rgba(6,182,212,0.3)',
                        color: '#22d3ee',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {r}
                      <button type="button" onClick={() => removeRole(r)} style={{ color: '#94a3b8' }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add open position..."
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  />
                  <button type="button" onClick={addRole} className="btn-secondary btn-sm">
                    <Plus size={16} /> Add Role
                  </button>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '6px' }}>
                  Required Skills
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.75rem' }}>
                  {requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'rgba(99,102,241,0.15)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        color: '#a5b4fc',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {sk}
                      <button type="button" onClick={() => removeSkill(sk)} style={{ color: '#94a3b8' }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  />
                  <button type="button" onClick={addSkill} className="btn-secondary btn-sm">
                    <Plus size={16} /> Add Skill
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                  }}
                >
                  <Save size={18} /> Save Team Settings
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
