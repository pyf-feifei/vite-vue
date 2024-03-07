<template>
  <div class="tags-container">
    <el-scrollbar
      class="scroll-container"
      :vertical="false"
      @wheel.prevent="handleScroll"
    >
      <router-link
        ref="tagRef"
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.fullPath"
        :class="'tags-item ' + (isActive(tag) ? 'active' : '')"
        :to="{ path: tag.path, query: tag.query }"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
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
    <ul
      v-show="contentMenuVisible"
      class="contextmenu"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        <svg-icon icon-class="refresh" />
        刷新
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <svg-icon icon-class="close" />
        关闭
      </li>
      <li @click="closeOtherTags">
        <svg-icon icon-class="close_other" />
        关闭其它
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <svg-icon icon-class="close_left" />
        关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <svg-icon icon-class="close_right" />
        关闭右侧
      </li>
      <li>
        <svg-icon icon-class="close_all" @click="closeAllTags(selectedTag)" />
        关闭所有
      </li>
    </ul>
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
const { proxy } = getCurrentInstance()

const left = ref(0) //弹窗左侧距离--变量
const top = ref(0) //弹窗上距离--变量
const selectedTag = ref({
  //右键选中的tag--变量
  path: '',
  fullPath: '',
  name: '',
  title: '',
  affix: false,
  keepAlive: false,
})

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

const contentMenuVisible = ref(false) // 右键菜单是否显示--变量
watch(contentMenuVisible, (value) => {
  //右键菜单方法
  if (value) {
    document.body.addEventListener('click', closeContentMenu)
  } else {
    document.body.removeEventListener('click', closeContentMenu)
  }
})

/**
 * 关闭右键菜单--方法
 */
function closeContentMenu() {
  contentMenuVisible.value = false
}
/**
 * 滚动事件--方法
 */
function handleScroll() {
  closeContentMenu()
}
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
 * 判断是否是第一个view标签--方法
 */
function isFirstView() {
  try {
    return selectedTag.value.fullPath === tagsViewStore.visitedViews[1].fullPath
  } catch (err) {
    return false
  }
}
/**
 * 判断是否是最后一个view标签--方法
 */
function isLastView() {
  try {
    return (
      selectedTag.value.fullPath ===
      tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1].fullPath
    )
  } catch (err) {
    return false
  }
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
 * 刷新-方法
 */
function refreshSelectedTag(view) {
  tagsViewStore.delCachedView(view) //删除缓存的路由
  const { fullPath } = view
  nextTick(() => {
    router.replace({ path: '/redirect' + fullPath })
  })
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
 * 关闭其他标签--方法
 */
function closeOtherTags() {
  router.push(selectedTag.value)
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}
/**
 * 关闭左侧标签--方法
 */
function closeLeftTags() {
  tagsViewStore.delLeftViews(selectedTag.value).then((res) => {
    if (!res.visitedViews.find((item) => item.path === route.path)) {
      toLastView(res.visitedViews)
    }
  })
}
/**
 * 关闭右侧标签--方法
 */
function closeRightTags() {
  tagsViewStore.delRightViews(selectedTag.value).then((res) => {
    if (!res.visitedViews.find((item) => item.path === route.path)) {
      toLastView(res.visitedViews)
    }
  })
}
/**
 * 关闭所有标签--方法
 */
function closeAllTags(view) {
  tagsViewStore.delAllViews().then((res) => {
    toLastView(res.visitedViews, view)
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
 * 添加Tage--方法
 */
function addTags() {
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
  const menuMinWidth = 105

  const offsetLeft = proxy?.$el.getBoundingClientRect().left // container margin left
  const offsetWidth = proxy?.$el.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const l = e.clientX - offsetLeft + 15 // 15: margin right

  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }

  // 混合模式下，需要减去顶部菜单(fixed)的高度
  if (settingsStore.layout === 'mix') {
    top.value = e.clientY - 50
  } else {
    top.value = e.clientY
  }

  contentMenuVisible.value = true
  console.log('contentMenuVisible', contentMenuVisible)
  selectedTag.value = tag
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

.contextmenu {
  position: absolute;
  z-index: 99;
  font-size: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);

  li {
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background: var(--el-fill-color-light);
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
