import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../../core/entities/User';
import { AuthRepositoryImpl } from '../../data/auth/AuthRepositoryImpl';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const authRepo = new AuthRepositoryImpl();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionUser = authRepo.getSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setIsLoading(false);
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    authRepo.saveSession(newUser);
  };

  const logout = () => {
    setUser(null);
    authRepo.clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
