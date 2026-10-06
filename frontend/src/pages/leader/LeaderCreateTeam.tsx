import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Plus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';

export const LeaderCreateTeam: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loadingHackathons, setLoadingHackathons] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: 'NeuralNomads',
    description: 'Building an autonomous multi-modal AI system for real-time agricultural crop disease diagnosis.',
    hackathonId: '',
    maxTeamSize: 6,
    minCandidateScore: 75,
    preferredDept: 'Computer Science and Engineering',
    availabilityReq: 'Full-time during hackathon weekend',
  });

  const [requiredRoles, setRequiredRoles] = useState<
    { roleName: string; skillNames: string; neededCount: number }[]
  >([
    { roleName: 'AI/ML Developer', skillNames: 'Python, PyTorch, Computer Vision', neededCount: 1 },
    { roleName: 'Frontend Developer', skillNames: 'React, JavaScript, CSS', neededCount: 1 },
    { roleName: 'Backend Developer', skillNames: 'Node.js, Express, SQL', neededCount: 1 },
    { roleName: 'UI/UX Designer', skillNames: 'UI/UX, CSS', neededCount: 1 },
    { roleName: 'IoT Developer', skillNames: 'IoT, Hardware', neededCount: 1 },
  ]);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      setLoadingHackathons(true);
      const res = await apiClient.get('/hackathons');
      if (res.data.success && res.data.hackathons.length > 0) {
        setHackathons(res.data.hackathons);
        setFormData((prev) => ({ ...prev, hackathonId: res.data.hackathons[0].id }));
      }
    } catch {
      toast.error('Failed to load hackathons.');
    } finally {
      setLoadingHackathons(false);
    }
  };

  const handleAddRole = () => {
    setRequiredRoles([
      ...requiredRoles,
      { roleName: 'Full Stack Developer', skillNames: 'React, Node.js', neededCount: 1 },
    ]);
  };

  const handleRemoveRole = (idx: number) => {
    setRequiredRoles(requiredRoles.filter((_, i) => i !== idx));
  };

  const handleRoleChange = (idx: number, field: string, val: any) => {
    const updated = [...requiredRoles];
    (updated[idx] as any)[field] = val;
    setRequiredRoles(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.hackathonId) {
      toast.error('Please enter team name and select a hackathon.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        requiredRoles: requiredRoles.map((r) => ({
          roleName: r.roleName,
          skillNames: r.skillNames.split(',').map((s) => s.trim()),
          neededCount: Number(r.neededCount) || 1,
        })),
      };

      const res = await apiClient.post('/teams', payload);
      if (res.data.success) {
        toast.success(`Team '${res.data.team.name}' created successfully!`);
        navigate('/leader/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not create team.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '860px', padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #06b6d4, #10b981)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
          }}
        >
          <Layers size={30} color="#fff" />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Create Your Hackathon Team
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '4px' }}>
          Define your required roles, skill quotas, and minimum selection threshold for candidate matching
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Core Team Details */}
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            marginBottom: '2rem',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.5rem' }}>
            Basic Information
          </h3>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Team Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Innovators, NeuralNomads"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Hackathon *</label>
              <select
                className="input-field"
                value={formData.hackathonId}
                onChange={(e) => setFormData({ ...formData, hackathonId: e.target.value })}
                disabled={loadingHackathons}
              >
                {hackathons.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} (Max {h.maxTeamSize} members)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Team Mission / Problem Statement</label>
            <textarea
              className="input-field"
              placeholder="Explain the problem you aim to solve and what kind of product you are building..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Maximum Team Size</label>
              <input
                type="number"
                min={2}
                max={10}
                className="input-field"
                value={formData.maxTeamSize}
                onChange={(e) => setFormData({ ...formData, maxTeamSize: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Candidate Score (%)</label>
              <input
                type="number"
                min={50}
                max={100}
                className="input-field"
                value={formData.minCandidateScore}
                onChange={(e) => setFormData({ ...formData, minCandidateScore: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Required Roles & Skills Quota */}
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                Required Roles & Skills
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Our matching engine ranks candidates against these specific role and skill targets.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddRole}
              className="btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Add Role
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requiredRoles.map((role, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Role Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={role.roleName}
                    onChange={(e) => handleRoleChange(idx, 'roleName', e.target.value)}
                    placeholder="e.g. AI/ML Developer"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div style={{ flex: 2, minWidth: '220px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                    Required Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={role.skillNames}
                    onChange={(e) => handleRoleChange(idx, 'skillNames', e.target.value)}
                    placeholder="e.g. Python, PyTorch, Computer Vision"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveRole(idx)}
                  disabled={requiredRoles.length <= 1}
                  style={{
                    color: '#f43f5e',
                    padding: '8px',
                    borderRadius: '8px',
                    marginTop: '16px',
                  }}
                  title="Remove role"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.05rem',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #10b981 100%)',
            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
          }}
        >
          {submitting ? 'Creating Team...' : 'Launch Team & Discover Candidates'} <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};
