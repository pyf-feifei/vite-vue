<template>
  <section class="app-main" :class="{
    backgroundColorTransparent: settingsStore.backgroundColorTransparent,
  }">
    <router-view :key="`${currentRoute.path}`">
      <template #default="{ Component, route }">
        <transition mode="out-in">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </template>
    </router-view>
  </section>
</template>

<script setup>
import tagsViewStore from '@/store/modules/tagsView'
import settingsStore from '@/store/modules/settings'

const currentRoute = useRoute();
const cachedViews = computed(() => tagsViewStore.cachedViews) // 缓存页面集合
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  width: 100%;
  min-height: calc(100vh - $navbar-height);
  overflow: hidden;
  background-color: var(--el-bg-color-page);
}

.fixed-header+.app-main {
  min-height: 100vh;
  padding-top: $navbar-height;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - $navbar-height - $tags-view-height);
  }

  .fixed-header+.app-main {
    min-height: 100vh;
    padding-top: $navbar-height + $tags-view-height;
  }
}

.layout-mix {
  .app-main {
    height: calc(100vh - $navbar-height);
    min-height: calc(100vh - $navbar-height);
    padding-top: 0;
    overflow-y: auto;
  }

  .fixed-header+.app-main {
    min-height: calc(100vh - $navbar-height);
    padding-top: 0;
  }

  .hasTagsView {
    .app-main {
      height: calc(100vh - $navbar-height - $tags-view-height);
      min-height: calc(100vh - $navbar-height - $tags-view-height);
    }

    .fixed-header+.app-main {
      min-height: calc(100vh - $navbar-height);
      padding-top: $tags-view-height;
    }
  }
}

.layout-top {
  .fixed-header+.app-main {
    padding-top: 0;
  }

  .hasTagsView {
    .fixed-header+.app-main {
      padding-top: $tags-view-height;
    }
  }
}
</style>
