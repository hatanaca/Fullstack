<template>
	<div class="user-management">
		<div class="header">
			<button class="btn-back" @click="goBack">← Voltar</button>
			<h2>Gerenciamento de Usuários</h2>
		</div>

		<div v-if="loading" class="loading">
			<div class="loading-content">
				<span class="loading-icon">⏳</span>
				Carregando usuários...
			</div>
		</div>

		<div v-else-if="error" class="error">
			<div class="error-content">
				<span class="error-icon">⚠️</span>
				{{ error }}
				<button @click="fetchUsers">Tentar novamente</button>
			</div>
		</div>

		<div v-else-if="users.length === 0" class="no-users">
			<div class="empty-content">
				<span class="empty-icon">📝</span>
				<p>Nenhum usuário encontrado.</p>
			</div>
		</div>

		<div v-else class="table-container">
			<table>
				<thead>
					<tr>
						<th>Nome</th>
						<th>Email</th>
						<th>Função</th>
						<th>Ações</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="user in users" :key="user.id">
						<td class="user-name">{{ user.name }}</td>
						<td class="user-email">{{ user.email }}</td>
						<td>
							<select 
								v-model="user.role" 
								@change="updateUser(user)"
								:disabled="isCurrentUser(user.id) || loading"
								class="role-select"
							>
								<option value="admin">Administrador</option>
								<option value="user">Usuário</option>
							</select>
						</td>
						<td>
							<button 
								@click="deleteUser(user.id)"
								:disabled="isCurrentUser(user.id) || loading"
								class="btn-delete"
								:title="isCurrentUser(user.id) ? 'Não é possível excluir seu próprio usuário' : ''"
							>
								{{ loading ? 'Excluindo...' : 'Excluir' }}
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useAuth } from '@/composables/useAuth';
	import api from '@/plugins/api';
	import type { User } from '@/types/interfaces';

	export default defineComponent({
		name: 'UserManagement',
		setup() {
			const router = useRouter();
			const { currentUser } = useAuth();
			const users = ref<User[]>([]);
			const loading = ref(false);
			const error = ref<string | null>(null);

			const isCurrentUser = (userId: number) => {
				return currentUser?.id === userId;
			};

			const fetchUsers = async () => {
				loading.value = true;
				error.value = null;

				try {
					const response = await api.getUsers();
					users.value = Array.isArray(response) ? response : [];
					console.log('Usuários carregados:', users.value);
				} catch (err) {
					console.error('Error fetching users:', err);
					error.value = 'Erro ao carregar os usuários. Por favor, tente novamente.';
				} finally {
					loading.value = false;
				}
			};

			const updateUser = async (user: User) => {
				if (loading.value || isCurrentUser(user.id)) return;

				const originalRole = user.role;
				loading.value = true;
				error.value = null;

				try {
					console.log('Atualizando usuário:', user.id, 'para função:', user.role);
					await api.updateUser(user.id, { role: user.role });
					console.log('Usuário atualizado com sucesso');
				} catch (err) {
					console.error('Error updating user:', err);
					error.value = 'Erro ao atualizar o usuário. Por favor, tente novamente.';
					user.role = originalRole; // Reverte a mudança em caso de erro
				} finally {
					loading.value = false;
				}
			};

			const deleteUser = async (id: number) => {
				if (loading.value || isCurrentUser(id)) return;
				if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

				loading.value = true;
				error.value = null;

				try {
					console.log('Excluindo usuário:', id);
					await api.deleteUser(id);
					console.log('Usuário excluído com sucesso');
					await fetchUsers(); // Recarrega a lista após excluir
				} catch (err) {
					console.error('Error deleting user:', err);
					error.value = 'Erro ao excluir o usuário. Por favor, tente novamente.';
				} finally {
					loading.value = false;
				}
			};

			const goBack = () => {
				router.push('/');
			};

			onMounted(() => {
				console.log('Componente montado, buscando usuários...');
				fetchUsers();
			});

			return { 
				users, 
				loading,
				error,
				isCurrentUser,
				updateUser, 
				deleteUser,
				fetchUsers,
				goBack
			};
		}
	});
</script>

<style scoped>
.user-management {
	max-width: 1000px;
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

.loading, .error, .no-users {
	text-align: center;
	padding: 40px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.loading-content, .error-content, .empty-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	color: #4b5563;
}

.loading-icon, .error-icon, .empty-icon {
	font-size: 2em;
	margin-bottom: 8px;
}

.error-content {
	color: #dc2626;
}

.error button {
	background-color: #dc2626;
	color: white;
	padding: 8px 16px;
	border-radius: 6px;
	font-weight: 500;
	margin-top: 8px;
}

.error button:hover {
	background-color: #b91c1c;
}

.table-container {
	background: white;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	overflow-x: auto;
}

table {
	width: 100%;
	border-collapse: collapse;
}

th, td {
	padding: 12px 16px;
	text-align: left;
	border-bottom: 1px solid #e5e7eb;
}

th {
	background-color: #f9fafb;
	font-weight: 600;
	color: #374151;
}

tr:hover {
	background-color: #f9fafb;
}

.user-name {
	font-weight: 500;
	color: #1f2937;
}

.user-email {
	color: #4b5563;
}

.role-select {
	padding: 6px 12px;
	border: 1px solid #e5e7eb;
	border-radius: 6px;
	background-color: white;
	color: #374151;
	font-size: 0.9em;
	width: 140px;
}

.role-select:disabled {
	background-color: #f3f4f6;
	cursor: not-allowed;
	opacity: 0.7;
}

button {
	padding: 6px 12px;
	border: none;
	border-radius: 6px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-delete {
	background-color: #ef4444;
	color: white;
	min-width: 80px;
}

.btn-delete:hover:not(:disabled) {
	background-color: #dc2626;
}

.btn-delete:disabled {
	background-color: #fca5a5;
}
</style>
