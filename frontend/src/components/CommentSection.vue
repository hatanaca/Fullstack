<template>
  <div>
    <h3>Comments</h3>
    <ul>
      <li v-for="comment in comments" :key="comment.id">
        <strong>{{ comment.user?.name || 'Usuário desconhecido' }}</strong>: 
        {{ comment.content || 'Sem conteúdo' }}
      </li>
    </ul>
    <form @submit.prevent="postComment">
      <textarea v-model="newComment" placeholder="Write a comment..."></textarea>
      <button type="submit">Post Comment</button>
    </form>
    <div v-if="debugMode">
      <h4>Debug Data:</h4>
      <pre>{{ JSON.stringify(comments, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import api from '@/plugins/api';

interface Comment {
  id: number;
  content: string;
  user?: {
    id: number;
    name: string;
  };
  created_at?: string;
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
    const debugMode = ref(false); // Set to true to see the raw comment data
    
    const fetchComments = async () => {
      try {
        const response = await api.get(`/tasks/${props.taskId}/comments`);
        console.log('API response:', response.data);
        
        if (Array.isArray(response.data)) {
          comments.value = response.data.map((comment: any) => {
            // Ensure the comment has the expected structure
            return {
              id: comment.id,
              content: comment.content || '',
              user: comment.user || null,
              created_at: comment.created_at
            };
          });
        } else {
          console.error('Unexpected API response format:', response.data);
          comments.value = [];
        }
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
        
        console.log('New comment response:', response.data);
        
        // Add new comment only if the response contains valid data
        if (response.data && response.data.id) {
          comments.value.unshift(response.data);
          newComment.value = '';
        } else {
          console.error('Invalid response from comment creation:', response.data);
          alert('Erro ao postar comentário: resposta inválida do servidor');
        }
      } catch (error) {
        console.error('Error posting comment', error);
        alert('Erro ao postar comentário');
      }
    };

    onMounted(fetchComments);
    
    return { comments, newComment, postComment, debugMode };
  }
});
</script>
