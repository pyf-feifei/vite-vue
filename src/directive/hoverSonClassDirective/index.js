/**
 * 通过class设置hover事件
 * 使用：v-hoverSonClassDirective:元素类名="handleHover"
 */
export const hoverSonClassDirective = {
  beforeMount(el, binding) {
    const updateHoverDirective = () => {
      let isHoveringTarget = false
      let currentHoveredElement = null

      const checkForTarget = (event) => {
        const targetClass = binding.arg || 'quotePoint' // 默认类名为 'quotePoint'
        const targetElements = el.querySelectorAll(`.${targetClass}`)

        let isInside = false
        let hoveredElement = null

        targetElements.forEach((targetElement) => {
          const rect = targetElement.getBoundingClientRect()
          if (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
          ) {
            isInside = true
            hoveredElement = targetElement
          }
        })

        if (
          isInside !== isHoveringTarget ||
          hoveredElement !== currentHoveredElement
        ) {
          isHoveringTarget = isInside
          currentHoveredElement = hoveredElement
          binding.value(isHoveringTarget, event, currentHoveredElement)
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
          currentHoveredElement = null
          binding.value(false, null, null)
        }
      }

      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)

      // 保存事件处理函数以便在 unmounted 中使用
      el._hoverDirectiveHandlers = {
        mouseenter: handleMouseEnter,
        mouseleave: handleMouseLeave,
        mousemove: checkForTarget,
      }
    }

    updateHoverDirective()
  },
  unmounted(el) {
    // 清理事件监听器
    if (el._hoverDirectiveHandlers) {
      el.removeEventListener(
        'mouseenter',
        el._hoverDirectiveHandlers.mouseenter
      )
      el.removeEventListener(
        'mouseleave',
        el._hoverDirectiveHandlers.mouseleave
      )
      el.removeEventListener('mousemove', el._hoverDirectiveHandlers.mousemove)
      delete el._hoverDirectiveHandlers
    }
  },
}
