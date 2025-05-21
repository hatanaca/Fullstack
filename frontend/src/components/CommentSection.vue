<template>
	<div>
		<h3>Comments</h3>
		<ul>
			<li v-for="comment in comments" :key="comment.id">
				<!-- Corrigido: Acessa comment.user.name apenas se existir -->
				<strong>{{ comment.user?.name || 'Usuário desconhecido' }}</strong>: 
				{{ comment.content || 'Sem conteúdo' }}
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
    user?: { // Mantido como opcional
        id: number;
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
				// Verifica se a resposta tem dados e formata corretamente
				comments.value = response.data;	
				} catch (error) {
				console.error('Error fetching comments', error);
				comments.value = [];
			}
		};

		const postComment = async () => {
    if (!newComment.value.trim()) return;

    try {
        const response = await api.post(`/tasks/${props.taskId}/comments`, {
            content: newComment.value,
            user_id: 1 // Idealmente, pegue o ID do usuário atual da sua store
        });

        // Adiciona o novo comentário no início da lista
        comments.value.unshift(response.data);
        newComment.value = '';
    } catch (error) {
        console.error('Error posting comment', error);
        alert('Erro ao postar comentário');
    }
};

		onMounted(fetchComments);
		return { comments, newComment, postComment };
	}
});
</script>
