import { defineStore } from 'pinia'
import defaultSettings from '@/settings'
import { useStorage } from '@vueuse/core'
const useSettingsStore = defineStore('setting', {
  state: () => {
    return {
      showSettings: useStorage(
        'showSettings',
        defaultSettings.showSettings,
        () => {
          localStorage.setItem('showSettings', defaultSettings.showSettings)
          return localStorage
        }
      ),
      title: useStorage('title', defaultSettings.title, () => {
        localStorage.setItem('title', defaultSettings.title)
        return localStorage
      }),
      layout: useStorage('layout', defaultSettings.layout, () => {
        localStorage.setItem('layout', defaultSettings.layout)
        return localStorage
      }),
      theme: useStorage('theme', defaultSettings.theme, () => {
        localStorage.setItem('theme', defaultSettings.theme)
        return localStorage
      }),
      sidebarLogo: useStorage(
        'sidebarLogo',
        defaultSettings.sidebarLogo,
        () => {
          localStorage.setItem('sidebarLogo', defaultSettings.sidebarLogo)
          return localStorage
        }
      ),
      fixedHeader: useStorage(
        'fixedHeader',
        defaultSettings.fixedHeader,
        () => {
          localStorage.setItem('fixedHeader', defaultSettings.fixedHeader)
          return localStorage
        }
      ),
      tagsView: useStorage('tagsView', defaultSettings.tagsView, () => {
        localStorage.setItem('tagsView', defaultSettings.tagsView)
        return localStorage
      }),
    }
  },
  getters: {},
  actions: {},
})
export default useSettingsStore()
