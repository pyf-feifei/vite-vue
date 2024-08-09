/**
 * 通过classs设置hover事件
 * 使用：v-hoverSonClassDirective:元素类名="handleHover"
 */
export const hoverSonClassDirective = {
  beforeMount(el, binding) {
    const updateHoverDirective = () => {
      let isHoveringTarget = false

      const checkForTarget = (event) => {
        const targetClass = binding.arg || 'quotePoint' // 默认类名为 'quotePoint'
        const targetElements = el.querySelectorAll(`.${targetClass}`)

        let isInside = false
        targetElements.forEach((targetElement) => {
          const rect = targetElement.getBoundingClientRect()
          if (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
          ) {
            isInside = true
          }
        })

        if (isInside !== isHoveringTarget) {
          isHoveringTarget = isInside
          binding.value(isHoveringTarget, event)
        }
      }

      // 鼠标进入时触发的函数
      const handleMouseEnter = () => {
        el.addEventListener('mousemove', checkForTarget)
      }

      // 鼠标离开时触发的函数
      const handleMouseLeave = () => {
        el.removeEventListener('mousemove', checkForTarget)
        if (isHoveringTarget) {
          isHoveringTarget = false
          binding.value(false)
        }
      }

      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    }

    updateHoverDirective()
  },
  unmounted(el) {
    // 清理事件监听器
    el.removeEventListener('mouseenter')
    el.removeEventListener('mouseleave')
    el.removeEventListener('mousemove')
  },
}
