<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <!--混合布局-->
    <template v-if="layout == 'mix'">
      <div class="flex w-full">
        <SidebarLogo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
        <SidebarMixTopMenu class="flex-1" />
        <NavbarRight />
      </div>
    </template>

    <!--左侧布局 || 顶部布局 -->
    <template v-if="true">
      <SidebarLogo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
      <el-scrollbar>
        <SidebarMenu :menu-list="constantRoutes" base-path="" />
      </el-scrollbar>
      <NavbarRight v-if="layout === 'top'" />
    </template>
  </div>
</template>

<script setup>
import settingsStore from '@/store/modules/settings'
import appStore from '@/store/modules/app'
import { constantRoutes } from '@/router'

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
