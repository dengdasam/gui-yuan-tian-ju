import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './assets/styles/main.css'

// Views
import TitleScreen from './views/TitleScreen.vue'
import GameScreen from './views/GameScreen.vue'

const routes = [
  { path: '/', component: TitleScreen },
  { path: '/game', component: GameScreen }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
