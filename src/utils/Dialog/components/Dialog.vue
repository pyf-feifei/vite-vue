<template>
  <el-dialog
    :id="elDialogId"
    v-model="visible"
    v-bind="elDialogOptions.attributes"
    :class="{
      'no-header-dialog': props.elDialogOptions.title ? false : true,
    }"
    @open="elDialogOptions.events?.open"
    @opened="
      () => {
        if (!elDialogOptions.events?.opened) return
        elDialogOptions.events?.opened()
      }
    "
    @close="
      () => {
        if (!elDialogOptions.events.close) return
        elDialogOptions.events?.close()
      }
    "
    @closed="
      () => {
        if (elDialogOptions.events?.closed) {
          elDialogOptions.events?.closed()
        }
        onClose()
      }
    "
    @open-auto-focus="elDialogOptions.events?.openAutoFocus"
    @close-auto-focus="elDialogOptions.events?.closeAutoFocus"
  >
    <template v-if="elDialogOptions.slots?.header" #header>
      {{ elDialogOptions.slots.header }}
    </template>

    <template v-if="contentComponent">
      <component :is="contentComponent" v-bind="componentProps" />
    </template>

    <template v-if="elDialogOptions.slots?.footer" #footer>
      {{ elDialogOptions.slots.footer }}
    </template>
  </el-dialog>
</template>

<script>
import { ref, shallowRef } from 'vue'

export default {
  props: {
    onClose: {
      type: Function,
    },
    elDialogOptions: {
      type: Object,
      default: (context) => ({
        attributes: {
          title: '', // Dialog 对话框 Dialog 的标题，也可通过具名 slot 传入
          width: '50%', // 对话框的宽度，默认值为 50%
          fullscreen: false, // 是否为全屏 Dialog
          top: '15vh', // dialog CSS 中的 margin-top 值，默认为 15vh
          modal: true, // 是否需要遮罩层
          modalClass: '', // 遮罩的自定义类名
          appendToBody: false, // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
          appendTo: 'body', // Dialog 挂载到哪个 DOM 元素 将覆盖 append-to-body
          lockScroll: true, // 是否在 Dialog 出现时将 body 滚动锁定
          customClass: '', // Dialog 的自定义类名
          openDelay: 0, // dialog 打开的延时时间，单位毫秒
          closeDelay: 0, // dialog 关闭的延时时间，单位毫秒
          closeOnClickModal: true, // 是否可以通过点击 modal 关闭 Dialog
          closeOnPressEscape: true, // 是否可以通过按下 ESC 关闭 Dialog
          showClose: false, // 是否显示关闭按钮
          beforeClose: null, // 关闭前的回调，会暂停 Dialog 的关闭. 回调函数内执行 done 参数方法的时候才是真正关闭对话框的时候.
          draggable: false, // 为 Dialog 启用可拖拽功能
          overflow: false, // 拖动范围可以超出可视区
          center: false, // 是否让 Dialog 的 header 和 footer 部分居中排列
          alignCenter: false, // 是否水平垂直对齐对话框
          destroyOnClose: true, // 当关闭 Dialog 时，销毁其中的元素
          closeIcon: null, // 自定义关闭图标，默认 Close
          zIndex: 2000, // 和原生的 CSS 的 z-index 相同，改变 z 轴的顺序
          headerAriaLevel: '2', // header 的 aria-level 属性
          ...context.elDialogOptions?.attributes,
        },
        events: {
          open: null,
          opened: null,
          close: null,
          closed: null,
          openAutoFocus: null,
          closeAutoFocus: null,
          ...context.elDialogOptions?.events,
        },
        slots: {
          header: null,
          footer: null,
          ...context.elDialogOptions?.slots,
        },
      }),
    },
    componentProps: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const visible = ref(false)
    const elDialogId = ref('')
    elDialogId.value = getRandomString(18)
    const contentComponent = shallowRef(null)

    function show(component) {
      contentComponent.value = component
      visible.value = true
    }

    function hide() {
      visible.value = false
    }
    /**
     * 关闭弹窗
     */
    function closeDialog() {
      hide()
    }
    onMounted(async () => {
      await nextTick()
      // 获取 el-dialog
      let elementDom = document.getElementById(elDialogId.value)
      let elDialogBodyDom =
        elementDom.getElementsByClassName('el-dialog__body')?.[0]

      elDialogBodyDom && elDialogBodyDom.classList.add('padding0') //设置样式
    })

    onBeforeUnmount(() => {})

    ////
    /**
     * 生成随机字符串
     * @param {number} length - 字符串的长度
     * @param {string} chars - 字符集（可选），默认为字母和数字
     * @returns {string} 生成的随机字符串
     */
    function getRandomString(
      length,
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    ) {
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    return {
      props,
      visible,
      elDialogId,
      contentComponent,
      show,
      hide,
      closeDialog,
    }
  },
}
</script>

<style lang="scss">
.el-dialog-dom {
  position: absolute !important;
  pointer-events: none !important;
}
.pointer-events-auto {
  pointer-events: auto !important;
}
.padding0 {
  padding: 0px;
}
.no-header-dialog {
  .el-dialog__header {
    display: none;
  }
}
</style>
