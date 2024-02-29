<template>
  <div class="logo-container" :class="{
    backgroundColorTransparent: settingsStore.backgroundColorTransparent,
  }">
    <transition enter-active-class="animate__animated animate__fadeInLeft">
      <router-link class="wh-full flex-center" to="/">
        <img v-if="settingsStore.sidebarLogo" :src="logo" class="logo-image" />
        <span class="logo-title"> {{ settingsStore.title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import settingsStore from '@/store/modules/settings'

defineProps({
})

const logo = ref(new URL(`../../../../assets/vue.svg`, import.meta.url).href)
</script>

<style lang="scss" scoped>
.logo-container {
  width: 100%;
  height: $navbar-height;
  background-color: $sidebar-logo-background;

  .logo-image {
    width: 20px;
    height: 20px;
  }

  .logo-title {
    flex-shrink: 0;
    /* 防止容器在空间不足时缩小 */
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    color: white;
  }
}

.layout-top,
.layout-mix {
  .logo-container {
    width: $sidebar-width;
  }

  &.hideSidebar {
    .logo-container {
      width: $sidebar-width-collapsed;
    }
  }
}
</style>
