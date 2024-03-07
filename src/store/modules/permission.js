import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'
const usePermissionStore = defineStore('permission', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      routes: reactive([]),
    }
  },
  getters: {},
  actions: {
    /**
     * 设置路由
     * @param {*} newRoutes
     */
    setRoutes(newRoutes) {
      this.routes = constantRoutes.concat(newRoutes)
    },
    /**
     * 生成动态路由
     *
     * @param roles 用户角色集合
     * @returns
     */
    generateRoutes() {
      return new Promise((resolve, reject) => {
        // 接口获取所有路由
        setRoutes([])
        resolve([])
      })
    },
  },
})
export default usePermissionStore()
