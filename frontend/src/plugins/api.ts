// src/plugins/api.ts
import axios from 'axios';
import type { AuthResponse, User } from '../types/interfaces';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
  // withCredentials: true // Descomente se necessário para CORS/cookies
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptores de debug (apenas desenvolvimento)
if (import.meta.env.DEV) {
  api.interceptors.request.use(request => {
    console.log('[API] Starting Request:', request);
    return request;
  });

  api.interceptors.response.use(
    response => {
      console.log('[API] Response:', response);
      return response;
    },
    error => {
      console.log('[API] Error:', error.response || error.message);
      return Promise.reject(error);
    }
  );
}

export default {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', { email, password });
    return response.data;
  },

  async register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', {
      name,
      email,
      password,
      password_confirmation
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
  },

  async me(): Promise<User> {
    const response = await api.get<{ user: User }>('/me');
    return response.data.user;
  },

  // Método genérico para outras chamadas API
  async request<T>(config: axios.AxiosRequestConfig): Promise<T> {
    const response = await api.request<T>(config);
    return response.data;
  }
};
