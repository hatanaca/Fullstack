<template>
	<div v-if="task">
		<h2>Task Detail</h2>
		<h3>{{ task.title }}</h3>
		<p>{{ task.description }}</p>
		<p>Status: <strong>{{ task.completed ? 'Completed' : 'Pending' }}</strong></p>
		<div v-if="task.project">
			<p>Project: {{ task.project.name }}</p>
		</div>
		<FileAttachment :taskId="task.id" />
		<CommentSection :taskId="task.id" />
		<button @click="goBack">Back</button>
	</div>
	<div v-else>
		<p>Loading task details...</p>
		</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
//defineCOmponent => typed component, ref => reactive variable, onMounted exec code when componnet is monted
import { useRoute, useRouter } from 'vue-router';
//useRoute => information of actual URL, useRouter navegation between pages
import api from '@/plugins/api';
//http request
import CommentSection from './CommentSection.vue';
import FileAttachment from './FileAttachment.vue';
//linha 10,11 ":" => "v-bind:taskId="task.id"
interface Task {
	id: number;
	title: string;
	description: string;
	completed: boolean;
	project?: { name: string };
	}

export default  defineComponent({
	name: 'TaskDetail',
	components: {CommentSection, FileAttachment },
	setup() {
	//Init the component
		const route = useRoute();
		const router = useRouter();
		const task = ref<Task | null>(null);
		//Typescript genericType, ref => reactive variable, start's with null
		const fetchTask = async () => {
    if (!route.params.id || isNaN(Number(route.params.id))) { // Validação do ID
        router.push({ name: 'TaskList' });
        return;
    }
    try {
        const response = await api.get(`/tasks/${route.params.id}`);
        task.value = response.data;
    } catch (error) {
        console.error('Error fetching task detail', error);
        router.push({ name: 'TaskList' }); // Redireciona se a task não existe
    }
};

			onMounted(fetchTask);
			const goBack = () => router.push({ name: 'TaskList' });
			return { task, goBack };
			}
			});
</script>


