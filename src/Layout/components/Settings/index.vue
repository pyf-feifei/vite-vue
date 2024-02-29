<template>
  <div class="settings-container">
    <h3 class="text-base font-bold">项目配置</h3>
    <el-divider>主题</el-divider>
    <div class="flex justify-center" @click.stop>
      <el-switch v-model="isDark" @change="toggleDark" inline-prompt :active-icon="IconEpMoon"
        :inactive-icon="IconEpSunny" active-color="var(--el-fill-color-dark)" inactive-color="var(--el-color-primary)" />
    </div>

    <el-divider>主题颜色</el-divider>
    <ul class="w-full space-x-2 flex-x-center py-2 pa-0">
      <li v-for="(colorObj, index) in settingsStore.themeColors" :key="index"
        class="w-[30px] h-[30px] cursor-pointer flex-center color-white"
        :style="{ background: colorObj['--el-color-primary'] }" @click="settingsStore.changeThemeColor(colorObj)">
        <i-ep-check v-show="colorObj['--el-color-primary'] == settingsStore.themeColor" />
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