import { defineStore } from 'pinia'
import defaultSettings from '@/settings'
import { useStorage } from '@vueuse/core'
const useSettingsStore = defineStore('setting', {
  state: () => {
    return {
      showSettings: useStorage('showSettings', defaultSettings.showSettings),
      layout: useStorage('layout', defaultSettings.layout),
      theme: useStorage('theme', defaultSettings.theme),
    }
  },
  getters: {},
  actions: {},
})
export default useSettingsStore()
