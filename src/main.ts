import './assets/main.css'
import './assets/transitions.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// import { simulateAdmin } from './utils/simulateAdmin'

const app = createApp(App)

// DEBUG MODE - Simulate admin login for development
// simulateAdmin(false)

app.use(createPinia())
app.use(router)

app.mount('#app')
