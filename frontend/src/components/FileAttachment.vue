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
	import axios from 'axios';

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
					const response = await axios.get(`http://localhost/api/tasks/${props.taskId}`);
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
						await axios.post(`http://localhost/api/tasks/${props.taskId}/attachments`, formData, { headers: { 'Content-Type': 'multipart/form-data'}
						});
						fetchAttachments();
					} catch (error) {
						console.error('Error uploading file', error);
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

