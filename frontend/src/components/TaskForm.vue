<template>
  <div class="task-form">
    <h3>Nova Tarefa</h3>
    <form @submit.prevent="createTask">
      <div class="form-group">
        <label for="title">Título:</label>
        <input 
          v-model="newTask.title" 
          id="title" 
          type="text" 
          required
          :disabled="loading"
          placeholder="Digite o título da tarefa"
        />
      </div>
      <div class="form-group">
        <label for="description">Descrição:</label>
        <textarea 
          v-model="newTask.description" 
          id="description"
          :disabled="loading"
          placeholder="Digite a descrição da tarefa"
          rows="3"
        ></textarea>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <button type="submit" :disabled="loading || !newTask.title.trim()">
        {{ loading ? 'Criando...' : 'Criar Tarefa' }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import api from '@/plugins/api';
import type { TaskCreateData } from '@/plugins/api';

export default defineComponent({
  name: 'TaskForm',
  emits: ['taskCreated', 'error'],
  setup(props, { emit }) {
    const { currentUser } = useAuth();
    const loading = ref(false);
    const error = ref<string | null>(null);

    const newTask = reactive<TaskCreateData>({
      title: '',
      description: '',
      completed: false
    });

    const createTask = async () => {
      if (loading.value) return;
      if (!currentUser?.id) {
        error.value = 'Você precisa estar logado para criar uma tarefa.';
        return;
      }

      if (!newTask.title.trim()) {
        error.value = 'O título da tarefa é obrigatório.';
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        console.log('Criando nova tarefa:', newTask);
        await api.createTask(newTask);
        console.log('Tarefa criada com sucesso');
        
        // Limpa o formulário
        newTask.title = '';
        newTask.description = '';
        newTask.completed = false;
        
        emit('taskCreated');
      } catch (err) {
        console.error('Error creating task:', err);
        error.value = 'Erro ao criar a tarefa. Por favor, tente novamente.';
      } finally {
        loading.value = false;
      }
    };

    return { 
      newTask, 
      loading,
      error,
      createTask 
    };
  }
});
</script>

<style scoped>
.task-form {
  margin-bottom: 20px;
  padding: 24px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.3em;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

input,
textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1em;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

input:disabled,
textarea:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  font-size: 0.9em;
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: #fef2f2;
  border-radius: 6px;
  border: 1px solid #fee2e2;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover:not(:disabled) {
  background-color: #2563eb;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>

