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

// Guard de navegação corrigido - SEM checkAuth()
router.beforeEach(async (to, from, next) => {
  console.log('Router guard executando para:', to.path)
  
  if (to.meta.requiresAuth) {
    const auth = useAuth()
    
    // Usar apenas o estado atual, SEM fazer nova requisição
    const hasToken = !!localStorage.getItem('authToken')
    const hasUser = !!auth.currentUser
    const isAuthenticated = hasToken && hasUser
    
    console.log('Verificação de autenticação:', {
      hasToken,
      hasUser,
      isAuthenticated,
      user: auth.currentUser
    })
    
    if (!isAuthenticated) {
      console.log('Usuário não autenticado, redirecionando para login')
      next('/login')
    } else {
      console.log('Usuário autenticado, permitindo acesso')
      next()
    }
  } else {
    // Para rota /login, verificar se já está autenticado
    if (to.path === '/login') {
      const auth = useAuth()
      const hasToken = !!localStorage.getItem('authToken')
      const hasUser = !!auth.currentUser
      
      if (hasToken && hasUser) {
        console.log('Usuário já autenticado, redirecionando para dashboard')
        next('/')
        return
      }
    }
    next()
  }
})

export default router;
