import { createApp } from 'vue'
import DrawerComponent from './components/Drawer.vue'
import { ElMessage } from 'element-plus'
class Drawer {
  constructor() {
    this.drawers = []
  }

  show(component, props = {}, drawerMountDom) {
    if (drawerMountDom) {
      if (drawerMountDom && drawerMountDom?.nodeType === 1) {
        drawerMountDom.iniPositionOld = window.getComputedStyle(drawerMountDom).position
        drawerMountDom.style.position = 'relative'
      } else {
        console.log('props', props, drawerMountDom)
        let callWord = 'drawerMountDom请传入dom元素！'
        ElMessage.error(callWord)
        throw Error(callWord)
      }
    }
    return new Promise((resolve, reject) => {
      const drawerContainer = document.createElement('div')
      drawerContainer.classList.add('drawer-container')
      const needToAppendDom = drawerMountDom || document.body
      needToAppendDom.appendChild(drawerContainer) // 将新弹窗挂载到 body
      const drawerApp = createApp(DrawerComponent, {
        onClose: () => {
          try {
            drawerMountDom && (drawerMountDom.style.position = drawerMountDom.iniPositionOld)
            drawerContainer && drawerApp.unmount(drawerContainer) // 关闭时卸载组件
            drawerContainer && needToAppendDom.removeChild(drawerContainer) // 移除容器
          } catch (error) {}
        },
        ...props,
        elDrawerOptions: props?.elDrawerOptions,
        componentProps: props?.componentProps,
      })
      drawerApp.config.globalProperties.$drawer = this
      drawerApp.config.globalProperties = {
        ...drawerApp.config.globalProperties,
        ...this.app.config.globalProperties,
        ...{ $drawer: this },
      }
      drawerApp._context.directives = { ...drawerApp._context.directives, ...this.app._context.directives }
      const drawerInstance = drawerApp.mount(drawerContainer)
      //添加关闭弹窗方法
      const mixin = {
        methods: {
          $drawerClose(isSucces = false, retrunData) {
            drawerInstance.closeDrawer()
            resolve({
              confirm: isSucces,
              data: retrunData,
            })
          },
        },
      }
      // 新建一个对象
      const componentWithMixin = Object.assign({}, component, mixin)
      drawerInstance.show(componentWithMixin)

      this.drawers.push(drawerInstance) // 存储弹窗实例以便管理
    })
  }

  closeAll() {
    this.drawers.forEach((drawer) => drawer.closeDrawer()) // 隐藏所有弹窗
    this.drawers = [] // 清空弹窗列表
  }
}
const drawer = new Drawer()

// 全局注册 directive 方法
export function setupDrawer(app) {
  app.config.globalProperties.$drawer = drawer
  drawer.app = app // 添加属性
}
export default drawer
