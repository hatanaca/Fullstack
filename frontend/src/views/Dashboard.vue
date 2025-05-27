<!-- Dashboard.vue -->
<template>
  <div class="dashboard">
    <div v-if="auth.isLoading" class="loading-message">
      Carregando...
    </div>
    
    <div v-else-if="auth.isAuthenticated && auth.currentUser" class="dashboard-content">
      <h2>Dashboard</h2>
      <div class="user-info">
        <h3>Bem-vindo, {{ auth.currentUser.name }}!</h3>
        <p><strong>Email:</strong> {{ auth.currentUser.email }}</p>
        <p><strong>ID:</strong> {{ auth.currentUser.id }}</p>
      </div>
      
      <div class="actions">
        <button @click="handleLogout" class="logout-btn" :disabled="auth.isLoading">
          {{ auth.isLoading ? 'Saindo...' : 'Logout' }}
        </button>
      </div>
    </div>
    
    <div v-else class="not-authenticated">
      <p>Você não está autenticado.</p>
      <button @click="goToLogin">Ir para Login</button>
    </div>

    <!-- Mensagem de erro se houver -->
    <div v-if="auth.hasError" class="error-message" @click="auth.clearError">
      {{ auth.errorMessage }}
      <small>Clique para fechar</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// IMPORTANTE: Caminho correto baseado na estrutura de pastas
import { useAuth } from '../composables/useAuth'

const auth = useAuth()
const router = useRouter()

onMounted(async () => {
  console.log('Dashboard mounted')
  
  // Verifica autenticação ao carregar o dashboard
  await auth.checkAuth()
  
  if (!auth.isAuthenticated) {
    console.log('Usuário não autenticado, redirecionando para login...')
    router.push('/login')
  } else {
    console.log('Usuário autenticado:', auth.currentUser)
  }
})

const handleLogout = async () => {
  try {
    console.log('Iniciando logout...')
    
    await auth.logout()
    
    console.log('Logout realizado, redirecionando...')
    router.push('/login')
  } catch (error) {
    console.error('Erro no logout:', error)
    // Mesmo com erro, redireciona para login
    router.push('/login')
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.loading-message {
  text-align: center;
  font-size: 18px;
  color: #666;
}

.dashboard-content {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.user-info {
  background: white;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  border: 1px solid #e9ecef;
}

.user-info h3 {
  color: #28a745;
  margin-top: 0;
}

.user-info p {
  margin: 10px 0;
  color: #495057;
}

.actions {
  text-align: center;
  margin-top: 20px;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.logout-btn:hover:not(:disabled) {
  background: #c82333;
}

.logout-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.not-authenticated {
  text-align: center;
  padding: 40px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
}

.not-authenticated button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
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

.error-message small {
  display: block;
  margin-top: 5px;
  font-size: 12px;
}
</style>
