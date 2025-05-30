<template>
  <div 
    class="task-item" 
    :class="{ 'task-completed': task.completed }"
    @click="navigateToTask"
  >
    <div class="task-content">
      <div class="task-header">
        <h3 :class="{ completed: task.completed }">{{ task.title }}</h3>
        <span class="task-id">#{{ task.id }}</span>
      </div>
      <p class="task-description" :class="{ completed: task.completed }">
        {{ task.description }}
      </p>
    </div>
    <div class="task-actions" @click.stop>
      <button 
        class="btn-complete"
        :class="{ 'btn-undo': task.completed }"
        @click="toggleComplete"
        :disabled="loading"
      >
        <span class="btn-icon">{{ task.completed ? '↺' : '✓' }}</span>
        {{ task.completed ? 'Desfazer' : 'Concluir' }}
      </button>
      <button 
        class="btn-delete" 
        @click="deleteTask"
        :disabled="loading"
      >
        <span class="btn-icon">×</span>
        {{ loading ? 'Excluindo...' : 'Excluir' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import api, { type Task } from '@/plugins/api';

export default defineComponent({
  name: 'TaskItem',
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true
    }
  },
  emits: ['taskDeleted', 'taskUpdated', 'error'],
  setup(props, { emit }) {
    const router = useRouter();
    const { currentUser } = useAuth();
    const loading = ref(false);

    const navigateToTask = () => {
      if (!currentUser?.id) {
        emit('error', 'Você precisa estar logado para ver os detalhes da tarefa.');
        return;
      }
      
      if (currentUser.id !== props.task.user_id) {
        emit('error', 'Você não tem permissão para ver os detalhes desta tarefa.');
        return;
      }

      router.push({ name: 'TaskDetail', params: { id: props.task.id } });
    };

    const toggleComplete = async () => {
      if (loading.value) return;
      if (!currentUser?.id) {
        emit('error', 'Você precisa estar logado para atualizar a tarefa.');
        return;
      }

      if (currentUser.id !== props.task.user_id) {
        emit('error', 'Você não tem permissão para atualizar esta tarefa.');
        return;
      }

      loading.value = true;

      try {
        await api.toggleTaskCompletion(props.task.id);
        emit('taskUpdated');
      } catch (err) {
        console.error('Error updating task:', err);
        emit('error', 'Erro ao atualizar a tarefa. Por favor, tente novamente.');
      } finally {
        loading.value = false;
      }
    };

    const deleteTask = async () => {
      if (loading.value) return;
      if (!currentUser?.id) {
        emit('error', 'Você precisa estar logado para excluir a tarefa.');
        return;
      }

      if (currentUser.id !== props.task.user_id) {
        emit('error', 'Você não tem permissão para excluir esta tarefa.');
        return;
      }

      if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

      loading.value = true;

      try {
        await api.deleteTask(props.task.id);
        emit('taskDeleted');
      } catch (err) {
        console.error('Error deleting task:', err);
        emit('error', 'Erro ao excluir a tarefa. Por favor, tente novamente.');
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      navigateToTask,
      toggleComplete,
      deleteTask
    };
  }
});
</script>

<style scoped>
.task-item {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: #ffffff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.task-completed {
  background-color: #f8f9fa;
  border-color: #e9ecef;
}

.task-content {
  flex: 1;
  margin-right: 20px;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.task-id {
  color: #6c757d;
  font-size: 0.9em;
  font-weight: 500;
}

h3 {
  margin: 0;
  color: #212529;
  font-size: 1.1em;
  font-weight: 600;
}

.task-description {
  color: #495057;
  font-size: 0.95em;
  margin: 0;
}

.completed {
  text-decoration: line-through;
  color: #6c757d;
}

.task-actions {
  display: flex;
  gap: 8px;
}

button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fff;
}

.btn-complete {
  color: #198754;
  border-color: #198754;
}

.btn-complete:hover {
  background-color: #198754;
  color: white;
}

.btn-undo {
  color: #6c757d;
  border-color: #6c757d;
}

.btn-undo:hover {
  background-color: #6c757d;
  color: white;
}

.btn-delete {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: white;
}

.btn-icon {
  font-size: 1.1em;
  line-height: 1;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f3f4f6 !important;
  border-color: #e5e7eb !important;
  color: #9ca3af !important;
}
</style>

