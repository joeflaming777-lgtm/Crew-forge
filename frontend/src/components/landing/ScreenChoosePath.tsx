import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck, ArrowRight, Sparkles, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const ScreenChoosePath: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchDemoUser } = useAuth();
  const toast = useToast();

  const handleQuickLogin = async (userKey: 'arjun' | 'priya' | 'aarav') => {
    try {
      const emailMap = {
        arjun: 'arjun@hackmate.dev',
        priya: 'priya@hackmate.dev',
        aarav: 'aarav@hackmate.dev',
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
        padding: '5rem 1.5rem',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.02em',
              marginBottom: '0.8rem',
            }}
          >
            One Platform. One User Login.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: '1.2rem',
              color: '#94a3b8',
            }}
          >
            A single unified user account for all hackathons. Join teams or lead teams seamlessly.
          </motion.p>
        </div>

        {/* The Two Feature Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Find a Team Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="glass-card"
            style={{
              padding: '3rem 2.25rem',
              borderRadius: '24px',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              background: 'linear-gradient(180deg, rgba(19, 27, 46, 0.9) 0%, rgba(13, 18, 32, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
                  marginBottom: '1.75rem',
                }}
              >
                <UserCheck size={36} color="#ffffff" />
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#818cf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}
              >
                <Sparkles size={14} /> Join a Team
              </div>

              <h3
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                }}
              >
                Discover & Join Teams
              </h3>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}
              >
                Create your verified profile, showcase GitHub code and skill assessments, and match with teams seeking your skillset.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.05rem',
                }}
              >
                User Login to Explore <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>

          {/* Build a Team Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="glass-card"
            style={{
              padding: '3rem 2.25rem',
              borderRadius: '24px',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              background: 'linear-gradient(180deg, rgba(19, 27, 46, 0.9) 0%, rgba(13, 18, 32, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
                  marginBottom: '1.75rem',
                }}
              >
                <ShieldCheck size={36} color="#ffffff" />
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#2dd4bf',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}
              >
                <Sparkles size={14} /> Form a Team
              </div>

              <h3
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                }}
              >
                Build & Lead a Squad
              </h3>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}
              >
                Register your hackathon squad, specify needed roles and skills, find verified student candidates, and send invitations.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.05rem',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #10b981 100%)',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)',
                }}
              >
                User Login to Build <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Unified Authentication Quick Actions */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                Single User Account
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                Log in to access both finding teammates and creating teams under one user profile.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
              >
                User Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-secondary"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>

        {/* 1-Click Instant Demo Login Bar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>
              1-Click Demo User Logins:
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => handleQuickLogin('arjun')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.825rem' }}
            >
              Arjun Sharma (User: Owner & Member)
            </button>
            <button
              onClick={() => handleQuickLogin('priya')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.825rem' }}
            >
              Priya Patel (User: Looking for Team)
            </button>
            <button
              onClick={() => handleQuickLogin('aarav')}
              className="btn-secondary btn-sm"
              style={{ fontSize: '0.825rem' }}
            >
              Aarav Mehta (User: Team Owner)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
