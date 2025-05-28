<template>
  <div class="task-form">
    <h3>Create New Task</h3>
    <form @submit.prevent="createTask">
      <div>
        <label for="title">Title:</label>
        <input v-model="newTask.title" id="title" type="text" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="newTask.description" id="description"></textarea>
      </div>
      <button type="submit">Add Task</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import api from '@/plugins/api';
import type { TaskCreateData } from '@/plugins/api';

export default defineComponent({
  name: 'TaskForm',
  emits: ['taskCreated'],
  setup(props, { emit }) {
    const newTask = reactive<TaskCreateData>({
      title: '',
      description: '',
      completed: false
    });

    const createTask = async () => {
      try {
        await api.createTask(newTask);
        // Reset the form
        newTask.title = '';
        newTask.description = '';
        emit('taskCreated');
      } catch (error) {
        console.error('Error creating task', error);
      }
    };

    return { newTask, createTask };
  }
});
</script>

<style scoped>
.task-form {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fafafa;
}
form > div {
  margin-bottom: 10px;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
input,
textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>

