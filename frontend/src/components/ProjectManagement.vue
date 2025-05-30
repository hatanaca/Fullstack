<template>
	<div class="project-management">
		<div class="header">
			<button class="btn-back" @click="goBack">← Voltar</button>
			<h2>Gerenciamento de Projetos</h2>
		</div>

		<form @submit.prevent="createProject" class="project-form">
			<div class="form-group">
				<label for="projectName">Nome do Projeto</label>
				<input 
					id="projectName"
					v-model="newProject.name" 
					placeholder="Digite o nome do projeto" 
					required 
				/>
			</div>

			<div class="form-group">
				<label for="projectDescription">Descrição</label>
				<textarea 
					id="projectDescription"
					v-model="newProject.description" 
					placeholder="Digite a descrição do projeto"
					rows="3"
				></textarea>
			</div>

			<button type="submit" :disabled="loading">
				{{ loading ? 'Criando...' : 'Criar Projeto' }}
			</button>
		</form>

		<div class="projects-list">
			<div v-if="loading" class="loading">
				Carregando projetos...
			</div>
			
			<div v-else-if="error" class="error">
				{{ error }}
				<button @click="fetchProjects">Tentar novamente</button>
			</div>

			<div v-else-if="projects.length === 0" class="no-projects">
				Nenhum projeto encontrado. Crie seu primeiro projeto acima!
			</div>

			<ul v-else>
				<li v-for="project in projects" :key="project.id" class="project-item">
					<div class="project-info">
						<h3>{{ project.name }}</h3>
						<p>{{ project.description }}</p>
					</div>
					<div class="project-actions">
						<button @click="deleteProject(project.id)" class="btn-delete">
							Excluir
						</button>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
	import {defineComponent, ref, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import api from '@/plugins/api';
	import type { Project, ProjectForm } from '@/types/interfaces';

	export default defineComponent({
		name: 'ProjectManagement',
		setup() { 
			const router = useRouter();
			const projects = ref<Project[]>([]);
			const newProject = ref<ProjectForm>({ name: '', description: '' });
			const loading = ref(false);
			const error = ref<string | null>(null);

			const fetchProjects = async () => {
				loading.value = true;
				error.value = null;

				try {
					console.log('Fetching projects...');
					projects.value = await api.getProjects();
				} catch (err) {
					console.error('Error fetching projects:', err);
					error.value = 'Erro ao carregar os projetos. Por favor, tente novamente.';
				} finally {
					loading.value = false;
				}
			};

			const createProject = async () => {
				if (loading.value) return;
				
				loading.value = true;
				error.value = null;

				try {
					console.log('Creating project:', newProject.value);
					await api.createProject(newProject.value);
					newProject.value = { name: '', description: '' };
					await fetchProjects();
				} catch (err) {
					console.error('Error creating project:', err);
					error.value = 'Erro ao criar o projeto. Por favor, tente novamente.';
				} finally {
					loading.value = false;
				}
			};

			const deleteProject = async (id: number) => {
				if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
				
				loading.value = true;
				error.value = null;

				try {
					await api.deleteProject(id);
					await fetchProjects();
				} catch (err) {
					console.error('Error deleting project:', err);
					error.value = 'Erro ao excluir o projeto. Por favor, tente novamente.';
				} finally {
					loading.value = false;
				}
			};

			const goBack = () => {
				router.push('/');
			};

			onMounted(fetchProjects);
			return { projects, newProject, loading, error, createProject, deleteProject, goBack };
		}
	});
</script>

<style scoped>
.project-management {
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

h2 {
	margin: 0;
	color: #2c3e50;
	font-size: 1.8em;
}

.project-form {
	background: white;
	padding: 24px;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	margin-bottom: 24px;
}

.form-group {
	margin-bottom: 16px;
}

.form-group label {
	display: block;
	margin-bottom: 8px;
	color: #374151;
	font-weight: 500;
}

input, textarea {
	width: 100%;
	padding: 8px 12px;
	border: 1px solid #e5e7eb;
	border-radius: 6px;
	font-size: 1em;
}

textarea {
	resize: vertical;
}

button {
	padding: 8px 16px;
	background-color: #3b82f6;
	color: white;
	border: none;
	border-radius: 6px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

button:hover {
	background-color: #2563eb;
}

button:disabled {
	background-color: #9ca3af;
	cursor: not-allowed;
}

.projects-list {
	margin-top: 24px;
}

.loading, .error, .no-projects {
	text-align: center;
	padding: 40px;
	color: #6b7280;
	background: white;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.error {
	color: #dc2626;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
}

.error button {
	background-color: #dc2626;
}

.error button:hover {
	background-color: #b91c1c;
}

ul {
	list-style: none;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.project-item {
	background: white;
	padding: 16px;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.project-info h3 {
	margin: 0 0 8px 0;
	color: #2c3e50;
}

.project-info p {
	margin: 0;
	color: #6b7280;
}

.project-actions {
	display: flex;
	gap: 8px;
}

.btn-delete {
	background-color: #ef4444;
}

.btn-delete:hover {
	background-color: #dc2626;
}
</style>
