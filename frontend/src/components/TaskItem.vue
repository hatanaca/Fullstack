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
      >
        <span class="btn-icon">{{ task.completed ? '↺' : '✓' }}</span>
        {{ task.completed ? 'Undo' : 'Complete' }}
      </button>
      <button class="btn-delete" @click="deleteTask">
        <span class="btn-icon">×</span>
        Delete
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';
import api, { type Task } from '@/plugins/api';

export default defineComponent({
  name: 'TaskItem',
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true
    }
  },
  setup(props, { emit }) {
    const router = useRouter();

    const navigateToTask = () => {
      router.push({ name: 'TaskDetail', params: { id: props.task.id } });
    };

    const toggleComplete = async () => {
      try {
        await api.toggleTaskCompletion(props.task.id);
        emit('taskUpdated');
      } catch (error) {
        console.error('Error updating task', error);
      }
    };

    const deleteTask = async () => {
      try {
        await api.deleteTask(props.task.id);
        emit('taskDeleted');
      } catch (error) {
        console.error('Error deleting task', error);
      }
    };

    return {
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
</style>

