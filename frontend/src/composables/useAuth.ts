// src/composables/useAuth.ts
import { reactive, ref, computed } from 'vue'
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

// Token reativo para rastreamento de mudanças
const authToken = ref<string | null>(localStorage.getItem('authToken'))

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
      
      const response = await api.login(email, password)
      
      console.log('Resposta do login:', response)
      
      if (!response.token || !response.user) {
        console.error('Resposta inválida:', response)
        throw new Error('Resposta inválida do servidor')
      }

      localStorage.setItem('authToken', response.token)
      authToken.value = response.token
      globalAuthState.user = response.user
      console.log('Login realizado com sucesso:', response.user)
    } catch (error: any) {
      console.error('Erro no login:', error)
      let errorMessage = 'Erro ao tentar fazer login'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }

      globalAuthState.error = errorMessage
      globalAuthState.user = null
      localStorage.removeItem('authToken')
      authToken.value = null
      throw new Error(errorMessage)
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
      
      const response = await api.register(name, email, password, password_confirmation)
      
      console.log('Resposta do registro:', response)
      
      if (!response.token || !response.user) {
        console.error('Resposta inválida:', response)
        throw new Error('Resposta inválida do servidor')
      }

      localStorage.setItem('authToken', response.token)
      authToken.value = response.token
      globalAuthState.user = response.user
      console.log('Registro realizado com sucesso:', response.user)
    } catch (error: any) {
      console.error('Erro no registro:', error)
      let errorMessage = 'Erro ao tentar registrar'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join(', ')
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }

      globalAuthState.error = errorMessage
      globalAuthState.user = null
      localStorage.removeItem('authToken')
      authToken.value = null
      throw new Error(errorMessage)
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
      authToken.value = null // Limpa o token reativo
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
      console.log('Nenhum token encontrado no localStorage')
      globalAuthState.user = null
      authToken.value = null
      globalAuthState.loading = false
      return false
    }

    try {
      globalAuthState.loading = true
      globalAuthState.error = ''

      console.log('Verificando autenticação...')
      const user = await api.me()
      
      if (!user || !user.id) {
        throw new Error('Usuário inválido recebido do servidor')
      }
      
      console.log('User recebido do /me:', user)
      
      globalAuthState.user = user
      authToken.value = token // Sincroniza o token reativo
      console.log('Usuário autenticado:', user)
      return true
    } catch (error) {
      console.error('Erro na verificação de auth:', error)
      // Limpa completamente o estado de autenticação
      localStorage.removeItem('authToken')
      authToken.value = null
      globalAuthState.user = null
      globalAuthState.error = 'Sessão expirada ou inválida'
      return false
    } finally {
      globalAuthState.loading = false
    }
  }

  /**
   * Inicializa a autenticação.
   */
  const initAuth = async (): Promise<void> => {
    if (!isInitializing.value) {
      console.log('Inicialização já foi realizada')
      return
    }
    
    console.log('Iniciando verificação de autenticação...')
    try {
      // Limpa o estado antes de verificar
      globalAuthState.user = null
      globalAuthState.error = ''
      
      const isAuthenticated = await checkAuth()
      console.log('Estado de autenticação inicial:', { 
        isAuthenticated,
        hasToken: !!authToken.value,
        hasUser: !!globalAuthState.user,
        userId: (globalAuthState.user as User | null)?.id
      })
      
      if (!isAuthenticated || !(globalAuthState.user as User | null)?.id) {
        console.log('Limpando estado por autenticação inválida')
        localStorage.removeItem('authToken')
        authToken.value = null
        globalAuthState.user = null
      }
    } catch (error) {
      console.error('Erro na inicialização da autenticação:', error)
      // Limpa o estado em caso de erro
      localStorage.removeItem('authToken')
      authToken.value = null
      globalAuthState.user = null
      globalAuthState.error = 'Erro ao inicializar autenticação'
    } finally {
      isInitializing.value = false
      resolveReady(null)
    }
  }

  const clearError = (): void => {
    globalAuthState.error = ''
  }

  // Computed reativo para isAuthenticated
  const isAuthenticated = computed(() => {
    // Só considera autenticado se tiver tanto o token quanto o usuário com ID válido
    return !!authToken.value && !!globalAuthState.user?.id
  })

  // Getters
  const getters = {
    get currentUser(): User | null {
      return globalAuthState.user;
    },
    get isLoading(): boolean {
      return globalAuthState.loading;
    },
    get hasError(): boolean {
      return !!globalAuthState.error;
    },
    get errorMessage(): string {
      return globalAuthState.error;
    },
    get isInitializing(): boolean {
      return isInitializing.value;
    },
    get ready(): Promise<unknown> {
      return readyPromise;
    }
  };

  // Inicializa a verificação de auth
  initAuth();

  return {
    ...getters,
    login,
    logout,
    register,
    clearError,
    isAuthenticated,
    checkAuth,
    initAuth
  }
}

export default useAuth
