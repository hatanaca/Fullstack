<template>
  <div class="task-list-container">
    <div class="header">
      <button class="btn-back" @click="goBack">← Voltar</button>
      <h2>Minhas Tarefas</h2>
    </div>
    
    <TaskForm @taskCreated="fetchTasks" />
    
    <div class="tasks-wrapper">
      <div v-if="loading" class="loading">
        <div class="loading-content">
          <span class="loading-icon">⏳</span>
          Carregando suas tarefas...
        </div>
      </div>
      
      <div v-else-if="error" class="error">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          {{ error }}
          <button @click="fetchTasks">Tentar novamente</button>
        </div>
      </div>
      
      <ul v-else>
        <li v-for="task in tasks" :key="task.id">
          <TaskItem 
            :task="task" 
            @taskDeleted="handleTaskDeleted" 
            @taskUpdated="handleTaskUpdated"
            @error="handleError"
          />
        </li>
        <li v-if="tasks.length === 0" class="no-tasks">
          <div class="empty-content">
            <span class="empty-icon">📝</span>
            <p>Você ainda não tem nenhuma tarefa.</p>
            <p class="empty-subtitle">Crie sua primeira tarefa usando o formulário acima!</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import TaskItem from './TaskItem.vue';
import TaskForm from './TaskForm.vue';
import api, { type Task } from '@/plugins/api';

export default defineComponent({
  name: 'TaskList',
  components: {
    TaskItem,
    TaskForm,
  },
  setup() {
    const router = useRouter();
    const { currentUser } = useAuth();
    const tasks = ref<Task[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchTasks = async () => {
      if (!currentUser?.id) {
        error.value = 'Você precisa estar logado para ver suas tarefas.';
        return;
      }

      loading.value = true;
      error.value = null;
      
      try {
        console.log('Buscando suas tasks...');
        tasks.value = await api.getTasks();
        console.log('Tasks recebidas:', tasks.value);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        error.value = err instanceof Error ? err.message : 'Erro ao carregar suas tarefas. Por favor, tente novamente.';
        tasks.value = [];
      } finally {
        loading.value = false;
      }
    };

    const handleTaskDeleted = () => {
      console.log('Task excluída com sucesso');
      fetchTasks();
    };

    const handleTaskUpdated = () => {
      console.log('Task atualizada com sucesso');
      fetchTasks();
    };

    const handleError = (errorMessage: string) => {
      error.value = errorMessage;
    };

    const goBack = () => {
      router.push('/');
    };

    onMounted(() => {
      console.log('TaskList montado, buscando suas tasks...');
      fetchTasks();
    });

    return { 
      tasks, 
      loading,
      error,
      fetchTasks,
      handleTaskDeleted,
      handleTaskUpdated,
      handleError,
      goBack
    };
  }
});
</script>

<style scoped>
.task-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8em;
}

.btn-back {
  padding: 8px 16px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background-color: #e5e7eb;
}

.tasks-wrapper {
  margin-top: 24px;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

li {
  margin: 0;
  padding: 0;
}

.loading, .error, .no-tasks {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.loading-content, .error-content, .empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #4b5563;
}

.loading-icon, .error-icon, .empty-icon {
  font-size: 2em;
  margin-bottom: 8px;
}

.error-content {
  color: #dc2626;
}

.error button {
  padding: 8px 16px;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.error button:hover {
  background-color: #b91c1c;
}

.empty-content {
  color: #6b7280;
}

.empty-subtitle {
  color: #9ca3af;
  font-size: 0.9em;
  margin-top: -8px;
}
</style>
