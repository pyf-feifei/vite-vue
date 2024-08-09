/**
 * hover事件
 * 使用：v-hoverDirective="handleHover"
 */
export const hoverDirective = {
  beforeMount(el, binding) {
    // 鼠标进入时触发的函数
    const handleMouseEnter = (event) => {
      binding.value(true, event) // 传递一个值和事件对象给绑定的函数
    }

    // 鼠标离开时触发的函数
    const handleMouseLeave = (event) => {
      binding.value(false, event) // 传递一个值和事件对象给绑定的函数
    }

    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)

    // 保存事件处理函数以便在 unmounted 中使用
    el._hoverHandlers = {
      mouseenter: handleMouseEnter,
      mouseleave: handleMouseLeave,
    }
  },
  unmounted(el) {
    // 清理事件监听器
    if (el._hoverHandlers) {
      el.removeEventListener('mouseenter', el._hoverHandlers.mouseenter)
      el.removeEventListener('mouseleave', el._hoverHandlers.mouseleave)
      delete el._hoverHandlers
    }
  },
}
