<script setup lang="ts">
import { onMounted } from 'vue'
import api from '@/plugins/api'

onMounted(() => {
  api.get('/ping')
    .then(res => console.log('Ping OK:', res.data))
    .catch(err => console.error('Erro no CORS ou conexão:', err))
})
</script>

<template>
  <div>
    <h1>Teste de conexão com backend</h1>
    <p>Veja o console do navegador para a resposta da API.</p>
  </div>
</template>

