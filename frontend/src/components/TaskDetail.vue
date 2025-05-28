<template>
	<div class="task-detail">
		<div v-if="loading" class="loading">
			<p>Loading task details...</p>
		</div>
		
		<div v-else-if="task" class="task-content">
			<div class="task-header">
				<h2>Task Details</h2>
				<span class="task-id">#{{ task.id }}</span>
			</div>

			<div class="task-info">
				<h3>{{ task.title }}</h3>
				<p class="description">{{ task.description }}</p>
				<p class="status">
					Status: 
					<span :class="{ 'status-completed': task.completed, 'status-pending': !task.completed }">
						{{ task.completed ? 'Completed' : 'Pending' }}
					</span>
				</p>
				
				<div v-if="task.project" class="project-info">
					<p>Project: {{ task.project.name }}</p>
				</div>
			</div>

			<div class="task-attachments">
				<FileAttachment :taskId="task.id" />
			</div>

			<div class="task-comments">
				<CommentSection :taskId="task.id" />
			</div>

			<div class="actions">
				<button class="btn-back" @click="goBack">← Back to List</button>
			</div>
		</div>

		<div v-else class="error">
			<p>Task not found or error loading task.</p>
			<button class="btn-back" @click="goBack">← Back to List</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api, { type Task } from '@/plugins/api';
import CommentSection from './CommentSection.vue';
import FileAttachment from './FileAttachment.vue';

export default defineComponent({
	name: 'TaskDetail',
	components: { CommentSection, FileAttachment },
	
	setup() {
		const route = useRoute();
		const router = useRouter();
		const task = ref<Task | null>(null);
		const loading = ref(true);

		const fetchTask = async () => {
			const id = Number(route.params.id);
			
			if (!id || isNaN(id)) {
				router.push({ name: 'TaskList' });
				return;
			}

			try {
				loading.value = true;
				const taskData = await api.getTask(id);
				task.value = taskData;
			} catch (error) {
				console.error('Error fetching task detail:', error);
				task.value = null;
			} finally {
				loading.value = false;
			}
		};

		const goBack = () => router.push({ name: 'TaskList' });

		onMounted(fetchTask);

		return { 
			task, 
			loading,
			goBack 
		};
	}
});
</script>

<style scoped>
.task-detail {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}

.loading, .error {
	text-align: center;
	padding: 40px;
	color: #666;
}

.task-header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 24px;
}

.task-id {
	color: #666;
	font-size: 1.1em;
}

.task-info {
	background: white;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	margin-bottom: 24px;
}

h3 {
	margin: 0 0 16px 0;
	color: #2c3e50;
	font-size: 1.5em;
}

.description {
	color: #34495e;
	line-height: 1.6;
	margin-bottom: 16px;
}

.status {
	display: flex;
	align-items: center;
	gap: 8px;
	margin: 16px 0;
}

.status-completed, .status-pending {
	padding: 4px 8px;
	border-radius: 4px;
	font-weight: 500;
}

.status-completed {
	background-color: #d1fae5;
	color: #065f46;
}

.status-pending {
	background-color: #fef3c7;
	color: #92400e;
}

.project-info {
	margin-top: 16px;
	padding-top: 16px;
	border-top: 1px solid #e5e7eb;
}

.task-attachments, .task-comments {
	margin-top: 24px;
}

.actions {
	margin-top: 24px;
	display: flex;
	justify-content: flex-start;
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
</style>


