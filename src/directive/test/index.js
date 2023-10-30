/**
 * 按钮权限
 */
export const testDirective = {
  mounted(el, binding) {
    console.log('binding', binding)
    // 「其他角色」按钮权限校验
    const { value } = binding
    if (value) {
      if (value == true) {
        return
      } else {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('need')
    }
  },
}
