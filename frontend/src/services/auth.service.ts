// src/services/auth.service.ts
import type { AuthResponse, User } from '../types/interfaces';
import api from "../plugins/api";
import { reactive } from 'vue';

export class AuthService {

  public state = reactive({
    user: null as User | null,
    loading: false,
    error: ''
  });

  async login(email: string, password: string): Promise<void> {
    try {
      this.state.loading = true;
      const data = await api.login(email, password);
      localStorage.setItem('authToken', data.token);
      this.state.user = data.user;
      this.state.error = '';
    } catch (error) {
      this.state.error = (error as Error).message || 'Erro no login';
      throw error;
    } finally {
      this.state.loading = false;
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<void> {
    try {
      this.state.loading = true;
      const data = await api.register(name, email, password, password_confirmation);
      localStorage.setItem('authToken', data.token);
      this.state.user = data.user;
      this.state.error = '';
    } catch (error) {
      this.state.error = (error as Error).message || 'Erro no registro';
      throw error;
    } finally {
      this.state.loading = false;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.logout();
    } finally {
      localStorage.removeItem('authToken');
      this.state.user = null;
    }
  }

  async checkAuth(): Promise<void> {
    try {
      this.state.loading = true;
      const user = await api.me();
      this.state.user = user;
    } catch {
      this.state.user = null;
    } finally {
      this.state.loading = false;
    }
  }

  get currentUser(): User | null {
    return this.state.user;
  }

  get isLoading(): boolean {
    return this.state.loading;
  }

  get errorMessage(): string {
    return this.state.error;
  }
}

export const authService = new AuthService();
