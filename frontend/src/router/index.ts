import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import TaskList from '../components/TaskList.vue';
import TaskDetail from '../components/TaskDetail.vue';
import UserManagement from '../components/UserManagement.vue';
import ProjectManagement from '../components/ProjectManagement.vue';
import Dashboard from '../views/Dashboard.vue';
import Auth from '../components/Auth.vue';
import { useAuth } from '../composables/useAuth';

const routes: Array<RouteRecordRaw> = [
  { 
    path: '/', 
    component: Dashboard, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/tasks', 
    name: 'TaskList', 
    component: TaskList, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/login', 
    name: 'Login',
    component: Auth,
    meta: { guest: true } 
  },
  { 
    path: '/task/:id', 
    name: 'TaskDetail', 
    component: TaskDetail, 
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: '/users', 
    name: 'UserManagement', 
    component: UserManagement,
    meta: { requiresAuth: true }
  },
  { 
    path: '/projects', 
    name: 'ProjectManagement', 
    component: ProjectManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      const auth = useAuth();
      return auth.isAuthenticated ? '/tasks' : '/login';
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegação melhorado com tratamento de inicialização
router.beforeEach(async (to) => {
  console.log(`🛡️ Router guard: ${to.path}`);
  
  const auth = useAuth();
  
  // Se a rota requer autenticação
  if (to.meta.requiresAuth) {
    console.log('🔒 Rota requer autenticação');
    
    // Se ainda está inicializando, esperar
    if (auth.isInitializing) {
      console.log('⏳ Auth ainda inicializando, aguardando...');
      await auth.ready;
    }
    
    // Se não está autenticado após inicialização
    if (!auth.isAuthenticated) {
      console.log('❌ Usuário não autenticado, redirecionando para login');
      return '/login';
    }
    
    console.log('✅ Usuário autenticado, permitindo acesso');
  }
  
  // Para rotas de guest (como login)
  if (to.meta.guest) {
    if (auth.isAuthenticated) {
      console.log('✅ Usuário já autenticado, redirecionando para tasks');
      return '/tasks';
    }
  }
  
  console.log('✅ Navegação permitida');
  return true;
});

export default router;
