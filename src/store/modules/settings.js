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
      themeColors: ref([
        {
          '--el-color-primary': '#4C5FE8',
          '--main-color': '#333333',
          '--main-color-rgbnorgb': '51, 51, 51',
          // '--menu-background': 'rgba(76, 95, 232, 0.4)',
          '--el-menu-hover-bg-color': '#304156',
          '--menu-text': '#bfcbd9',
          '--menu-active-text': '#4c5fe8',
          '--sub-menu-background': '#304156',
          '--sub-menu-active-text': '#4c5fe8',
          '--sub-menu-hover': '#4c5fe8',
        },
        {
          '--el-color-primary': '#304156',
          '--main-color': '#333333',
          '--main-color-rgbnorgb': '51, 51, 51',
          // '--menu-background': 'rgba(48, 65, 86, 0.4)',
          '--el-menu-hover-bg-color': '#304156',
          '--menu-text': '#bfcbd9',
          '--menu-active-text': '#4c5fe8',
          '--sub-menu-background': '#304156',
          '--sub-menu-active-text': '#4c5fe8',
          '--sub-menu-hover': '#4c5fe8',
        },
        {
          '--el-color-primary': '#11a983',
          '--main-color': '#333333',
          '--main-color-rgbnorgb': '51, 51, 51',
          // '--menu-background': 'rgba(17, 169, 131, 0.4)',
          '--el-menu-hover-bg-color': '#304156',
          '--menu-text': '#bfcbd9',
          '--menu-active-text': '#4c5fe8',
          '--sub-menu-background': '#304156',
          '--sub-menu-active-text': '#4c5fe8',
          '--sub-menu-hover': '#4c5fe8',
        },
        {
          '--el-color-primary': '#13c2c2',
          '--main-color': '#333333',
          '--main-color-rgbnorgb': '51, 51, 51',
          // '--menu-background': 'rgba(19, 194, 194, 0.4)',
          '--el-menu-hover-bg-color': '#304156',
          '--menu-text': '#bfcbd9',
          '--menu-active-text': '#4c5fe8',
          '--sub-menu-background': '#304156',
          '--sub-menu-active-text': '#4c5fe8',
          '--sub-menu-hover': '#4c5fe8',
        },
        {
          '--el-color-primary': '#6959CD',
          '--main-color': '#333333',
          '--main-color-rgbnorgb': '51, 51, 51',
          // '--menu-background': 'rgba(105, 89, 205, 0.4)',
          '--el-menu-hover-bg-color': '#304156',
          '--menu-text': '#bfcbd9',
          '--menu-active-text': '#4c5fe8',
          '--sub-menu-background': '#304156',
          '--sub-menu-active-text': '#4c5fe8',
          '--sub-menu-hover': '#4c5fe8',
        },
        {
          '--el-color-primary': '#f5222d',
          '--main-color': '#333333',
          '--main-color-rgbnorgb': '51, 51, 51',
          // '--menu-background': 'rgba(245, 34, 45, 0.4)',
          '--el-menu-hover-bg-color': '#304156',
          '--menu-text': '#bfcbd9',
          '--menu-active-text': '#4c5fe8',
          '--sub-menu-background': '#304156',
          '--sub-menu-active-text': '#4c5fe8',
          '--sub-menu-hover': '#4c5fe8',
          //主题修改后的其他变异颜色修改
          '--el-color-primary-light-3': ' #E03F34',
          '--el-color-primary-light-5': '#E46B62',
          '--el-color-primary-light-7': '#E7978F',
          '--el-color-primary-light-8': ' #E9A29C',
          '--el-color-primary-light-9': '#EBB8B5',
          '--el-color-primary-dark-2': '#9A0210',
        },
      ]),
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
    changeThemeColor(colorObj) {
      Object.entries(colorObj).forEach(([key, val]) => {
        document.documentElement.style.setProperty(key, val)
        if (key === '--el-color-primary') {
          this.changeSetting({ key: 'themeColor', value: val })
        }
      })
    },
  },
})
const settingsStore = useSettingsStore()
const findColorObj = settingsStore.themeColors.find(
  (item) => item['--el-color-primary'] === settingsStore.themeColor
)
settingsStore.changeThemeColor(findColorObj || settingsStore.themeColors[0]) //初始化时就重置主题
export default settingsStore
