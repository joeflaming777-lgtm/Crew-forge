import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Sparkles, Users, Compass, Layers } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent') || '';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleRedirectAfterAuth = () => {
    if (intent === 'find-team') {
      navigate('/find-team');
    } else if (intent === 'build-team') {
      navigate('/build-team');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your user email address.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password, intent);
      toast.success('Welcome back to CrewForge!');
      handleRedirectAfterAuth();
    } catch {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoStudent = (emailVal: string, name: string) => {
    setEmail(emailVal);
    setPassword('student123');
    toast.info(`Selected demo user: ${name}`);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2.5rem',
          borderRadius: '24px',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(99, 102, 241, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Users size={30} color="#fff" />
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            User Login
          </h2>

          <p style={{ fontSize: '0.925rem', color: '#94a3b8', marginTop: '6px' }}>
            One single user account. Find teams or build teams for any hackathon.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
              User Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="input-field"
                placeholder="user@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.75rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
                required
              />
              <Mail
                size={18}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.75rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
                required
              />
              <Lock
                size={18}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In as User'} <ArrowRight size={18} />
          </button>
        </form>

        {/* 1-Click Demo Profiles */}
        <div style={{ marginTop: '1.75rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            1-Click Demo User Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => fillDemoStudent('arjun@skillsync.dev', 'Arjun Sharma')}
              className="btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                fontSize: '0.825rem',
              }}
            >
              <span>Arjun Sharma (User: Team Owner & Member)</span>
              <Sparkles size={14} color="#f59e0b" />
            </button>
            <button
              type="button"
              onClick={() => fillDemoStudent('priya@skillsync.dev', 'Priya Patel')}
              className="btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                fontSize: '0.825rem',
              }}
            >
              <span>Priya Patel (User: Looking for Team)</span>
              <Sparkles size={14} color="#38bdf8" />
            </button>
            <button
              type="button"
              onClick={() => fillDemoStudent('aarav@skillsync.dev', 'Aarav Mehta')}
              className="btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                fontSize: '0.825rem',
              }}
            >
              <span>Aarav Mehta (User: Team Owner)</span>
              <Sparkles size={14} color="#2dd4bf" />
            </button>
          </div>
        </div>

        {/* Bottom Link to Register */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#94a3b8',
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ color: '#818cf8', fontWeight: 600 }}
          >
            Create User Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
