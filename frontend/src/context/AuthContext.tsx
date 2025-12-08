import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, detectUserRole } from '../services/api';
import type { LoginRequest, SignUpRequest, LoginResponse, RoleType, Patient } from '../types';
import { getHighestRoleFromToken, getUsernameFromToken } from '../utils/jwt';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  userRole: RoleType | null;
  patientProfile: Patient | null;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignUpRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshUserRole: () => Promise<void>;
  hasRole: (role: RoleType) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null
  );
  const [userRole, setUserRole] = useState<RoleType | null>(() => {
    const stored = localStorage.getItem('userRole');
    return stored ? (stored as RoleType) : null;
  });
  const [lastUsername, setLastUsername] = useState<string | null>(localStorage.getItem('lastUsername'));
  const [patientProfile, setPatientProfile] = useState<Patient | null>(() => {
    try {
      const raw = localStorage.getItem('patientProfile');
      return raw ? (JSON.parse(raw) as Patient) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // --- helpers: cache role by username (frontend-only) ---
  const getCachedRole = (username?: string | null): RoleType | null => {
    if (!username) return null;
    try {
      const raw = localStorage.getItem('userRoleByUsername');
      if (!raw) return null;
      const map = JSON.parse(raw) as Record<string, RoleType>;
      return map[username] || null;
    } catch {
      return null;
    }
  };

  const setCachedRole = (username: string, role: RoleType) => {
    try {
      const raw = localStorage.getItem('userRoleByUsername');
      const map = raw ? (JSON.parse(raw) as Record<string, RoleType>) : {};
      map[username] = role;
      localStorage.setItem('userRoleByUsername', JSON.stringify(map));
    } catch {
      // ignore cache errors
    }
  };

  const refreshUserRole = async () => {
    if (!token) {
      setUserRole(null);
      return;
    }
    try {
      const role = await detectUserRole();
      setUserRole(role as RoleType);
    } catch (error) {
      console.error('Error detecting user role:', error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Refresh role when token changes
      refreshUserRole();
    } else {
      localStorage.removeItem('token');
      setUserRole(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId.toString());
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [userRole]);

  useEffect(() => {
    if (patientProfile) {
      localStorage.setItem('patientProfile', JSON.stringify(patientProfile));
    } else {
      localStorage.removeItem('patientProfile');
    }
  }, [patientProfile]);

  useEffect(() => {
    if (lastUsername) {
      localStorage.setItem('lastUsername', lastUsername);
    } else {
      localStorage.removeItem('lastUsername');
    }
  }, [lastUsername]);

  const login = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const response: LoginResponse = await authAPI.login(data);
      setToken(response.jwt);
      setUserId(response.userId);
      setLastUsername(data.username);

      // 1) Try JWT role immediately
      const roleFromToken = getHighestRoleFromToken(response.jwt);
      if (roleFromToken) {
        setUserRole(roleFromToken);
        localStorage.setItem('userRole', roleFromToken);
        setCachedRole(data.username, roleFromToken);
      }

      // 2) Fallback to cached role by username (from prior signup)
      const cachedRole = getCachedRole(data.username);
      if (cachedRole) {
        setUserRole(cachedRole);
        localStorage.setItem('userRole', cachedRole);
      }

      // 3) Cache patient profile if provided in login response
      if (response.patient) {
        setPatientProfile(response.patient as Patient);
        localStorage.setItem('patientProfile', JSON.stringify(response.patient));
      }

      // Role will be detected in useEffect when token is set
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignUpRequest) => {
    setLoading(true);
    try {
      // Ensure only one role is sent
      const signupData = {
        ...data,
        roles: data.roles.length > 0 ? [data.roles[0]] : ['PATIENT'],
      };
      
      // Store the selected role BEFORE signup/login so we can use it immediately
      const selectedRole = signupData.roles[0] as RoleType;
      
      await authAPI.signup(signupData);
      
      // Set the role immediately from signup data (before role detection)
      setUserRole(selectedRole);
      localStorage.setItem('userRole', selectedRole);
      setCachedRole(data.username, selectedRole);
      setLastUsername(data.username);
      
      // After signup, automatically login
      await login({ username: data.username, password: data.password });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setUserRole(null);
    setPatientProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('patientProfile');
    localStorage.removeItem('userRoleByUsername');
    localStorage.removeItem('lastUsername');
  };

  const hasRole = (role: RoleType): boolean => {
    return userRole === role;
  };

  const value: AuthContextType = {
    isAuthenticated: !!token,
    token,
    userId,
    userRole,
    patientProfile,
    login,
    signup,
    logout,
    loading,
    refreshUserRole,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

