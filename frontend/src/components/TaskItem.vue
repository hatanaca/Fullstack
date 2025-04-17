<template>
  <div class="task-item">
    <h3 :class="{ completed: task.completed }">{{ task.title }}</h3>
    <p>{{ task.description }}</p>
    <button @click.stop="toggleComplete">
      {{ task.completed ? 'Undo' : 'Complete' }}
    </button>
    <button @click.stop="deleteTask">Delete</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import api from '@/plugins/api';


interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default defineComponent({
  name: 'TaskItem',
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true
    }
  },
  methods: {
    async toggleComplete() {
      try {
        const updatedTask = { ...this.task, completed: !this.task.completed };
        await apí.put(`/tasks/${this.task.id}`, updatedTask);
        this.$emit('taskUpdated');
      } catch (error) {
        console.error('Error updating task', error);
      }
    },
    async deleteTask() {
      try {
        await api.delete(`/tasks/${this.task.id}`);
        this.$emit('taskDeleted');
      } catch (error) {
        console.error('Error deleting task', error);
      }
    }
  }
});
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}
.task-item {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
}
button {
  margin-right: 5px;
}
</style>

