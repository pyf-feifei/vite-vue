import { defineStore } from 'pinia'
import defaultSettings from '@/settings'
import { useStorage } from '@vueuse/core'
const useSettingsStore = defineStore('setting', {
  state: () => {
    return {
      showSettings: useStorage('showSettings', defaultSettings.showSettings),
      title: useStorage('title', defaultSettings.title),
      layout: useStorage('layout', defaultSettings.layout),
      theme: useStorage('theme', defaultSettings.theme),
      sidebarLogo: useStorage('sidebarLogo', defaultSettings.sidebarLogo),
      fixedHeader: useStorage('fixedHeader', defaultSettings.fixedHeader),
      tagsView: useStorage('tagsView', defaultSettings.tagsView),
    }
  },
  getters: {},
  actions: {},
})
export default useSettingsStore()
