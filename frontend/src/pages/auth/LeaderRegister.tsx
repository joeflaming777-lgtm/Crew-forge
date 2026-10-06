import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const LeaderRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: 'IIT Bombay',
    department: 'Computer Science and Engineering',
    year: 3,
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/leader/register', {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        college: formData.college,
        department: formData.department,
        year: Number(formData.year),
        bio: formData.bio,
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success('Leader registered! Now create your hackathon team.');
        navigate('/leader/create-team');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
          maxWidth: '560px',
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
            Team Leader Registration
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
            Set up your team lead account to build and recruit for your hackathon squad
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="input-field"
                placeholder="e.g. Aarav Sharma"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="leader@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">College / University *</label>
              <input
                type="text"
                name="college"
                className="input-field"
                placeholder="e.g. IIT Bombay, BITS"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <input
                type="text"
                name="department"
                className="input-field"
                placeholder="e.g. CSE, IT, ECE"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Year of Study</label>
            <select
              name="year"
              className="input-field"
              value={formData.year}
              onChange={handleChange}
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Leader Bio / Vision</label>
            <textarea
              name="bio"
              className="input-field"
              placeholder="What kind of hackathon team are you forming and what is your focus?"
              value={formData.bio}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="input-field"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '0.85rem',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #10b981 100%)',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)',
            }}
          >
            {loading ? 'Creating Account...' : 'Continue to Create Team'} <ArrowRight size={18} />
          </button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: '#94a3b8' }}>Already registered as Leader? </span>
          <Link to="/leader/login" style={{ color: '#2dd4bf', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
