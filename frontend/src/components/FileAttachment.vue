<template>
	<div>
		<h3>File Attachment</h3>
		<input type="file" @change="uploadFile"/>
		<!-- @ => v-on -->
		<ul>
			<li v-for="attachment in attachments" :key="attachment.id">
			<!-- : => v-bind -->
				<a :href="downloadUrl(attachment.filepath)" target="_blank"> {{ attachment.filename }}</a>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, onMounted } from 'vue';
	import api from '@/plugins/api';

	interface Attachment {
		id: number;
		filename: string;
		filepath: string;
	}
	
	export default defineComponent({
		name: 'FileAttachment',
		props: { //objeto para receber parametros do componente pai
			taskId: {
			//definindo regras para o TaskId
				type: Number,
				required: true,
			}
		},
		setup(props) {
			const attachments = ref<Attachment[]>([]);
			const fetchAttachments = async () => {
				try {
					const response = await api.get(`/tasks/${props.taskId}`);
					attachments.value = response.data.attachments || [];
				} catch (error) {
					console.error("Error fetching attachments", error);
				}
			};
			const uploadFile = async (event: Event) => {
    				const target = event.target as HTMLInputElement;
   				if (target.files && target.files[0]) {
       					const formData = new FormData();
        				formData.append('file', target.files[0]);
        				try {
            					// Adicionar tratamento de erro explícito
            					const response = await api.post(
                					`/tasks/${props.taskId}/attachments`, formData,
                					{ headers: { 'Content-Type': 'multipart/form-data' } }
            						);
           					 attachments.value.push(response.data); // Atualizar lista localmente
       					} catch (error) {
            					console.error('Error uploading file', error);
            					alert('Falha no upload. Verifique o console.'); // Feedback ao usuário
        				}
    				}
			};
			const downloadUrl = (filepath: string) => {
				return `http://localhost/storage/${filepath}`;
			};

			onMounted(fetchAttachments);
			return { attachments, uploadFile, downloadUrl };
			}

	});
</script>

