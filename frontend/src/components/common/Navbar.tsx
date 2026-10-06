import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { Notification } from '../../types';
import {
  Users,
  Compass,
  FileCheck,
  Award,
  Bell,
  LogOut,
  Layers,
  ChevronRight,
  Shield,
  UserCheck,
  Check,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isCandidate, isLeader, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [pendingInvitesCount, setPendingInvitesCount] = useState<number>(0);

  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    if (user) {
      fetchNotifications();
      if (isCandidate) {
        fetchCandidateInvites();
      }
    }
  }, [user, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  const fetchCandidateInvites = async () => {
    try {
      const res = await apiClient.get('/invitations');
      if (res.data.success) {
        const pending = (res.data.invitations || []).filter(
          (inv: any) => inv.status === 'PENDING'
        );
        setPendingInvitesCount(pending.length);
      }
    } catch {
      // ignore
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await apiClient.put('/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  };

  const scrollToChoosePath = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#choose-path');
      return;
    }
    const el = document.getElementById('choose-path');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#about');
      return;
    }
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      return;
    }
    const el = document.getElementById('hero');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        background: 'rgba(8, 11, 17, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* LOGO */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
            }}
          >
            <Users size={20} color="#ffffff" />
          </div>
          <span
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            HackMate
          </span>
        </Link>

        {/* ================= PUBLIC LANDING NAV ================= */}
        {!user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <a
                href="#hero"
                onClick={scrollToHero}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  color: '#94a3b8',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                Home
              </a>
              <a
                href="#about"
                onClick={scrollToAbout}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  color: '#94a3b8',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                About
              </a>
            </div>

            <button
              onClick={scrollToChoosePath}
              className="btn-primary"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}
            >
              Get Started <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          /* ================= AUTHENTICATED PORTAL NAVS ================= */
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Candidate Nav Links */}
            {isCandidate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <NavLink to="/candidate/dashboard" label="Dashboard" />
                <NavLink to="/candidate/teams" label="Browse Teams" icon={<Compass size={16} />} />
                <NavLink to="/candidate/my-team" label="My Team" icon={<Users size={16} />} />
                <NavLink
                  to="/candidate/invitations"
                  label="Invitations"
                  icon={<FileCheck size={16} />}
                  badge={pendingInvitesCount > 0 ? pendingInvitesCount : undefined}
                />
                <NavLink to="/candidate/quiz" label="Skill Assessment" icon={<Award size={16} />} />
              </div>
            )}

            {/* Team Leader Nav Links */}
            {isLeader && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <NavLink to="/leader/dashboard" label="Dashboard" />
                <NavLink to="/leader/discover" label="Discover Candidates" icon={<UserCheck size={16} />} />
                <NavLink to="/leader/team" label="Team Builder" icon={<Layers size={16} />} />
                <NavLink to="/leader/invitations" label="Sent Invitations" icon={<FileCheck size={16} />} />
              </div>
            )}

            {/* Admin Nav Links */}
            {isAdmin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <NavLink to="/admin" label="Overview" icon={<Shield size={16} />} />
              </div>
            )}

            {/* Notifications Bell Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: 'relative',
                  padding: '8px',
                  borderRadius: '10px',
                  background: showNotifications ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#f43f5e',
                      boxShadow: '0 0 8px #f43f5e',
                    }}
                  />
                )}
              </button>

              {/* Notification Popup */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '340px',
                    background: '#101726',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                    padding: '1rem',
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                      Notifications ({unreadCount})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        style={{ fontSize: '0.75rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Check size={12} /> Mark read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.length === 0 ? (
                      <p style={{ fontSize: '0.825rem', color: '#64748b', textAlign: 'center', padding: '1.5rem 0' }}>
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: notif.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                            border: notif.isRead ? '1px solid transparent' : '1px solid rgba(99, 102, 241, 0.2)',
                          }}
                        >
                          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc' }}>
                            {notif.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                            {notif.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill & Logout */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px 4px 12px',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
                {user.candidateProfile?.fullName?.split(' ')[0] ||
                  user.leaderProfile?.fullName?.split(' ')[0] ||
                  'Admin'}
              </span>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  padding: '6px',
                  borderRadius: '50%',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#f43f5e')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink: React.FC<{
  to: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}> = ({ to, label, icon, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.875rem',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? '#f8fafc' : '#94a3b8',
        padding: '6px 10px',
        borderRadius: '8px',
        background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
        transition: 'all 0.2s',
      }}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && (
        <span
          style={{
            background: '#6366f1',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 700,
            borderRadius: '9999px',
            padding: '1px 6px',
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};
