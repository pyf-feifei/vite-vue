<template>
  <div class="tags-container">
    <el-scrollbar class="scroll-container" :vertical="false">
      <router-link
        ref="tagRef"
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.fullPath"
        :class="'tags-item ' + (isActive(tag) ? 'active' : '')"
        :to="{ path: tag.path, query: tag.query }"
        @contextmenu.prevent="openContentMenu(tag, $event)"
      >
        {{ tag.title }}
        <el-icon
          class="close-icon"
          size="12px"
          v-if="!isAffix(tag)"
          @click.prevent.stop="closeSelectedTag(tag)"
          ><CircleCloseFilled
        /></el-icon>
      </router-link>
    </el-scrollbar>
    <!-- tag标签操作菜单 -->
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { resolve } from 'path-browserify'
const router = useRouter()
const route = useRoute()
import tagsViewStore from '@/store/modules/tagsView'
import settingsStore from '@/store/modules/settings'
import permissionStore from '@/store/modules/permission'
import ContentMenuCom from './components/ContentMenuCom.vue'
import ContextMenu from '@/utils/ContextMenu/index.js'
const { proxy } = getCurrentInstance()

watch(
  //route当前路由改变时添加到storetagsView中
  route,
  () => {
    addTags()
    moveToCurrentTag()
  },
  {
    immediate: true, //初始化立即执行
  }
)

/**
 * 判断是否是激活的--方法
 */
function isActive(tag) {
  return tag.path === route.path
}
/**
 * 判断是否是affix--方法
 */
function isAffix(tag) {
  return tag?.affix
}
/**
 * 到最后一个标签-方法
 */
function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView && latestView.fullPath) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    router.push('/')
  }
}
/**
 * 关闭选中的标签--方法
 */
function closeSelectedTag(view) {
  tagsViewStore.delView(view).then((res) => {
    if (isActive(view)) {
      toLastView(res.visitedViews, view)
    }
  })
}

/**
 * 过滤出需要固定的标签--方法
 */
function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach((route) => {
    const tagPath = resolve(basePath, route.path)
    if (route.meta?.affix) {
      tags.push({
        path: tagPath,
        fullPath: tagPath,
        name: String(route.name),
        title: route.meta?.title || 'no-name',
        affix: route.meta?.affix,
        keepAlive: route.meta?.keepAlive,
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, basePath + route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
/**
 * 初始化Tages--方法
 */
function initTags() {
  const tags = filterAffixTags(permissionStore.routes)
  for (const tag of tags) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}
/**
 * 添加Tage--方法--->需要
 */
function addTags() {
  console.log('route.meta', route)
  if (route.meta.title) {
    tagsViewStore.addView({
      name: route.name,
      title: route.meta.title,
      path: route.path,
      fullPath: route.fullPath,
      affix: route.meta?.affix,
      keepAlive: route.meta?.keepAlive,
    })
  }
}
/**
 * 移到当前Tag--方法
 */
function moveToCurrentTag() {
  // 使用 nextTick() 的目的是确保在更新 tagsView 组件之前，scrollPaneRef 对象已经滚动到了正确的位置。
  nextTick(() => {
    for (const tag of tagsViewStore.visitedViews) {
      if (tag.path === route.path) {
        // when query is different then update
        // route.query = { ...route.query, ...tag.query };
        if (tag.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView({
            name: route.name,
            title: route.meta.title || '',
            path: route.path,
            fullPath: route.fullPath,
            affix: route.meta?.affix,
            keepAlive: route.meta?.keepAlive,
          })
        }
      }
    }
  })
}
/**
 * 打开右键菜单--方法
 */
function openContentMenu(tag, e) {
  console.log('tag', tag)

  e.preventDefault()
  ContextMenu.show(
    e,
    ContentMenuCom,
    {
      // area: '200px', // 打开的vue的宽度
    },
    {
      // 传入任意vue组件的props对象
      selectedTag: tag,
    }
  )
}

onMounted(() => {
  initTags()
})
</script>

<style lang="scss" scoped>
.tags-container {
  width: 100%;
  height: 34px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 1px var(--el-box-shadow-light);
  box-sizing: border-box;
  .tags-item {
    display: inline-block;
    padding: 3px 8px;
    margin: 4px 0 0 5px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid var(--el-border-color-light);

    &:hover {
      color: var(--el-color-primary);
    }

    &:first-of-type {
      margin-left: 15px;
    }

    &:last-of-type {
      margin-right: 15px;
    }

    .close-icon {
      transform: translateY(2px);
      border-radius: 50%;

      &:hover {
        color: #fff;
        background-color: var(--el-color-primary);
      }
    }

    &.active {
      color: #fff;
      background-color: var(--el-color-primary);

      &::before {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 5px;
        content: '';
        background: #fff;
        border-radius: 50%;
      }

      .close-icon:hover {
        color: var(--el-color-primary);
        background-color: var(--el-fill-color-light);
      }
    }
  }
}

.scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  .el-scrollbar__bar {
    bottom: 0;
  }

  .el-scrollbar__wrap {
    height: 49px;
  }
}
</style>
