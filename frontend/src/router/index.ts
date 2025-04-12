import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import TaskList from '../components/TaskList.vue';
import TaskDetail from '../components/TaskDetail.vue';
import UserManagement from '../components/UserManagement.vue';
import ProjectManagement from '../components/ProjectManagement.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'TaskList', component: TaskList },
  { path: '/task/:id', name: 'TaskDetail', component: TaskDetail, props: true },
  { path: '/users', name: 'UserManagement', component: UserManagement },
  { path: '/projects', name: 'ProjectManagement', component: ProjectManagement },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

