import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isCandidate: boolean;
  isLeader: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('skillsync_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Failed to verify existing session:', err);
      localStorage.removeItem('skillsync_token');
      localStorage.removeItem('skillsync_user');
      localStorage.removeItem('hackmate_token');
      localStorage.removeItem('hackmate_user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('skillsync_token') || localStorage.getItem('hackmate_token');
    const savedUser = localStorage.getItem('skillsync_user') || localStorage.getItem('hackmate_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore parsing error
        }
      }
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('skillsync_token', newToken);
    localStorage.setItem('skillsync_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skillsync_token');
    localStorage.removeItem('skillsync_user');
    localStorage.removeItem('hackmate_token');
    localStorage.removeItem('hackmate_user');
    window.location.href = '/';
  };

  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem('skillsync_token') || localStorage.getItem('hackmate_token');
    if (currentToken) {
      await fetchCurrentUser(currentToken);
    }
  };

  const isCandidate = user?.role === 'candidate';
  const isLeader = user?.role === 'team_leader';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
        isCandidate,
        isLeader,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
