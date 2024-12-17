//拖拽改变元素大小
import { useResize } from './hoooks/useResize'
export const resizeDirective = {
  mounted(el, binding) {
    const resizeDirectiveOption = binding.value || {}
    console.log(
      'resizeDirectiveOption',
      resizeDirectiveOption,
      el.clientWidth,
      el.clientHeight
    )

    const { onMountedFun, onUnmountedFun } = useResize(el, {
      minWidth: el.clientWidth,
      minHeight: el.clientHeight,
      headerSize: 0,
      edgeSize: 10,
      scale: 1,
      ...resizeDirectiveOption,
    })
    onMountedFun()
    el.__vueResizeDirectiveOption__ = {
      onUnmountedFun: onUnmountedFun,
    }
  },
  unmounted(el) {
    console.log('关闭')
    el.__vueResizeDirectiveOption__?.onUnmountedFun &&
      el.__vueResizeDirectiveOption__?.onUnmountedFun()
    delete el.__vueResizeDirectiveOption__
  },
}
