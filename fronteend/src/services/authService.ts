import api from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const getCurrentUser = (): { token: string } | null => {
  const token = localStorage.getItem('token');
  if (token) {
    return { token };
  }
  return null;
};