export function useResize(dragRef, option, emit) {
  let dragRefIn = null
  if (dragRef instanceof HTMLElement || dragRef.nodeType === 1) {
    dragRefIn = ref(dragRef)
  } else {
    dragRefIn = dragRef
  }
  const { minWidth, minHeight, headerSize, edgeSize, scale, errorRange } = {
    minWidth: dragRefIn.value?.clientWidth || 0,
    minHeight: dragRefIn.value?.clientHeight || 0,
    headerSize: 0,
    edgeSize: 10, //鼠标显示不同样式的离边框的范围
    errorRange: 2, //边框外误差设置在元素外的像素距离
    scale: 1,
    ...option,
  }

  const bodyStyle = ref({ minWidth, minHeight })

  const isResizing = ref(false)
  const initialPosition = ref({ clientX: 0, clientY: 0 })
  const initialSize = ref({ clientWidth: 0, clientHeight: 0, offsetLeft: 0, offsetTop: 0 })

  const cursorStyle = ref('default') //鼠标样式

  const updateCursorStyle = (e) => {
    const { offsetLeft, offsetTop, clientWidth, clientHeight } = dragRefIn.value
    const { clientX, clientY } = e
    if (
      clientX >= offsetLeft &&
      clientX <= offsetLeft + clientWidth &&
      clientY >= offsetTop &&
      clientY <= offsetTop + headerSize
    ) {
      cursorStyle.value = 'default'
      return
    }
    if (clientX > offsetLeft + clientWidth - edgeSize && clientY > offsetTop + clientHeight - edgeSize) {
      cursorStyle.value = 'se-resize' // 右下角
    } else if (clientX < offsetLeft + edgeSize && clientY > offsetTop + clientHeight - edgeSize) {
      cursorStyle.value = 'sw-resize' // 左下角
    } else if (clientX > offsetLeft + clientWidth - edgeSize && clientY < offsetTop + edgeSize) {
      cursorStyle.value = 'ne-resize' // 右上角
    } else if (clientX < offsetLeft + edgeSize && clientY < offsetTop + edgeSize) {
      cursorStyle.value = 'nw-resize' // 左上角
    } else if (clientX > offsetLeft + clientWidth - edgeSize) {
      cursorStyle.value = 'w-resize' // 右拖动
    } else if (offsetLeft + edgeSize > clientX) {
      cursorStyle.value = 'w-resize' // 左拖动
    } else if (clientY > offsetTop + clientHeight - edgeSize) {
      cursorStyle.value = 's-resize' // 下拖动
    } else if (clientY < offsetTop + edgeSize) {
      cursorStyle.value = 's-resize' // 上拖动
    } else {
      cursorStyle.value = 'default' // 默认光标样式
    }
  }

  const onMousedown = (e) => {
    if (cursorStyle.value === 'default') {
      return
    }
    const { offsetLeft, offsetTop, clientWidth, clientHeight } = dragRefIn.value
    const { clientX, clientY } = e
    isResizing.value = true
    initialPosition.value = { clientX, clientY }
    initialSize.value = {
      offsetLeft,
      offsetTop,
      clientWidth,
      clientHeight,
    }
  }

  const onMousemove = (e) => {
    if (isResizing.value && cursorStyle.value !== 'default') {
      e.preventDefault() // 移动时禁用默认事件
      const { offsetLeft, offsetTop, clientWidth, clientHeight } = initialSize.value
      let newWidth = clientWidth
      let newHeight = clientHeight
      let newLeft = offsetLeft
      let newTop = offsetTop
      const { clientX: x, clientY: y } = initialPosition.value
      const { clientX, clientY } = e

      // 左侧鼠标拖拽位置
      if (x > offsetLeft - errorRange && x < offsetLeft + edgeSize) {
        // 往左拖拽
        if (x > clientX) {
          newWidth = clientWidth + (x - clientX) * scale
        }
        // 往右拖拽
        if (x < clientX) {
          newWidth = Math.max(clientWidth - (clientX - x) * scale, minWidth)
        }
        if (newWidth === minWidth) {
          newLeft = offsetLeft + clientWidth - minWidth
        } else {
          newLeft = offsetLeft + (clientX - x) * scale
        }
      }

      // 右侧鼠标拖拽位置
      if (x > offsetLeft + clientWidth - edgeSize && x < offsetLeft + clientWidth + errorRange) {
        // 往左拖拽
        if (x > clientX) {
          newWidth = Math.max(clientWidth - (x - clientX) * scale, minWidth)
        }
        // 往右拖拽
        if (x < clientX) {
          newWidth = clientWidth + (clientX - x) * scale
        }
      }

      // 顶部鼠标拖拽位置
      if (y > offsetTop - errorRange && y < offsetTop + edgeSize) {
        // 往上拖拽
        if (y > clientY) {
          newHeight = clientHeight + (y - clientY) * scale
        }
        // 往下拖拽
        if (y < clientY) {
          newHeight = Math.max(clientHeight - (clientY - y) * scale, minHeight)
        }
        if (newHeight === minHeight) {
          newTop = offsetTop + clientHeight - minHeight
        } else {
          newTop = offsetTop + (clientY - y) * scale
        }
      }

      // 底部鼠标拖拽位置
      if (y > offsetTop + clientHeight - edgeSize && y < offsetTop + clientHeight + errorRange) {
        // 往上拖拽
        if (y > clientY) {
          newHeight = Math.max(clientHeight - (y - clientY) * scale, minHeight)
        }
        // 往下拖拽
        if (y < clientY) {
          newHeight = clientHeight + (clientY - y) * scale
        }
      }

      if (dragRefIn.value) {
        bodyStyle.value = { width: `${newWidth}px`, height: `${newHeight}px`, left: `${newLeft}px`, top: `${newTop}px` }
        // 或者设置 dragRefIn.value.body 的样式
        dragRefIn.value.style.width = `${newWidth}px`
        dragRefIn.value.style.height = `${newHeight}px`
        dragRefIn.value.style.left = `${newLeft}px`
        dragRefIn.value.style.top = `${newTop}px`
        emit && emit('resize', { width: newWidth, height: newHeight, left: newLeft, top: newTop })
      }
    } else {
      updateCursorStyle(e)
    }
    dragRefIn.value.style.cursor = cursorStyle.value //设置鼠标样式
  }

  const onMouseup = () => {
    isResizing.value = false
  }
  const onMountedFun = () => {
    console.log('document', document)
    dragRefIn.value && onMousedown && dragRefIn.value.removeEventListener('mousedown', onMousedown)
    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
    dragRefIn.value.addEventListener('mousedown', onMousedown)
  }
  onMounted(onMountedFun)
  const onUnmountedFun = () => {
    console.log('关闭1')
    document.removeEventListener('mousemove', onMousemove)
    document.removeEventListener('mouseup', onMouseup)
    dragRefIn.value && onMousedown && dragRefIn.value.removeEventListener('mousedown', onMousedown)
  }
  onUnmounted(onUnmountedFun)

  return {
    cursorStyle,
    bodyStyle,
    onMountedFun,
    onUnmountedFun,
  }
}
