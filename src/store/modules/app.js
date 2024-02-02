import { defineStore } from 'pinia'
const useAppStore = defineStore('app', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型
      count: 10,
    }
  },
  getters: {
    counts: (state) => {
      return state.count * 2
    },
  },
  actions: {
    setCount() {
      this.count = 10
    },
  },
})
export default useAppStore()
