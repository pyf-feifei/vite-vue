import { testDirective } from './test'
import { clickOutDirective } from './clickOut'
import { hoverSonClassDirective } from './hoverSonClassDirective'
import { hoverDirective } from './hoverDirective'
import { vScrollDirective } from './vScrollDirective'
import { useDraggableDirective } from './useDraggableDirective'
import { resizeDirective } from './resizeDirective'

// 全局注册 directive 方法
export function setupDirective(app) {
  // 使 v-hasPerm 在所有组件中都可用
  app.directive('testDirective', testDirective)
  app.directive('clickOutDirective', clickOutDirective)
  app.directive('hoverSonClassDirective', hoverSonClassDirective)
  app.directive('hoverDirective', hoverDirective)
  app.directive('vScrollDirective', vScrollDirective)
  app.directive('useDraggableDirective', useDraggableDirective)
  app.directive('resizeDirective', resizeDirective)
}
