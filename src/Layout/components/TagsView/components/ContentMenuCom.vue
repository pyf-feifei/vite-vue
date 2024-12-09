<template>
  <!-- tag标签操作菜单 -->
  <div
    v-clickOutDirective="
      () => {
        ContextMenu.hide()
      }
    "
    class="h-auto contextmenu"
  >
    <ul>
      <li
        @click="
          () => {
            refreshSelectedTag(selectedTag)
            ContextMenu.hide()
          }
        "
      >
        <svg-icon icon-class="refresh" />
        刷新
      </li>
      <li
        v-if="!isAffix(selectedTag)"
        @click="
          () => {
            closeSelectedTag(selectedTag)
            ContextMenu.hide()
          }
        "
      >
        <svg-icon icon-class="close" />
        关闭
      </li>
      <li
        @click="
          () => {
            closeOtherTags()
            ContextMenu.hide()
          }
        "
      >
        <svg-icon icon-class="close_other" />
        关闭其它
      </li>
      <li
        v-if="!isFirstView()"
        @click="
          () => {
            closeLeftTags()
            ContextMenu.hide()
          }
        "
      >
        <svg-icon icon-class="close_left" />
        关闭左侧
      </li>
      <li
        v-if="!isLastView()"
        @click="
          () => {
            closeRightTags()
            ContextMenu.hide()
          }
        "
      >
        <svg-icon icon-class="close_right" />
        关闭右侧
      </li>
      <li>
        <svg-icon
          icon-class="close_all"
          @click="
            () => {
              closeAllTags(selectedTag)
              ContextMenu.hide()
            }
          "
        />
        关闭所有
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resolve } from 'path-browserify'
const router = useRouter()
const route = useRoute()
import tagsViewStore from '@/store/modules/tagsView'
import settingsStore from '@/store/modules/settings'
import permissionStore from '@/store/modules/permission'
const { proxy } = getCurrentInstance()
import ContextMenu from '@/utils/ContextMenu/index.js'
const props = defineProps({
  selectedTag: null,
})
const selectedTag = ref({
  //右键选中的tag--变量
  path: '',
  fullPath: '',
  name: '',
  title: '',
  affix: false,
  keepAlive: false,
})
console.log('props.selectedTag', props.selectedTag)

selectedTag.value = Object.assign(selectedTag.value, props.selectedTag)

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
  console.log('view', view)

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

onMounted(() => {})
</script>
<style scoped lang="scss">
.contextmenu {
  // position: absolute;
  z-index: 99;
  font-size: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
  width: 100px;
  li {
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}
</style>
