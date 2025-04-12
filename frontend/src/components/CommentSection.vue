<template>
	<div>
		<h3>Comments</h3>
		<ul>
			<li v-for="comment in comments" :key="comment.id">
				<strong>{{ comment.user.name }}</strong>: {{ comment.content }}
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
		id:number;
		content: string;
		user: { name: string };
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
					const response = await api.get(`http://localhost/api/tasks/${props.taskId}/comments`);
					comments.value = response.data;
				} catch (error) {
					console.error('Error fetching comments', error);
				}
			};
			
			const postComment = async () => {
				try {
				// For demo purposes, using a hard-coded user_id
				await api.post(`http://localhost/api/tasks/${props.taskId}/comments`, {
				content: newComment.value,
				user_id: 1
				});
				newComment.value = '';
				fetchComments();
				} catch (error) {
					console.error('Error posting comment', error);
					}
				};

				onMounted(fetchComments);
				return { comments, newComment, postComment };
		}

	});
</script>


