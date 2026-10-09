import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Award,
  Sparkles,
  Compass,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ScoreRing } from '../../components/common/ScoreRing';
import confetti from 'canvas-confetti';

export const QuizResultPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
  }, []);

  const quiz = user?.quizResults;
  const score = quiz?.score || 90;

  return (
    <div style={{ padding: '3rem 1.5rem 6rem' }}>
      <div className="container" style={{ maxWidth: '840px', textAlign: 'center' }}>
        {/* Activation Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={34} color="#fff" />
          </div>

          <span
            style={{
              display: 'inline-block',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '4px 12px',
              borderRadius: '9999px',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            Profile Activated 🎉
          </span>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
            Assessment Complete!
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '580px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Congratulations, {user?.fullName}! Your skills have been officially evaluated and your student profile is now 100% discoverable to SkillSync Team Owners.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <ScoreRing score={score} size={110} strokeWidth={9} label="Quiz Score" />
          </div>

          {/* Performance Tier */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              fontWeight: 700,
              fontSize: '0.95rem',
              marginBottom: '2rem',
            }}
          >
            <Zap size={18} color="#f59e0b" /> Performance Tier: Top 10% (Elite Candidate)
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <Link
              to="/find-team"
              className="btn-primary"
              style={{
                padding: '0.9rem 1.8rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Compass size={18} /> Explore Hackathon Teams
            </Link>

            <Link
              to="/build-team"
              className="btn-primary"
              style={{
                padding: '0.9rem 1.8rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #10b981)',
              }}
            >
              <Layers size={18} /> Build Your Own Team
            </Link>

            <Link
              to="/dashboard"
              className="btn-secondary"
              style={{ padding: '0.9rem 1.6rem', fontSize: '1rem' }}
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
