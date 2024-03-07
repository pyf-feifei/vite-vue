<!-- 侧边菜单：包括左侧布局(all)、顶部布局(all)、混合布局(left) -->
<template>
  <el-menu
    :default-active="currentRoute.path"
    :collapse="!appStore.sidebar.opened"
    :background-color="variables['menu-background']"
    :text-color="variables['menu-text']"
    :active-text-color="variables['menu-active-text']"
    :unique-opened="false"
    :collapse-transition="false"
    :mode="settingsStore.layout === 'top' ? 'horizontal' : 'vertical'"
  >
    <SidebarMenuItem
      v-for="route in menuList"
      :key="route.path"
      :item="route"
      :base-path="resolvePath(route.path)"
      :is-collapse="!appStore.sidebar.opened"
    />
  </el-menu>
</template>

<script setup>
import variables from '@/styles/variables.module.scss'
import settingsStore from '@/store/modules/settings'
import appStore from '@/store/modules/app'
import path from 'path-browserify'
import { isExternal } from '@/utils/index'
const props = defineProps({
  menuList: {
    required: true,
    default: () => {
      return []
    },
    type: Array,
  },
  basePath: {
    type: String,
    required: true,
  },
})
console.log('menuList', props.menuList)
const currentRoute = useRoute()
console.log('currentRoute', currentRoute)
/**
 * 解析路径
 *
 * @param routePath 路由路径 /user
 */
function resolvePath(routePath) {
  console.log('routePath', routePath)
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }

  // 完整绝对路径 = 父级路径(/system) + 路由路径(/user)
  const fullPath = path.resolve(props.basePath, routePath)
  return fullPath
}
</script>
