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
import '@/styles/index.scss'

import { setupDirective } from '@/directive'
import { setupDialog } from '@/utils/Dialog/index.js'
import { setupDrawer } from '@/utils/Drawer/index'
import { setupPopover } from '@/utils/Popover/index'
import { setupElementPluseIconsGlobal } from '@/utils/elementPluseIconsGlobal'
import { setupVuePlyr } from '@/utils/VuePlyr'

import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App)
app.use(router)
setupDirective(app) //使用自定义Directive
setupDialog(app) //使用自定义dialog
setupDrawer(app) //使用自定义Drawer
setupPopover(app) //使用自定义Popover
setupElementPluseIconsGlobal(app) //全局使用ElementPluseIcon
setupVuePlyr(app) //使用VuePlyr播放器
app.use(ElementPlus).use(pinia).mount('#app')
