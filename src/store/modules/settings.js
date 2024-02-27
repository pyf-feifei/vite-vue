import { defineStore } from 'pinia'
import defaultSettings from '@/settings'
import { useStorage } from '@vueuse/core'
const useSettingsStore = defineStore('setting', {
  state: () => {
    return {
      showSettings: useStorage(
        'showSettings',
        defaultSettings.showSettings,
        (() => {
          localStorage.setItem('showSettings', defaultSettings.showSettings)
          return localStorage
        })()
      ),
      title: useStorage(
        'title',
        defaultSettings.title,
        (() => {
          localStorage.setItem('title', defaultSettings.title)
          return localStorage
        })()
      ),
      layout: useStorage(
        'layout',
        defaultSettings.layout,
        (() => {
          localStorage.setItem('layout', defaultSettings.layout)
          return localStorage
        })()
      ),
      theme: useStorage(
        'theme',
        defaultSettings.theme,
        (() => {
          localStorage.setItem('theme', defaultSettings.theme)
          return localStorage
        })()
      ),
      sidebarLogo: useStorage(
        'sidebarLogo',
        defaultSettings.sidebarLogo,
        (() => {
          localStorage.setItem('sidebarLogo', defaultSettings.sidebarLogo)
          return localStorage
        })()
      ),
      fixedHeader: useStorage(
        'fixedHeader',
        defaultSettings.fixedHeader,
        (() => {
          localStorage.setItem('fixedHeader', defaultSettings.fixedHeader)
          return localStorage
        })()
      ),
      tagsView: useStorage(
        'tagsView',
        defaultSettings.tagsView,
        (() => {
          localStorage.setItem('tagsView', defaultSettings.tagsView)
          return localStorage
        })()
      ),
      backgroundColorTransparent: useStorage(
        'backgroundColorTransparent',
        defaultSettings.backgroundColorTransparent,
        (() => {
          localStorage.setItem(
            'backgroundColorTransparent',
            defaultSettings.backgroundColorTransparent
          )
          return localStorage
        })()
      ),
      themeColor: useStorage(
        'themeColor',
        defaultSettings.themeColor,
        (() => {
          localStorage.setItem('themeColor', defaultSettings.themeColor)
          return localStorage
        })()
      ),
    }
  },
  getters: {
    settingsMap() {
      return {
        fixedHeader: this.fixedHeader,
        tagsView: this.tagsView,
        sidebarLogo: this.sidebarLogo,
        layout: this.layout,
        themeColor: this.themeColor,
        theme: this.theme,
      }
    },
  },
  actions: {
    changeSetting({ key, value }) {
      let setting = this.settingsMap[key]
      if (setting) {
        this[key] = value
        // Special handling for theme changes
        if (key === 'theme') {
          document.documentElement.classList.toggle('dark', value === 'dark')
        }
      }
    },
  },
})
export default useSettingsStore()
