import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Users,
  Compass,
  Sparkles,
  Layers,
  CheckCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
  Send,
  UserCheck,
  Award,
  Github,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Team, EnrichedCandidate } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ScoreRing } from '../../components/common/ScoreRing';

export const FindTeamPage: React.FC = () => {
  const { teams, user, joinRequests, createJoinRequest, allCandidates } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Modal states
  const [requestModalTeam, setRequestModalTeam] = useState<Team | null>(null);
  const [requestRole, setRequestRole] = useState<string>('');
  const [requestMessage, setRequestMessage] = useState<string>('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [ownerProfileModal, setOwnerProfileModal] = useState<EnrichedCandidate | null>(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [hackathonFilter, setHackathonFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState<number | ''>('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [maxSizeFilter, setMaxSizeFilter] = useState<number | ''>('');
  const [hasOpenPositionsOnly, setHasOpenPositionsOnly] = useState(false);

  // Extract unique filter options
  const uniqueHackathons = useMemo(() => {
    return Array.from(new Set(teams.map((t) => t.hackathonName)));
  }, [teams]);

  const uniqueRoles = useMemo(() => {
    const rolesSet = new Set<string>();
    teams.forEach((t) => {
      (t.requiredRoles || []).forEach((r) => rolesSet.add(r));
      (t.openRoles || []).forEach((r) => rolesSet.add(r));
    });
    return Array.from(rolesSet);
  }, [teams]);

  const uniqueSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    teams.forEach((t) => {
      (t.requiredSkills || []).forEach((s) => skillsSet.add(s));
    });
    return Array.from(skillsSet);
  }, [teams]);

  // Filtered teams list
  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesHackathon = t.hackathonName.toLowerCase().includes(q);
        const matchesSkills = (t.requiredSkills || []).some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesHackathon && !matchesSkills) return false;
      }

      // Hackathon filter
      if (hackathonFilter && t.hackathonName !== hackathonFilter) return false;

      // Role filter
      if (
        roleFilter &&
        !(t.requiredRoles || []).includes(roleFilter) &&
        !(t.openRoles || []).includes(roleFilter)
      ) {
        return false;
      }

      // Skill filter
      if (skillFilter && !(t.requiredSkills || []).includes(skillFilter)) {
        return false;
      }

      // Department filter
      if (
        departmentFilter &&
        t.preferredDept &&
        !t.preferredDept.toLowerCase().includes(departmentFilter.toLowerCase())
      ) {
        return false;
      }

      // Team size filter
      if (maxSizeFilter && t.maxTeamSize > Number(maxSizeFilter)) {
        return false;
      }

      // Open positions filter
      if (hasOpenPositionsOnly && (!t.openRoles || t.openRoles.length === 0)) {
        return false;
      }

      return true;
    });
  }, [
    teams,
    search,
    hackathonFilter,
    roleFilter,
    skillFilter,
    departmentFilter,
    maxSizeFilter,
    hasOpenPositionsOnly,
  ]);

  const openOwnerProfile = (ownerId: string) => {
    const candidate = allCandidates.find((c) => c.id === ownerId);
    if (candidate) {
      setOwnerProfileModal(candidate);
    } else {
      toast.info('Owner profile details are currently being updated.');
    }
  };

  const openRequestModal = (team: Team) => {
    if (!user) {
      toast.error('Please log in to request to join a team.');
      navigate('/login');
      return;
    }
    setRequestModalTeam(team);
    setRequestRole(
      team.openRoles && team.openRoles.length > 0
        ? team.openRoles[0]
        : team.requiredRoles[0] || 'Member'
    );
    setRequestMessage('');
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalTeam) return;

    if (!requestRole.trim()) {
      toast.error('Please select or specify a role.');
      return;
    }

    setSubmittingRequest(true);
    const result = createJoinRequest(requestModalTeam.id, requestRole, requestMessage);
    setSubmittingRequest(false);

    if (result.success) {
      toast.success(result.message);
      setRequestModalTeam(null);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Compass size={16} /> Find a Team
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Find a Hackathon Team
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginTop: '6px', maxWidth: '780px' }}>
            Discover teams actively seeking contributors matching your skills. To join a squad, Team Owners review candidate profiles and extend direct invitations.
          </p>
        </div>

        {/* Notice Banner */}
        <div
          style={{
            marginBottom: '2rem',
            padding: '1rem 1.25rem',
            borderRadius: '14px',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Info size={20} color="#818cf8" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
            <strong>Invitation-Based Membership:</strong> CrewForge uses a merit-based invitation model. View any team's details to see what skills and positions they require. Team Owners discover active students and send invitations directly to your dashboard inbox.
          </span>
        </div>

        {/* Search & Comprehensive Filters Card */}
        <div
          className="glass-card"
          style={{
            padding: '1.75rem',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '2.5rem',
          }}
        >
          {/* Main Search Input */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search teams by name, hackathon, description, or tech stack..."
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

          {/* Filter Dropdowns Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Hackathon Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                Hackathon
              </label>
              <select
                value={hackathonFilter}
                onChange={(e) => setHackathonFilter(e.target.value)}
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
                <option value="">All Hackathons</option>
                {uniqueHackathons.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Roles Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                Required Role
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
                {uniqueRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Skills Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                Required Skill
              </label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
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
                <option value="">All Skills</option>
                {uniqueSkills.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
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

            {/* Team Size Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                Max Team Size
              </label>
              <select
                value={maxSizeFilter}
                onChange={(e) => setMaxSizeFilter(e.target.value ? Number(e.target.value) : '')}
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
                <option value="">Any Size</option>
                <option value="4">Up to 4</option>
                <option value="5">Up to 5</option>
                <option value="6">Up to 6</option>
              </select>
            </div>

            {/* Open Positions Only Toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setHasOpenPositionsOnly(!hasOpenPositionsOnly)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: hasOpenPositionsOnly ? 'rgba(45, 212, 191, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: hasOpenPositionsOnly ? '1px solid rgba(45, 212, 191, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                  color: hasOpenPositionsOnly ? '#2dd4bf' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  height: '38px',
                }}
              >
                {hasOpenPositionsOnly ? '✓ Open Roles Only' : 'Show All Teams'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
            Showing <strong style={{ color: '#f8fafc' }}>{filteredTeams.length}</strong> available hackathon teams
          </span>

          {(search || hackathonFilter || roleFilter || skillFilter || departmentFilter || maxSizeFilter || hasOpenPositionsOnly) && (
            <button
              onClick={() => {
                setSearch('');
                setHackathonFilter('');
                setRoleFilter('');
                setSkillFilter('');
                setDepartmentFilter('');
                setMaxSizeFilter('');
                setHasOpenPositionsOnly(false);
              }}
              style={{ fontSize: '0.825rem', color: '#818cf8', fontWeight: 600 }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Teams Cards Grid */}
        {filteredTeams.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Compass size={48} color="#6366f1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.35rem', color: '#f8fafc', fontWeight: 700 }}>
              No hackathon teams found matching your filters.
            </h3>
            <p style={{ color: '#94a3b8', marginTop: '6px', maxWidth: '440px', margin: '6px auto 1.5rem' }}>
              Try broadening your filter criteria or search query to find more open squads.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredTeams.map((team) => (
              <motion.div
                key={team.id}
                whileHover={{ y: -6 }}
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: '22px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.85) 0%, rgba(13, 18, 32, 0.95) 100%)',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div>
                  {/* Top Hackathon & Size Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#a5b4fc',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      {team.hackathonName}
                    </span>

                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} /> {team.currentMemberCount} / {team.maxTeamSize} Members
                    </span>
                  </div>

                  {/* Team Name */}
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: '#f8fafc',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {team.name}
                  </h3>

                  {/* Team Leader / Owner with clickable profile */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    {team.ownerAvatar ? (
                      <img
                        src={team.ownerAvatar}
                        alt={team.ownerName}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#06b6d4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#fff',
                        }}
                      >
                        {team.ownerName[0]}
                      </div>
                    )}
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Led by{' '}
                      <button
                        type="button"
                        onClick={() => openOwnerProfile(team.ownerId)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#38bdf8',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        {team.ownerName}
                      </button>
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.925rem',
                      color: '#cbd5e1',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                    }}
                  >
                    {team.description}
                  </p>

                  {/* Open Roles */}
                  {team.openRoles && team.openRoles.length > 0 && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Open Roles ({team.openRoles.length})
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {team.openRoles.map((role, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              padding: '3px 9px',
                              borderRadius: '6px',
                              background: 'rgba(56, 189, 248, 0.12)',
                              color: '#7dd3fc',
                              border: '1px solid rgba(56, 189, 248, 0.25)',
                            }}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Required Skills */}
                  {team.requiredSkills && team.requiredSkills.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Required Tech Stack
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {team.requiredSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.05)',
                              color: '#cbd5e1',
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Status & Actions */}
                <div
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Min Score: {team.minCandidateScore}%
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {user?.id === team.ownerId ? (
                      <button
                        onClick={() => navigate(`/team/${team.id}`)}
                        className="btn-secondary btn-sm"
                        style={{
                          padding: '7px 14px',
                          fontSize: '0.825rem',
                          background: 'rgba(45, 212, 191, 0.15)',
                          color: '#2dd4bf',
                          border: '1px solid rgba(45, 212, 191, 0.3)',
                        }}
                      >
                        Manage Team →
                      </button>
                    ) : team.members.some((m) => m.userId === user?.id) ? (
                      <span
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}
                      >
                        ✓ Official Member
                      </span>
                    ) : joinRequests.some((r) => r.teamId === team.id && r.candidateId === user?.id && r.status === 'PENDING') ? (
                      <span
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}
                      >
                        ⏳ Request Pending
                      </span>
                    ) : team.currentMemberCount >= team.maxTeamSize ? (
                      <span
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#94a3b8',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        Squad Full
                      </span>
                    ) : (
                      <button
                        onClick={() => openRequestModal(team)}
                        className="btn-primary btn-sm"
                        style={{
                          padding: '7px 14px',
                          fontSize: '0.825rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Send size={13} /> Request to Join
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/find-team/${team.id}`)}
                      className="btn-secondary btn-sm"
                      style={{
                        padding: '7px 12px',
                        fontSize: '0.825rem',
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ================= REQUEST TO JOIN MODAL ================= */}
        {requestModalTeam && (
          <Modal
            isOpen={!!requestModalTeam}
            onClose={() => setRequestModalTeam(null)}
            title={`Request to Join "${requestModalTeam.name}"`}
            subtitle={`${requestModalTeam.hackathonName} • Owned by ${requestModalTeam.ownerName}`}
            maxWidth="520px"
          >
            <form onSubmit={handleSendRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                  Select Position / Role you want to apply for *
                </label>
                {requestModalTeam.openRoles && requestModalTeam.openRoles.length > 0 ? (
                  <select
                    value={requestRole}
                    onChange={(e) => setRequestRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#131b2e',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                  >
                    {requestModalTeam.openRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={requestRole}
                    onChange={(e) => setRequestRole(e.target.value)}
                    placeholder="e.g. Full Stack Developer"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#131b2e',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                  Note to Team Owner (Optional)
                </label>
                <textarea
                  rows={3}
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Share your strengths, relevant project links or reason you'd like to collaborate..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#131b2e',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', color: '#cbd5e1' }}>
                Your current verified profile ({user?.fullName}, {user?.overallSkillScore}% skill score) will be shared with the team owner for review.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRequestModalTeam(null)}
                  className="btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={14} /> Send Join Request
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* ================= OWNER PROFILE MODAL ================= */}
        {ownerProfileModal && (
          <Modal
            isOpen={!!ownerProfileModal}
            onClose={() => setOwnerProfileModal(null)}
            title="Team Owner Profile"
            subtitle={`${ownerProfileModal.fullName} • ${ownerProfileModal.college}`}
            maxWidth="580px"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <ScoreRing score={ownerProfileModal.overallScore} size={88} strokeWidth={8} label="Skill Score" />
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                    {ownerProfileModal.fullName}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                    {ownerProfileModal.department} • Year {ownerProfileModal.year}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '4px' }}>
                    {ownerProfileModal.college}
                  </div>
                </div>
              </div>

              {ownerProfileModal.bio && (
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Bio
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px' }}>
                    {ownerProfileModal.bio}
                  </p>
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Verified Skills ({ownerProfileModal.skills.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ownerProfileModal.skills.map((s) => (
                    <span
                      key={s.id}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        color: '#7dd3fc',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {s.name} ({s.proficiency})
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  type="button"
                  onClick={() => setOwnerProfileModal(null)}
                  className="btn-secondary btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
