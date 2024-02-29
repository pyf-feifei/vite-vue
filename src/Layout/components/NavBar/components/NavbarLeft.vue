<template>
  <div class="flex">
    <hamburger :is-active="appStore.sidebar.opened" @toggle-click="toggleSideBar" />
    <breadcrumb />
  </div>
</template>   

<script setup>
import appStore from '@/store/modules/app'
function toggleSideBar() {
  appStore.toggleSidebar()
}
</script>
