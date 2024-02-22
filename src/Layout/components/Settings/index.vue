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
  </div>
</template>
<script setup>
import IconEpSunny from '~icons/ep/sunny'
import IconEpMoon from '~icons/ep/moon'
import settingsStore from '@/store/modules/settings'

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
}
</style>
