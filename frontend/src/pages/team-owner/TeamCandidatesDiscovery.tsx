import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
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
  ChevronLeft,
  Sliders,
  Send,
  Layers,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { EnrichedCandidate } from '../../types';
import { ScoreRing } from '../../components/common/ScoreRing';
import { Modal } from '../../components/common/Modal';

export const TeamCandidatesDiscovery: React.FC = () => {
  const { id, candidateId } = useParams<{ id: string; candidateId?: string }>();
  const [searchParams] = useSearchParams();
  const urlRole = searchParams.get('role') || '';

  const { getTeamById, user, allCandidates, sendInvitation, invitations } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const team = getTeamById(id || '');

  // Filter state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(urlRole);
  const [skillFilter, setSkillFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(team ? team.minCandidateScore : 70);
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  // Modals & Comparison State
  const [selectedCandidate, setSelectedCandidate] = useState<EnrichedCandidate | null>(null);
  const [inviteModalCandidate, setInviteModalCandidate] = useState<EnrichedCandidate | null>(null);
  const [inviteRole, setInviteRole] = useState(team?.openRoles[0] || 'Developer');
  const [inviteMessage, setInviteMessage] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);

  // Comparison tray (up to 3 candidates)
  const [comparisonList, setComparisonList] = useState<EnrichedCandidate[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // If candidateId param present, auto-open candidate profile modal
  useEffect(() => {
    if (candidateId) {
      const match = allCandidates.find((c) => c.id === candidateId);
      if (match) setSelectedCandidate(match);
    }
  }, [candidateId, allCandidates]);

  if (!team) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Team not found.</h3>
        <Link to="/dashboard" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === team.ownerId;
  if (!isOwner) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Access Restricted: Team Owner Only</h3>
        <p style={{ color: '#94a3b8', marginTop: '6px' }}>Only the owner of {team.name} can invite candidates.</p>
        <Link to={`/find-team/${team.id}`} className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          View Team Page
        </Link>
      </div>
    );
  }

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return allCandidates.filter((cand) => {
      // Exclude team members
      const isAlreadyMember = team.members.some((m) => m.userId === cand.id);
      if (isAlreadyMember) return false;

      // Exclude current owner self
      if (cand.id === user?.id) return false;

      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesName = cand.fullName.toLowerCase().includes(q);
        const matchesCollege = cand.college.toLowerCase().includes(q);
        const matchesBio = cand.bio ? cand.bio.toLowerCase().includes(q) : false;
        const matchesSkills = cand.skills.some((s) => s.name.toLowerCase().includes(q));
        if (!matchesName && !matchesCollege && !matchesBio && !matchesSkills) return false;
      }

      // Role filter
      if (roleFilter && !cand.preferredRoles.some((r) => r.name.toLowerCase().includes(roleFilter.toLowerCase()))) {
        return false;
      }

      // Skill filter
      if (skillFilter && !cand.skills.some((s) => s.name.toLowerCase() === skillFilter.toLowerCase())) {
        return false;
      }

      // Department filter
      if (departmentFilter && !cand.department.toLowerCase().includes(departmentFilter.toLowerCase())) {
        return false;
      }

      // Score filter
      if (cand.overallScore < minScoreFilter) {
        return false;
      }

      // Availability filter
      if (availabilityFilter && cand.availability !== availabilityFilter) {
        return false;
      }

      return true;
    });
  }, [allCandidates, team, user, search, roleFilter, skillFilter, departmentFilter, minScoreFilter, availabilityFilter]);

  const handleOpenInviteModal = (cand: EnrichedCandidate) => {
    setInviteModalCandidate(cand);
    setInviteRole(team.openRoles[0] || cand.preferredRoles[0]?.name || 'Developer');
    setInviteMessage(`Hi ${cand.fullName.split(' ')[0]}, we reviewed your profile on CrewForge and would love to have you on team "${team.name}" for ${team.hackathonName}!`);
  };

  const handleSendInvite = () => {
    if (!inviteModalCandidate) return;
    setSendingInvite(true);
    const success = sendInvitation(team.id, inviteModalCandidate.id, inviteRole, inviteMessage);
    if (success) {
      toast.success(`Invitation sent to ${inviteModalCandidate.fullName}!`);
      setInviteModalCandidate(null);
    } else {
      toast.error('An active invitation has already been sent to this student.');
    }
    setSendingInvite(false);
  };

  const toggleComparison = (cand: EnrichedCandidate) => {
    if (comparisonList.some((c) => c.id === cand.id)) {
      setComparisonList(comparisonList.filter((c) => c.id !== cand.id));
    } else {
      if (comparisonList.length >= 3) {
        toast.info('You can compare up to 3 candidates simultaneously.');
        return;
      }
      setComparisonList([...comparisonList, cand]);
    }
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 6rem' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Top Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(`/team/${team.id}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              color: '#94a3b8',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <ChevronLeft size={16} /> Back to Team Overview
          </button>

          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
            Recruiting for: <strong style={{ color: '#2dd4bf' }}>{team.name}</strong> ({team.hackathonName})
          </span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Candidate Discovery & Squad Matching
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginTop: '6px', maxWidth: '780px' }}>
            Discover and invite high-performing students verified via GitHub and technical skill evaluation. Select candidates to compare metrics side-by-side.
          </p>
        </div>

        {/* Filter Controls Card */}
        <div
          className="glass-card"
          style={{
            padding: '1.75rem',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '2.5rem',
          }}
        >
          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search candidate by name, college, bio, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 2.85rem',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
            <Search
              size={20}
              color="#64748b"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Filters Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            {/* Preferred Role Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: '#131b2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              >
                <option value="">All Roles</option>
                <option value="AI/ML">AI/ML Developer</option>
                <option value="Full Stack">Full Stack Developer</option>
                <option value="Frontend">Frontend Developer</option>
                <option value="Backend">Backend Developer</option>
                <option value="UI/UX">UI/UX Designer</option>
                <option value="DevOps">DevOps Engineer</option>
                <option value="Mobile">Mobile Developer</option>
                <option value="Smart Contract">Smart Contract Engineer</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                Department
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: '#131b2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            {/* Availability Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                Availability
              </label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: '#131b2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.85rem',
                }}
              >
                <option value="">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
              </select>
            </div>

            {/* Minimum Score Threshold Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>
                  Min Skill Score
                </label>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2dd4bf' }}>
                  {minScoreFilter}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                step={1}
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2dd4bf' }}
              />
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
            Found <strong style={{ color: '#f8fafc' }}>{filteredCandidates.length}</strong> matching student profiles
          </span>

          {comparisonList.length > 0 && (
            <button
              onClick={() => setShowComparisonModal(true)}
              className="btn-primary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              }}
            >
              <Scale size={16} /> Compare {comparisonList.length} Selected Candidates
            </button>
          )}
        </div>

        {/* Candidates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {filteredCandidates.map((cand) => {
            const hasExistingInvite = invitations.some(
              (i) => i.teamId === team.id && i.candidateId === cand.id && i.status === 'PENDING'
            );
            const isComparing = comparisonList.some((c) => c.id === cand.id);

            return (
              <motion.div
                key={cand.id}
                whileHover={{ y: -6 }}
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: '22px',
                  border: isComparing
                    ? '1px solid rgba(99, 102, 241, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.85) 0%, rgba(13, 18, 32, 0.95) 100%)',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div>
                  {/* Top Bar: Availability Pill & Compare Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        background: cand.availability === 'Available' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: cand.availability === 'Available' ? '#34d399' : '#fbbf24',
                      }}
                    >
                      ● {cand.availability}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleComparison(cand)}
                      style={{
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: isComparing ? '#818cf8' : '#94a3b8',
                        background: isComparing ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.04)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}
                    >
                      <Scale size={14} /> {isComparing ? 'Comparing' : 'Compare'}
                    </button>
                  </div>

                  {/* Profile Info Header with Score Ring */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                      <ScoreRing score={cand.overallScore} size={76} strokeWidth={6} label="Score" />
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                        {cand.fullName}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                        {cand.college} • Year {cand.year}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {cand.department}
                      </div>
                    </div>
                  </div>

                  {/* Bio Preview */}
                  {cand.bio && (
                    <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {cand.bio}
                    </p>
                  )}

                  {/* Preferred Roles */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Preferred Roles
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {cand.preferredRoles.map((r, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: r.isPrimary ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.04)',
                            color: r.isPrimary ? '#a5b4fc' : '#cbd5e1',
                            border: r.isPrimary ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                          }}
                        >
                          {r.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Skills
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {cand.skills.slice(0, 5).map((sk) => (
                        <span
                          key={sk.id}
                          style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.04)',
                            color: '#94a3b8',
                          }}
                        >
                          {sk.name}
                        </span>
                      ))}
                      {cand.skills.length > 5 && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b', padding: '2px 4px' }}>
                          +{cand.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons Footer */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCandidate(cand)}
                    className="btn-secondary btn-sm"
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    View Profile
                  </button>

                  {hasExistingInvite ? (
                    <button
                      disabled
                      className="btn-secondary btn-sm"
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.825rem',
                        background: 'rgba(245, 158, 11, 0.12)',
                        color: '#fbbf24',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Clock size={14} /> Invite Sent
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenInviteModal(cand)}
                      className="btn-primary btn-sm"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                      }}
                    >
                      <Send size={14} /> Invite
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ================= MODAL: CANDIDATE PROFILE DETAILS ================= */}
        {selectedCandidate && (
          <Modal
            isOpen={!!selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            title="Candidate Profile"
          >
            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <ScoreRing score={selectedCandidate.overallScore} size={84} strokeWidth={7} label="Overall" />
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                    {selectedCandidate.fullName}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    {selectedCandidate.college} • Year {selectedCandidate.year}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
                    {selectedCandidate.department} • {selectedCandidate.availability}
                  </div>
                </div>
              </div>

              {selectedCandidate.bio && (
                <div style={{ marginBottom: '1.25rem', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>{selectedCandidate.bio}</p>
                </div>
              )}

              {/* Scores Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Verified Skills</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
                    {selectedCandidate.skills.length} Skills
                  </div>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>GitHub Score</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c084fc' }}>
                    {selectedCandidate.githubScore}/100
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Skills & Proficiency
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedCandidate.skills.map((s) => (
                    <span
                      key={s.id}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '0.8rem',
                        color: '#f8fafc',
                      }}
                    >
                      {s.name} {s.proficiency && <span style={{ color: '#94a3b8' }}>({s.proficiency})</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* GitHub Breakdown if available */}
              {selectedCandidate.githubAnalysis && (
                <div style={{ marginBottom: '1.5rem', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                    <Github size={16} /> GitHub Analysis (@{selectedCandidate.githubAnalysis.username})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    <span>Repos: <strong>{selectedCandidate.githubAnalysis.publicRepos}</strong></span>
                    <span>Stars: <strong>{selectedCandidate.githubAnalysis.totalStars}</strong></span>
                    <span>Activity: <strong>{selectedCandidate.githubAnalysis.recentActivityLevel}</strong></span>
                  </div>
                </div>
              )}

              {/* Action Buttons inside modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="btn-secondary btn-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cand = selectedCandidate;
                    setSelectedCandidate(null);
                    handleOpenInviteModal(cand);
                  }}
                  className="btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)' }}
                >
                  <Send size={14} /> Invite to Squad
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ================= MODAL: SEND INVITATION ================= */}
        {inviteModalCandidate && (
          <Modal
            isOpen={!!inviteModalCandidate}
            onClose={() => setInviteModalCandidate(null)}
            title={`Invite ${inviteModalCandidate.fullName}`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Assign Role on Team "{team.name}"
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: '#131b2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '0.9rem',
                  }}
                >
                  {team.openRoles.map((role) => (
                    <option key={role} value={role}>
                      {role} (Open Role)
                    </option>
                  ))}
                  {inviteModalCandidate.preferredRoles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name} (Candidate Preferred)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Personal Invitation Message
                </label>
                <textarea
                  rows={4}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setInviteModalCandidate(null)}
                  className="btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={sendingInvite}
                  onClick={handleSendInvite}
                  className="btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)' }}
                >
                  {sendingInvite ? 'Sending...' : 'Send Official Invitation'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ================= MODAL: CANDIDATE COMPARISON ================= */}
        {showComparisonModal && (
          <Modal
            isOpen={showComparisonModal}
            onClose={() => setShowComparisonModal(false)}
            title={`Comparing ${comparisonList.length} Candidates`}
          >
            <div style={{ overflowX: 'auto', padding: '0.5rem 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${comparisonList.length}, minmax(220px, 1fr))`, gap: '1.25rem' }}>
                {comparisonList.map((cand) => (
                  <div
                    key={cand.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <ScoreRing score={cand.overallScore} size={70} strokeWidth={6} label="Score" />
                      <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc', marginTop: '8px' }}>
                        {cand.fullName}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {cand.college} • Year {cand.year}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase' }}>Verified Skills</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{cand.skills.length} Skills</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase' }}>GitHub Score</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c084fc' }}>{cand.githubScore}/100</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase' }}>Top Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                        {cand.skills.slice(0, 4).map((s) => (
                          <span key={s.id} style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowComparisonModal(false);
                          handleOpenInviteModal(cand);
                        }}
                        className="btn-primary btn-sm"
                        style={{ width: '100%', fontSize: '0.8rem', padding: '6px' }}
                      >
                        Invite {cand.fullName.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
