import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'
import '@/permission'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'
import 'uno.css'

import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/dark.scss'

import { setupDirective } from '@/directive'

import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App)
setupDirective(app)
app.use(router).use(ElementPlus).use(pinia).mount('#app')
