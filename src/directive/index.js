import { testDirective } from './test'
import { clickOutDirective } from './clickOut'
import { hoverSonClassDirective } from './hoverSonClassDirective'
import { hoverDirective } from './hoverDirective'

// 全局注册 directive 方法
export function setupDirective(app) {
  // 使 v-hasPerm 在所有组件中都可用
  app.directive('testDirective', testDirective)
  app.directive('clickOutDirective', clickOutDirective)
  app.directive('hoverSonClassDirective', hoverSonClassDirective)
  app.directive('hoverDirective', hoverDirective)
}
