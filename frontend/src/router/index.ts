import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import TaskList from '../components/TaskList.vue';
import TaskDetail from '../components/TaskDetail.vue';
import UserManagement from '../components/UserManagement.vue';
import ProjectManagement from '../components/ProjectManagement.vue';
import HelloWorld from '../components/HelloWorld.vue'; // Importando o componente HelloWorld

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'TaskList', component: TaskList },
  { path: '/task/:id', name: 'TaskDetail', component: TaskDetail, props: true },
  { path: '/users', name: 'UserManagement', component: UserManagement },
  { path: '/projects', name: 'ProjectManagement', component: ProjectManagement },
  { path: '/hello', name: 'HelloWorld', component: HelloWorld }, // Nova rota para HelloWorld
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

