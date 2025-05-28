<template>
	<div>
		<h2>Project Management</h2>
		<form @submit.prevent="createProject">
			<input v-model="newProject.name" placeholder="Project Name" required />
			<textarea v-model="newProject.description" placeholder="Project Description"></textarea>
			<button type="submit">Create Project</button>
		</form>
		<ul>
			<li v-for="project in projects" :key="project">
				<strong>{{ project.name }}</strong>: {{ project.description }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
	import {defineComponent, ref, onMounted } from 'vue';
	import api from '@/plugins/api';

	interface Project {
		id: number;
		name: string;
		description: string;
		}

	export default defineComponent({
		name: 'ProjectManagement',
		setup() { 
			const projects = ref<Project[]>([]);
			const newProject = ref({name: '', description: '' });
			const fetchProjects = async () => {
				try {
					console.log('Fetching projects...');
					const response = await api.get('/projects');
					console.log('Projects response:', response.data);
					projects.value = response.data;
				} catch (error) {
					console.error('Error fetching projects:', error);
					console.error('Error details:', error.response?.data || 'No response data');
				}
			};
			const createProject = async () => {
				try {
					console.log('Creating project:', newProject.value);
					const response = await api.post('/projects', newProject.value);
					console.log('Create project response:', response.data);
					newProject.value = {name: '', description: '' };
					fetchProjects();
				} catch (error) {
					console.error('Error creating project:', error);
					console.error('Error details:', error.response?.data || 'No response data');
				}
			};

			onMounted(fetchProjects);
			return { projects, newProject, createProject};
			}
		});
</script>
