/**
 * hover事件
 * 使用：v-hoverDirective="handleHover"
 */
export const hoverDirective = {
  beforeMount(el, binding) {
    // 鼠标进入时触发的函数
    el.addEventListener('mouseenter', (event) => {
      binding.value(true, event) // 传递一个值和事件对象给绑定的函数
    })

    // 鼠标离开时触发的函数
    el.addEventListener('mouseleave', (event) => {
      binding.value(false, event) // 传递一个值和事件对象给绑定的函数
    })
  },
  unmounted(el) {
    // 清理事件监听器
    el.removeEventListener('mouseenter')
    el.removeEventListener('mouseleave')
  },
}
