// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ProfileMode } from '../types';
import { INITIAL_USER, INITIAL_FAMILY_MEMBERS } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  profileMode: ProfileMode;
  setProfileMode: (mode: ProfileMode) => void;
  login: (email: string, role?: 'mother' | 'father' | 'guardian') => void;
  register: (name: string, email: string, role: 'mother' | 'father' | 'guardian') => void;
  switchUserRole: (memberId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nesta_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [profileMode, setProfileModeState] = useState<ProfileMode>(() => {
    const saved = localStorage.getItem('nesta_profile_mode');
    return (saved as ProfileMode) || 'child';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('nesta_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nesta_user');
    }
  }, [user]);

  const setProfileMode = (mode: ProfileMode) => {
    setProfileModeState(mode);
    localStorage.setItem('nesta_profile_mode', mode);
  };

  const login = (email: string, role: 'mother' | 'father' | 'guardian' = 'mother') => {
    const matchingMember = INITIAL_FAMILY_MEMBERS.find(m => m.email.toLowerCase() === email.toLowerCase());
    const newUser: UserProfile = {
      id: matchingMember ? matchingMember.id : 'usr_custom',
      name: matchingMember ? matchingMember.name : (role === 'father' ? 'Михаил Сабитов' : 'Анна Сабитова'),
      email: email,
      role: role,
      avatarUrl: matchingMember?.avatarUrl || INITIAL_USER.avatarUrl,
      accessLevel: matchingMember?.role || 'owner'
    };
    setUser(newUser);
  };

  const register = (name: string, email: string, role: 'mother' | 'father' | 'guardian') => {
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      email,
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      accessLevel: 'owner'
    };
    setUser(newUser);
  };

  const switchUserRole = (memberId: string) => {
    const member = INITIAL_FAMILY_MEMBERS.find(m => m.id === memberId);
    if (member) {
      setUser({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.relationship === 'Папа' ? 'father' : (member.relationship === 'Мама' ? 'mother' : 'guardian'),
        avatarUrl: member.avatarUrl,
        accessLevel: member.role
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      profileMode,
      setProfileMode,
      login,
      register,
      switchUserRole,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
