<template>
  <div>
    <h2>Task List</h2>
    <TaskForm @taskCreated="fetchTasks" />
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <router-link :to="{ name: 'TaskDetail', params: { id: task.id } }">
          <TaskItem :task="task" @taskDeleted="fetchTasks" @taskUpdated="fetchTasks" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import TaskItem from './TaskItem.vue';
import api from '@/plugins/api';

import TaskForm from './TaskForm.vue';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default defineComponent({
  name: 'TaskList',
  components: {
    TaskItem,
    TaskForm,
  },
  setup() {
    const tasks = ref<Task[]>([]);

    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
	tasks.value = response.data;
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };

    onMounted(() => {
      fetchTasks();
    });

    return { tasks, fetchTasks };
  }
});
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 10px 0;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}
</style>

