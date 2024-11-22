//自定义滚动用来获取滚动到上和滚到底的事件，还有拿到用于记录是否在底部，用于记录是否达到滚动
import { throttle, debounce } from 'lodash'
export const vScrollDirective = {
  mounted(el, binding) {
    console.log('binding', el, binding)
    const options = binding.value
    //  options.someOpt.isAtBottom  false // 用于记录是否在底部
    //  options.someOpt.isReachScroll  false // 用于记录是否达到滚动
    let isAtTop = false // 用于记录是否在顶部
    const threshold = options?.threshold || 20 // 默认误差为10
    const handleScroll = debounce(() => {
      const { scrollTop, scrollHeight, clientHeight } = el
      // 判断是否滚动到底部
      options.someOpt.isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold
      // 判断是否滚动到顶部
      isAtTop = scrollTop === 0
      options.someOpt.isReachScroll = scrollHeight + threshold >= clientHeight
      // 调用回调函数
      if (options.someOpt.isAtBottom && options?.onBottom) {
        options.onBottom(options.someOpt.isAtBottom)
      }
      if (isAtTop && options?.onTop) {
        options.onTop(isAtTop)
      }
    }, 300) // 节流时间为100毫秒

    el.addEventListener('scroll', handleScroll)

    // 在组件卸载时移除事件监听器
    el._scrollListener = handleScroll
  },
  unmounted(el) {
    if (el._scrollListener) {
      el.removeEventListener('scroll', el._scrollListener)
    }
  },
}
