import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  ChevronLeft,
  User as UserIcon,
  GraduationCap,
  BookOpen,
  Mail,
  Linkedin,
  Github,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const UserProfileEdit: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [college, setCollege] = useState(user?.college || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [year, setYear] = useState(user?.year || 3);
  const [gender, setGender] = useState(user?.gender || 'Prefer not to say');
  const [bio, setBio] = useState(user?.bio || '');
  const [availability, setAvailability] = useState<'Available' | 'Busy' | 'Committed'>(user?.availability || 'Available');
  const [githubUsername, setGithubUsername] = useState(user?.githubUsername || '');
  const [linkedIn, setLinkedIn] = useState(user?.linkedIn || '');
  const [hackathonExperience, setHackathonExperience] = useState(user?.hackathonExperience || '');

  // Skills
  const [skills, setSkills] = useState<{ id: string; name: string; category: string; proficiency?: string }[]>(
    user?.skills || []
  );
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate');

  // Preferred Roles
  const [roles, setRoles] = useState<{ id: string; name: string; isPrimary: boolean }[]>(
    user?.preferredRoles.map((r) => ({ id: r.id, name: r.name, isPrimary: r.isPrimary || false })) || []
  );
  const [newRoleName, setNewRoleName] = useState('');

  // Achievements
  const [achievements, setAchievements] = useState<string[]>(user?.achievements || []);
  const [newAchievement, setNewAchievement] = useState('');

  const addSkill = () => {
    if (newSkillName.trim()) {
      setSkills([
        ...skills,
        {
          id: 'sk-' + Date.now(),
          name: newSkillName.trim(),
          category: 'General',
          proficiency: newSkillProficiency,
        },
      ]);
      setNewSkillName('');
    }
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const addRole = () => {
    if (newRoleName.trim()) {
      setRoles([
        ...roles,
        {
          id: 'r-' + Date.now(),
          name: newRoleName.trim(),
          isPrimary: roles.length === 0,
        },
      ]);
      setNewRoleName('');
    }
  };

  const removeRole = (id: string) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  const setPrimaryRole = (id: string) => {
    setRoles(roles.map((r) => ({ ...r, isPrimary: r.id === id })));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (idx: number) => {
    setAchievements(achievements.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !college.trim()) {
      toast.error('Full Name and College are required.');
      return;
    }

    updateProfile({
      fullName: fullName.trim(),
      avatarUrl: avatarUrl.trim(),
      college: college.trim(),
      department: department.trim(),
      year: Number(year),
      gender,
      bio: bio.trim(),
      availability,
      githubUsername: githubUsername.trim(),
      linkedIn: linkedIn.trim(),
      hackathonExperience: hackathonExperience.trim(),
      skills,
      preferredRoles: roles.map((r) => ({ id: r.id, name: r.name, category: 'General', isPrimary: r.isPrimary })),
      achievements,
      verificationSteps: {
        ...(user?.verificationSteps || {
          profile: true,
          skills: true,
          roles: true,
          github: false,
          githubAnalysis: false,
          quiz: false,
          quizResult: false,
        }),
        profile: true,
        skills: skills.length >= 2,
        roles: roles.length >= 1,
        github: !!githubUsername.trim(),
      },
    });

    toast.success('Student profile updated successfully!');
    navigate('/profile');
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/profile')}
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
            <ChevronLeft size={16} /> Back to Profile View
          </button>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Edit Student Profile
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '4px' }}>
            Update your public credentials, skills, roles, and hackathon availability.
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                  />
                </div>
              </div>

              {/* College & Department */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem' }}>
                    College / University *
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: '#131b2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem' }}>
                    Availability Status
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: '#131b2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="Available">Available (Seeking squads)</option>
                    <option value="Busy">Busy (Not taking invites)</option>
                    <option value="Committed">Committed (Squad full)</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem' }}>
                  Bio & Tech Passion
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', color: '#fff', resize: 'vertical' }}
                />
              </div>

              {/* Social Links */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem' }}>
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. octocat"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem' }}>
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                  />
                </div>
              </div>

              {/* Preferred Roles */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '8px' }}>
                  Preferred Roles
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {roles.map((r) => (
                    <span
                      key={r.id}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: r.isPrimary ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: r.isPrimary ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                        color: r.isPrimary ? '#a5b4fc' : '#cbd5e1',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setPrimaryRole(r.id)}
                        title="Set as primary role"
                        style={{ color: r.isPrimary ? '#fbbf24' : '#64748b' }}
                      >
                        ★
                      </button>
                      <span>{r.name}</span>
                      <button type="button" onClick={() => removeRole(r.id)} style={{ color: '#94a3b8' }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add preferred role (e.g. AI/ML Developer)..."
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                  />
                  <button type="button" onClick={addRole} className="btn-secondary btn-sm">
                    <Plus size={16} /> Add Role
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '8px' }}>
                  Verified Skills
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#f8fafc',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {s.name} ({s.proficiency})
                      <button type="button" onClick={() => removeSkill(s.id)} style={{ color: '#94a3b8' }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Skill name (e.g. React, Python)..."
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    style={{ flex: 2, padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                  />
                  <select
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', background: '#131b2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button type="button" onClick={addSkill} className="btn-secondary btn-sm">
                    <Plus size={16} /> Add Skill
                  </button>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '8px' }}>
                  Achievements & Awards
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                  {achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem',
                        color: '#cbd5e1',
                      }}
                    >
                      <span>• {ach}</span>
                      <button type="button" onClick={() => removeAchievement(idx)} style={{ color: '#94a3b8' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add achievement (e.g. Finalist - Smart India Hackathon)..."
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: '#fff' }}
                  />
                  <button type="button" onClick={addAchievement} className="btn-secondary btn-sm">
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>

              {/* Submit */}
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
                  }}
                >
                  <Save size={18} /> Save Student Profile
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
