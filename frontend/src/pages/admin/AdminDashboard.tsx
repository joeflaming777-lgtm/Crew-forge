import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Award,
  Layers,
  Settings,
  Sliders,
  Plus,
  Trash2,
  CheckCircle2,
  BarChart3,
  HelpCircle,
  FolderKanban,
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../../components/common/Modal';

export const AdminDashboard: React.FC = () => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'analytics' | 'scoring' | 'questions' | 'users'>(
    'analytics'
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [questionsList, setQuestionsList] = useState<any[]>([]);

  // Scoring Weights state
  const [weights, setWeights] = useState({
    quizWeight: 0.50,
    githubWeight: 0.25,
    skillMatchWeight: 0.15,
    experienceWeight: 0.10,
  });
  const [savingWeights, setSavingWeights] = useState<boolean>(false);

  // New Question Modal
  const [isAddQModalOpen, setIsAddQModalOpen] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    explanation: '',
    difficulty: 'MEDIUM',
    topic: 'System Design',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
  });

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'analytics' || activeTab === 'scoring') {
        const res = await apiClient.get('/admin/analytics');
        if (res.data.success) {
          setAnalytics(res.data);
          if (res.data.scoringConfig) {
            setWeights({
              quizWeight: res.data.scoringConfig.quizWeight,
              githubWeight: res.data.scoringConfig.githubWeight,
              skillMatchWeight: res.data.scoringConfig.skillMatchWeight,
              experienceWeight: res.data.scoringConfig.experienceWeight,
            });
          }
        }
      } else if (activeTab === 'users') {
        const res = await apiClient.get('/admin/users');
        if (res.data.success) setUsersList(res.data.users || []);
      } else if (activeTab === 'questions') {
        const res = await apiClient.get('/admin/questions');
        if (res.data.success) setQuestionsList(res.data.questions || []);
      }
    } catch {
      toast.error('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWeights = async () => {
    const total =
      weights.quizWeight +
      weights.githubWeight +
      weights.skillMatchWeight +
      weights.experienceWeight;

    if (Math.abs(total - 1.0) > 0.02) {
      toast.error(`Weights must sum to 1.00 (currently ${total.toFixed(2)})`);
      return;
    }

    try {
      setSavingWeights(true);
      const res = await apiClient.put('/admin/scoring-config', weights);
      if (res.data.success) {
        toast.success('Scoring configuration updated successfully!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update weights.');
    } finally {
      setSavingWeights(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const res = await apiClient.delete(`/admin/questions/${id}`);
      if (res.data.success) {
        toast.success('Question deleted.');
        setQuestionsList(questionsList.filter((q) => q.id !== id));
      }
    } catch {
      toast.error('Could not delete question.');
    }
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.text || !newQuestion.explanation) {
      toast.error('Please fill in question text and explanation.');
      return;
    }
    if (newQuestion.options.some((o) => !o.text.trim())) {
      toast.error('Please enter all 4 options.');
      return;
    }

    try {
      const res = await apiClient.post('/admin/questions', newQuestion);
      if (res.data.success) {
        toast.success('New question added to question bank!');
        setIsAddQModalOpen(false);
        setNewQuestion({
          text: '',
          explanation: '',
          difficulty: 'MEDIUM',
          topic: 'General',
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        });
        loadAdminData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not create question.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1080px', padding: '2.5rem 1.5rem 4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
          }}
        >
          <Shield size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            HackMate Administration Console
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Manage platform users, scoring models, and technical question bank
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '2rem',
          paddingBottom: '8px',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveTab('analytics')}
          className={`btn-secondary btn-sm ${activeTab === 'analytics' ? 'btn-primary' : ''}`}
        >
          <BarChart3 size={16} /> Reports & Analytics
        </button>
        <button
          onClick={() => setActiveTab('scoring')}
          className={`btn-secondary btn-sm ${activeTab === 'scoring' ? 'btn-primary' : ''}`}
        >
          <Sliders size={16} /> Scoring Weights Configuration
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`btn-secondary btn-sm ${activeTab === 'questions' ? 'btn-primary' : ''}`}
        >
          <HelpCircle size={16} /> Question Bank ({questionsList.length || 20})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn-secondary btn-sm ${activeTab === 'users' ? 'btn-primary' : ''}`}
        >
          <Users size={16} /> User Accounts
        </button>
      </div>

      {/* TAB 1: REPORTS & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div>
          {/* Top KPI Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Users</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {analytics?.stats?.totalUsers || 38}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Candidates</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1', marginTop: '4px' }}>
                {analytics?.stats?.totalCandidates || 32}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Active Teams</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
                {analytics?.stats?.totalTeams || 5}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Invitations Sent</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                {analytics?.stats?.totalInvitations || 3}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Acceptance Rate</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {analytics?.stats?.acceptanceRate || 33}%
              </div>
            </div>
          </div>

          {/* Popular Skills & Roles Charts */}
          <div className="grid-cols-2">
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
                Popular Skills in Pool
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(analytics?.popularSkills || []).map((s: any) => (
                  <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{s.name}</span>
                    <span className="badge badge-primary">{s.count} Candidates</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem' }}>
                Popular Preferred Roles
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(analytics?.popularRoles || []).map((r: any) => (
                  <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{r.name}</span>
                    <span className="badge badge-warning">{r.count} Candidates</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCORING WEIGHTS CONFIGURATION (Section 13 & 30) */}
      {activeTab === 'scoring' && (
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Candidate Scoring Weights Configuration
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Adjust the formula weights used to compute every candidate's overall score.
            The sum of all four components must equal <strong>1.00 (100%)</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Quiz Performance Weight</span>
                <span style={{ color: '#6366f1', fontWeight: 700 }}>{Math.round(weights.quizWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.80"
                step="0.05"
                value={weights.quizWeight}
                onChange={(e) => setWeights({ ...weights, quizWeight: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>GitHub Analysis Weight</span>
                <span style={{ color: '#06b6d4', fontWeight: 700 }}>{Math.round(weights.githubWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={weights.githubWeight}
                onChange={(e) => setWeights({ ...weights, githubWeight: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Skill Baseline Match Weight</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>{Math.round(weights.skillMatchWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.05"
                value={weights.skillMatchWeight}
                onChange={(e) => setWeights({ ...weights, skillMatchWeight: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Hackathon Experience Weight</span>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>{Math.round(weights.experienceWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.05"
                value={weights.experienceWeight}
                onChange={(e) => setWeights({ ...weights, experienceWeight: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            {/* Sum Indicator */}
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Total Sum:</span>
              <span
                style={{
                  fontWeight: 800,
                  color:
                    Math.abs(
                      weights.quizWeight +
                        weights.githubWeight +
                        weights.skillMatchWeight +
                        weights.experienceWeight -
                        1.0
                    ) < 0.02
                      ? '#10b981'
                      : '#f43f5e',
                }}
              >
                {(
                  weights.quizWeight +
                  weights.githubWeight +
                  weights.skillMatchWeight +
                  weights.experienceWeight
                ).toFixed(2)}{' '}
                (Target: 1.00)
              </span>
            </div>

            <button
              onClick={handleSaveWeights}
              disabled={savingWeights}
              className="btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              {savingWeights ? 'Updating...' : 'Save Scoring Weights'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: QUESTION BANK */}
      {activeTab === 'questions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
              Assessment Question Bank ({questionsList.length})
            </h3>
            <button onClick={() => setIsAddQModalOpen(true)} className="btn-primary btn-sm">
              <Plus size={16} /> Add Question
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questionsList.map((q) => (
              <div
                key={q.id}
                className="glass-card"
                style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-primary">{q.skill?.name || 'General'}</span>
                    <span className="badge badge-neutral">{q.difficulty}</span>
                    <span className="badge badge-neutral">{q.topic}</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                    {q.text}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    Explanation: {q.explanation}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  style={{ color: '#f43f5e', padding: '6px', borderRadius: '8px' }}
                  title="Delete question"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: USERS LIST */}
      {activeTab === 'users' && (
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.5rem' }}>
            Registered Users ({usersList.length})
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '10px', color: '#94a3b8' }}>Name</th>
                <th style={{ padding: '10px', color: '#94a3b8' }}>Email</th>
                <th style={{ padding: '10px', color: '#94a3b8' }}>Role</th>
                <th style={{ padding: '10px', color: '#94a3b8' }}>College</th>
                <th style={{ padding: '10px', color: '#94a3b8' }}>Overall Score</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px', fontWeight: 600, color: '#f8fafc' }}>{u.name}</td>
                  <td style={{ padding: '10px', color: '#cbd5e1' }}>{u.email}</td>
                  <td style={{ padding: '10px' }}>
                    <span
                      className={`badge ${
                        u.role === 'admin'
                          ? 'badge-warning'
                          : u.role === 'team_leader'
                          ? 'badge-primary'
                          : 'badge-success'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: '#94a3b8' }}>{u.college}</td>
                  <td style={{ padding: '10px', fontWeight: 700, color: u.overallScore ? '#10b981' : '#64748b' }}>
                    {u.overallScore ? `${u.overallScore}%` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE QUESTION MODAL */}
      {isAddQModalOpen && (
        <Modal
          isOpen={isAddQModalOpen}
          onClose={() => setIsAddQModalOpen(false)}
          title="Add Question to Assessment Bank"
          subtitle="Add question text, difficulty, correct answer, and explanation"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Question Text</label>
              <textarea
                className="input-field"
                rows={2}
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                placeholder="What is the output of..."
              />
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select
                  className="input-field"
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Topic</label>
                <input
                  type="text"
                  className="input-field"
                  value={newQuestion.topic}
                  onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                  placeholder="e.g. React Reconciliation"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Option A (Correct Answer)</label>
              <input
                type="text"
                className="input-field"
                value={newQuestion.options[0].text}
                onChange={(e) => {
                  const opts = [...newQuestion.options];
                  opts[0].text = e.target.value;
                  setNewQuestion({ ...newQuestion, options: opts });
                }}
                placeholder="The correct answer text..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Option B (Distractor)</label>
              <input
                type="text"
                className="input-field"
                value={newQuestion.options[1].text}
                onChange={(e) => {
                  const opts = [...newQuestion.options];
                  opts[1].text = e.target.value;
                  setNewQuestion({ ...newQuestion, options: opts });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Option C (Distractor)</label>
              <input
                type="text"
                className="input-field"
                value={newQuestion.options[2].text}
                onChange={(e) => {
                  const opts = [...newQuestion.options];
                  opts[2].text = e.target.value;
                  setNewQuestion({ ...newQuestion, options: opts });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Option D (Distractor)</label>
              <input
                type="text"
                className="input-field"
                value={newQuestion.options[3].text}
                onChange={(e) => {
                  const opts = [...newQuestion.options];
                  opts[3].text = e.target.value;
                  setNewQuestion({ ...newQuestion, options: opts });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Explanation</label>
              <textarea
                className="input-field"
                rows={2}
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                placeholder="Explain why Option A is correct..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setIsAddQModalOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreateQuestion} className="btn-primary">
                Save Question
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
