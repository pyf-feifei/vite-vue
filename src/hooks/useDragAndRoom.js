// useDragAndRoom.js 在某个div下自由拖动缩放
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

export function useDragAndRoom(containerRef, options = {}) {
  const {
    minScale = 0.1,
    maxScale = 5,
    zoomSpeed = 0.1,
    initialScale = 1,
    onZoomChange,
    onPanChange,
  } = options

  // Pan state
  const panState = reactive({
    translateX: 0,
    translateY: 0,
    prevTranslateX: 0,
    prevTranslateY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
  })

  // Zoom state
  const zoomState = reactive({
    scale: initialScale,
    targetScale: initialScale,
    ZOOM_SPEED: zoomSpeed,
    MIN_SCALE: minScale,
    MAX_SCALE: maxScale,
  })

  // 使用 CSS transform3d 来启用硬件加速
  const transformStyle = computed(() => ({
    transform: `translate3d(${panState.translateX}px, ${panState.translateY}px, 0) scale(${zoomState.scale})`,
    cursor: panState.isDragging ? 'move' : 'default',
    willChange: panState.isDragging ? 'transform' : 'auto', // 提示浏览器即将进行动画
  }))

  let animationFrameId = null

  // 使用 requestAnimationFrame 优化拖动更新
  function updateDragPosition(event) {
    panState.translateX =
      panState.prevTranslateX + (event.clientX - panState.lastX)
    panState.translateY =
      panState.prevTranslateY + (event.clientY - panState.lastY)

    onPanChange?.({
      x: panState.translateX,
      y: panState.translateY,
    })
  }

  // Add new state to track if mouse is over content
  const isOverContent = ref(false)

  function startDrag(event) {
    // Only start drag if mouse is over content
    if (event.button !== 0 || !isOverContent.value) return

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }

    panState.isDragging = true
    panState.lastX = event.clientX
    panState.lastY = event.clientY

    function onMouseMove(event) {
      // 使用 requestAnimationFrame 进行位置更新
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(() => updateDragPosition(event))
    }

    function onMouseUp(event) {
      panState.isDragging = false
      panState.prevTranslateX = panState.translateX
      panState.prevTranslateY = panState.translateY

      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseup', onMouseUp)
  }

  // 优化的缩放动画
  let zoomAnimationFrame = null
  function animateZoom(targetScale, contentX, contentY) {
    const currentScale = zoomState.scale
    const diff = targetScale - currentScale
    const factor = 0.2

    if (Math.abs(diff) < 0.001) {
      zoomState.scale = targetScale
      return
    }

    const newScale = currentScale + diff * factor
    zoomState.scale = newScale

    // 更新位置，保持鼠标指向的内容点不变
    panState.translateX = mouseX - contentX * newScale
    panState.translateY = mouseY - contentY * newScale

    panState.prevTranslateX = panState.translateX
    panState.prevTranslateY = panState.translateY

    onPanChange?.({
      x: panState.translateX,
      y: panState.translateY,
    })

    zoomAnimationFrame = requestAnimationFrame(() =>
      animateZoom(targetScale, contentX, contentY)
    )
  }

  function handleWheel(event) {
    if (!isOverContent.value) return
    event.preventDefault()

    if (zoomAnimationFrame) {
      cancelAnimationFrame(zoomAnimationFrame)
    }

    // 获取鼠标相对于容器的位置
    const containerRect = containerRef.value.getBoundingClientRect()
    const mouseX = event.clientX - containerRect.left
    const mouseY = event.clientY - containerRect.top

    // 计算鼠标相对于已变换内容的位置
    const contentX = (mouseX - panState.translateX) / zoomState.scale
    const contentY = (mouseY - panState.translateY) / zoomState.scale

    const zoomFactor =
      event.deltaY > 0 ? 1 - zoomState.ZOOM_SPEED : 1 + zoomState.ZOOM_SPEED
    const targetScale = clamp(
      zoomState.scale * zoomFactor,
      zoomState.MIN_SCALE,
      zoomState.MAX_SCALE
    )

    // 修改缩放动画函数
    function animateZoom(targetScale, contentX, contentY) {
      const currentScale = zoomState.scale
      const diff = targetScale - currentScale
      const factor = 0.2

      if (Math.abs(diff) < 0.001) {
        zoomState.scale = targetScale
        return
      }

      const newScale = currentScale + diff * factor
      zoomState.scale = newScale

      // 更新位置，保持鼠标指向的内容点不变
      panState.translateX = mouseX - contentX * newScale
      panState.translateY = mouseY - contentY * newScale

      panState.prevTranslateX = panState.translateX
      panState.prevTranslateY = panState.translateY

      onPanChange?.({
        x: panState.translateX,
        y: panState.translateY,
      })

      zoomAnimationFrame = requestAnimationFrame(() =>
        animateZoom(targetScale, contentX, contentY)
      )
    }

    // 开始缩放动画
    animateZoom(targetScale, contentX, contentY)
    onZoomChange?.(targetScale)
  }

  function getRelativeMousePos(event) {
    const rect = containerRef.value.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  // 重置所有状态
  function reset() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    if (zoomAnimationFrame) {
      cancelAnimationFrame(zoomAnimationFrame)
    }

    zoomState.scale = initialScale
    panState.translateX = 0
    panState.translateY = 0
    panState.prevTranslateX = 0
    panState.prevTranslateY = 0
  }

  // 清理函数
  onBeforeUnmount(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    if (zoomAnimationFrame) {
      cancelAnimationFrame(zoomAnimationFrame)
    }
  })

  // Add new methods to track mouse position
  function onContentEnter() {
    isOverContent.value = true
  }

  function onContentLeave() {
    isOverContent.value = false
  }

  return {
    panState,
    zoomState,
    transformStyle,
    startDrag,
    handleWheel,
    reset,
    onContentEnter,
    onContentLeave,
  }
}
