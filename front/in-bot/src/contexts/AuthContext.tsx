/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@inbot:user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  // No longer need a separate effect to load from localStorage
  // Since we initialize state synchronously, isLoading can be false immediately
  // unless we were doing an async verification check.
  const [isLoading] = useState(false);

  const login = (token: string, newUser: User) => {
    localStorage.setItem('@inbot:token', token);
    localStorage.setItem('@inbot:user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('@inbot:token');
    localStorage.removeItem('@inbot:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
