<template>
  <div class="settings-container">
    <h3 class="text-base font-bold">项目配置</h3>
    <el-divider>主题</el-divider>
    <div class="flex justify-center" @click.stop>
      <el-switch
        v-model="isDark"
        @change="toggleDark"
        inline-prompt
        :active-icon="IconEpMoon"
        :inactive-icon="IconEpSunny"
        active-color="var(--el-fill-color-dark)"
        inactive-color="var(--el-color-primary)"
      />
    </div>

    <el-divider>主题颜色</el-divider>
    <ul class="w-full space-x-2 flex-x-center py-2 pa-0">
      <li
        v-for="(colorObj, index) in themeColors"
        :key="index"
        class="w-[30px] h-[30px] cursor-pointer flex-center color-white"
        :style="{ background: colorObj['--el-color-primary'] }"
        @click="changeThemeColor(colorObj)"
      >
        <i-ep-check
          v-show="colorObj['--el-color-primary'] == currentThemeColor"
        />
      </li>
    </ul>
  </div>
</template>
<script setup>
import IconEpSunny from '~icons/ep/sunny'
import IconEpMoon from '~icons/ep/moon'
import settingsStore from '@/store/modules/settings'
import variables from '@/styles/variables.module.scss'

/**
 * 切换暗黑模式
 */
const isDark = useDark()
isDark.value = settingsStore.theme === 'dark'
const toggleDark = () => {
  console.log('isDark', isDark)
  useToggle(isDark)
}
/**
 * 主题颜色
 */
// const themeColors = ref([
//   '#409EFF',
//   '#304156',
//   '#11a983',
//   '#13c2c2',
//   '#6959CD',
//   '#f5222d',
// ])
const themeColors = ref([
  {
    '--el-color-primary': '#409EFF',
    '--main-color': variables['main-color'],
    '--menu-background': variables['menu-background'],
    '--el-menu-hover-bg-color': variables['menu-background'],
    '--menu-text': variables['menu-text'],
    '--menu-active-text': variables['menu-active-text'],
    '--sub-menu-background': variables['sub-menu-background'],
    '--sub-menu-active-text': variables['sub-menu-active-text'],
    '--sub-menu-hover': variables['sub-menu-hover'],
  },
  {
    '--el-color-primary': '#304156',
    '--main-color': variables['main-color'],
    '--menu-background': variables['menu-background'],
    '--el-menu-hover-bg-color': variables['menu-background'],
    '--menu-text': variables['menu-text'],
    '--menu-active-text': variables['menu-active-text'],
    '--sub-menu-background': variables['sub-menu-background'],
    '--sub-menu-active-text': variables['sub-menu-active-text'],
    '--sub-menu-hover': variables['sub-menu-hover'],
  },
  {
    '--el-color-primary': '#11a983',
    '--main-color': variables['main-color'],
    '--menu-background': variables['menu-background'],
    '--el-menu-hover-bg-color': variables['menu-background'],
    '--menu-text': variables['menu-text'],
    '--menu-active-text': variables['menu-active-text'],
    '--sub-menu-background': variables['sub-menu-background'],
    '--sub-menu-active-text': variables['sub-menu-active-text'],
    '--sub-menu-hover': variables['sub-menu-hover'],
  },
  {
    '--el-color-primary': '#13c2c2',
    '--main-color': variables['main-color'],
    '--menu-background': variables['menu-background'],
    '--el-menu-hover-bg-color': variables['menu-background'],
    '--menu-text': variables['menu-text'],
    '--menu-active-text': variables['menu-active-text'],
    '--sub-menu-background': variables['sub-menu-background'],
    '--sub-menu-active-text': variables['sub-menu-active-text'],
    '--sub-menu-hover': variables['sub-menu-hover'],
  },
  {
    '--el-color-primary': '#6959CD',
    '--main-color': variables['main-color'],
    '--menu-background': variables['menu-background'],
    '--el-menu-hover-bg-color': variables['menu-background'],
    '--menu-text': variables['menu-text'],
    '--menu-active-text': variables['menu-active-text'],
    '--sub-menu-background': variables['sub-menu-background'],
    '--sub-menu-active-text': variables['sub-menu-active-text'],
    '--sub-menu-hover': variables['sub-menu-hover'],
  },
  {
    '--el-color-primary': '#f5222d',
    '--main-color': variables['main-color'],
    '--menu-background': variables['menu-background'],
    '--el-menu-hover-bg-color': variables['menu-background'],
    '--menu-text': variables['menu-text'],
    '--menu-active-text': variables['menu-active-text'],
    '--sub-menu-background': variables['sub-menu-background'],
    '--sub-menu-active-text': variables['sub-menu-active-text'],
    '--sub-menu-hover': variables['sub-menu-hover'],
  },
])
/**
 * 主题颜色--切换主题颜色
 */
function changeThemeColor(colorObj) {
  Object.entries(colorObj).forEach(([key, val]) => {
    document.documentElement.style.setProperty(key, val)
    if (key === '--el-color-primary') {
      settingsStore.changeSetting({ key: 'themeColor', value: val })
    }
  })
}

const currentThemeColor = computed(() => {
  return settingsStore.themeColor
})
</script>
<style lang="scss" scoped>
.settings-container {
  padding: 16px;

  .layout {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
    height: 50px;

    &-item {
      position: relative;
      width: 18%;
      height: 45px;
      overflow: hidden;
      cursor: pointer;
      background: #f0f2f5;
      border-radius: 4px;
    }

    &-item.is-active {
      border: 2px solid var(--el-color-primary);
    }

    &-mix div:nth-child(1) {
      width: 100%;
      height: 30%;
      background: #1b2a47;
      box-shadow: 0 0 1px #888;
    }

    &-mix div:nth-child(2) {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30%;
      height: 70%;
      background: #1b2a47;
      box-shadow: 0 0 1px #888;
    }

    &-top div:nth-child(1) {
      width: 100%;
      height: 30%;
      background: #1b2a47;
      box-shadow: 0 0 1px #888;
    }

    &-left div:nth-child(1) {
      width: 30%;
      height: 100%;
      background: #1b2a47;
    }

    &-left div:nth-child(2) {
      position: absolute;
      top: 0;
      right: 0;
      width: 70%;
      height: 30%;
      background: #fff;
      box-shadow: 0 0 1px #888;
    }
  }
}
</style>
