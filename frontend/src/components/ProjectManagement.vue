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
	import axios from 'axios';

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
				const response = await axios.get('http://localhost/api/projects');
				projects.value = response.data;
				} catch (error) {
				console.log('Error fetching projects', error)
				}
			};
			const createProject = async () => {
				try {
				await axios.post('http://localhost/api/projects', newProject.value);
				newProject.value = {name: '', description: '' };
				fetchProjects();
				} catch (error) {
				console.error('Error creating project', error);
				}
			};

			onMounted(fetchProjects);
			return { projects, newProject, createProject};
			}
		});
</script>
