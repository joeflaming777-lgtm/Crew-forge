import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Code2,
  Briefcase,
  Trophy,
  Github,
  Sparkles,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Star,
  GitFork,
  Globe,
  Activity,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ScoreRing } from '../../components/common/ScoreRing';

export const CandidateOnboarding: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Available skills & roles from backend or standard defaults
  const [availableSkills, setAvailableSkills] = useState<{ id: string; name: string; category: string }[]>([]);
  const [availableRoles, setAvailableRoles] = useState<{ id: string; name: string; category: string }[]>([]);

  // Step 1: Personal (prefilled from user profile)
  const [personal, setPersonal] = useState({
    college: user?.candidateProfile?.college || 'IIT Bombay',
    department: user?.candidateProfile?.department || 'Computer Science and Engineering',
    year: user?.candidateProfile?.year || 3,
    phone: user?.candidateProfile?.phone || '',
    gender: user?.candidateProfile?.gender || 'Prefer not to say',
    bio: user?.candidateProfile?.bio || '',
  });

  // Step 2: Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'React', 'JavaScript']);

  // Step 3: Preferred Roles
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['AI/ML Developer', 'Full Stack Developer']);

  // Step 4: Experience
  const [experience, setExperience] = useState({
    hackathonsCount: 2,
    projects: 'Built an autonomous drone mapping platform and collaborative code reviewer.',
    achievements: 'Finalist at National Student Hackathon 2025; Google Developer Student Club Lead.',
    certifications: 'AWS Certified Cloud Practitioner; DeepLearning.AI Specialization',
    availability: 'Available',
  });

  // Step 5: GitHub
  const [githubUser, setGithubUser] = useState<string>('');
  const [analyzingGithub, setAnalyzingGithub] = useState<boolean>(false);
  const [githubResult, setGithubResult] = useState<any>(null);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [skillsRes, rolesRes] = await Promise.all([
        apiClient.get('/admin/skills'),
        apiClient.get('/admin/roles'),
      ]);
      if (skillsRes.data.success) setAvailableSkills(skillsRes.data.skills);
      if (rolesRes.data.success) setAvailableRoles(rolesRes.data.roles);
    } catch {
      // fallback
    }
  };

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const toggleRole = (roleName: string) => {
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== roleName));
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
  };

  const handleAnalyzeGithub = async () => {
    if (!githubUser.trim()) {
      toast.error('Please enter your public GitHub username.');
      return;
    }

    try {
      setAnalyzingGithub(true);
      const res = await apiClient.post('/github/analyze', { username: githubUser.trim() });
      if (res.data.success) {
        setGithubResult(res.data.analysis);
        toast.success(`GitHub analyzed! Technical Score: ${res.data.analysis.score}/100`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not analyze GitHub. Check username.');
    } finally {
      setAnalyzingGithub(false);
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);

      // Save step 1
      if (currentStep === 1) {
        await apiClient.put('/candidate/profile', personal);
        setCurrentStep(2);
      }
      // Save step 2
      else if (currentStep === 2) {
        if (selectedSkills.length === 0) {
          toast.error('Please select at least 1 skill.');
          return;
        }
        await apiClient.put('/candidate/skills', { skillIds: selectedSkills });
        setCurrentStep(3);
      }
      // Save step 3
      else if (currentStep === 3) {
        if (selectedRoles.length === 0) {
          toast.error('Please select at least 1 preferred role.');
          return;
        }
        await apiClient.put('/candidate/roles', { roleIds: selectedRoles });
        setCurrentStep(4);
      }
      // Save step 4
      else if (currentStep === 4) {
        await apiClient.put('/candidate/profile', experience);
        setCurrentStep(5);
      }
      // Save step 5 & complete onboarding
      else if (currentStep === 5) {
        if (!githubResult) {
          toast.error('Mandatory: Please click "Analyze GitHub" before completing.');
          return;
        }
        await apiClient.post('/candidate/complete-onboarding');
        await refreshUser();
        toast.success('Onboarding complete! Now take your skill assessment.');
        navigate('/candidate/quiz');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not save step.');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Personal', icon: <Briefcase size={16} /> },
    { num: 2, title: 'Skills', icon: <Code2 size={16} /> },
    { num: 3, title: 'Roles', icon: <Briefcase size={16} /> },
    { num: 4, title: 'Experience', icon: <Trophy size={16} /> },
    { num: 5, title: 'GitHub', icon: <Github size={16} /> },
  ];

  // Group skills by category
  const categories = ['Programming', 'Web Development', 'AI / ML', 'Data', 'Other'];

  return (
    <div className="container" style={{ maxWidth: '860px', padding: '3rem 1.5rem' }}>
      {/* Step Progress Tracker */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {stepsList.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: s.num < currentStep ? 'pointer' : 'default',
                }}
                onClick={() => s.num < currentStep && setCurrentStep(s.num)}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background:
                      s.num === currentStep
                        ? 'linear-gradient(135deg, #6366f1, #06b6d4)'
                        : s.num < currentStep
                        ? '#10b981'
                        : 'rgba(255, 255, 255, 0.07)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border:
                      s.num === currentStep
                        ? '2px solid rgba(255,255,255,0.4)'
                        : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {s.num < currentStep ? <Check size={18} /> : s.num}
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: s.num === currentStep ? '#f8fafc' : '#94a3b8',
                  }}
                >
                  {s.title}
                </span>
              </div>
              {idx < stepsList.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    margin: '0 8px',
                    background:
                      s.num < currentStep ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Card Container */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          borderRadius: '24px',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <AnimatePresence mode="wait">
          {/* STEP 1: PERSONAL INFORMATION */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Step 1: Personal & Academic Profile
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '2rem' }}>
                Verify your university background so Team Leaders can match according to college and department criteria.
              </p>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">College / University</label>
                  <input
                    type="text"
                    className="input-field"
                    value={personal.college}
                    onChange={(e) => setPersonal({ ...personal, college: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department / Branch</label>
                  <input
                    type="text"
                    className="input-field"
                    value={personal.department}
                    onChange={(e) => setPersonal({ ...personal, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <select
                    className="input-field"
                    value={personal.year}
                    onChange={(e) => setPersonal({ ...personal, year: Number(e.target.value) })}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gender (Optional)</label>
                  <select
                    className="input-field"
                    value={personal.gender}
                    onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                  >
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Bio</label>
                <textarea
                  className="input-field"
                  placeholder="Introduce yourself and your technical passion..."
                  value={personal.bio}
                  onChange={(e) => setPersonal({ ...personal, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: SKILLS */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Step 2: Technical Skills
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
                Select all technologies you are proficient in. Your personalized assessment will focus on these topics.
              </p>

              {categories.map((cat) => {
                const skillsInCat = availableSkills.filter((s) => s.category === cat);
                if (skillsInCat.length === 0) return null;

                return (
                  <div key={cat} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.6rem' }}>
                      {cat}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {skillsInCat.map((s) => {
                        const isSelected = selectedSkills.includes(s.name);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleSkill(s.name)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '9999px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                              border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                              color: isSelected ? '#a5b4fc' : '#94a3b8',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {isSelected && <Check size={14} color="#818cf8" />}
                            {s.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* STEP 3: PREFERRED ROLES */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Step 3: Preferred Hackathon Roles
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '2rem' }}>
                Select the roles you wish to fulfill on a hackathon team. The first selected role will be your primary track.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '12px',
                }}
              >
                {availableRoles.map((r) => {
                  const isSelected = selectedRoles.includes(r.name);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleRole(r.name)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        textAlign: 'left',
                        background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.925rem', color: isSelected ? '#fff' : '#cbd5e1' }}>
                          {r.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.category}</div>
                      </div>
                      {isSelected && <Check size={18} color="#6366f1" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: EXPERIENCE */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Step 4: Hackathon Experience & Projects
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '2rem' }}>
                Team Leaders value previous hackathon attendance and concrete past projects.
              </p>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Number of Hackathons Attended</label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    className="input-field"
                    value={experience.hackathonsCount}
                    onChange={(e) => setExperience({ ...experience, hackathonsCount: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Availability Status</label>
                  <select
                    className="input-field"
                    value={experience.availability}
                    onChange={(e) => setExperience({ ...experience, availability: e.target.value })}
                  >
                    <option value="Available">Available (Ready to join)</option>
                    <option value="Busy">Busy (Limited hours)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Key Projects</label>
                <textarea
                  className="input-field"
                  placeholder="Detail 1-2 projects you have built..."
                  value={experience.projects}
                  onChange={(e) => setExperience({ ...experience, projects: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Achievements & Awards</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Hackathon wins, coding contest ranks, merit awards..."
                  value={experience.achievements}
                  onChange={(e) => setExperience({ ...experience, achievements: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Certifications</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="AWS, DeepLearning.AI, Coursera, etc..."
                  value={experience.certifications}
                  onChange={(e) => setExperience({ ...experience, certifications: e.target.value })}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 5: MANDATORY GITHUB ANALYSIS */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Step 5: Mandatory GitHub Verification
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '2rem' }}>
                SkillSync computes explainable technical scores from your public GitHub activity. A valid GitHub username is required.
              </p>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">GitHub Username *</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. torvalds or your username"
                      value={githubUser}
                      onChange={(e) => setGithubUser(e.target.value)}
                      style={{ paddingLeft: '2.75rem' }}
                    />
                    <Github
                      size={18}
                      color="#64748b"
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAnalyzeGithub}
                    disabled={analyzingGithub || !githubUser.trim()}
                    className="btn-primary"
                    style={{ whiteSpace: 'nowrap', padding: '0 1.5rem' }}
                  >
                    {analyzingGithub ? 'Analyzing...' : 'Analyze GitHub'} <Sparkles size={16} />
                  </button>
                </div>
              </div>

              {/* GitHub Analysis Result Card */}
              {githubResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    borderRadius: '20px',
                    padding: '1.75rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.36)',
                  }}
                >
                  {/* Top Bar: Profile & Score */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      paddingBottom: '1.25rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {githubResult.avatarUrl ? (
                        <img
                          src={githubResult.avatarUrl}
                          alt={githubResult.username}
                          style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #818cf8' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #818cf8',
                          }}
                        >
                          <Github size={26} color="#818cf8" />
                        </div>
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#f8fafc' }}>
                            @{githubResult.username}
                          </span>
                          <a
                            href={githubResult.profileUrl || `https://github.com/${githubResult.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                            title="View GitHub Profile"
                          >
                            <ExternalLink size={14} />
                          </a>
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                            ✓ Verified Public GitHub
                          </span>
                          {githubResult.archetype && (
                            <span
                              className="badge"
                              style={{
                                background: 'rgba(99, 102, 241, 0.25)',
                                color: '#a5b4fc',
                                border: '1px solid rgba(99, 102, 241, 0.4)',
                                fontWeight: 700,
                              }}
                            >
                              {githubResult.archetype}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                          Technical evaluation synthesized from public repositories, events, and code evidence.
                        </p>
                      </div>
                    </div>

                    <ScoreRing score={githubResult.score} size={84} label="GitHub Score" />
                  </div>

                  {/* Executive Summary */}
                  {githubResult.summary && (
                    <div
                      style={{
                        margin: '1.25rem 0',
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        background: 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        color: '#cbd5e1',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                      }}
                    >
                      <strong style={{ color: '#a5b4fc' }}>Executive Technical Summary: </strong>
                      {githubResult.summary}
                    </div>
                  )}

                  {/* 4-Pillar Score Breakdown */}
                  {githubResult.breakdown && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '10px' }}>
                        Explainable 4-Pillar Score Breakdown
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                            <span style={{ color: '#cbd5e1' }}>Repo Substance</span>
                            <strong style={{ color: '#818cf8' }}>{githubResult.breakdown.repoBreadthScore}/25</strong>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${(githubResult.breakdown.repoBreadthScore / 25) * 100}%`, height: '100%', background: '#818cf8', borderRadius: '3px' }} />
                          </div>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                            <span style={{ color: '#cbd5e1' }}>Stack & Languages</span>
                            <strong style={{ color: '#38bdf8' }}>{githubResult.breakdown.languageMasteryScore}/25</strong>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${(githubResult.breakdown.languageMasteryScore / 25) * 100}%`, height: '100%', background: '#38bdf8', borderRadius: '3px' }} />
                          </div>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                            <span style={{ color: '#cbd5e1' }}>Commit Velocity</span>
                            <strong style={{ color: '#10b981' }}>{githubResult.breakdown.activityScore}/25</strong>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${(githubResult.breakdown.activityScore / 25) * 100}%`, height: '100%', background: '#10b981', borderRadius: '3px' }} />
                          </div>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                            <span style={{ color: '#cbd5e1' }}>Rigor & Live Demos</span>
                            <strong style={{ color: '#f59e0b' }}>{githubResult.breakdown.documentationScore}/25</strong>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${(githubResult.breakdown.documentationScore / 25) * 100}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4 Core Metrics Cards */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '10px',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                        {githubResult.metrics?.originalRepos ?? githubResult.publicRepos}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Original Repos</div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                        {githubResult.metrics?.recentPushes90d ?? (githubResult.recentActivityLevel === 'High' ? '10+' : 'Active')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recent Pushes (90d)</div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                        {githubResult.metrics?.deployedProjectsCount ?? 0}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Live Deployed Apps</div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
                        {githubResult.metrics?.originalStars ?? githubResult.totalStars}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Original Stars</div>
                    </div>
                  </div>

                  {/* Showcase Repositories */}
                  {githubResult.showcaseRepos && githubResult.showcaseRepos.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '10px' }}>
                        Top Showcase Repositories
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                        {githubResult.showcaseRepos.map((repo: any) => (
                          <div
                            key={repo.name}
                            style={{
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.07)',
                              borderRadius: '12px',
                              padding: '12px 14px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <a
                                href={repo.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem', textDecoration: 'none' }}
                              >
                                {repo.name}
                              </a>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: '#94a3b8' }}>
                                {repo.stars > 0 && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#fbbf24' }}>
                                    <Star size={12} fill="#fbbf24" /> {repo.stars}
                                  </span>
                                )}
                                {repo.language && (
                                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                                    {repo.language}
                                  </span>
                                )}
                              </div>
                            </div>
                            {repo.description && (
                              <p style={{ margin: '4px 0 8px', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                                {repo.description.length > 80 ? repo.description.slice(0, 80) + '...' : repo.description}
                              </p>
                            )}
                            {repo.liveUrl && (
                              <a
                                href={repo.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.72rem',
                                  color: '#38bdf8',
                                  textDecoration: 'none',
                                }}
                              >
                                <Globe size={12} /> Live Demonstration →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights & Growth Areas */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '12px',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {/* Highlights */}
                    {githubResult.highlights && githubResult.highlights.length > 0 && (
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.05)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
                          <CheckCircle2 size={15} /> Verified Strengths
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                          {githubResult.highlights.map((h: string, i: number) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Growth Areas */}
                    {githubResult.growthAreas && githubResult.growthAreas.length > 0 && (
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.05)',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>
                          <AlertCircle size={15} /> Growth Opportunities
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                          {githubResult.growthAreas.map((g: string, i: number) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Languages & Frameworks Chips */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>Detected Languages & Technologies:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {githubResult.topLanguages?.map((l: any) => (
                        <span key={l.name} className="badge badge-primary" style={{ fontSize: '0.725rem' }}>
                          {l.name} ({l.percentage}%)
                        </span>
                      ))}
                      {githubResult.detectedFrameworks?.map((f: string) => (
                        <span key={f} className="badge badge-neutral" style={{ fontSize: '0.725rem' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {!githubResult && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    color: '#fcd34d',
                    fontSize: '0.85rem',
                  }}
                >
                  <AlertCircle size={18} />
                  <span>You cannot finish onboarding without running GitHub verification.</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Navigation Controls */}
        <div
          style={{
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn-secondary"
            >
              <ChevronLeft size={18} /> Previous
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            {loading ? (
              'Saving...'
            ) : currentStep === 5 ? (
              <>Complete & Start Quiz <ArrowRight size={18} /></>
            ) : (
              <>Save & Next <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
