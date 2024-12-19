export function useDraggableResizable(parentRef, options = {}) {
  const defaultOptions = {
    minWidth: 50,
    minHeight: 50,
    maxWidth: null,
    maxHeight: null,
    scaleFactor: 0.1,
  }

  // 合并默认配置和用户配置
  const config = { ...defaultOptions, ...options }

  // 状态变量
  let state = {
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  }

  // 拖动状态
  let dragState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    originalX: 0,
    originalY: 0,
  }

  // 获取唯一子元素
  function getChildElement() {
    return parentRef.querySelector(':scope > *')
  }

  // 边界计算
  function getBoundaries() {
    return {
      width: parentRef.clientWidth,
      height: parentRef.clientHeight,
    }
  }

  // 更新元素样式（使用 transform 减少重绘）
  function updateElementStyle() {
    const element = getChildElement()
    if (element) {
      element.style.transform = `translate(${state.x}px, ${state.y}px)`
      element.style.width = `${state.width}px`
      element.style.height = `${state.height}px`
    }
  }

  // 精确缩放算法
  function handleScale(event) {
    const element = getChildElement()
    if (!element) return

    // 获取元素和鼠标信息
    const rect = element.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    // 计算缩放比例
    const scaleDirection = event.deltaY > 0 ? -1 : 1
    const scale = 1 + config.scaleFactor * scaleDirection

    // 计算新尺寸
    const newWidth = state.width * scale
    const newHeight = state.height * scale

    // 边界控制
    const boundaries = getBoundaries()
    state.width = Math.max(
      config.minWidth,
      Math.min(newWidth, config.maxWidth || boundaries.width)
    )
    state.height = Math.max(
      config.minHeight,
      Math.min(newHeight, config.maxHeight || boundaries.height)
    )

    // 精确位置调整
    const widthRatio = mouseX / rect.width
    const heightRatio = mouseY / rect.height

    state.x -= (state.width - newWidth) * widthRatio
    state.y -= (state.height - newHeight) * heightRatio

    // 边界检查
    state.x = Math.max(0, Math.min(state.x, boundaries.width - state.width))
    state.y = Math.max(0, Math.min(state.y, boundaries.height - state.height))

    updateElementStyle()
  }

  // 防抖拖动处理
  function handleDragStart(event) {
    const element = getChildElement()
    if (!element) return

    // 阻止默认行为
    event.preventDefault()
    event.stopPropagation()

    const rect = element.getBoundingClientRect()
    dragState = {
      isDragging: true,
      startX: event.clientX,
      startY: event.clientY,
      originalX: state.x,
      originalY: state.y,
    }

    // 使用 document 监听移动和结束事件
    document.addEventListener('mousemove', handleDragMove, { passive: false })
    document.addEventListener('mouseup', handleDragEnd, { passive: false })
  }

  // 拖动移动
  function handleDragMove(event) {
    if (!dragState.isDragging) return

    // 阻止默认行为
    event.preventDefault()
    event.stopPropagation()

    // 计算偏移量
    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY

    // 计算新位置
    const boundaries = getBoundaries()
    state.x = Math.max(
      0,
      Math.min(dragState.originalX + deltaX, boundaries.width - state.width)
    )
    state.y = Math.max(
      0,
      Math.min(dragState.originalY + deltaY, boundaries.height - state.height)
    )

    updateElementStyle()
  }

  // 结束拖动
  function handleDragEnd(event) {
    if (!dragState.isDragging) return

    // 阻止默认行为
    event.preventDefault()
    event.stopPropagation()

    dragState.isDragging = false

    // 移除事件监听
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
  }

  // 初始化
  function init() {
    const element = getChildElement()
    if (element) {
      // 设置必要的样式
      element.style.position = 'absolute'
      element.style.cursor = 'move'
      element.style.userSelect = 'none'
      element.style.willChange = 'transform'

      // 添加事件监听
      element.addEventListener('mousedown', handleDragStart, { passive: false })
      element.addEventListener('wheel', handleScale, { passive: false })
    }
  }

  // 销毁
  function destroy() {
    const element = getChildElement()
    if (element) {
      element.removeEventListener('mousedown', handleDragStart)
      element.removeEventListener('wheel', handleScale)
    }

    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
  }

  return {
    init,
    destroy,
  }
}
