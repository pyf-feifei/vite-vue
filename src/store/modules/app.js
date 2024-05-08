import { defineStore } from 'pinia'
import defaultSettings from '@/settings'
const sidebarStatus = useStorage('sidebarStatus', 'closed')
const useAppStore = defineStore('app', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型
      count: 10,
      device: useStorage('device', 'desktop'),
      size: useStorage(
        'size',
        defaultSettings.size,
        (() => {
          localStorage.setItem('size', defaultSettings.size)
          return localStorage
        })()
      ),

      sidebarStatus: sidebarStatus,

      sidebar: reactive({
        opened: sidebarStatus !== 'closed',
        withoutAnimation: false,
      }),
      activeTopMenuPath: useStorage('activeTopMenuPath', ''),
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
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
      if (this.sidebar.opened) {
        this.sidebarStatus = 'opened'
      } else {
        this.sidebarStatus = 'closed'
      }
    },
    closeSideBar() {
      this.sidebar.opened = false
      this.sidebarStatus = 'closed'
    },
    openSideBar() {
      this.sidebar.opened = true
      this.sidebarStatus = 'opened'
    },
    toggleDevice(val) {
      this.device = val
    },
    changeSize(val) {
      this.size = val
    },
    /**
     * 混合模式顶部切换
     */
    activeTopMenu(val) {
      this.activeTopMenuPath = val
    },
  },
})
export default useAppStore()
