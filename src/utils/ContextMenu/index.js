import { createApp, h } from 'vue'
import init from '@/main/init.js'


class ContextMenu {
  static instance = null

  constructor() {
    this.app = null
    this.componentInstance = null
    this.container = null
    this.resolvePromise = null // 用于保存 resolve 函数
  }

  static getInstance() {
    if (!ContextMenu.instance) {
      ContextMenu.instance = new ContextMenu()
    }
    return ContextMenu.instance
  }

  show(event, component, options = {}, props = {}) {
    const { area = 'auto' } = options
    const position = { x: event.clientX, y: event.clientY }
    console.log('position', position)

    if (this.container) {
      console.log('进入这')

      this.hide()
    }

    this.container = document.createElement('div')
    this.container.style.position = 'fixed'
    this.container.style.top = `${position.y}px`
    this.container.style.left = `${position.x}px`
    this.container.style.width = area
    this.container.style.zIndex = 1000

    document.body.appendChild(this.container)

    // 创建一个 Promise 并保存 resolve 函数
    return new Promise((resolve) => {
      this.resolvePromise = resolve

      // 将 resolve 函数通过 props 传递给 component
      const enhancedProps = {
        ...props,
        onResolve: this.resolvePromise, // 将 resolve 函数传递给 component
      }

      this.app = createApp({
        render: () => h(component, enhancedProps),
      })
      init(this.app)
      // console.log('this.container', this.container)

      this.componentInstance = this.app.mount(this.container)
    })
  }

  hide() {
    if (this.container) {
      document.body.removeChild(this.container)
      this.container = null
      this.app.unmount()
      this.app = null
      this.componentInstance = null
      this.resolvePromise = null // 清除 resolve 函数
    }
  }
}

export default ContextMenu.getInstance()
