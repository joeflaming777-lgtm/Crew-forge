import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  User as UserIcon,
  ChevronDown,
  Sparkles,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    logout,
    myOwnedTeams,
    myMemberTeams,
    myReceivedInvitations,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    switchDemoUser,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showManageDropdown, setShowManageDropdown] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const pendingInvitesCount = myReceivedInvitations.filter((i) => i.status === 'PENDING').length;

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

  // Determine contextual role label
  const getContextualRole = (): { label: string; color: string; bg: string } => {
    if (!user) return { label: 'Guest', color: '#94a3b8', bg: 'rgba(255,255,255,0.06)' };
    if (myOwnedTeams.length > 0) {
      return {
        label: 'Team Owner',
        color: '#2dd4bf',
        bg: 'rgba(45, 212, 191, 0.12)',
      };
    }
    if (myMemberTeams.length > 0) {
      return {
        label: 'Team Member',
        color: '#818cf8',
        bg: 'rgba(129, 140, 248, 0.12)',
      };
    }
    return {
      label: 'Looking for a Team',
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)',
    };
  };

  const roleInfo = getContextualRole();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        background: 'rgba(8, 11, 17, 0.88)',
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
            SkillSync
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                to="/login"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: '#cbd5e1',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                }}
              >
                Log In
              </Link>
              <button
                onClick={scrollToChoosePath}
                className="btn-primary"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}
              >
                Get Started <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* ================= SINGLE AUTHENTICATED USER NAV ================= */
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Main Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <NavLink to="/dashboard" label="Dashboard" />
              <NavLink to="/find-team" label="Find a Team" icon={<Compass size={16} />} />
              <NavLink to="/my-teams" label="My Teams" icon={<Users size={16} />} />
              <NavLink
                to="/invitations"
                label="Invitations"
                icon={<FileCheck size={16} />}
                badge={pendingInvitesCount > 0 ? pendingInvitesCount : undefined}
              />
              <NavLink to="/profile" label="Profile" icon={<UserIcon size={16} />} />

              {/* If user owns one or more teams, show Manage Teams */}
              {myOwnedTeams.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowManageDropdown(!showManageDropdown)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#2dd4bf',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(45, 212, 191, 0.1)',
                      border: '1px solid rgba(45, 212, 191, 0.25)',
                    }}
                  >
                    <Layers size={15} />
                    <span>Manage Teams ({myOwnedTeams.length})</span>
                    <ChevronDown size={14} />
                  </button>

                  {showManageDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '42px',
                        left: 0,
                        width: '240px',
                        background: '#101726',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        boxShadow: '0 16px 36px rgba(0,0,0,0.6)',
                        padding: '0.5rem',
                        zIndex: 1000,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#64748b',
                          padding: '6px 10px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Teams You Own
                      </div>
                      {myOwnedTeams.map((team) => (
                        <Link
                          key={team.id}
                          to={`/team/${team.id}`}
                          onClick={() => setShowManageDropdown(false)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: '#f8fafc',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{team.name}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{team.hackathonName}</span>
                        </Link>
                      ))}
                      <div
                        style={{
                          borderTop: '1px solid rgba(255,255,255,0.08)',
                          marginTop: '4px',
                          paddingTop: '4px',
                        }}
                      >
                        <Link
                          to="/build-team"
                          onClick={() => setShowManageDropdown(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 10px',
                            fontSize: '0.825rem',
                            color: '#38bdf8',
                            fontWeight: 600,
                          }}
                        >
                          <PlusCircle size={14} /> Create Another Team
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notifications Bell Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowManageDropdown(false);
                  setShowProfileMenu(false);
                }}
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
                {unreadNotificationsCount > 0 && (
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
                      Notifications ({unreadNotificationsCount})
                    </span>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        style={{
                          fontSize: '0.75rem',
                          color: '#6366f1',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={12} /> Mark read
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      maxHeight: '280px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {notifications.length === 0 ? (
                      <p
                        style={{
                          fontSize: '0.825rem',
                          color: '#64748b',
                          textAlign: 'center',
                          padding: '1.5rem 0',
                        }}
                      >
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.link) {
                              navigate(notif.link);
                              setShowNotifications(false);
                            }
                          }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: notif.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                            border: notif.isRead
                              ? '1px solid transparent'
                              : '1px solid rgba(99, 102, 241, 0.2)',
                            cursor: 'pointer',
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

            {/* User Profile Pill & Contextual Role Badge */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 6px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    {user.fullName[0]}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.2 }}>
                    {user.fullName.split(' ')[0]}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: roleInfo.color,
                      lineHeight: 1,
                    }}
                  >
                    {roleInfo.label}
                  </span>
                </div>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '44px',
                    right: 0,
                    width: '220px',
                    background: '#101726',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '14px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                    padding: '0.5rem',
                    zIndex: 1000,
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                      {user.fullName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
                    <div
                      style={{
                        display: 'inline-block',
                        marginTop: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: roleInfo.color,
                        background: roleInfo.bg,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      {roleInfo.label}
                    </div>
                  </div>

                  <div style={{ padding: '4px 0' }}>
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#cbd5e1',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <UserIcon size={15} /> View Full Profile
                    </Link>

                    <Link
                      to="/profile/edit"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#cbd5e1',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Sparkles size={15} /> Edit Skills & Roles
                    </Link>
                  </div>

                  {/* Switch Demo Profile */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      padding: '6px 10px 4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                    }}
                  >
                    Quick Switch Account
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <button
                      onClick={() => {
                        switchDemoUser('user-arjun');
                        setShowProfileMenu(false);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: user.id === 'user-arjun' ? '#6366f1' : '#94a3b8',
                        fontWeight: user.id === 'user-arjun' ? 700 : 500,
                      }}
                    >
                      Arjun Sharma (Owner & Member)
                    </button>
                    <button
                      onClick={() => {
                        switchDemoUser('user-priya');
                        setShowProfileMenu(false);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: user.id === 'user-priya' ? '#6366f1' : '#94a3b8',
                        fontWeight: user.id === 'user-priya' ? 700 : 500,
                      }}
                    >
                      Priya Patel (Looking for Team)
                    </button>
                    <button
                      onClick={() => {
                        switchDemoUser('user-aarav');
                        setShowProfileMenu(false);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: user.id === 'user-aarav' ? '#6366f1' : '#94a3b8',
                        fontWeight: user.id === 'user-aarav' ? 700 : 500,
                      }}
                    >
                      Aarav Mehta (Team Owner)
                    </button>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '4px', paddingTop: '4px' }}>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        navigate('/');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#f43f5e',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244,63,94,0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={15} /> Log Out
                    </button>
                  </div>
                </div>
              )}
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
  const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));

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
        padding: '6px 11px',
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
