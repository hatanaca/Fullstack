// src/types/interfaces.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  user_id?: number;
  project_id?: number;
  project?: Project;
  attachments?: Attachment[];
  comments?: Comment[];
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  user_id?: number;
  tasks?: Task[];
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: number;
  content: string;
  task_id: number;
  user_id: number;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface Attachment {
  id: number;
  filename: string;
  filepath: string;
  task_id: number;
  created_at?: string;
  updated_at?: string;
}

// Tipos para formulários
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface TaskForm {
  title: string;
  description: string;
  completed?: boolean;
  project_id?: number;
}

export interface ProjectForm {
  name: string;
  description: string;
}

// Tipos para API responses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Tipos para erro
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
