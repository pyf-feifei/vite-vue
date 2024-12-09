import { setupDirective } from '@/directive'
import { setupDialog } from '@/utils/Dialog/index.js'
import { setupDrawer } from '@/utils/Drawer/index'
import { setupPopover } from '@/utils/Popover/index'
import { setupElementPluseIconsGlobal } from '@/utils/elementPluseIconsGlobal'
import { setupVuePlyr } from '@/utils/VuePlyr'
import { createPinia } from 'pinia'
const pinia = createPinia()
import router from '@/router'
import ElementPlus from 'element-plus'
export default function init(app) {
  app.use(router)
  setupDirective(app) //使用自定义Directive
  setupDialog(app) //使用自定义dialog
  setupDrawer(app) //使用自定义Drawer
  setupPopover(app) //使用自定义Popover
  setupElementPluseIconsGlobal(app) //全局使用ElementPluseIcon
  setupVuePlyr(app) //使用VuePlyr播放器
  app.use(ElementPlus).use(pinia)
}
