import { createApp } from 'vue'
import PopoverComponent from './components/Popover.vue'
import { ElMessage } from 'element-plus'
class Popover {
  constructor() {
    this.popovers = []
  }

  show(component, props = {}) {
    let targetElement = null
    let referenceObj = props?.elPopoverOptions?.slots?.reference
    if (!referenceObj) {
      let callWord = 'elPopoverOptions.slots.reference属性必传！'
      ElMessage.error(callWord)
      throw Error(callWord)
    } else {
      let referenceIsVue =
        referenceObj &&
        (referenceObj.$el !== undefined ||
          referenceObj._isVue ||
          referenceObj.proxy !== undefined)
      if (!(referenceObj?.nodeType === 1 || referenceIsVue)) {
        let callWord =
          'elPopoverOptions.slots.reference属性必须为vue组件或dom元素！'
        ElMessage.error(callWord)
        throw Error(callWord)
      } else if (referenceObj?.nodeType === 1) {
        targetElement = referenceObj
      } else if (referenceIsVue) {
        //判断vue组件
        targetElement = referenceObj.$el
      }
    }
    //获取旧的position
    const computedStyle = window.getComputedStyle(targetElement)
    targetElement.iniPositionOld = computedStyle.position
    const zIndex = computedStyle.getPropertyValue('z-index')
    targetElement.iniZIndexOld = zIndex === 'auto' ? 0 : parseInt(zIndex, 10)
    targetElement.style.zIndex = targetElement.iniZIndexOld - 1
    // targetElement.style.position = 'relative'
    //新建popoverContainer 用于挂载vue
    const popoverContainer = document.createElement('div')
    let targetElementClassName = `dialog-container-${this.popovers.length + 1}`
    popoverContainer.classList.add(targetElementClassName)
    targetElement.appendChild(popoverContainer) // 将新弹窗挂载到 targetElement
    // 动态创建一个 style 标签
    const style = document.createElement('style')
    // 定义伪元素的样式
    style.innerHTML = `
        .${targetElementClassName}{
            position: absolute !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 1 !important;
            opcity:0 !important;
            background-color: transparent !important;
            z-index: 1 !important;
            position: absolute !important;
            top: 0px !important;
            left: 0px !important;
            margin: 0px !important;
            .el-tooltip__trigger{
              height: 100% !important;
              width: 100% !important;
            }
        }
    `
    // 将 style 标签添加到文档的 head 部分
    document.head.appendChild(style)
    return new Promise((resolve, reject) => {
      const popoverApp = createApp(PopoverComponent, {
        onClose: () => {
          try {
            targetElement &&
              (targetElement.style.position = targetElement.iniPositionOld)
            targetElement &&
              (targetElement.style.zIndex = targetElement.iniZIndexOld)
            popoverContainer && popoverApp.unmount(popoverContainer) // 关闭时卸载组件
            popoverContainer && targetElement.removeChild(popoverContainer) // 移除容器
          } catch (error) {}
        },
        ...props,
        elPopoverOptions: props?.elPopoverOptions,
        componentProps: props?.componentProps,
      })
      popoverApp.config.globalProperties.$popover = this
      popoverApp.config.globalProperties = {
        ...popoverApp.config.globalProperties,
        ...this.app.config.globalProperties,
        ...{ $popover: this },
      }
      popoverApp._context.directives = {
        ...popoverApp._context.directives,
        ...this.app._context.directives,
      }
      const popoverInstance = popoverApp.mount(popoverContainer)
      //添加关闭弹窗方法
      const mixin = {
        methods: {
          $popoverClose(isSucces = false, retrunData) {
            popoverInstance.closePopover()
            resolve({
              confirm: isSucces,
              data: retrunData,
            })
          },
        },
      }
      // 新建一个对象
      const componentWithMixin = Object.assign({}, component, mixin)
      popoverInstance.show(componentWithMixin)

      this.popovers.push(popoverInstance) // 存储弹窗实例以便管理
    })
  }

  closeAll() {
    this.popovers.forEach((popover) => popover.closePopover()) // 隐藏所有弹窗
    this.popovers = [] // 清空弹窗列表
  }
}
const popover = new Popover()

// 全局注册 directive 方法
export function setupPopover(app) {
  app.config.globalProperties.$popover = popover
  popover.app = app // 添加属性
}
export default popover
