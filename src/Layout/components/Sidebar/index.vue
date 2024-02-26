<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <!--混合布局-->
    <!--左侧布局 || 顶部布局 -->
    <template v-if="true">
      <SidebarLogo v-if="sidebarLogo" />
      <el-scrollbar>
        <SidebarMenu base-path="" />
      </el-scrollbar>
      <NavbarRight v-if="layout === 'top'" />
    </template>
  </div>
</template>

<script setup>
import settingsStore from '@/store/modules/settings'

const sidebarLogo = computed(() => settingsStore.sidebarLogo)
const layout = computed(() => settingsStore.layout)
</script>

<style lang="scss" scoped>
.has-logo {
  .el-scrollbar {
    height: calc(100vh - $navbar-height);
  }
}
</style>
