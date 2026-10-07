import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  GraduationCap,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  Github,
  BookOpen,
  Briefcase,
  ExternalLink,
  Edit3,
  CheckCircle,
  Clock,
  Compass,
  Layers,
  Linkedin,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ScoreRing } from '../../components/common/ScoreRing';

export const UserProfileView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Please sign in to view your profile.</h3>
        <Link to="/login" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Go to Login
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'profile', label: 'Basic Info', completed: !!(user.fullName && user.college), link: '/profile/edit' },
    { key: 'skills', label: 'Skills', completed: user.skills && user.skills.length >= 2, link: '/profile/edit' },
    { key: 'roles', label: 'Preferred Roles', completed: user.preferredRoles && user.preferredRoles.length >= 1, link: '/profile/edit' },
    { key: 'github', label: 'GitHub Username', completed: !!user.githubUsername, link: '/github' },
    { key: 'githubAnalysis', label: 'GitHub Analysis', completed: !!user.githubAnalysis, link: '/github' },
    { key: 'quiz', label: 'Personalized Quiz', completed: !!(user.quizResults && user.quizResults.score > 0), link: '/quiz' },
    { key: 'quizResult', label: 'Quiz Results', completed: !!user.isActivated, link: '/quiz/result' },
  ];

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Header Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '2rem',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '24px',
                    objectFit: 'cover',
                    border: '2px solid rgba(99, 102, 241, 0.4)',
                    boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#fff',
                  }}
                >
                  {user.fullName[0]}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>
                    {user.fullName}
                  </h1>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      background: user.isActivated ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: user.isActivated ? '#34d399' : '#fbbf24',
                    }}
                  >
                    {user.isActivated ? 'Activated Profile ✓' : 'Verification Incomplete'}
                  </span>
                </div>

                <div style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '4px' }}>
                  {user.college} • {user.department} (Year {user.year})
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={14} color="#64748b" /> {user.email}
                  </span>
                  {user.gender && (
                    <span>Gender: {user.gender}</span>
                  )}
                  {user.linkedIn && (
                    <a
                      href={user.linkedIn}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}
                    >
                      <Linkedin size={14} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Overall Score Ring & Edit Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <ScoreRing score={user.overallSkillScore} size={90} strokeWidth={8} label="Overall Score" />

              <Link
                to="/profile/edit"
                className="btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
              >
                <Edit3 size={15} /> Edit Profile
              </Link>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6 }}>{user.bio}</p>
            </div>
          )}
        </motion.div>

        {/* Verification Stepper Bar */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
              Mandatory Profile Verification Flow
            </span>
            <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem' }}>
              {user.completionPercentage}% Completed
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {steps.map((st) => (
              <Link
                key={st.key}
                to={st.link}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: st.completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: st.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: st.completed ? '#34d399' : '#94a3b8',
                }}
              >
                {st.completed ? <CheckCircle size={14} color="#34d399" /> : <Clock size={14} color="#64748b" />}
                <span>{st.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Skills & Roles */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                Skills & Preferred Roles
              </h3>
              <Link to="/profile/edit" style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>
                Edit →
              </Link>
            </div>

            {/* Preferred Roles */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                Preferred Roles
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {user.preferredRoles.map((r) => (
                  <span
                    key={r.id}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: r.isPrimary ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: r.isPrimary ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: r.isPrimary ? '#a5b4fc' : '#cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    {r.name} {r.isPrimary && '★ Primary'}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                Verified Skills
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {user.skills.map((sk) => (
                  <span
                    key={sk.id}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                    }}
                  >
                    {sk.name} {sk.proficiency && <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>({sk.proficiency})</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* GitHub Analysis & Quiz Overview Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* GitHub Card */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Github size={18} color="#fff" />
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                    GitHub Analysis {user.githubUsername && `(@${user.githubUsername})`}
                  </span>
                </div>
                <Link to="/github" style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 600 }}>
                  View Analysis →
                </Link>
              </div>

              {user.githubAnalysis ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1rem' }}>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Repos</div>
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.1rem' }}>
                        {user.githubAnalysis.publicRepos}
                      </div>
                    </div>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Stars</div>
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.1rem' }}>
                        {user.githubAnalysis.totalStars}
                      </div>
                    </div>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Score</div>
                      <div style={{ fontWeight: 800, color: '#c084fc', fontSize: '1.1rem' }}>
                        {user.githubAnalysis.score}%
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Archetype: <strong>{user.githubAnalysis.archetype || 'Full Stack Engineer'}</strong>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0', color: '#94a3b8' }}>
                  <p style={{ fontSize: '0.875rem' }}>GitHub not connected or analyzed yet.</p>
                  <Link to="/github" className="btn-secondary btn-sm" style={{ marginTop: '8px', display: 'inline-block' }}>
                    Connect & Analyze GitHub
                  </Link>
                </div>
              )}
            </div>

            {/* Quiz Result Card */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="#38bdf8" />
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>Personalized Skill Assessment</span>
                </div>
                <Link to={user.quizResults ? '/quiz/result' : '/quiz'} style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                  {user.quizResults ? 'View Results →' : 'Take Quiz →'}
                </Link>
              </div>

              {user.quizResults ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                      Role: <strong>{user.quizResults.roleName}</strong>
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                      {user.quizResults.score}/100
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Completed on {new Date(user.quizResults.completedAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0', color: '#94a3b8' }}>
                  <p style={{ fontSize: '0.875rem' }}>Assessment not completed yet.</p>
                  <Link to="/quiz" className="btn-primary btn-sm" style={{ marginTop: '8px', display: 'inline-block' }}>
                    Start 20-Min Assessment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects & Achievements */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Projects & Hackathon Experience
            </h3>
            <Link to="/profile/edit" style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>
              Add Projects →
            </Link>
          </div>

          {user.projects && user.projects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {user.projects.map((proj) => (
                <div
                  key={proj.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                    {proj.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '10px' }}>
                    {proj.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {proj.techStack.map((tech, idx) => (
                      <span key={idx} style={{ fontSize: '0.725rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: '#cbd5e1' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>No projects listed yet.</p>
          )}

          {user.achievements && user.achievements.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                Key Achievements:
              </div>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.875rem', color: '#cbd5e1' }}>
                {user.achievements.map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
