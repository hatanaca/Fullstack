// src/plugins/api.ts
import axios from 'axios';
import type { AuthResponse, User, Project, ProjectForm } from '../types/interfaces';

// Adicionar interface para Task
interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

interface TaskCreateData {
  title: string;
  description: string;
  completed?: boolean;
}

interface TaskUpdateData {
  title?: string;
  description?: string;
  completed?: boolean;
}

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
  console.log('🔄 Making request to:', config.url);
  console.log('🔑 Token present:', !!token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.error('❌ Request interceptor error:', error);
  return Promise.reject(error);
});

// Interceptor de response → deixa o Axios rejeitar 4xx/5xx
api.interceptors.response.use(
  response => {
    console.log('✅ Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default {
  // === AUTH METHODS ===
  
  // Retorna exatamente o AuthResponse: { message, user, token }
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/login', { email, password });
    if (!response.data.token || !response.data.user) {
      console.error('Resposta inválida do servidor:', response.data);
      throw new Error('Resposta inválida do servidor de autenticação');
    }
    return response.data;
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
    
    // Log da resposta completa para debug
    console.log('Resposta completa do registro:', response.data);
    
    if (!response.data.token || !response.data.user) {
      console.error('Resposta inválida do servidor:', response.data);
      throw new Error('Resposta inválida do servidor de autenticação');
    }
    return response.data;
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
  },

  // === TASK METHODS ===
  
  // Buscar todas as tasks do usuário atual
  async getTasks(): Promise<Task[]> {
    try {
      const response = await api.get('/tasks/my');
      if (Array.isArray(response.data)) {
        return response.data as Task[];
      }
      console.error('Resposta inválida do servidor:', response.data);
      throw new Error('Erro ao buscar tarefas: formato de resposta inválido');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Buscar uma task específica (verifica se pertence ao usuário atual)
  async getTask(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    const task = response.data as Task;
    
    // Verifica se a task pertence ao usuário atual
    const currentUser = await this.me();
    if (task.user_id !== currentUser.id) {
      throw new Error('Você não tem permissão para acessar esta tarefa.');
    }
    
    return task;
  },

  // Criar nova task (automaticamente associada ao usuário atual)
  async createTask(taskData: TaskCreateData): Promise<Task> {
    const response = await api.post('/tasks', taskData);
    return response.data as Task;
  },

  // Atualizar task existente (verifica se pertence ao usuário atual)
  async updateTask(id: number, taskData: TaskUpdateData): Promise<Task> {
    // Primeiro verifica se a task pertence ao usuário
    await this.getTask(id);
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data as Task;
  },

  // Deletar task (verifica se pertence ao usuário atual)
  async deleteTask(id: number): Promise<void> {
    // Primeiro verifica se a task pertence ao usuário
    await this.getTask(id);
    await api.delete(`/tasks/${id}`);
  },

  // Marcar task como concluída/não concluída (verifica se pertence ao usuário atual)
  async toggleTaskCompletion(id: number): Promise<Task> {
    // Primeiro verifica se a task pertence ao usuário
    await this.getTask(id);
    const response = await api.put(`/tasks/${id}/toggle`);
    return response.data as Task;
  },

  // === PROJECT METHODS ===
  async getProjects(): Promise<Project[]> {
    const response = await api.get('/projects');
    return response.data as Project[];
  },

  async createProject(projectData: ProjectForm): Promise<Project> {
    const response = await api.post('/projects', projectData);
    return response.data as Project;
  },

  async updateProject(id: number, projectData: ProjectForm): Promise<Project> {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data as Project;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  // === USER METHODS ===
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data as User[];
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data as User;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};

// Exportar também os tipos para usar em outros arquivos
export type { Task, TaskCreateData, TaskUpdateData };
