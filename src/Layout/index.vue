<template>
  <div class="wh-full" :class="classObj">
    <!-- 遮罩层 -->
    <div
      v-if="classObj.mobile && classObj.openSidebar"
      class="fixed z-1000 bg-black bg-opacity-20"
      @click="handleOutsideClick"
    ></div>
    <Sidebar
      class="sidebar-container"
      :class="{
        backgroundColorTransparent: settingsStore.backgroundColorTransparent,
      }"
    />

    <!-- 混合布局 -->
    <div v-if="layout === 'mix'" class="mix-container">
      <div class="mix-container__left">
        <SidebarMenu
          :menu-list="mixLeftMenus"
          :base-path="activeTopMenuPath"
        ></SidebarMenu>
        <div class="sidebar-toggle">
          <hamburger
            :is-active="appStore.sidebar.opened"
            @toggle-click="toggleSidebar"
          />
        </div>
      </div>

      <div :class="{ hasTagsView: showTagsView }" class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <TagsView v-if="showTagsView" />
        </div>
        <AppMain />
        <RightPanel v-if="defaultSettings.showSettings">
          <Settings />
        </RightPanel>
      </div>
    </div>

    <!-- 左侧布局|| 顶部布局 -->
    <div
      v-else
      :class="{
        hasTagsView: showTagsView,
        backgroundColorTransparent: settingsStore.backgroundColorTransparent,
      }"
      class="main-container"
    >
      <div :class="{ 'fixed-header': fixedHeader }">
        <NavBar v-if="layout === 'left'" />
        <TagsView v-if="showTagsView" />
      </div>
      <AppMain />
      <RightPanel v-if="defaultSettings.showSettings">
        <Settings />
      </RightPanel>
    </div>
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import appStore from '@/store/modules/app'
import settingsStore from '@/store/modules/settings'
import defaultSettings from '@/settings'
import permissionStore from '@/store/modules/permission'

const fixedHeader = computed(() => settingsStore.fixedHeader)
const showTagsView = computed(() => settingsStore.tagsView)
const layout = computed(() => settingsStore.layout)
const activeTopMenuPath = computed(() => appStore.activeTopMenuPath) // 顶部菜单激活path
const mixLeftMenus = computed(() => permissionStore.mixLeftMenus) // 混合布局左侧菜单

watch(
  //设置责左边栏
  () => activeTopMenuPath.value,
  (newVal) => {
    permissionStore.setMixLeftMenus(newVal)
  },
  {
    deep: true,
    immediate: true,
  }
)

const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  mobile: appStore.device === 'mobile',
  'layout-left': layout.value === 'left',
  'layout-top': layout.value === 'top',
  'layout-mix': layout.value === 'mix',
  backgroundColorTransparent: settingsStore.backgroundColorTransparent,
}))
const width = useWindowSize().width
const WIDTH = 992 // 响应式布局容器固定宽度  大屏（>=1200px） 中屏（>=992px） 小屏（>=768px）

watchEffect(() => {
  if (width.value < WIDTH) {
    appStore.toggleDevice('mobile')
    appStore.closeSideBar()
  } else {
    appStore.toggleDevice('desktop')

    if (width.value >= 1200) {
      appStore.openSideBar()
    } else {
      appStore.closeSideBar()
    }
  }
})

function handleOutsideClick() {
  appStore.closeSideBar()
}
function toggleSidebar() {
  appStore.toggleSidebar()
}
</script>

<style lang="scss" scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: $sidebar-width;
  height: 100%;
  overflow: hidden;
  background-color: $menu-background;
  transition: width 0.28s;

  :deep(.el-menu) {
    border: none;
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - $sidebar-width);
  transition: width 0.28s;
}

.main-container {
  position: relative;
  min-height: 100%;
  margin-left: $sidebar-width;
  transition: margin-left 0.28s;
}

.layout-top {
  .fixed-header {
    top: $navbar-height;
    width: 100%;
  }

  .sidebar-container {
    z-index: 999;
    display: flex;
    width: 100% !important;
    height: $navbar-height;

    :deep(.el-scrollbar) {
      flex: 1;
      height: $navbar-height;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title),
    :deep(.el-menu--horizontal) {
      height: $navbar-height;
      line-height: $navbar-height;
    }

    :deep(.el-menu--collapse) {
      width: 100%;
    }
  }

  .main-container {
    min-height: calc(100vh - $navbar-height);
    padding-top: $navbar-height;
    margin-left: 0;
  }
}

.layout-mix {
  .sidebar-container {
    width: 100% !important;
    height: $navbar-height;

    :deep(.el-scrollbar) {
      flex: 1;
      height: $navbar-height;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title),
    :deep(.el-menu--horizontal) {
      height: $navbar-height;
      line-height: $navbar-height;
    }

    :deep(.el-menu--horizontal.el-menu) {
      border: none;
    }
  }

  &.hideSidebar {
    .sidebar-container {
      width: 100% !important;
    }
  }

  .mix-container {
    display: flex;
    height: 100%;
    padding-top: $navbar-height;

    &__left {
      position: relative;
      width: $sidebar-width;
      height: 100%;

      :deep(.el-menu) {
        height: 100%;
        border: none;
      }

      .sidebar-toggle {
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50px;
        line-height: 50px;
        box-shadow: 0 0 6px -2px var(--el-color-primary);

        div:hover {
          background-color: var(--menu-background);
        }

        :deep(svg) {
          color: var(--el-color-primary) !important;
        }
      }
    }

    .main-container {
      flex: 1;
      min-width: 0;
      margin-left: 0;

      .fixed-header {
        top: $navbar-height;
      }
    }
  }
}

.hideSidebar {
  .sidebar-container {
    width: $sidebar-width-collapsed !important;
  }

  .main-container {
    margin-left: $sidebar-width-collapsed;
  }

  .mix-container__left {
    width: $sidebar-width-collapsed;
  }

  .fixed-header {
    left: $sidebar-width-collapsed;
    width: calc(100% - $sidebar-width-collapsed);
  }

  &.mobile {
    .fixed-header {
      width: 100%;
    }

    &.layout-left {
      .main-container {
        margin-left: 0;
      }

      .sidebar-container {
        pointer-events: none;
        transition-duration: 0.3s;
        transform: translate3d(-$sidebar-width, 0, 0);
      }
    }

    &.layout-top {
      .sidebar-container {
        z-index: 999;
        display: flex;
        width: 100% !important;
        height: $navbar-height;

        :deep(.el-scrollbar) {
          flex: 1;
          min-width: 0;
          height: $navbar-height;
        }
      }

      .main-container {
        padding-top: $navbar-height;
        margin-left: 0;
        overflow: hidden;
      }

      // 顶部模式全局变量修改
      --el-menu-item-height: $navbar-height;
    }
  }
}
</style>
