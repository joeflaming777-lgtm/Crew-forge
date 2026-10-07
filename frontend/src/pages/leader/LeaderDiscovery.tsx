import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  UserCheck,
  Check,
  AlertTriangle,
  Github,
  Award,
  Sparkles,
  Mail,
  Scale,
  X,
  ExternalLink,
  ChevronDown,
  Star,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import { EnrichedCandidate } from '../../types';
import { ScoreRing } from '../../components/common/ScoreRing';
import { Modal } from '../../components/common/Modal';

export const LeaderDiscovery: React.FC = () => {
  const location = useLocation();
  const toast = useToast();

  const [candidates, setCandidates] = useState<EnrichedCandidate[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('matchScore');

  // Modals & Comparison State
  const [selectedCandidate, setSelectedCandidate] = useState<EnrichedCandidate | null>(null);
  const [inviteModalCandidate, setInviteModalCandidate] = useState<EnrichedCandidate | null>(null);
  const [inviteRole, setInviteRole] = useState<string>('');
  const [inviteMessage, setInviteMessage] = useState<string>('');
  const [sendingInvite, setSendingInvite] = useState<boolean>(false);

  // Comparison tray (up to 3 candidates)
  const [comparisonList, setComparisonList] = useState<EnrichedCandidate[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  // Check URL query params for initial role filter (e.g. from "Find Matching Candidates" button)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam) {
      setRoleFilter(roleParam);
    }
  }, [location.search]);

  useEffect(() => {
    fetchCandidates();
  }, [search, roleFilter, skillFilter, departmentFilter, minScoreFilter, availabilityFilter, sortBy]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/candidates', {
        params: {
          search: search || undefined,
          role: roleFilter || undefined,
          skill: skillFilter || undefined,
          department: departmentFilter || undefined,
          minOverallScore: minScoreFilter > 0 ? minScoreFilter : undefined,
          availability: availabilityFilter || undefined,
          sortBy,
        },
      });

      if (res.data.success) {
        setCandidates(res.data.candidates || []);
        setStats(res.data.stats || null);
      }
    } catch {
      toast.error('Failed to discover candidates.');
    } finally {
      setLoading(false);
    }
  };

  const openInviteModal = (cand: EnrichedCandidate) => {
    setInviteModalCandidate(cand);
    setInviteRole(cand.preferredRoles[0]?.name || 'Developer');
    setInviteMessage(
      `Hi ${cand.fullName.split(' ')[0]}, we reviewed your profile and would love for you to join our hackathon squad!`
    );
  };

  const handleSendInvite = async () => {
    if (!inviteModalCandidate || !inviteRole) return;

    try {
      setSendingInvite(true);
      const res = await apiClient.post('/invitations', {
        candidateProfileId: inviteModalCandidate.id,
        roleName: inviteRole,
        message: inviteMessage,
      });

      if (res.data.success) {
        toast.success(`Invitation sent to ${inviteModalCandidate.fullName}!`);
        setInviteModalCandidate(null);
        await fetchCandidates();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not send invitation.');
    } finally {
      setSendingInvite(false);
    }
  };

  const toggleComparison = (cand: EnrichedCandidate) => {
    const exists = comparisonList.some((c) => c.id === cand.id);
    if (exists) {
      setComparisonList(comparisonList.filter((c) => c.id !== cand.id));
    } else {
      if (comparisonList.length >= 3) {
        toast.info('You can compare up to 3 candidates simultaneously.');
        return;
      }
      setComparisonList([...comparisonList, cand]);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Excellent':
        return '#10b981';
      case 'Strong':
        return '#06b6d4';
      case 'Eligible':
        return '#6366f1';
      case 'Below Requirement':
        return '#f59e0b';
      default:
        return '#f43f5e';
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Discover & Evaluate Candidates
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '4px' }}>
          Rank students by technical compatibility, verified assessment scores, and GitHub activity evidence.
        </p>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search by Name/Skill/Role */}
          <div style={{ position: 'relative', flex: 2, minWidth: '240px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search by candidate name, college, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
            />
            <Search
              size={18}
              color="#64748b"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Role Filter */}
          <select
            className="input-field"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ flex: 1, minWidth: '160px' }}
          >
            <option value="">All Roles</option>
            <option value="AI/ML Developer">AI/ML Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="IoT Developer">IoT Developer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>

          {/* Skill Filter */}
          <select
            className="input-field"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            style={{ flex: 1, minWidth: '150px' }}
          >
            <option value="">All Skills</option>
            <option value="Python">Python</option>
            <option value="React">React</option>
            <option value="PyTorch">PyTorch</option>
            <option value="Node.js">Node.js</option>
            <option value="SQL">SQL</option>
            <option value="Docker">Docker</option>
            <option value="IoT">IoT</option>
            <option value="UI/UX">UI/UX</option>
          </select>

          {/* Sort By */}
          <select
            className="input-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ flex: 1, minWidth: '160px' }}
          >
            <option value="matchScore">Sort by Compatibility</option>
            <option value="overallScore">Sort by Overall Score</option>
            <option value="quizScore">Sort by Quiz Score</option>
            <option value="githubScore">Sort by GitHub Score</option>
            <option value="experience">Sort by Experience</option>
          </select>
        </div>

        {/* Filter Quick Badges & Active Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <span>Showing <strong style={{ color: '#fff' }}>{candidates.length}</strong> candidates</span>
            {roleFilter && (
              <span className="badge badge-primary">
                Role: {roleFilter} <button onClick={() => setRoleFilter('')} style={{ color: '#fff', marginLeft: '4px' }}>×</button>
              </span>
            )}
            {skillFilter && (
              <span className="badge badge-primary">
                Skill: {skillFilter} <button onClick={() => setSkillFilter('')} style={{ color: '#fff', marginLeft: '4px' }}>×</button>
              </span>
            )}
          </div>

          {comparisonList.length > 0 && (
            <button
              onClick={() => setShowComparisonModal(true)}
              className="btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Scale size={16} /> Compare {comparisonList.length} Selected
            </button>
          )}
        </div>
      </div>

      {/* CANDIDATES LIST */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
          Evaluating candidates against team requirements...
        </div>
      ) : candidates.length === 0 ? (
        <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: '20px' }}>
          <UserCheck size={44} color="#6366f1" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.35rem', color: '#f8fafc' }}>No candidates match your current requirements.</h3>
          <p style={{ color: '#94a3b8', marginTop: '6px' }}>Try resetting or broadening your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {candidates.map((cand) => {
            const isCompared = comparisonList.some((c) => c.id === cand.id);
            const tierColor = getTierColor(cand.matchAnalysis.tier);

            return (
              <motion.div
                key={cand.id}
                whileHover={{ y: -2 }}
                className="glass-card glass-card-interactive"
                style={{
                  padding: '1.75rem 2rem',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  border: isCompared ? '1.5px solid #6366f1' : undefined,
                }}
              >
                {/* Left: Avatar & Candidate Info */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flex: 2, minWidth: '280px' }}>
                  <img
                    src={cand.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cand.fullName}`}
                    alt={cand.fullName}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.05)',
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                        {cand.fullName}
                      </h3>
                      <span
                        className="badge"
                        style={{
                          background: `${tierColor}20`,
                          color: tierColor,
                          border: `1px solid ${tierColor}50`,
                        }}
                      >
                        {cand.matchAnalysis.tier}
                      </span>
                      {cand.invitationStatus && (
                        <span className="badge badge-warning">
                          Invitation {cand.invitationStatus}
                        </span>
                      )}
                      {cand.isMemberOfCurrentTeam && (
                        <span className="badge badge-success">On Your Team</span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '2px' }}>
                      {cand.department} • {cand.college} (Year {cand.year})
                    </p>

                    {/* Roles Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                      {cand.preferredRoles.map((r) => (
                        <span key={r.id} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                          {r.name}
                        </span>
                      ))}
                    </div>

                    {/* Explainable Why It Matches & Gaps (Sections 20 & 22) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                      {cand.matchAnalysis.reasons.slice(0, 2).map((reason, idx) => (
                        <div key={idx} style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{reason}</span>
                        </div>
                      ))}
                      {cand.matchAnalysis.gaps.slice(0, 1).map((gap, idx) => (
                        <div key={idx} style={{ fontSize: '0.8rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center: Score Rings Breakdown */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexShrink: 0 }}>
                  <ScoreRing score={cand.matchAnalysis.matchScore} size={82} label="Compatibility" />
                  <ScoreRing score={cand.overallScore} size={70} label="Overall" />
                  <ScoreRing score={cand.quizScore} size={70} label="Quiz" />
                  <ScoreRing score={cand.githubScore} size={70} label="GitHub" />
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
                  <button
                    onClick={() => openInviteModal(cand)}
                    disabled={Boolean(cand.invitationStatus === 'PENDING' || cand.isMemberOfCurrentTeam)}
                    className="btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <Mail size={14} /> Invite to Team
                  </button>

                  <button
                    onClick={() => setSelectedCandidate(cand)}
                    className="btn-secondary btn-sm"
                    style={{ width: '100%' }}
                  >
                    Full Profile
                  </button>

                  <button
                    onClick={() => toggleComparison(cand)}
                    className="btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      background: isCompared ? 'rgba(99, 102, 241, 0.2)' : undefined,
                      borderColor: isCompared ? '#6366f1' : undefined,
                    }}
                  >
                    <Scale size={14} /> {isCompared ? 'Remove' : 'Compare'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* FULL CANDIDATE PROFILE MODAL (Section 22) */}
      {selectedCandidate && (
        <Modal
          isOpen={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          title={selectedCandidate.fullName}
          subtitle={`${selectedCandidate.department} • ${selectedCandidate.college}`}
          maxWidth="720px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Match Banner */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <span className="badge badge-success" style={{ marginBottom: '4px' }}>
                  {selectedCandidate.matchAnalysis.tier} Candidate
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                  Team Compatibility: {selectedCandidate.matchAnalysis.matchScore}%
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Availability: <strong>{selectedCandidate.availability}</strong> • Hackathons: <strong>{selectedCandidate.hackathonsCount}</strong>
                </div>
              </div>

              <ScoreRing score={selectedCandidate.matchAnalysis.matchScore} size={84} />
            </div>

            {/* Why This Candidate Matches & Gaps (Section 22 Requirement) */}
            <div className="grid-cols-2">
              <div style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>
                  ✓ Why This Candidate Matches
                </h4>
                <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {selectedCandidate.matchAnalysis.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>
                  ⚠ Potential Skill Gaps
                </h4>
                <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {selectedCandidate.matchAnalysis.gaps.length > 0 ? (
                    selectedCandidate.matchAnalysis.gaps.map((g, i) => <li key={i}>{g}</li>)
                  ) : (
                    <li>No significant skill gaps identified.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* GitHub Technical Evidence */}
            {selectedCandidate.githubAnalysis && (
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      <Github size={20} color="#818cf8" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>
                          @{selectedCandidate.githubAnalysis.username}
                        </span>
                        <a
                          href={selectedCandidate.githubAnalysis.profileUrl || `https://github.com/${selectedCandidate.githubAnalysis.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#94a3b8', display: 'flex' }}
                        >
                          <ExternalLink size={13} />
                        </a>
                        {selectedCandidate.githubAnalysis.archetype && (
                          <span
                            className="badge"
                            style={{
                              background: 'rgba(99, 102, 241, 0.25)',
                              color: '#a5b4fc',
                              border: '1px solid rgba(99, 102, 241, 0.4)',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                            }}
                          >
                            {selectedCandidate.githubAnalysis.archetype}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                    GitHub Score: {selectedCandidate.githubAnalysis.score}/100
                  </span>
                </div>

                {/* Summary */}
                {selectedCandidate.githubAnalysis.summary && (
                  <p
                    style={{
                      margin: '0 0 12px',
                      fontSize: '0.85rem',
                      color: '#cbd5e1',
                      lineHeight: 1.5,
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {selectedCandidate.githubAnalysis.summary}
                  </p>
                )}

                {/* 4-Pillar Breakdown Bars */}
                {selectedCandidate.githubAnalysis.breakdown && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                        <span style={{ color: '#94a3b8' }}>Repo Substance</span>
                        <strong style={{ color: '#818cf8' }}>{selectedCandidate.githubAnalysis.breakdown.repoBreadthScore}/25</strong>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                        <div style={{ width: `${(selectedCandidate.githubAnalysis.breakdown.repoBreadthScore / 25) * 100}%`, height: '100%', background: '#818cf8', borderRadius: '2px' }} />
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                        <span style={{ color: '#94a3b8' }}>Stack Breadth</span>
                        <strong style={{ color: '#38bdf8' }}>{selectedCandidate.githubAnalysis.breakdown.languageMasteryScore}/25</strong>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                        <div style={{ width: `${(selectedCandidate.githubAnalysis.breakdown.languageMasteryScore / 25) * 100}%`, height: '100%', background: '#38bdf8', borderRadius: '2px' }} />
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                        <span style={{ color: '#94a3b8' }}>Commit Velocity</span>
                        <strong style={{ color: '#10b981' }}>{selectedCandidate.githubAnalysis.breakdown.activityScore}/25</strong>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                        <div style={{ width: `${(selectedCandidate.githubAnalysis.breakdown.activityScore / 25) * 100}%`, height: '100%', background: '#10b981', borderRadius: '2px' }} />
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                        <span style={{ color: '#94a3b8' }}>Rigor & Demos</span>
                        <strong style={{ color: '#f59e0b' }}>{selectedCandidate.githubAnalysis.breakdown.documentationScore}/25</strong>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                        <div style={{ width: `${(selectedCandidate.githubAnalysis.breakdown.documentationScore / 25) * 100}%`, height: '100%', background: '#f59e0b', borderRadius: '2px' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Core Stats Row */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#94a3b8', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span>
                    Original Repos: <strong style={{ color: '#fff' }}>{selectedCandidate.githubAnalysis.metrics?.originalRepos ?? selectedCandidate.githubAnalysis.publicRepos}</strong>
                  </span>
                  <span>
                    Stars: <strong style={{ color: '#fbbf24' }}>{selectedCandidate.githubAnalysis.metrics?.originalStars ?? selectedCandidate.githubAnalysis.totalStars} ★</strong>
                  </span>
                  <span>
                    Recent Activity: <strong style={{ color: '#10b981' }}>{selectedCandidate.githubAnalysis.recentActivityLevel}</strong>
                  </span>
                  {selectedCandidate.githubAnalysis.metrics?.deployedProjectsCount ? (
                    <span>
                      Live Demos: <strong style={{ color: '#38bdf8' }}>{selectedCandidate.githubAnalysis.metrics.deployedProjectsCount}</strong>
                    </span>
                  ) : null}
                </div>

                {/* Showcase Repositories */}
                {selectedCandidate.githubAnalysis.showcaseRepos && selectedCandidate.githubAnalysis.showcaseRepos.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>
                      Key Showcase Projects:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                      {selectedCandidate.githubAnalysis.showcaseRepos.slice(0, 2).map((repo: any) => (
                        <div
                          key={repo.name}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <a
                              href={repo.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.8rem', textDecoration: 'none' }}
                            >
                              {repo.name}
                            </a>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#94a3b8' }}>
                              {repo.stars > 0 && <span style={{ color: '#fbbf24' }}>★ {repo.stars}</span>}
                              {repo.language && <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{repo.language}</span>}
                            </div>
                          </div>
                          {repo.liveUrl && (
                            <a
                              href={repo.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#38bdf8', marginTop: '4px', textDecoration: 'none' }}
                            >
                              <Globe size={11} /> Live Demo →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Strengths */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedCandidate.githubAnalysis.technicalStrengths?.map((s) => (
                    <span key={s} className="badge badge-neutral" style={{ fontSize: '0.725rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setSelectedCandidate(null)} className="btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedCandidate(null);
                  openInviteModal(selectedCandidate);
                }}
                className="btn-primary"
              >
                Send Team Invitation →
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SEND INVITATION CONFIRMATION MODAL (Section 24) */}
      {inviteModalCandidate && (
        <Modal
          isOpen={Boolean(inviteModalCandidate)}
          onClose={() => setInviteModalCandidate(null)}
          title="Send Team Invitation"
          subtitle={`Invite ${inviteModalCandidate.fullName} to join your hackathon team`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Assign Role on Team *</label>
              <select
                className="input-field"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                {inviteModalCandidate.preferredRoles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="AI/ML Developer">AI/ML Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="IoT Developer">IoT Developer</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Personalized Invitation Message</label>
              <textarea
                className="input-field"
                rows={3}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setInviteModalCandidate(null)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                disabled={sendingInvite}
                className="btn-primary"
              >
                {sendingInvite ? 'Sending...' : 'Confirm & Send Invitation'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* COMPARISON MODAL */}
      {showComparisonModal && (
        <Modal
          isOpen={showComparisonModal}
          onClose={() => setShowComparisonModal(false)}
          title="Side-by-Side Candidate Comparison"
          subtitle="Compare technical scores, verified quiz performance, and skill breadth"
          maxWidth="900px"
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '12px', color: '#94a3b8' }}>Metric</th>
                  {comparisonList.map((c) => (
                    <th key={c.id} style={{ padding: '12px', color: '#f8fafc', fontWeight: 800 }}>
                      {c.fullName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>Match Compatibility</td>
                  {comparisonList.map((c) => (
                    <td key={c.id} style={{ padding: '12px', fontWeight: 700, color: '#10b981' }}>
                      {c.matchAnalysis.matchScore}% ({c.matchAnalysis.tier})
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>Overall Score</td>
                  {comparisonList.map((c) => (
                    <td key={c.id} style={{ padding: '12px', fontWeight: 700, color: '#f8fafc' }}>
                      {c.overallScore}%
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>Assessment Score</td>
                  {comparisonList.map((c) => (
                    <td key={c.id} style={{ padding: '12px', fontWeight: 700, color: '#6366f1' }}>
                      {c.quizScore}%
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>GitHub Score</td>
                  {comparisonList.map((c) => (
                    <td key={c.id} style={{ padding: '12px', fontWeight: 700, color: '#06b6d4' }}>
                      {c.githubScore}/100
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>Hackathons Attended</td>
                  {comparisonList.map((c) => (
                    <td key={c.id} style={{ padding: '12px', color: '#cbd5e1' }}>
                      {c.hackathonsCount}
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>Primary Skills</td>
                  {comparisonList.map((c) => (
                    <td key={c.id} style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {c.skills.slice(0, 4).map((s) => (
                          <span key={s.id} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
};
