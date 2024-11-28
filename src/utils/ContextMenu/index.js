//鼠标位置弹窗
import { createApp, h } from 'vue'
import init from '@/core/js/init'

class ContextMenu {
  static instance = null

  constructor() {
    this.app = null
    this.componentInstance = null
    this.container = null
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

    if (this.container) {
      this.hide()
    }

    this.container = document.createElement('div')
    this.container.style.position = 'fixed'
    this.container.style.top = `${position.y}px`
    this.container.style.left = `${position.x}px`
    this.container.style.width = area
    this.container.style.zIndex = 1000

    document.body.appendChild(this.container)

    this.app = createApp({
      render: () => h(component, props),
    })
    init(this.app)

    this.componentInstance = this.app.mount(this.container)
  }

  hide() {
    if (this.container) {
      document.body.removeChild(this.container)
      this.container = null
      this.app.unmount()
      this.app = null
      this.componentInstance = null
    }
  }
}

export default ContextMenu.getInstance()
