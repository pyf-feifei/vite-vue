import { testDirective } from './test'

// 全局注册 directive 方法
export function setupDirective(app) {
  // 使 v-hasPerm 在所有组件中都可用
  app.directive('testDirective', testDirective)
}
