import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Github,
  Search,
  Sparkles,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Star,
  Activity,
  Code2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ScoreRing } from '../../components/common/ScoreRing';

export const GitHubVerificationPage: React.FC = () => {
  const { user, runGitHubAnalysis } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.githubUsername || 'octocat');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(user?.githubAnalysis || null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter a GitHub username.');
      return;
    }

    try {
      setAnalyzing(true);
      toast.info('Fetching repository metrics and computing code breadth...');
      const res = await runGitHubAnalysis(username.trim());
      setAnalysisResult(res);
      toast.success('GitHub analysis complete! Score updated.');
    } catch {
      toast.error('Failed to analyze GitHub profile.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Verification Stepper Indicator */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Sparkles size={16} /> Mandatory Profile Verification: Step 4 of 6
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            GitHub Skill Verification
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginTop: '4px' }}>
            Analyze repository breadth, commit frequency, code documentation, and language mastery to power your HackMate match score.
          </p>
        </div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '2rem',
          }}
        >
          <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <input
                type="text"
                placeholder="Enter GitHub username (e.g. torvalds, arjun-codes)..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.85rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#fff',
                }}
              />
              <Github size={20} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="btn-primary"
              style={{
                padding: '0.85rem 1.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              }}
            >
              <Search size={18} /> {analyzing ? 'Analyzing Repos...' : 'Analyze GitHub'}
            </button>
          </form>
        </motion.div>

        {/* Analysis Results View */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{
              padding: '2.5rem',
              borderRadius: '24px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.85) 0%, rgba(13, 18, 32, 0.95) 100%)',
              marginBottom: '2rem',
            }}
          >
            {/* Header Result */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <ScoreRing score={analysisResult.score} size={88} strokeWidth={8} label="GitHub Score" />
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                    @{analysisResult.username}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#c084fc', fontWeight: 600, marginTop: '2px' }}>
                    Archetype: {analysisResult.archetype}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                    {analysisResult.summary}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ padding: '10px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Public Repos</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>{analysisResult.publicRepos}</div>
                </div>
                <div style={{ padding: '10px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Stars</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{analysisResult.totalStars}</div>
                </div>
              </div>
            </div>

            {/* Score Breakdown (Breadth, Mastery, Activity, Documentation) */}
            {analysisResult.breakdown && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Score Component Breakdown (out of 25 each)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Repo Breadth</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                      {analysisResult.breakdown.repoBreadthScore} / 25
                    </div>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Language Mastery</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a855f7' }}>
                      {analysisResult.breakdown.languageMasteryScore} / 25
                    </div>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Activity Velocity</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                      {analysisResult.breakdown.activityScore} / 25
                    </div>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Documentation</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                      {analysisResult.breakdown.documentationScore} / 25
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Language Breakdown */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
                Top Programming Languages
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {analysisResult.topLanguages.map((lang) => (
                  <div key={lang.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>{lang.name}</span>
                      <span style={{ color: '#94a3b8' }}>{lang.percentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${lang.percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                          borderRadius: '9999px',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Strengths */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                Detected Strengths
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {analysisResult.technicalStrengths.map((st, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#d8b4fe',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {st}
                  </span>
                ))}
              </div>
            </div>

            {/* Next Step CTA */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '2rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>
                ✓ GitHub Verification Completed
              </span>

              <Link
                to="/dashboard"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.85rem 1.6rem',
                }}
              >
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
