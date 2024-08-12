<template>
  <el-popover
    :id="elPopoverId"
    @show="
      () => {
        if (elPopoverOptions.events?.show) {
          elPopoverOptions.events?.show()
        }
      }
    "
    @beforeEnter="
      () => {
        if (elPopoverOptions.events?.beforeEnter) {
          elPopoverOptions.events?.beforeEnter()
        }
      }
    "
    @afterEnter="
      () => {
        if (elPopoverOptions.events?.afterEnter) {
          elPopoverOptions.events?.afterEnter()
        }
      }
    "
    @hide="
      () => {
        if (elPopoverOptions.events?.hide) {
          elPopoverOptions.events?.hide()
        }
      }
    "
    @beforeLeave="
      () => {
        if (elPopoverOptions.events?.beforeLeave) {
          elPopoverOptions.events?.beforeLeave()
        }
      }
    "
    @afterLeave="
      () => {
        if (elPopoverOptions.events?.afterLeave) {
          elPopoverOptions.events?.afterLeave()
        }
        onClose()
      }
    "
    v-model:visible="visible"
    v-bind="elPopoverOptions.attributes"
  >
    <template v-if="elPopoverOptions.slots?.default" #default>
      <div>
        <component :is="elPopoverOptions.slots.default"></component>
      </div>
    </template>

    <template v-if="contentComponent">
      <div>
        <component :is="contentComponent" v-bind="componentProps" />
      </div>
    </template>
    <template v-if="elPopoverOptions.slots?.reference" #reference>
      <div></div>
    </template>
  </el-popover>
</template>

<script>
import { ref, shallowRef } from 'vue'

export default {
  props: {
    onClose: {
      type: Function,
    },
    elPopoverOptions: {
      type: Object,
      default: (context) => ({
        attributes: {
          trigger: 'hover', // 触发方式, 这个失效
          title: '', // 标题
          effect: 'light', // Tooltip 主题，Element Plus 内置了 dark / light 两种主题
          content: '', // 显示的内容，也可以通过写入默认 slot 修改显示内容
          width: 150, // 宽度
          placement: 'bottom', // 出现位置
          disabled: false, // Popover 是否可用
          visible: null, // Popover 是否显示
          offset: undefined, // 浮层偏移量, Popover 是在 Tooltip,基础上开发的， Popover的 offset 是 undefined
          transition: '', // 定义渐变动画，默认是 el-fade-in-linear
          showArrow: true, // 是否显示 Tooltip 箭头， 欲了解更多信息，请参考 ElPopper
          popperOptions: { modifiers: [{ name: 'computeStyles', options: { gpuAcceleration: false } }] }, // popper.js 的参数
          popperClass: '', // 为 popper 添加类名
          popperStyle: {}, // 为 popper 自定义样式
          showAfter: 0, // 在触发后多久显示内容，单位毫秒
          hideAfter: 200, // 延迟关闭，单位毫秒
          autoClose: 0, // tooltip 出现后自动隐藏延时，单位毫秒
          tabindex: 0, // Popover 组件的 tabindex
          teleported: false, // 是否将 popover 的下拉列表插入至 body 元素
          persistent: true, // 当 popover 组件长时间不触发且 persistent 属性设置为 false 时, popover 将会被删除
          ...context.elPopoverOptions?.attributes,
        },
        events: {
          show: null,
          beforeEnter: null,
          afterEnter: null,
          hide: null,
          beforeLeave: null,
          afterLeave: null,
          ...context.elPopoverOptions?.events,
        },
        slots: {
          reference: null,
          default: null,
          ...context.elPopoverOptions?.slots,
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
    const elPopoverId = ref('')
    elPopoverId.value = getRandomString(18)
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
    function closePopover() {
      hide()
    }
    onMounted(async () => {
      await nextTick()
      // 获取 el-popover
      let elementDom = document.getElementById(elPopoverId.value)
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
      elPopoverId,
      contentComponent,
      show,
      hide,
      closePopover,
    }
  },
}
</script>

<style lang="scss"></style>
