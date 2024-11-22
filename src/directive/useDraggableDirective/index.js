//自定义拖动指令依附useDraggable，设置某些元素不可以拖动
import { useDraggable } from '@vueuse/core'
import { throttle } from 'lodash'
export const useDraggableDirective = {
  mounted(el, binding) {
    const useDraggableOption = binding.value || {}
    // 获取视口边界
    let viewportWidth = window.innerWidth
    let viewportHeight = window.innerHeight
    const elementWidth = el.offsetWidth
    const elementHeight = el.offsetHeight
    //如果有右和下位置改变x,y
    if (useDraggableOption?.position) {
      //初始位置非useDraggable有的属性
      useDraggableOption.position = {
        ...(useDraggableOption?.position || {
          right: 0,
          bottom: 0,
        }),
      }
      //console.log('进入', viewportWidth - elementWidth, viewportHeight - elementHeight)
      useDraggableOption.initialValue = {}
      useDraggableOption.initialValue.x =
        viewportWidth - elementWidth - useDraggableOption?.position.right
      useDraggableOption.initialValue.y =
        viewportHeight - elementHeight - useDraggableOption?.position.bottom
    }
    const useDraggableOptionIn = {
      initialValue: { x: 0, y: 0 },
      unMoveClass: [], //不能移动的类useDraggable没有的属性
      ...useDraggableOption,
    }
    const { x, y, style } = useDraggable(el, useDraggableOptionIn)
    const oldXY = reactive({
      //用来设置哪些元素不可以移动和unMoveClass搭配
      x: undefined,
      y: undefined,
    })
    const setOldXYData = (setUndefined = false) => {
      if (!setUndefined) {
        oldXY.x = oldXY.x || x.value
        oldXY.y = oldXY.y || y.value
      } else {
        x.value = oldXY.x
        y.value = oldXY.y
        oldXY.x = undefined
        oldXY.y = undefined
      }
    }
    ////完成输入框不能拖拽
    const focusHandler = function (event) {
      if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        setOldXYData()
      }
    }
    const blurHandler = function (event) {
      if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        setOldXYData(true)
      }
    }
    el.addEventListener('focus', focusHandler, true)
    el.addEventListener('blur', blurHandler, true)
    // 监听鼠标左键按下事件
    // 添加鼠标移动事件监听器
    const mousemoveEvent = (event) => {}
    // 添加鼠标离开文档事件监听器
    const mouseleaveEvent = () => {
      el.removeEventListener('mousemove', mousemoveEvent)
      setOldXYData()
    }
    /**
     *
     * @param {*} event
     */
    const onMouseUpEvent = (event) => {
      el.removeEventListener('mousemove', mousemoveEvent)
      setOldXYData()
    }
    /**
     * 鼠标按下事件
     * @param {*} event
     */
    const mousedownEvent = (event) => {
      let classList = Array.from(event.target.classList)
      // 检查是否是左键按下
      if (event.button === 0) {
        setOldXYData()
        if (
          classList.some((item) =>
            useDraggableOptionIn.unMoveClass.includes(item)
          )
        ) {
          // 添加鼠标移动事件监听器
          el.addEventListener('mousemove', mousemoveEvent)

          // 添加鼠标离开文档事件监听器
          el.addEventListener('mouseleave', mouseleaveEvent)
          // 添加 mouseup 事件监听器
          el.addEventListener('mouseup', onMouseUpEvent)
        } else {
          el.removeEventListener('mousemove', mousemoveEvent)
          // 添加鼠标离开文档事件监听器
          el.removeEventListener('mouseleave', mouseleaveEvent)
          // 添加 mouseup 事件监听器
          el.removeEventListener('mouseup', onMouseUpEvent)
          setOldXYData(true)
        }
      }
    }
    el.addEventListener('mousedown', mousedownEvent) // 第三个参数为 true，表示在捕获阶段执行

    // 将计算的样式应用到元素上
    el.style.position = 'fixed'
    el.style.left = `${x.value}px`
    el.style.top = `${y.value}px`
    el.style.zIndex = 1200

    // 监听 x 和 y 的变化，并更新元素的样式
    x.value = useDraggableOption.initialValue?.x || 0
    y.value = useDraggableOption.initialValue?.y || 0

    /**
     * x不超出视口
     * @param {*} newX
     */
    const changeX = (newX) => {
      if (oldXY.x !== undefined) {
        el.style.left = `${oldXY.x}px`
        return
      }
      // 限制 x 在视口边界内
      if (newX < 0) {
        newX = 0
      } else if (newX + elementWidth > viewportWidth) {
        newX = viewportWidth - elementWidth
      }
      el.style.left = `${newX}px`
    }
    /**
     * y不超出视口
     * @param {*} newY
     */
    const changeY = (newY) => {
      if (oldXY.y !== undefined) {
        el.style.top = `${oldXY.y}px`
        return
      }
      // 限制 y 在视口边界内
      if (newY < 0) {
        newY = 0
      } else if (newY + elementHeight > viewportHeight) {
        newY = viewportHeight - elementHeight
      }
      el.style.top = `${newY}px`
    }
    // 监听 x 和 y 的变化，并更新元素的样式
    watch(x, (newX) => {
      //改变y的时候需要改一下页面宽度和页面高度，因为有可能x,y会是其他的触发，而不单是这个
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
      // 限制 x 在视口边界内
      changeX(newX)
    })
    // 监听 x 和 y 的变化，并更新元素的样式
    watch(y, (newY) => {
      //改变y的时候需要改一下页面宽度和页面高度，因为有可能x,y会是其他的触发，而不单是这个
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
      // 限制 y 在视口边界内
      changeY(newY)
    })

    /**
     * 监听视口变化，节流
     */
    const resizeHandler = throttle(() => {
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
      changeX(x.value)
      changeY(y.value)
    }, 10)
    window.addEventListener('resize', resizeHandler)
    // 存储事件处理函数以便在 unmounted 钩子中移除
    el.__vueUseDraggableDirective__ = {
      focusHandler,
      blurHandler,
      mousedownEvent,
      onMouseUpEvent,
      mouseleaveEvent,
      mousemoveEvent,
      resizeHandler,
    }
  },
  unmounted(el) {
    const {
      focusHandler,
      blurHandler,
      mousedownEvent,
      onMouseUpEvent,
      mouseleaveEvent,
      mousemoveEvent,
      resizeHandler,
    } = el.__vueUseDraggableDirective__
    focusHandler && el.removeEventListener('focus', focusHandler, true)
    blurHandler && el.removeEventListener('blur', blurHandler, true)
    mousedownEvent && el.removeEventListener('mousedown', mousedownEvent)
    onMouseUpEvent && el.removeEventListener('mouseup', onMouseUpEvent)
    mouseleaveEvent && el.removeEventListener('mouseleave', mouseleaveEvent)
    mousemoveEvent && el.removeEventListener('mousemove', mousemoveEvent)
    resizeHandler && window.removeEventListener('resize', resizeHandler)
    delete el.__vueUseDraggableDirective__
  },
}
