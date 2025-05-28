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
            :disabled="auth.isLoading"
          >
        </div>
        <div class="form-group">
          <label for="loginPassword">Senha:</label>
          <input 
            v-model="loginPassword" 
            type="password" 
            id="loginPassword" 
            required
            :disabled="auth.isLoading"
          >
        </div>
        <button type="submit" :disabled="auth.isLoading">
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
            :disabled="auth.isLoading"
          >
        </div>
        <div class="form-group">
          <label for="registerEmail">Email:</label>
          <input 
            v-model="registerEmail" 
            type="email" 
            id="registerEmail" 
            required
            :disabled="auth.isLoading"
          >
        </div>
        <div class="form-group">
          <label for="registerPassword">Senha:</label>
          <input 
            v-model="registerPassword" 
            type="password" 
            id="registerPassword" 
            required
            :disabled="auth.isLoading"
          >
        </div>
        <div class="form-group">
          <label for="registerPasswordConfirmation">Confirmar Senha:</label>
          <input 
            v-model="registerPasswordConfirmation" 
            type="password" 
            id="registerPasswordConfirmation" 
            required
            :disabled="auth.isLoading"
          >
        </div>
        <button type="submit" :disabled="auth.isLoading">
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
import { ref, onMounted } from 'vue'
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
    console.log('=== INICIANDO LOGIN ===', new Date().toISOString())
    console.log('Email:', loginEmail.value)
    
    // Limpar erros anteriores
    auth.clearError()
    
    await auth.login(loginEmail.value, loginPassword.value)
    
    console.log('Login concluído. IsAuthenticated:', auth.isAuthenticated.value)
    
    if (auth.isAuthenticated.value) {
      console.log('Login realizado com sucesso, redirecionando para tasks...')
      await router.push('/tasks')
    } else {
      console.error('Login não resultou em autenticação')
    }
  } catch (error) {
    console.error('Erro no processo de login:', error)
    // O erro já foi tratado no composable useAuth
  }
}

const handleRegister = async () => {
  try {
    console.log('=== INICIANDO REGISTRO ===', new Date().toISOString())
    console.log('Dados:', {
      name: registerName.value,
      email: registerEmail.value,
      passwordLength: registerPassword.value.length
    })
    
    // Limpar erros anteriores
    auth.clearError()
    
    // Validação local das senhas
    if (registerPassword.value !== registerPasswordConfirmation.value) {
      auth.setError('As senhas não coincidem')
      return
    }

    if (registerPassword.value.length < 8) {
      auth.setError('A senha deve ter pelo menos 8 caracteres')
      return
    }

    await auth.register(
      registerName.value,
      registerEmail.value,
      registerPassword.value,
      registerPasswordConfirmation.value
    )
    
    console.log('Registro concluído. IsAuthenticated:', auth.isAuthenticated.value)
    
    if (auth.isAuthenticated.value) {
      console.log('Registro realizado com sucesso, redirecionando para tasks...')
      await router.push('/tasks')
    } else {
      console.error('Registro não resultou em autenticação')
    }
  } catch (error) {
    console.error('Erro no processo de registro:', error)
    // O erro já foi tratado no composable useAuth
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  position: relative;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.toggle-form {
  text-align: center;
  margin-top: 15px;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.toggle-form:hover {
  color: #0056b3;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-top: 15px;
  cursor: pointer;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.loading-spinner {
  padding: 20px;
  font-weight: bold;
  color: #007bff;
}
</style>
