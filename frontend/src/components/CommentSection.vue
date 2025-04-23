<template>
	<div>
		<h3>Comments</h3>
		<ul>
			<li v-for="comment in comments" :key="comment.id">
    <strong>{{ comment.user?.name || 'Usuário desconhecido' }}</strong>: {{ comment.content }}
</li>
		</ul>
		<form @submit.prevent="postComment">
			<textarea v-model="newComment" placeholder="Write a comment..."></textarea>
			<button type="submit">Post Comment</button>
		</form>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, onMounted } from 'vue';
	import api from '@/plugins/api';


	interface Comment {
    		id: number;
    		content: string;
    		user?: { // <--- Adicione "?"
        		name: string;
    			};
		}
	
	export default defineComponent({ 
		name: 'CommentSection',
		props: {
			taskId: {
				type: Number,
				required: true 
				}
			},
		setup(props) {
			const comments = ref<Comment[]>([]);
			const newComment = ref('');

			const fetchComments = async () => {
    try {
        const response = await api.get(`/tasks/${props.taskId}/comments`);
        comments.value = response.data || []; // Se response.data for undefined, usa array vazio
    } catch (error) {
        console.error('Error fetching comments', error);
        comments.value = []; // Limpa a lista para evitar dados corrompidos
        // Opcional: exibir mensagem de erro para o usuário
    }
};
			
			const postComment = async () => {
    try {
        const response = await api.post(`/tasks/${props.taskId}/comments`, {
            content: newComment.value,
            user_id: 1
        });
        comments.value.push(response.data); // Adicionar comentário à lista local
        newComment.value = '';
    } catch (error) {
        console.error('Error posting comment', error);
        alert('Erro ao postar comentário. Verifique o console.');
    }
};

				onMounted(fetchComments);
				return { comments, newComment, postComment };
		}

	});
</script>


