<template>
  <el-drawer
    :id="elDrawerId"
    v-model="visible"
    v-bind="elDrawerOptions.attributes"
    @open="elDrawerOptions.events?.open"
    @opened="
      () => {
        if (!elDrawerOptions.events?.opened) return
        elDrawerOptions.events?.opened()
      }
    "
    @close="
      () => {
        if (!elDrawerOptions.events.close) return
        elDrawerOptions.events?.close()
      }
    "
    @closed="
      () => {
        if (!elDrawerOptions.events.closed) return
        elDrawerOptions.events?.closed()
        onClose()
      }
    "
    @open-auto-focus="elDrawerOptions.events?.openAutoFocus"
    @close-auto-focus="elDrawerOptions.events?.closeAutoFocus"
  >
    <template v-if="elDrawerOptions.slots?.header" #header>
      {{ elDrawerOptions.slots.header }}
    </template>

    <template v-if="contentComponent">
      <component v-clickOutDirective="clickOutDirective" :is="contentComponent" v-bind="componentProps" />
    </template>

    <template v-if="elDrawerOptions.slots?.footer" #footer>
      {{ elDrawerOptions.slots.footer }}
    </template>
  </el-drawer>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    onClose: {
      type: Function,
    },
    elDrawerOptions: {
      type: Object,
      default: (context) => ({
        attributes: {
          title: '',
          withHeader: false,
          appendToBody: false,
          lockScroll: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          openDelay: 0,
          closeDelay: 0,
          destroyOnClose: false,
          modal: true,
          direction: 'rtl',
          showClose: true,
          size: '30%',
          modalClass: '',
          zIndex: 2000,
          headerAriaLevel: '2',
          ...context.elDrawerOptions?.attributes,
        },
        events: {
          open: null,
          opened: null,
          close: null,
          closed: null,
          openAutoFocus: null,
          closeAutoFocus: null,
          ...context.elDrawerOptions?.events,
        },
        slots: {
          header: null,
          footer: null,
          ...context.elDrawerOptions?.slots,
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
    const elDrawerId = ref('')
    elDrawerId.value = getRandomString(18)
    const contentComponent = ref(null)

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
    function closeDrawer() {
      hide()
    }
    ////点击元素外
    let clickOutDirectiveTimesFirst = true
    /**
     * 点击元素外事件
     */
    function clickOutDirective() {
      if (clickOutDirectiveTimesFirst) {
        clickOutDirectiveTimesFirst = false
        return
      }
      closeDrawer()
    }
    onMounted(async () => {
      await nextTick()
      // 获取 el-drawer
      let elementDom = document.getElementById(elDrawerId.value)
      let elDrawerBodyDom = elementDom.getElementsByClassName('el-drawer__body')?.[0]
      elDrawerBodyDom && elDrawerBodyDom.classList.add('padding0') //设置样式
      if (!props.elDrawerOptions.attributes.modal) {
        //如果不要遮罩层设置可以点其他地方
        let elDrawerDOM = elementDom?.parentNode
        elDrawerDOM.classList.add('el-drawer-dom')
        elementDom.classList.add('pointer-events-auto') //解决子元素被 pointer-events: none影响的bug
      }
    })

    onBeforeUnmount(() => {})

    ////
    /**
     * 生成随机字符串
     * @param {number} length - 字符串的长度
     * @param {string} chars - 字符集（可选），默认为字母和数字
     * @returns {string} 生成的随机字符串
     */
    function getRandomString(length, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    return {
      props,
      visible,
      elDrawerId,
      contentComponent,
      show,
      hide,
      closeDrawer,
      clickOutDirective,
      // clickOutDirectiveTimesFirst,
    }
  },
}
</script>

<style lang="scss">
.el-drawer-dom {
  position: absolute !important;
  pointer-events: none !important;
}
.pointer-events-auto {
  pointer-events: auto !important;
}
.padding0 {
  padding: 0px;
}
</style>
