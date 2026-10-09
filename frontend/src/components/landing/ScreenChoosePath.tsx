import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Layers, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const ScreenChoosePath: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleQuickLogin = async (userKey: 'arjun' | 'priya' | 'aarav') => {
    try {
      const emailMap = {
        arjun: 'arjun@skillsync.dev',
        priya: 'priya@skillsync.dev',
        aarav: 'aarav@skillsync.dev',
      };

      const nameMap = {
        arjun: 'Arjun Sharma',
        priya: 'Priya Patel',
        aarav: 'Aarav Mehta',
      };

      toast.info(`Logging in as ${nameMap[userKey]}...`);
      await login(emailMap[userKey]);
      toast.success(`Welcome back, ${nameMap[userKey]}!`);
      navigate('/dashboard');
    } catch {
      toast.error('Quick login failed.');
    }
  };

  return (
    <section
      id="choose-path"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="glow-orb"
        style={{
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(6, 182, 212, 0.1) 60%, transparent 100%)',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      <div className="container" style={{ maxWidth: '880px', position: 'relative', zIndex: 10 }}>
        {/* Single Centered Call-To-Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card"
          style={{
            padding: 'clamp(2.5rem, 5vw, 4.25rem) clamp(1.5rem, 4vw, 3.5rem)',
            borderRadius: '28px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            background: 'linear-gradient(180deg, rgba(19, 27, 46, 0.9) 0%, rgba(13, 18, 32, 0.96) 100%)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 45px rgba(99, 102, 241, 0.18)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 35px rgba(99, 102, 241, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.25)',
              marginBottom: '1.75rem',
            }}
          >
            <Sparkles size={36} color="#ffffff" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.3rem, 5vw, 3.6rem)',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Your Next Team Starts Here.
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: '620px',
              margin: '0 auto 2.5rem',
            }}
          >
            One account. Every hackathon opportunity. Find your team or build one of your own.
          </motion.p>

          {/* Primary Button & Secondary Link */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <button
              onClick={() => navigate('/register')}
              className="btn-primary"
              style={{
                fontSize: '1.15rem',
                padding: '1.05rem 2.75rem',
                borderRadius: '9999px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.45)',
                cursor: 'pointer',
              }}
            >
              Get Started →
            </button>

            <div style={{ fontSize: '1rem', color: '#94a3b8' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#818cf8',
                  fontWeight: 600,
                  textDecoration: 'none',
                  marginLeft: '2px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c7d2fe')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#818cf8')}
              >
                Log in
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Actions Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              marginTop: '3.25rem',
              paddingTop: '2.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(59, 130, 246, 0.15))',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Compass size={22} color="#818cf8" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Action 1
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                  Find a Team
                </div>
                <div style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '2px' }}>
                  Discover open squads matching your verified skills
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(16, 185, 129, 0.15))',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Layers size={22} color="#2dd4bf" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Action 2
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                  Build a Team
                </div>
                <div style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '2px' }}>
                  Form a hackathon team, define roles and recruit peers
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 1-Click Instant Demo Login Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop: '2rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem 1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
              1-Click Demo Logins:
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={() => handleQuickLogin('arjun')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              Arjun (Owner & Member)
            </button>
            <button
              onClick={() => handleQuickLogin('priya')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              Priya (Looking for Team)
            </button>
            <button
              onClick={() => handleQuickLogin('aarav')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              Aarav (Team Owner)
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
