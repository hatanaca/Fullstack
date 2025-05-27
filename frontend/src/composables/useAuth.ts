// src/composables/useAuth.ts
import { reactive } from 'vue'
import type { AuthResponse, User } from '../types/interfaces'
import api from '../plugins/api'

// Estado reativo global compartilhado entre todas as instâncias
const globalAuthState = reactive({
  user: null as User | null,
  loading: false,
  error: ''
})

export function useAuth() {
  
  const login = async (email: string, password: string): Promise<void> => {
    try {
      globalAuthState.loading = true
      globalAuthState.error = ''
      
      console.log('Tentando fazer login...', { email })
      
      const response = await api.login(email, password)
      
      if (response.token && response.user) {
        localStorage.setItem('authToken', response.token)
        globalAuthState.user = response.user
        console.log('Login realizado com sucesso:', response.user)
      } else {
        throw new Error('Resposta inválida do servidor')
      }
      
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
      
      const response = await api.register(name, email, password, password_confirmation)
      
      if (response.token && response.user) {
        localStorage.setItem('authToken', response.token)
        globalAuthState.user = response.user
        console.log('Registro realizado com sucesso:', response.user)
      } else {
        throw new Error('Resposta inválida do servidor')
      }
      
    } catch (error: any) {
      console.error('Erro no registro:', error)
      
      let errorMessage = 'Erro desconhecido no registro'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        // Caso o backend retorne erros de validação
        errorMessage = Object.values(error.response.data.errors).flat().join(', ')
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

  const logout = async (): Promise<void> => {
    try {
      globalAuthState.loading = true
      
      // Tenta fazer logout no servidor
      await api.logout()
      console.log('Logout realizado no servidor')
      
    } catch (error) {
      console.error('Erro no logout do servidor:', error)
      // Mesmo com erro no servidor, fazemos logout local
    } finally {
      // Sempre limpa o estado local
      localStorage.removeItem('authToken')
      globalAuthState.user = null
      globalAuthState.error = ''
      globalAuthState.loading = false
      console.log('Estado local limpo')
    }
  }

  const checkAuth = async (): Promise<void> => {
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      globalAuthState.user = null
      globalAuthState.loading = false
      return
    }

    try {
      globalAuthState.loading = true
      globalAuthState.error = ''
      
      console.log('Verificando autenticação...')
      
      const user = await api.me()
      globalAuthState.user = user
      
      console.log('Usuário autenticado:', user)
      
    } catch (error: any) {
      console.error('Erro na verificação de autenticação:', error)
      
      // Token provavelmente inválido, remove tudo
      localStorage.removeItem('authToken')
      globalAuthState.user = null
      
      // Não mostra erro para checkAuth, apenas limpa
      globalAuthState.error = ''
      
    } finally {
      globalAuthState.loading = false
    }
  }

  const clearError = (): void => {
    globalAuthState.error = ''
  }

  const initAuth = async (): Promise<void> => {
    await checkAuth()
  }

  return {
    // Estado reativo
    state: globalAuthState,
    
    // Métodos principais
    login,
    register,
    logout,
    checkAuth,
    initAuth,
    clearError,
    
    // Getters computados para facilitar o uso
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
    }
  }
}

// Export default para permitir import default se necessário
export default useAuth
