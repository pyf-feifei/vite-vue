import Vue from 'vue'
import DialogTitle from './DialogTitle.vue'
import importDialog from '@/utils/dialog/index.js'
import { createMd5Id } from '@/utils'

class Dialog {
  constructor() {
    this.instanceMap = {}
  }
  dialogShow(
    component,
    propsData = {
      width: '30%',
      titlePadding: '10px',
      title: '弹窗标题',
      showCloseButton: true,
    }
  ) {
    return new Promise((resolve, reject) => {
      const DialogComponent = Vue.extend(component)

      const elIn = document.createElement('div')
      let dialogMd5Id = createMd5Id()
      let inInstance = new DialogComponent({
        el: elIn,
        propsData: propsData,
        components: {
          DialogTitle, // 引入自定义的 DialogHeader 组件
        },
        data() {
          return {
            dialogMd5Id: dialogMd5Id,
          }
        },
        mounted() {
          console.log('重新进入')
          const overlay = document.createElement('div')
          overlay.classList.add(`overlay${this.dialogMd5Id}`)
          overlay.style.zIndex = '99'
          overlay.style.position = 'fixed'
          overlay.style.top = 0
          overlay.style.right = 0
          overlay.style.bottom = 0
          overlay.style.left = 0
          overlay.style.height = '100%'
          overlay.style.overflow = 'auto'
          overlay.style.backgroundColor = 'rgba(0, 0, 0, .5)'
          // overlay.style.display = 'flex'
          // overlay.style.justifyContent = 'center'
          // overlay.style.alignItems = 'center'
          // 设置其他样式属性，例如背景色和透明度
          const idElement = document.getElementById('app')
          idElement.appendChild(overlay)
          overlay.addEventListener('click', (event) => {
            event.stopPropagation() // 阻止点击事件冒泡，防止关闭弹窗
          })
          const alloverlay = document.createElement('div')
          alloverlay.classList.add('alloverlay')
          overlay.appendChild(alloverlay)
          const dialogTitle = new Vue({
            render: (h) =>
              h(DialogTitle, {
                props: {
                  showCloseButton: propsData.showCloseButton,
                  title: propsData.title,
                  titlePadding: propsData.titlePadding,
                },
                on: {
                  'close-dialog': function (event) {
                    console.log('this', dialogTitle)
                    dialogTitle.$emit('close-dialog')
                    // 在这里处理 close-dialog 事件
                    // importDialog.instanceMap[dialogMd5Id].$destroy()
                    // delete importDialog.instanceMap[dialogMd5Id]
                  },
                },
              }),
          }).$mount()
          alloverlay.appendChild(dialogTitle.$el)

          alloverlay.appendChild(this.$el)
          this.$nextTick(() => {
            this.centerDialog(alloverlay)
            dialogTitle.$on('close-dialog', () => {
              this.$emit('close-dialog')
            })
          })
        },
        destroyed() {
          // overlay.removeChild(this.$el)
          this.removeOverlay()
        },
        methods: {
          removeOverlay() {
            const overlay = document.querySelector(
              `.overlay${this.dialogMd5Id}`
            )
            while (overlay.firstChild) {
              overlay.removeChild(overlay.firstChild)
            }
            const idElement = document.getElementById('app')
            idElement.removeChild(overlay)
          },
          centerDialog(dom) {
            dom.style.margin = '200px auto 13px'
            dom.style.background = '#ffffff'
            dom.style.position = 'relative'
            dom.style.position = 'relative'
            // dialog.style.borderRadius = '4px'
            dom.style.boxShadow =
              '0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08)'
            dom.style.boxSizing = 'border-box'
            dom.style.width = propsData.width
          },
          $dialogClose(data) {
            resolve({
              confirm: false,
              data: data,
            })
            importDialog.instanceMap[this.dialogMd5Id].$destroy()
            delete importDialog.instanceMap[this.dialogMd5Id]
          },
          $dialogConfirm(data) {
            console.log('进入这')
            resolve({
              confirm: true,
              data: data,
            })
            importDialog.instanceMap[this.dialogMd5Id].$destroy()
            delete importDialog.instanceMap[this.dialogMd5Id]
          },
        },
      })
      this.instanceMap[dialogMd5Id] = inInstance
    })
  }
  clear() {
    Object.values(importDialog.instanceMap).forEach((item) => {
      item.$destroy()
    })
    this.instanceMap = {}
  }
}

// 全局注册 Dialog
export function setupDialog(app) {
  const dialog = new Dialog()
  // 使 v-hasPerm 在所有组件中都可用
  app.config.globalProperties.$dialog = dialog
}
