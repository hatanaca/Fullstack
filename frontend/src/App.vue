<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth } from './composables/useAuth'

const auth = useAuth()

// Inicializa a verificação de autenticação quando o app carrega
onMounted(async () => {
  console.log('App.vue mounted - verificando autenticação inicial...')
  
  try {
    await auth.checkAuth()
    console.log('Verificação inicial de auth completa:', {
      isAuthenticated: auth.isAuthenticated,
      user: auth.currentUser
    })
  } catch (error) {
    console.error('Erro na verificação inicial de auth:', error)
  }
})
</script>

<style scoped>
#app {
  font-weight: normal;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
  padding: 3px;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}
</style>
