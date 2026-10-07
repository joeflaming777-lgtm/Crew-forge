import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const LeaderLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/leader/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success('Welcome back, Leader ' + (res.data.user.leaderProfile?.fullName || '') + '!');
        navigate('/leader/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoLeader = () => {
    setEmail('leader@skillsync.dev');
    setPassword('leader123');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          borderRadius: '24px',
          border: '1px solid rgba(6, 182, 212, 0.25)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06b6d4, #10b981)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
            }}
          >
            <ShieldCheck size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
            Team Leader Login
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
            Manage your hackathon teams, discover talent, and send invitations
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="input-field"
                placeholder="leader@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
                required
              />
              <Mail
                size={18}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
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
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.85rem',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #10b981 100%)',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In as Leader'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={fillDemoLeader}
            className="btn-secondary btn-sm"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Sparkles size={14} color="#06b6d4" /> Fill Demo Leader (Aarav - NeuralNomads)
          </button>
        </div>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
          }}
        >
          <Link to="/leader/register" style={{ color: '#2dd4bf', fontWeight: 600 }}>
            New Leader? Register
          </Link>
          <Link to="/candidate/login" style={{ color: '#94a3b8' }}>
            Candidate Login →
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
