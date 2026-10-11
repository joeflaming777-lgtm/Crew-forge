import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Layers,
  Check,
  Search,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { apiClient } from '../../api/client';

const PLATFORM_ROLES = [
  { name: 'AI/ML Developer', category: 'AI & Data', description: 'Machine learning, deep learning, PyTorch, models' },
  { name: 'Frontend Developer', category: 'Engineering', description: 'React, Vue, modern UI/UX, animations, web apps' },
  { name: 'Backend Developer', category: 'Engineering', description: 'Node.js, APIs, microservices, databases' },
  { name: 'Full Stack Developer', category: 'Engineering', description: 'End-to-end development across frontend & backend' },
  { name: 'UI/UX Designer', category: 'Design', description: 'Wireframes, Figma, user journeys, design systems' },
  { name: 'Data Scientist', category: 'AI & Data', description: 'Data pipelines, analytics, feature engineering' },
  { name: 'Data Analyst', category: 'AI & Data', description: 'SQL analytics, dashboards, data visualization' },
  { name: 'IoT Developer', category: 'Hardware & IoT', description: 'Sensors, microcontrollers, edge devices' },
  { name: 'Cybersecurity', category: 'Security', description: 'Audits, network defense, penetration testing' },
  { name: 'Cloud Engineer', category: 'DevOps & Cloud', description: 'AWS, GCP, infrastructure, serverless' },
  { name: 'DevOps Engineer', category: 'DevOps & Cloud', description: 'Docker, Kubernetes, CI/CD, deployment' },
  { name: 'Mobile Developer', category: 'Engineering', description: 'React Native, Flutter, iOS, Android' },
  { name: 'Hardware Engineer', category: 'Hardware & IoT', description: 'Circuits, PCB design, embedded systems' },
  { name: 'Researcher', category: 'Research', description: 'Algorithm design, papers, academic review' },
];

const PLATFORM_SKILLS = [
  { name: 'Python', category: 'Programming' },
  { name: 'JavaScript', category: 'Programming' },
  { name: 'TypeScript', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'C++', category: 'Programming' },
  { name: 'C', category: 'Programming' },
  { name: 'Go', category: 'Programming' },
  { name: 'Rust', category: 'Programming' },
  { name: 'React', category: 'Web Development' },
  { name: 'Node.js', category: 'Web Development' },
  { name: 'Express', category: 'Web Development' },
  { name: 'Next.js', category: 'Web Development' },
  { name: 'HTML', category: 'Web Development' },
  { name: 'CSS', category: 'Web Development' },
  { name: 'Tailwind CSS', category: 'Web Development' },
  { name: 'Django', category: 'Web Development' },
  { name: 'Flask', category: 'Web Development' },
  { name: 'Machine Learning', category: 'AI / ML' },
  { name: 'Deep Learning', category: 'AI / ML' },
  { name: 'NLP', category: 'AI / ML' },
  { name: 'Computer Vision', category: 'AI / ML' },
  { name: 'PyTorch', category: 'AI / ML' },
  { name: 'TensorFlow', category: 'AI / ML' },
  { name: 'Generative AI', category: 'AI / ML' },
  { name: 'Data Science', category: 'Data' },
  { name: 'Data Analytics', category: 'Data' },
  { name: 'SQL', category: 'Data' },
  { name: 'PostgreSQL', category: 'Data' },
  { name: 'MongoDB', category: 'Data' },
  { name: 'Docker', category: 'DevOps & Cloud' },
  { name: 'Kubernetes', category: 'DevOps & Cloud' },
  { name: 'AWS', category: 'DevOps & Cloud' },
  { name: 'GCP', category: 'DevOps & Cloud' },
  { name: 'Git', category: 'Tools' },
  { name: 'Figma', category: 'Design' },
  { name: 'UI/UX Design', category: 'Design' },
];

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

  // Website Available Roles & Skills State
  const [availableRoles, setAvailableRoles] = useState<{ id?: string; name: string; category?: string; description?: string }[]>(PLATFORM_ROLES);
  const [availableSkills, setAvailableSkills] = useState<{ id?: string; name: string; category?: string }[]>(PLATFORM_SKILLS);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [roleCategoryFilter, setRoleCategoryFilter] = useState('All');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('All');
  const [roleSearchText, setRoleSearchText] = useState('');
  const [skillSearchText, setSkillSearchText] = useState('');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [rolesRes, skillsRes] = await Promise.all([
          apiClient.get('/admin/roles'),
          apiClient.get('/admin/skills'),
        ]);
        if (rolesRes.data?.success && Array.isArray(rolesRes.data.roles) && rolesRes.data.roles.length > 0) {
          const merged = [...rolesRes.data.roles];
          PLATFORM_ROLES.forEach((pr) => {
            if (!merged.some((r: any) => r.name.toLowerCase() === pr.name.toLowerCase())) {
              merged.push(pr);
            }
          });
          setAvailableRoles(merged);
        }
        if (skillsRes.data?.success && Array.isArray(skillsRes.data.skills) && skillsRes.data.skills.length > 0) {
          const merged = [...skillsRes.data.skills];
          PLATFORM_SKILLS.forEach((ps) => {
            if (!merged.some((s: any) => s.name.toLowerCase() === ps.name.toLowerCase())) {
              merged.push(ps);
            }
          });
          setAvailableSkills(merged);
        }
      } catch {
        // Fallback to PLATFORM_ROLES and PLATFORM_SKILLS
      }
    };
    fetchMetadata();
  }, []);

  const addSkill = (skillNameToAdd?: string, proficiencyToAdd?: string) => {
    const target = (skillNameToAdd || newSkillName).trim();
    const prof = proficiencyToAdd || newSkillProficiency;
    if (!target) {
      setShowSkillDropdown((prev) => !prev);
      return;
    }

    if (skills.some((s) => s.name.toLowerCase() === target.toLowerCase())) {
      toast.info(`"${target}" is already in your verified skills.`);
      setNewSkillName('');
      return;
    }

    const matched = availableSkills.find((s) => s.name.toLowerCase() === target.toLowerCase());
    setSkills([
      ...skills,
      {
        id: 'sk-' + Date.now(),
        name: matched?.name || target,
        category: matched?.category || 'General',
        proficiency: prof,
      },
    ]);
    setNewSkillName('');
    toast.success(`Added "${matched?.name || target}" (${prof}) to verified skills.`);
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const addRole = (roleNameToAdd?: string) => {
    const target = (roleNameToAdd || newRoleName).trim();
    if (!target) {
      setShowRoleDropdown((prev) => !prev);
      return;
    }

    if (roles.some((r) => r.name.toLowerCase() === target.toLowerCase())) {
      toast.info(`"${target}" is already in your preferred roles.`);
      setNewRoleName('');
      return;
    }

    const matched = availableRoles.find((r) => r.name.toLowerCase() === target.toLowerCase());
    setRoles([
      ...roles,
      {
        id: 'r-' + Date.now(),
        name: matched?.name || target,
        isPrimary: roles.length === 0,
      },
    ]);
    setNewRoleName('');
    toast.success(`Added "${matched?.name || target}" to preferred roles.`);
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem', margin: 0 }}>
                    Preferred Roles
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown((prev) => !prev)}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#a5b4fc',
                      background: showRoleDropdown ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      padding: '3px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Layers size={13} />
                    {showRoleDropdown ? 'Hide Website Roles' : `Explore Website Roles (${availableRoles.length})`}
                  </button>
                </div>

                {/* Selected Roles Badges */}
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
                  {roles.length === 0 && (
                    <span style={{ fontSize: '0.825rem', color: '#64748b', fontStyle: 'italic' }}>
                      No roles added yet. Pick from the website roles below or type a custom role.
                    </span>
                  )}
                </div>

                {/* Input + Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Add preferred role (e.g. AI/ML Developer)..."
                    value={newRoleName}
                    onChange={(e) => {
                      setNewRoleName(e.target.value);
                      if (e.target.value && !showRoleDropdown) setShowRoleDropdown(true);
                    }}
                    onFocus={() => setShowRoleDropdown(true)}
                    style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <button
                    type="button"
                    onClick={() => addRole()}
                    className="btn-secondary btn-sm"
                    title={newRoleName ? 'Add this role' : 'Click to show all roles available on the website'}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={16} /> Add Role
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown((prev) => !prev)}
                    className="btn-secondary btn-sm"
                    style={{
                      background: showRoleDropdown ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: showRoleDropdown ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: showRoleDropdown ? '#c7d2fe' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Layers size={14} /> {showRoleDropdown ? 'Close Roles' : 'Browse Roles'}
                  </button>
                </div>

                {/* Quick Add Role Suggestion Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} color="#a855f7" /> Suggestions:
                  </span>
                  {availableRoles
                    .filter((r) => !roles.some((ur) => ur.name.toLowerCase() === r.name.toLowerCase()))
                    .slice(0, 5)
                    .map((r) => (
                      <button
                        key={r.name}
                        type="button"
                        onClick={() => addRole(r.name)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#cbd5e1',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        + {r.name}
                      </button>
                    ))}
                </div>

                {/* Website Available Roles Interactive Dropdown Panel */}
                <AnimatePresence>
                  {showRoleDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -6, height: 0 }}
                      style={{
                        marginTop: '10px',
                        background: '#0f172a',
                        border: '1px solid rgba(99, 102, 241, 0.35)',
                        borderRadius: '14px',
                        padding: '14px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={14} color="#818cf8" />
                          Roles Available on Website ({availableRoles.length})
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowRoleDropdown(false)}
                          style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Category Filters & Search */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {['All', 'Engineering', 'AI & Data', 'Design', 'Security', 'DevOps & Cloud', 'Hardware & IoT'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setRoleCategoryFilter(cat)}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                background: roleCategoryFilter === cat ? '#6366f1' : 'rgba(255,255,255,0.05)',
                                color: roleCategoryFilter === cat ? '#fff' : '#94a3b8',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <div style={{ position: 'relative', flex: 1, minWidth: '140px' }}>
                          <input
                            type="text"
                            placeholder="Filter roles..."
                            value={roleSearchText}
                            onChange={(e) => setRoleSearchText(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px 8px 4px 26px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#fff',
                              fontSize: '0.75rem',
                            }}
                          />
                          <Search size={12} color="#64748b" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                        </div>
                      </div>

                      {/* Roles Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                          gap: '8px',
                          maxHeight: '220px',
                          overflowY: 'auto',
                          paddingRight: '4px',
                        }}
                      >
                        {availableRoles
                          .filter((r) => {
                            const matchCat = roleCategoryFilter === 'All' || r.category?.toLowerCase() === roleCategoryFilter.toLowerCase();
                            const matchSearch = !roleSearchText.trim() || r.name.toLowerCase().includes(roleSearchText.toLowerCase()) || r.category?.toLowerCase().includes(roleSearchText.toLowerCase());
                            return matchCat && matchSearch;
                          })
                          .map((r) => {
                            const isAdded = roles.some((ur) => ur.name.toLowerCase() === r.name.toLowerCase());
                            return (
                              <div
                                key={r.name}
                                onClick={() => !isAdded && addRole(r.name)}
                                style={{
                                  padding: '8px 10px',
                                  borderRadius: '8px',
                                  background: isAdded ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                                  border: isAdded ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: isAdded ? 'default' : 'pointer',
                                  transition: 'background 0.15s',
                                }}
                              >
                                <div>
                                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: isAdded ? '#a5b4fc' : '#f1f5f9' }}>
                                    {r.name}
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                    {r.category || 'Platform Track'}
                                  </div>
                                </div>
                                <div>
                                  {isAdded ? (
                                    <span style={{ fontSize: '0.725rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <Check size={13} /> Added
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '0.725rem', color: '#818cf8', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(99,102,241,0.15)' }}>
                                      + Add
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Skills */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.875rem', margin: 0 }}>
                    Verified Skills
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSkillDropdown((prev) => !prev)}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#a5b4fc',
                      background: showSkillDropdown ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      padding: '3px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Layers size={13} />
                    {showSkillDropdown ? 'Hide Website Skills' : `Explore Website Skills (${availableSkills.length})`}
                  </button>
                </div>

                {/* Selected Skills Badges */}
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
                  {skills.length === 0 && (
                    <span style={{ fontSize: '0.825rem', color: '#64748b', fontStyle: 'italic' }}>
                      No skills added yet. Select from website skills below or enter custom skills.
                    </span>
                  )}
                </div>

                {/* Input + Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Skill name (e.g. React, Python)..."
                    value={newSkillName}
                    onChange={(e) => {
                      setNewSkillName(e.target.value);
                      if (e.target.value && !showSkillDropdown) setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    style={{ flex: 2, minWidth: '180px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <select
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(e.target.value)}
                    style={{ flex: 1, minWidth: '120px', padding: '8px 12px', borderRadius: '10px', background: '#131b2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => addSkill()}
                    className="btn-secondary btn-sm"
                    title={newSkillName ? 'Add this skill' : 'Click to show all skills available on the website'}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={16} /> Add Skill
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSkillDropdown((prev) => !prev)}
                    className="btn-secondary btn-sm"
                    style={{
                      background: showSkillDropdown ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: showSkillDropdown ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: showSkillDropdown ? '#c7d2fe' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Layers size={14} /> {showSkillDropdown ? 'Close Skills' : 'Browse Skills'}
                  </button>
                </div>

                {/* Quick Add Skill Suggestion Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} color="#a855f7" /> Popular:
                  </span>
                  {availableSkills
                    .filter((s) => !skills.some((us) => us.name.toLowerCase() === s.name.toLowerCase()))
                    .slice(0, 7)
                    .map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => addSkill(s.name)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#cbd5e1',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        + {s.name}
                      </button>
                    ))}
                </div>

                {/* Website Available Skills Interactive Dropdown Panel */}
                <AnimatePresence>
                  {showSkillDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -6, height: 0 }}
                      style={{
                        marginTop: '10px',
                        background: '#0f172a',
                        border: '1px solid rgba(99, 102, 241, 0.35)',
                        borderRadius: '14px',
                        padding: '14px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={14} color="#818cf8" />
                          Skills Available on Website ({availableSkills.length}) — Click to add as {newSkillProficiency}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowSkillDropdown(false)}
                          style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Category Filters & Search */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {['All', 'Programming', 'Web Development', 'AI / ML', 'Data', 'DevOps & Cloud', 'Design'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSkillCategoryFilter(cat)}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                background: skillCategoryFilter === cat ? '#6366f1' : 'rgba(255,255,255,0.05)',
                                color: skillCategoryFilter === cat ? '#fff' : '#94a3b8',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <div style={{ position: 'relative', flex: 1, minWidth: '140px' }}>
                          <input
                            type="text"
                            placeholder="Filter skills..."
                            value={skillSearchText}
                            onChange={(e) => setSkillSearchText(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px 8px 4px 26px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#fff',
                              fontSize: '0.75rem',
                            }}
                          />
                          <Search size={12} color="#64748b" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                        </div>
                      </div>

                      {/* Skills Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                          gap: '8px',
                          maxHeight: '220px',
                          overflowY: 'auto',
                          paddingRight: '4px',
                        }}
                      >
                        {availableSkills
                          .filter((s) => {
                            const matchCat = skillCategoryFilter === 'All' || s.category?.toLowerCase() === skillCategoryFilter.toLowerCase();
                            const matchSearch = !skillSearchText.trim() || s.name.toLowerCase().includes(skillSearchText.toLowerCase()) || s.category?.toLowerCase().includes(skillSearchText.toLowerCase());
                            return matchCat && matchSearch;
                          })
                          .map((s) => {
                            const isAdded = skills.some((us) => us.name.toLowerCase() === s.name.toLowerCase());
                            return (
                              <div
                                key={s.name}
                                onClick={() => !isAdded && addSkill(s.name, newSkillProficiency)}
                                style={{
                                  padding: '8px 10px',
                                  borderRadius: '8px',
                                  background: isAdded ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                                  border: isAdded ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: isAdded ? 'default' : 'pointer',
                                  transition: 'background 0.15s',
                                }}
                              >
                                <div>
                                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: isAdded ? '#a5b4fc' : '#f1f5f9' }}>
                                    {s.name}
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                    {s.category || 'Skill'}
                                  </div>
                                </div>
                                <div>
                                  {isAdded ? (
                                    <span style={{ fontSize: '0.725rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <Check size={13} /> Added
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '0.725rem', color: '#818cf8', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(99,102,241,0.15)' }}>
                                      + Add
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
