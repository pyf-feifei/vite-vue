import { defineStore } from 'pinia'
import defaultSettings from '@/settings'
const useSettingsStore = defineStore('setting', {
  state: () => {
    return {
      showSettings: defaultSettings.showSettings,
    }
  },
  getters: {},
  actions: {},
})
export default useSettingsStore
