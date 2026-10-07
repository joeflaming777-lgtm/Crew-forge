import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  X,
  Users,
  Target,
  Sliders,
  Award,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import confetti from 'canvas-confetti';

export const BuildTeamPage: React.FC = () => {
  const { createTeam, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [hackathonName, setHackathonName] = useState('Smart India Hackathon 2026');
  const [customHackathon, setCustomHackathon] = useState('');
  const [description, setDescription] = useState('');
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [minCandidateScore, setMinCandidateScore] = useState(75);
  const [optionalRequirements, setOptionalRequirements] = useState('');

  // Roles tags
  const [roles, setRoles] = useState<string[]>(['Frontend Developer', 'Backend Developer']);
  const [newRoleInput, setNewRoleInput] = useState('');

  // Skills tags
  const [skills, setSkills] = useState<string[]>(['React', 'Node.js', 'TypeScript']);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [loading, setLoading] = useState(false);

  const HACKATHON_PRESETS = [
    'Smart India Hackathon 2026',
    'HackMIT 2026',
    'ETHIndia 2026',
    'Campus Innovation Hackathon 2026',
    'TCS Enquode Hackathon 2026',
    'Other (Custom)',
  ];

  const ROLE_SUGGESTIONS = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'AI/ML Developer',
    'UI/UX Designer',
    'Mobile Developer',
    'DevOps Engineer',
    'Smart Contract Engineer',
    'Cybersecurity Analyst',
  ];

  const SKILL_SUGGESTIONS = [
    'React',
    'Python',
    'Node.js',
    'TypeScript',
    'PyTorch',
    'Docker',
    'Solidity',
    'Figma',
    'Go',
    'Flutter',
    'Next.js',
  ];

  const addRole = (role: string) => {
    if (role && !roles.includes(role)) {
      setRoles([...roles, role]);
      setNewRoleInput('');
    }
  };

  const removeRole = (role: string) => {
    setRoles(roles.filter((r) => r !== role));
  };

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a team name.');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a brief team description or project vision.');
      return;
    }
    if (roles.length === 0) {
      toast.error('Please specify at least one required role.');
      return;
    }

    try {
      setLoading(true);
      const effectiveHackathon = hackathonName === 'Other (Custom)' ? (customHackathon || 'Open Hackathon') : hackathonName;

      const newTeam = createTeam({
        name: name.trim(),
        hackathonName: effectiveHackathon,
        description: description.trim(),
        maxTeamSize: Number(maxTeamSize),
        requiredRoles: roles,
        requiredSkills: skills,
        optionalRequirements: optionalRequirements.trim(),
        minCandidateScore: Number(minCandidateScore),
      });

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(`Team "${newTeam.name}" created! You are now the Team Owner.`);
      navigate(`/team/${newTeam.id}`);
    } catch {
      toast.error('Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #06b6d4, #10b981)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
            }}
          >
            <Layers size={28} color="#fff" />
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Create a Hackathon Team
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginTop: '6px', maxWidth: '580px', margin: '6px auto 0' }}>
            Define your hackathon project, specify missing roles, and begin discovering and inviting verified teammates.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Team Name */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Team Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. NeuralPulse, ByteForce, CyberSentinels"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

              {/* Hackathon Selection */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Target Hackathon *
                </label>
                <select
                  value={hackathonName}
                  onChange={(e) => setHackathonName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: '#131b2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '0.925rem',
                  }}
                >
                  {HACKATHON_PRESETS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                {hackathonName === 'Other (Custom)' && (
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter Custom Hackathon Name"
                    value={customHackathon}
                    onChange={(e) => setCustomHackathon(e.target.value)}
                    style={{
                      width: '100%',
                      marginTop: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  />
                )}
              </div>

              {/* Team Description */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Project Vision & Description *
                </label>
                <textarea
                  className="input-field"
                  placeholder="Describe your hackathon problem statement, proposed solution, and what your squad is building..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

              {/* Maximum Team Size & Minimum Score */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                    Maximum Team Size (including you)
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
                      fontSize: '0.925rem',
                    }}
                  >
                    <option value={2}>2 Members</option>
                    <option value={3}>3 Members</option>
                    <option value={4}>4 Members (Standard)</option>
                    <option value={5}>5 Members</option>
                    <option value={6}>6 Members (SIH Standard)</option>
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                      Minimum Candidate Score
                    </label>
                    <span style={{ fontWeight: 800, color: '#2dd4bf', fontSize: '1rem' }}>
                      {minCandidateScore}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={95}
                    step={1}
                    value={minCandidateScore}
                    onChange={(e) => setMinCandidateScore(Number(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: '#06b6d4',
                      height: '8px',
                      marginTop: '0.75rem',
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Filters matching candidate discovery threshold.
                  </div>
                </div>
              </div>

              {/* Required Roles */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '6px' }}>
                  Required Roles (Positions to fill) *
                </label>
                
                {/* Active Roles Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.75rem' }}>
                  {roles.map((r) => (
                    <span
                      key={r}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        color: '#22d3ee',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      {r}
                      <button
                        type="button"
                        onClick={() => removeRole(r)}
                        style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Role Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Add custom role title (e.g. Computer Vision Specialist)..."
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRole(newRoleInput.trim());
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '0.85rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addRole(newRoleInput.trim())}
                    className="btn-secondary btn-sm"
                    style={{ padding: '8px 14px' }}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                {/* Role Suggestions Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ROLE_SUGGESTIONS.filter((s) => !roles.includes(s)).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addRole(s)}
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: '#94a3b8',
                      }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '6px' }}>
                  Required Skills & Tech Stack *
                </label>

                {/* Active Skills Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.75rem' }}>
                  {skills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#a5b4fc',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      {sk}
                      <button
                        type="button"
                        onClick={() => removeSkill(sk)}
                        style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Skill Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g. PyTorch, GraphQL, WebSockets)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(newSkillInput.trim());
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '0.85rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(newSkillInput.trim())}
                    className="btn-secondary btn-sm"
                    style={{ padding: '8px 14px' }}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                {/* Skill Suggestions Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: '#94a3b8',
                      }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Requirements */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Optional Requirements & Preferences
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Prefers candidates from 2nd/3rd year, available for weekend offline sprints, prior hackathon experience..."
                  value={optionalRequirements}
                  onChange={(e) => setOptionalRequirements(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.05rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #10b981 100%)',
                    boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
                  }}
                >
                  {loading ? 'Creating Squad...' : 'Create Team & Launch Squad'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
