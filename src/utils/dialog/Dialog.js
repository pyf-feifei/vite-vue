import { createApp } from 'vue'
import DialogComponent from './DialogComponents.vue'

class Dialog {
  constructor() {
    this.dialogs = []
  }

  show(component, props = {}) {
    const dialogContainer = document.createElement('div')
    document.body.appendChild(dialogContainer) // 将新弹窗挂载到 body
    const dialogApp = createApp(DialogComponent, {
      onClose: () => {
        dialogApp.unmount(dialogContainer) // 关闭时卸载组件
        document.body.removeChild(dialogContainer) // 移除容器
      },
      ...{
        title: '标题',
      },
      ...props,
    })
    dialogApp.config.globalProperties.$dialog = this
    const dialogInstance = dialogApp.mount(dialogContainer)
    dialogInstance.show(component)

    this.dialogs.push(dialogInstance) // 存储弹窗实例以便管理
  }

  hideAll() {
    this.dialogs.forEach((dialog) => dialog.hide()) // 隐藏所有弹窗
    this.dialogs = [] // 清空弹窗列表
  }
}
const dialog = new Dialog()

// 全局注册 directive 方法
export function setupDialog(app) {
  app.config.globalProperties.$dialog = dialog
}
export default dialog
