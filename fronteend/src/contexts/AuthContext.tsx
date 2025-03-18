import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import * as authService from '../services/authService';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp < currentTime) {
              authService.logout();
              setCurrentUser(null);
            } else {
              const response = await api.get(`/users/${decoded.id}`);
              setCurrentUser(response.data);
            }
          } catch (error) {
            authService.logout();
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setCurrentUser(response.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    try {
      const response = await authService.register(credentials);
      setCurrentUser(response.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);