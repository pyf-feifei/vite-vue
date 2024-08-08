import { createApp } from 'vue'
import DialogComponent from './components/Dialog.vue'
import { ElMessage } from 'element-plus'
class Dialog {
  constructor() {
    this.dialogs = []
  }

  show(component, props = {}, dialogMountDom) {
    if (dialogMountDom) {
      if (dialogMountDom && dialogMountDom?.nodeType === 1) {
        dialogMountDom.iniPositionOld =
          window.getComputedStyle(dialogMountDom).position
        dialogMountDom.style.position = 'relative'
      } else {
        console.log('props', props, dialogMountDom)
        let callWord = 'dialogMountDom请传入dom元素！'
        ElMessage.error(callWord)
        throw Error(callWord)
      }
    }
    return new Promise((resolve, reject) => {
      const dialogContainer = document.createElement('div')
      dialogContainer.classList.add('dialog-container')
      const needToAppendDom = dialogMountDom || document.body
      needToAppendDom.appendChild(dialogContainer) // 将新弹窗挂载到 body
      const dialogApp = createApp(DialogComponent, {
        onClose: () => {
          try {
            dialogMountDom &&
              (dialogMountDom.style.position = dialogMountDom.iniPositionOld)
            dialogContainer && dialogApp.unmount(dialogContainer) // 关闭时卸载组件
            dialogContainer && needToAppendDom.removeChild(dialogContainer) // 移除容器
          } catch (error) {}
        },
        ...props,
        elDialogOptions: props?.elDialogOptions,
        componentProps: props?.componentProps,
      })
      dialogApp.config.globalProperties.$dialog = this
      dialogApp.config.globalProperties = {
        ...dialogApp.config.globalProperties,
        ...this.app.config.globalProperties,
        ...{ $dialog: this },
      }
      dialogApp._context.directives = {
        ...dialogApp._context.directives,
        ...this.app._context.directives,
      }
      const dialogInstance = dialogApp.mount(dialogContainer)
      //添加关闭弹窗方法
      const mixin = {
        methods: {
          $dialogClose(isSucces = false, retrunData) {
            dialogInstance.closeDialog()
            resolve({
              confirm: isSucces,
              data: retrunData,
            })
          },
        },
      }
      // 新建一个对象
      const componentWithMixin = Object.assign({}, component, mixin)
      dialogInstance.show(componentWithMixin)

      this.dialogs.push(dialogInstance) // 存储弹窗实例以便管理
    })
  }

  closeAll() {
    this.dialogs.forEach((dialog) => dialog.closeDialog()) // 隐藏所有弹窗
    this.dialogs = [] // 清空弹窗列表
  }
}
const dialog = new Dialog()

// 全局注册 directive 方法
export function setupDialog(app) {
  app.config.globalProperties.$dialog = dialog
  dialog.app = app // 添加属性
}
export default dialog
