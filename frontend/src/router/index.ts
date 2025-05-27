import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import TaskList from '../components/TaskList.vue';
import TaskDetail from '../components/TaskDetail.vue';
import UserManagement from '../components/UserManagement.vue';
import ProjectManagement from '../components/ProjectManagement.vue';
//import HelloWorld from '../components/HelloWorld.vue'; // Importando o componente HelloWorld
import Dashboard from '../views/Dashboard.vue';
import Auth from '../components/Auth.vue'; // Auth está em src/components
import { useAuth } from '../composables/useAuth'; // Import do composable

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },		
  { path: '/login', component: Auth },
//  { path: '/', name: 'TaskList', component: TaskList },
  { path: '/task/:id', name: 'TaskDetail', component: TaskDetail, props: true },
  { path: '/users', name: 'UserManagement', component: UserManagement },
  { path: '/projects', name: 'ProjectManagement', component: ProjectManagement },
//  { path: '/hello', name: 'HelloWorld', component: HelloWorld }, // Nova rota para HelloWorld
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegação corrigido
router.beforeEach(async (to, from, next) => {
  console.log('Router guard executando para:', to.path)
  
  if (to.meta.requiresAuth) {
    const auth = useAuth()
    
    // Verifica autenticação
    await auth.checkAuth()
    
    console.log('Estado de autenticação:', {
      isAuthenticated: auth.isAuthenticated,
      user: auth.currentUser,
      hasToken: !!localStorage.getItem('authToken')
    })
    
    if (!auth.isAuthenticated) {
      console.log('Usuário não autenticado, redirecionando para login')
      next('/login')
    } else {
      console.log('Usuário autenticado, permitindo acesso')
      next()
    }
  } else {
    next()
  }
})

export default router;
