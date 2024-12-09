import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@/permission'

import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'
import 'uno.css'

import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/dark.scss'
import '@/styles/index.scss'

import init from '@/main/init.js'

const app = createApp(App)
init(app)
app.mount('#app')
