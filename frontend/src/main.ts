import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 👈 importa o roteador

const app = createApp(App)

app.use(router) // 👈 conecta o roteador com o app
app.mount('#app')

