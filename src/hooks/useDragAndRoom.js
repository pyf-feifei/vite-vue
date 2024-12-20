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
    enableInertia = true,
    inertiaDeceleration = 0.9,
  } = options

  // Pan state
  const panState = reactive({
    translateX: 0,
    translateY: 0,
    prevTranslateX: 0,
    prevTranslateY: 0,
    isDragging: false,
    velocity: { x: 0, y: 0 },
    lastTime: 0,
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
  let lastDragEvent = null
  let isInertiaActive = false

  // 使用 requestAnimationFrame 优化拖动更新
  function updateDragPosition(event) {
    if (!lastDragEvent) {
      lastDragEvent = event
      return
    }

    const currentTime = performance.now()
    const deltaTime = currentTime - panState.lastTime
    const deltaX = event.clientX - lastDragEvent.clientX
    const deltaY = event.clientY - lastDragEvent.clientY

    // 计算瞬时速度
    if (deltaTime > 0) {
      panState.velocity.x = deltaX / deltaTime
      panState.velocity.y = deltaY / deltaTime
    }

    panState.translateX =
      panState.prevTranslateX + (event.clientX - panState.lastX)
    panState.translateY =
      panState.prevTranslateY + (event.clientY - panState.lastY)

    panState.lastTime = currentTime
    lastDragEvent = event

    onPanChange?.({
      x: panState.translateX,
      y: panState.translateY,
    })
  }

  // 惯性滚动动画
  function inertiaAnimation() {
    if (
      !isInertiaActive ||
      (Math.abs(panState.velocity.x) < 0.01 &&
        Math.abs(panState.velocity.y) < 0.01)
    ) {
      isInertiaActive = false
      return
    }

    panState.translateX += panState.velocity.x * 16 // 假设 16ms 每帧
    panState.translateY += panState.velocity.y * 16
    panState.prevTranslateX = panState.translateX
    panState.prevTranslateY = panState.translateY

    // 减速
    panState.velocity.x *= inertiaDeceleration
    panState.velocity.y *= inertiaDeceleration

    animationFrameId = requestAnimationFrame(inertiaAnimation)
  }

  function startDrag(event) {
    if (event.button !== 0) return // 只响应左键

    // 停止任何正在进行的惯性动画
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      isInertiaActive = false
    }

    panState.isDragging = true
    panState.lastX = event.clientX
    panState.lastY = event.clientY
    panState.lastTime = performance.now()
    lastDragEvent = null

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

      // 启用惯性滚动
      if (enableInertia) {
        isInertiaActive = true
        inertiaAnimation()
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseup', onMouseUp)
  }

  // 优化的缩放动画
  let zoomAnimationFrame = null
  function animateZoom(targetScale, mouseX, mouseY) {
    const currentScale = zoomState.scale
    const diff = targetScale - currentScale
    const factor = 0.2 // 动画平滑度因子

    if (Math.abs(diff) < 0.001) {
      zoomState.scale = targetScale
      return
    }

    zoomState.scale += diff * factor

    // 计算新的位置，使缩放以鼠标位置为中心
    const scaleRatio = zoomState.scale / currentScale
    panState.translateX = (panState.translateX - mouseX) * scaleRatio + mouseX
    panState.translateY = (panState.translateY - mouseY) * scaleRatio + mouseY

    panState.prevTranslateX = panState.translateX
    panState.prevTranslateY = panState.translateY

    zoomAnimationFrame = requestAnimationFrame(() =>
      animateZoom(targetScale, mouseX, mouseY)
    )
  }

  function handleWheel(event) {
    event.preventDefault()

    if (zoomAnimationFrame) {
      cancelAnimationFrame(zoomAnimationFrame)
    }

    const { x: mouseX, y: mouseY } = getRelativeMousePos(event)
    const zoomFactor =
      event.deltaY > 0 ? 1 - zoomState.ZOOM_SPEED : 1 + zoomState.ZOOM_SPEED
    const targetScale = clamp(
      zoomState.scale * zoomFactor,
      zoomState.MIN_SCALE,
      zoomState.MAX_SCALE
    )

    // 开始缩放动画
    animateZoom(targetScale, mouseX, mouseY)
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
    panState.velocity = { x: 0, y: 0 }
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

  return {
    panState,
    zoomState,
    transformStyle,
    startDrag,
    handleWheel,
    reset,
  }
}
