import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Instructor } from '../utils/mockData';
import { INITIAL_INSTRUCTOR } from '../utils/mockData';

interface AuthContextType {
  authUser: Instructor | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<Instructor | null>(() => {
    const saved = localStorage.getItem('testchecker_auth_user');
    return saved ? JSON.parse(saved) : INITIAL_INSTRUCTOR;
  });

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('testchecker_auth_user', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('testchecker_auth_user');
    }
  }, [authUser]);

  const login = (email: string, password: string): boolean => {
    if (email.trim() && password.trim()) {
      const user: Instructor = {
        ...INITIAL_INSTRUCTOR,
        email: email
      };
      setAuthUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        login,
        logout,
        isAuthenticated: !!authUser
      }}
    >
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
