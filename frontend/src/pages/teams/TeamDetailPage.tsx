import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Users,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Info,
  Sparkles,
  Layers,
  Award,
  Clock,
  CheckCircle,
  Send,
  UserCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ScoreRing } from '../../components/common/ScoreRing';

export const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTeamById, user, joinRequests, createJoinRequest, allCandidates } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const team = getTeamById(id || '');

  // Modal states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showOwnerProfile, setShowOwnerProfile] = useState(false);

  if (!team) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Team not found.</h3>
        <Link to="/find-team" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to Find Teams
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === team.ownerId;
  const isMember = team.members.some((m) => m.userId === user?.id);
  const pendingRequest = joinRequests.find(
    (r) => r.teamId === team.id && r.candidateId === user?.id && r.status === 'PENDING'
  );
  const isFull = team.currentMemberCount >= team.maxTeamSize;
  const ownerDetails = allCandidates.find((c) => c.id === team.ownerId);

  const handleOpenRequestModal = () => {
    if (!user) {
      toast.error('Please log in to request to join this team.');
      navigate('/login');
      return;
    }
    setSelectedRole(team.openRoles && team.openRoles.length > 0 ? team.openRoles[0] : (team.requiredRoles[0] || 'Member'));
    setMessage('');
    setShowRequestModal(true);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole.trim()) {
      toast.error('Please select or specify a role.');
      return;
    }

    setSubmitting(true);
    const result = createJoinRequest(team.id, selectedRole, message);
    setSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setShowRequestModal(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Back navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/find-team')}
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
            <ChevronLeft size={16} /> Back to Find a Team
          </button>
        </div>

        {/* Team Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(180deg, rgba(20, 28, 48, 0.9) 0%, rgba(13, 18, 32, 0.95) 100%)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              {team.hackathonName}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: team.status === 'Recruiting' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: team.status === 'Recruiting' ? '#34d399' : '#fbbf24',
                }}
              >
                {team.status === 'Recruiting' ? '● Currently Recruiting' : '● Squad Full'}
              </span>

              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {team.currentMemberCount} / {team.maxTeamSize} Members
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            {team.name}
          </h1>

          {/* Team Leader Contact / Credit with View Profile button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {team.ownerAvatar ? (
                <img
                  src={team.ownerAvatar}
                  alt={team.ownerName}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#06b6d4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {team.ownerName[0]}
                </div>
              )}
              <span style={{ fontSize: '0.925rem', color: '#cbd5e1' }}>
                Team Owner: <strong style={{ color: '#f8fafc' }}>{team.ownerName}</strong> ({team.ownerEmail})
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowOwnerProfile(true)}
              className="btn-secondary btn-sm"
              style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <UserCheck size={14} /> View Owner Profile
            </button>
          </div>

          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '2rem' }}>
            {team.description}
          </p>

          {/* Dynamic Action / Membership Status Banner */}
          {isOwner ? (
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                background: 'rgba(45, 212, 191, 0.1)',
                border: '1px solid rgba(45, 212, 191, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '0.95rem', color: '#2dd4bf', fontWeight: 600 }}>
                ★ You are the Team Owner of {team.name}.
              </span>
              <Link to={`/team/${team.id}`} className="btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)' }}>
                Open Team Management Dashboard →
              </Link>
            </div>
          ) : isMember ? (
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 600 }}>
                <CheckCircle2 size={18} /> You are an active Team Member of this squad!
              </div>
              <Link to="/my-teams" className="btn-secondary btn-sm">
                View in My Teams →
              </Link>
            </div>
          ) : pendingRequest ? (
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 600 }}>
                <Clock size={18} /> Your join request for "{pendingRequest.roleName}" is pending review by {team.ownerName}.
              </div>
              <Link to="/invitations" className="btn-secondary btn-sm">
                Track Sent Requests →
              </Link>
            </div>
          ) : isFull ? (
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                fontSize: '0.95rem',
              }}
            >
              This team has reached its maximum member limit ({team.maxTeamSize} / {team.maxTeamSize}).
            </div>
          ) : (
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                  Interested in joining {team.name}?
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                  Submit a join request for the team owner to review.
                </div>
              </div>
              <button
                onClick={handleOpenRequestModal}
                className="btn-primary"
                style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Send size={16} /> Request to Join Team
              </button>
            </div>
          )}
        </motion.div>

        {/* Requirements & Open Roles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Open Roles & Requirements */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
              Required Roles & Positions
            </h3>

            {team.openRoles && team.openRoles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                {team.openRoles.map((role, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.9rem' }}>{role}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>
                        Open Position
                      </span>
                    </div>

                    {!isOwner && !isMember && !pendingRequest && !isFull && (
                      <button
                        onClick={() => {
                          setSelectedRole(role);
                          setMessage('');
                          setShowRequestModal(true);
                        }}
                        className="btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        Apply →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>No open roles currently.</p>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Minimum Candidate Score:</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                {team.minCandidateScore}% overall skill score
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
              Required Tech Stack & Skills
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
              {(team.requiredSkills || []).map((sk, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {sk}
                </span>
              ))}
            </div>

            {team.optionalRequirements && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>Optional Requirements:</div>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{team.optionalRequirements}</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Squad Members */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.25rem' }}>
            Current Squad Members ({team.members.length} / {team.maxTeamSize})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {team.members.map((member) => (
              <div
                key={member.id}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.fullName}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: member.isOwner ? '#06b6d4' : '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    {member.fullName[0]}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                    {member.fullName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: member.isOwner ? '#2dd4bf' : '#38bdf8' }}>
                    {member.assignedRole}
                  </div>
                  {member.overallScore && (
                    <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                      Skill Score: {member.overallScore}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= REQUEST TO JOIN MODAL ================= */}
        {showRequestModal && (
          <Modal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            title={`Request to Join "${team.name}"`}
            subtitle={`${team.hackathonName} • Owned by ${team.ownerName}`}
            maxWidth="520px"
          >
            <form onSubmit={handleSendRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                  Select Position / Role *
                </label>
                {team.openRoles && team.openRoles.length > 0 ? (
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
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
                    {team.openRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your background, skills, or why you'd be a great fit for this project..."
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
                Your verified CrewForge profile ({user?.fullName}, {user?.overallSkillScore}% skill score) will be shared with the team owner for review.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={14} /> Submit Request
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* ================= OWNER PROFILE MODAL ================= */}
        {showOwnerProfile && ownerDetails && (
          <Modal
            isOpen={showOwnerProfile}
            onClose={() => setShowOwnerProfile(false)}
            title="Team Owner Profile"
            subtitle={`${ownerDetails.fullName} • ${ownerDetails.college}`}
            maxWidth="580px"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <ScoreRing score={ownerDetails.overallScore} size={88} strokeWidth={8} label="Skill Score" />
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                    {ownerDetails.fullName}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                    {ownerDetails.department} • Year {ownerDetails.year}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '4px' }}>
                    {ownerDetails.college}
                  </div>
                </div>
              </div>

              {ownerDetails.bio && (
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Bio
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px' }}>
                    {ownerDetails.bio}
                  </p>
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Verified Skills ({ownerDetails.skills.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ownerDetails.skills.map((s) => (
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
                  onClick={() => setShowOwnerProfile(false)}
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
