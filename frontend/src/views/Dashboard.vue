<template>
  <div class="dashboard">
    <!-- Header com informações do usuário -->
    <header class="dashboard-header">
      <div class="user-info">
        <h1>Bem-vindo, {{ auth.currentUser?.name || 'Usuário' }}!</h1>
        <p>Email: {{ auth.currentUser?.email }}</p>
        <p>ID: {{ auth.currentUser?.id }}</p>
      </div>
      <button @click="handleLogout" class="logout-btn" :disabled="auth.isLoading">
        {{ auth.isLoading ? 'Saindo...' : 'Logout' }}
      </button>
    </header>

    <!-- Navegação principal -->
    <nav class="dashboard-nav">
      <h2>Navegação</h2>
      <div class="nav-cards">
        <router-link to="/tasks" class="nav-card">
          <div class="card-icon">📋</div>
          <h3>Tarefas</h3>
          <p>Gerenciar suas tarefas</p>
        </router-link>
        
        <router-link to="/projects" class="nav-card">
          <div class="card-icon">📁</div>
          <h3>Projetos</h3>
          <p>Gerenciar projetos</p>
        </router-link>
        
        <router-link to="/users" class="nav-card">
          <div class="card-icon">👥</div>
          <h3>Usuários</h3>
          <p>Gerenciar usuários</p>
        </router-link>
      </div>
    </nav>

    <!-- Ações rápidas -->
    <section class="quick-actions">
      <h2>Ações Rápidas</h2>
      <div class="action-buttons">
        <button @click="goToTasks" class="action-btn primary">
          Ver Todas as Tarefas
        </button>
        <button @click="goToProjects" class="action-btn secondary">
          Ver Projetos
        </button>
      </div>
    </section>

    <!-- Mensagem de erro, se houver -->
    <div v-if="auth.hasError" class="error-message" @click="auth.clearError">
      {{ auth.errorMessage }}
      <small style="display: block; margin-top: 5px;">Clique para fechar</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()

const handleLogout = async () => {
  try {
    await auth.logout()
    router.push('/login')
  } catch (error) {
    console.error('Erro no logout:', error)
  }
}

const goToTasks = () => {
  router.push('/tasks')
}

const goToProjects = () => {
  router.push('/projects')
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-info h1 {
  color: #28a745;
  margin: 0 0 10px 0;
}

.user-info p {
  margin: 5px 0;
  color: #6c757d;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.logout-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.logout-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.dashboard-nav h2 {
  color: #495057;
  margin-bottom: 20px;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.nav-card {
  display: block;
  padding: 20px;
  background-color: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  text-align: center;
}

.nav-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.nav-card h3 {
  margin: 10px 0;
  color: #495057;
}

.nav-card p {
  color: #6c757d;
  margin: 0;
}

.quick-actions h2 {
  color: #495057;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.action-btn.primary {
  background-color: #007bff;
  color: white;
}

.action-btn.primary:hover {
  background-color: #0056b3;
}

.action-btn.secondary {
  background-color: #6c757d;
  color: white;
}

.action-btn.secondary:hover {
  background-color: #545b62;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>
