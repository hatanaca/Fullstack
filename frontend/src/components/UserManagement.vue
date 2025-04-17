<template>
	<div>
		<h2>User Management</h2>
		<table>
			<thead>
				<tr>
					<th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="user in users" :key="user.id">
					<td>{{ user.name }}</td>
					<td>{{ user.email }}</td>
					<td>
						<select v-model="user.role" @change="updateUser(user)">
							<option value="admin">Admin</option>
							<option value="user">User </option>
						</select>
					</td>
					<td>
						<button @click="deleteUser(user.id)">Delete</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, ref } from 'vue';
	import api from '@/plugins/api';

	interface User {
		id:number;
		name:string;
		email:string;
		role:string;
	}

	export default defineComponent({
		name: 'UserManagement',
		setup() {
			const users = ref<User[]>([]);
			const fetchUsers = async () => {
				try {
					const response = await api.get('/users');
					users.value = response.data;
				} catch (error) {
						console.error('Error fetching users', error);
				}
			};
			const updateUser = async (user: User) => {
				try {
					await api.put(`/users/${user.id}`, user);
				} catch (error) {
					console.error('Error updating user', error);
				}
			};
			const deleteUser = async (id: number) => {
				try {
					await api.delete(`/users/${id}`);
					fetchUsers();
				} catch (error) {
					console.error('Error deleting user', error);
				}
			};
			onMounted(fetchUsers);
			return { users, updateUser, deleteUser };
		}

	});
</script>
