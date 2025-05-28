<!-- Auth.vue -->
<template>
  <div class="auth-container">
    <div v-if="showLogin" class="login-form">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="loginEmail">Email:</label>
          <input 
            v-model="loginEmail" 
            type="email" 
            id="loginEmail" 
            required
            pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
            placeholder="exemplo@email.com"
            :class="{ 'error': loginEmailError }"
            @input="validateLoginEmail"
            :disabled="auth.isLoading"
          >
          <small v-if="loginEmailError" class="error-text">{{ loginEmailError }}</small>
        </div>
        <div class="form-group">
          <label for="loginPassword">Senha:</label>
          <input 
            v-model="loginPassword" 
            type="password" 
            id="loginPassword" 
            required
            minlength="6"
            :class="{ 'error': loginPasswordError }"
            @input="validateLoginPassword"
            :disabled="auth.isLoading"
          >
          <small v-if="loginPasswordError" class="error-text">{{ loginPasswordError }}</small>
        </div>
        <button 
          type="submit" 
          :disabled="auth.isLoading || !isLoginFormValid"
        >
          {{ auth.isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      <div class="toggle-form" @click="showLogin = false">
        Não tem conta? Registre-se
      </div>
    </div>

    <div v-else class="register-form">
      <h1>Registro</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="registerName">Nome:</label>
          <input 
            v-model="registerName" 
            type="text" 
            id="registerName" 
            required
            minlength="3"
            :class="{ 'error': registerNameError }"
            @input="validateRegisterName"
            :disabled="auth.isLoading"
          >
          <small v-if="registerNameError" class="error-text">{{ registerNameError }}</small>
        </div>
        <div class="form-group">
          <label for="registerEmail">Email:</label>
          <input 
            v-model="registerEmail" 
            type="email" 
            id="registerEmail" 
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            placeholder="exemplo@email.com"
            :class="{ 'error': registerEmailError }"
            @input="validateRegisterEmail"
            :disabled="auth.isLoading"
          >
          <small v-if="registerEmailError" class="error-text">{{ registerEmailError }}</small>
        </div>
        <div class="form-group">
          <label for="registerPassword">Senha:</label>
          <input 
            v-model="registerPassword" 
            type="password" 
            id="registerPassword" 
            required
            minlength="6"
            :class="{ 'error': registerPasswordError }"
            @input="validateRegisterPassword"
            :disabled="auth.isLoading"
          >
          <small v-if="registerPasswordError" class="error-text">{{ registerPasswordError }}</small>
        </div>
        <div class="form-group">
          <label for="registerPasswordConfirmation">Confirmar Senha:</label>
          <input 
            v-model="registerPasswordConfirmation" 
            type="password" 
            id="registerPasswordConfirmation" 
            required
            :class="{ 'error': registerPasswordConfirmationError }"
            @input="validateRegisterPasswordConfirmation"
            :disabled="auth.isLoading"
          >
          <small v-if="registerPasswordConfirmationError" class="error-text">
            {{ registerPasswordConfirmationError }}
          </small>
        </div>
        <button 
          type="submit" 
          :disabled="auth.isLoading || !isRegisterFormValid"
        >
          {{ auth.isLoading ? 'Registrando...' : 'Registrar' }}
        </button>
      </form>
      <div class="toggle-form" @click="showLogin = true">
        Já tem conta? Faça login
      </div>
    </div>

    <!-- Mensagem de erro -->
    <div v-if="auth.hasError" class="error-message" @click="auth.clearError">
      {{ auth.errorMessage }}
      <small style="display: block; margin-top: 5px;">Clique para fechar</small>
    </div>

    <!-- Loading overlay -->
    <div v-if="auth.isLoading" class="loading-overlay">
      <div class="loading-spinner">Carregando...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const auth = useAuth()
const router = useRouter()

// Estados do formulário
const showLogin = ref(true)
const loginEmail = ref('')
const loginPassword = ref('')
const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerPasswordConfirmation = ref('')

// Estados de erro
const loginEmailError = ref('')
const loginPasswordError = ref('')
const registerNameError = ref('')
const registerEmailError = ref('')
const registerPasswordError = ref('')
const registerPasswordConfirmationError = ref('')

// Validações
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

const validateLoginEmail = () => {
  loginEmailError.value = ''
  if (!loginEmail.value) {
    loginEmailError.value = 'Email é obrigatório'
  } else if (!validateEmail(loginEmail.value)) {
    loginEmailError.value = 'Email inválido'
  }
}

const validateLoginPassword = () => {
  loginPasswordError.value = ''
  if (!loginPassword.value) {
    loginPasswordError.value = 'Senha é obrigatória'
  } else if (loginPassword.value.length < 6) {
    loginPasswordError.value = 'Senha deve ter no mínimo 6 caracteres'
  }
}

const validateRegisterName = () => {
  registerNameError.value = ''
  if (!registerName.value) {
    registerNameError.value = 'Nome é obrigatório'
  } else if (registerName.value.length < 3) {
    registerNameError.value = 'Nome deve ter no mínimo 3 caracteres'
  }
}

const validateRegisterEmail = () => {
  registerEmailError.value = ''
  if (!registerEmail.value) {
    registerEmailError.value = 'Email é obrigatório'
  } else if (!validateEmail(registerEmail.value)) {
    registerEmailError.value = 'Email inválido'
  }
}

const validateRegisterPassword = () => {
  registerPasswordError.value = ''
  if (!registerPassword.value) {
    registerPasswordError.value = 'Senha é obrigatória'
  } else if (registerPassword.value.length < 6) {
    registerPasswordError.value = 'Senha deve ter no mínimo 6 caracteres'
  }
  validateRegisterPasswordConfirmation()
}

const validateRegisterPasswordConfirmation = () => {
  registerPasswordConfirmationError.value = ''
  if (!registerPasswordConfirmation.value) {
    registerPasswordConfirmationError.value = 'Confirmação de senha é obrigatória'
  } else if (registerPasswordConfirmation.value !== registerPassword.value) {
    registerPasswordConfirmationError.value = 'As senhas não coincidem'
  }
}

// Computed properties para validação do formulário
const isLoginFormValid = computed(() => {
  return (
    loginEmail.value &&
    loginPassword.value &&
    !loginEmailError.value &&
    !loginPasswordError.value
  )
})

const isRegisterFormValid = computed(() => {
  return (
    registerName.value &&
    registerEmail.value &&
    registerPassword.value &&
    registerPasswordConfirmation.value &&
    !registerNameError.value &&
    !registerEmailError.value &&
    !registerPasswordError.value &&
    !registerPasswordConfirmationError.value
  )
})

onMounted(() => {
  console.log('Auth component mounted')
  
  // Limpar qualquer erro anterior
  auth.clearError()
  
  // Se já estiver autenticado, redirecionar para tasks
  if (auth.isAuthenticated.value) {
    console.log('Usuário já autenticado, redirecionando para tasks...')
    router.push('/tasks')
  }
})

const handleLogin = async () => {
  try {
    // Validar formulário antes de enviar
    validateLoginEmail()
    validateLoginPassword()
    
    if (!isLoginFormValid.value) {
      return
    }

    console.log('=== INICIANDO LOGIN ===', new Date().toISOString())
    console.log('Email:', loginEmail.value)
    
    auth.clearError()
    await auth.login(loginEmail.value, loginPassword.value)
    
    if (auth.isAuthenticated.value) {
      console.log('Login realizado com sucesso, redirecionando...')
      await router.push('/')
    }
  } catch (error) {
    console.error('Erro no processo de login:', error)
  }
}

const handleRegister = async () => {
  try {
    // Validar formulário antes de enviar
    validateRegisterName()
    validateRegisterEmail()
    validateRegisterPassword()
    validateRegisterPasswordConfirmation()
    
    if (!isRegisterFormValid.value) {
      return
    }

    console.log('=== INICIANDO REGISTRO ===', new Date().toISOString())
    
    auth.clearError()
    await auth.register(
      registerName.value,
      registerEmail.value,
      registerPassword.value,
      registerPasswordConfirmation.value
    )
    
    if (auth.isAuthenticated.value) {
      console.log('Registro realizado com sucesso, redirecionando...')
      await router.push('/')
    }
  } catch (error) {
    console.error('Erro no processo de registro:', error)
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66,153,225,0.1);
}

input.error {
  border-color: #e53e3e;
}

.error-text {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover:not(:disabled) {
  background-color: #3182ce;
}

button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.toggle-form {
  text-align: center;
  margin-top: 16px;
  color: #4299e1;
  cursor: pointer;
  font-size: 0.875rem;
}

.toggle-form:hover {
  text-decoration: underline;
}

.error-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  max-width: 300px;
  z-index: 50;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.loading-spinner {
  background-color: white;
  padding: 20px 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
