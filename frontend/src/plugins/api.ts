// src/plugins/api.ts
import axios from 'axios';
import type { AuthResponse, User } from '../types/interfaces';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Interceptor de request → coloca o Bearer token se existir
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response → deixa o Axios rejeitar 4xx/5xx
api.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default {
  // Retorna exatamente o AuthResponse: { message, user, token }
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/login', { email, password });
    return response.data as AuthResponse;
  },

  // Retorna exatamente o AuthResponse: { message, user, token }
  async register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<AuthResponse> {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation
    });
    return response.data as AuthResponse;
  },

  // Logout não precisa retornar nada
  async logout(): Promise<void> {
    await api.post('/logout');
  },

  // Retorna o usuário: { id, name, email }
  async me(): Promise<User> {
    const response = await api.get('/me');
    return response.data.user as User;
  },

  // Caso precise renovar token
  async refreshToken(): Promise<{ message: string; token: string }> {
    const response = await api.post('/refresh-token');
    return response.data as { message: string; token: string };
  }
};

