// src/composables/useAuth.ts
import { reactive, ref } from 'vue'
import type { AuthResponse, User } from '../types/interfaces'
import api from '../plugins/api'

type AuthState = {
  user: User | null
  loading: boolean
  error: string
}

const globalAuthState = reactive<AuthState>({
  user: null,
  loading: false,
  error: ''
})

// Variáveis para controle de inicialização
const isInitializing = ref(true)
let resolveReady: (value: unknown) => void
const readyPromise = new Promise((resolve) => {
  resolveReady = resolve
})

export function useAuth() {
  /**
   * Faz login do usuário.
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      globalAuthState.loading = true
      globalAuthState.error = ''
      
      console.log('Tentando fazer login...', { email })
      
      const { token, user } = await api.login(email, password)
      
      console.log('Token recebido:', token)
      console.log('User recebido:', user)

      if (!token || !user) {
        throw new Error('Token ou usuário não recebidos do servidor')
      }

      localStorage.setItem('authToken', token)
      globalAuthState.user = user
      console.log('Login realizado com sucesso:', user)
    } catch (error: any) {
      console.error('Erro no login:', error)
      let errorMessage = 'Erro desconhecido no login'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      globalAuthState.error = errorMessage
      globalAuthState.user = null
      localStorage.removeItem('authToken')
      throw error
    } finally {
      globalAuthState.loading = false
    }
  }

  /**
   * Registra um novo usuário.
   */
  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<void> => {
    try {
      globalAuthState.loading = true
      globalAuthState.error = ''

      console.log('Tentando registrar usuário...', { name, email })
      
      const { token, user } = await api.register(name, email, password, password_confirmation)
      
      console.log('Token recebido:', token)
      console.log('User recebido:', user)

      if (!token || !user) {
        throw new Error('Token ou usuário não recebidos do servidor')
      }

      localStorage.setItem('authToken', token)
      globalAuthState.user = user
      console.log('Registro realizado com sucesso:', user)
    } catch (error: any) {
      console.error('Erro no registro:', error)
      let errorMessage = 'Erro desconhecido no registro'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join(', ')
      } else if (error.message) {
        errorMessage = error.message
      }

      globalAuthState.error = errorMessage
      globalAuthState.user = null
      localStorage.removeItem('authToken')
      throw error
    } finally {
      globalAuthState.loading = false
    }
  }

  /**
   * Faz logout do usuário.
   */
  const logout = async (): Promise<void> => {
    try {
      globalAuthState.loading = true
      await api.logout()
      console.log('Logout realizado no servidor')
    } catch (error) {
      console.error('Erro no logout do servidor:', error)
    } finally {
      localStorage.removeItem('authToken')
      globalAuthState.user = null
      globalAuthState.error = ''
      globalAuthState.loading = false
      console.log('Estado local limpo')
    }
  }

  /**
   * Verifica autenticação inicial.
   */
  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      globalAuthState.user = null
      globalAuthState.loading = false
      return false
    }

    try {
      globalAuthState.loading = true
      globalAuthState.error = ''

      console.log('Verificando autenticação...')
      const user = await api.me()
      
      console.log('User recebido do /me:', user)
      
      globalAuthState.user = user
      console.log('Usuário autenticado:', user)
      return true
    } catch (error) {
      console.error('Erro na verificação de auth:', error)
      localStorage.removeItem('authToken')
      globalAuthState.user = null
      globalAuthState.error = ''
      return false
    } finally {
      globalAuthState.loading = false
    }
  }

  /**
   * Inicializa a autenticação.
   */
  const initAuth = async (): Promise<void> => {
    if (!isInitializing.value) return
    
    try {
      await checkAuth()
    } finally {
      isInitializing.value = false
      resolveReady(null)
    }
  }

  const clearError = (): void => {
    globalAuthState.error = ''
  }

  return {
    state: globalAuthState,
    login,
    register,
    logout,
    checkAuth,
    initAuth,
    clearError,
    get isAuthenticated(): boolean {
      return !!globalAuthState.user && !!localStorage.getItem('authToken')
    },
    get currentUser(): User | null {
      return globalAuthState.user
    },
    get isLoading(): boolean {
      return globalAuthState.loading
    },
    get hasError(): boolean {
      return !!globalAuthState.error
    },
    get errorMessage(): string {
      return globalAuthState.error
    },
    get isInitializing(): boolean {
      return isInitializing.value
    },
    ready: readyPromise
  }
}

export default useAuth
