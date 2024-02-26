<template>
  <div class="flex">
    <div v-if="device !== 'mobile'" class="flex-center">
      <!--全屏 -->
      <div class="navbar-item" @click="toggle">
        <svg-icon
          :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
        />
      </div>
      <!-- 布局大小 -->
      <el-tooltip content="布局大小" effect="dark" placement="bottom">
        <size-select class="navbar-item" />
      </el-tooltip>
    </div>

    <!-- 用户头像 -->
    <el-dropdown trigger="click">
      <div class="flex-center ml-1">
        <img
          :src="
            userStore.userInfo.avatar ||
            'https://avatars.githubusercontent.com/u/141120814?s=200&v=4'
          "
          width="40px"
          height="40px"
          class="rounded-md cursor-pointer"
        />
        <el-icon class="cursor-pointer">
          <CaretBottom />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click="logout">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useFullscreen } from '@vueuse/core'
import appStore from '@/store/modules/app'
import tagsViewStore from '@/store/modules/tagsView'
import userStore from '@/store/modules/user'

const route = useRoute()
const router = useRouter()

// 设备类型：desktop-宽屏设备 || mobile-窄屏设备
const device = computed(() => appStore.device)

const { isFullscreen, toggle } = useFullscreen()

/**
 * 注销
 */
function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    lockScroll: false,
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews()
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`)
      })
  })
}
</script>
<style lang="scss" scoped>
.navbar-item {
  display: inline-block;
  width: 30px;
  height: $navbar-height;
  line-height: $navbar-height;
  color: var(--el-text-color);
  text-align: center;
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 10%);
  }
}

.layout-top,
.layout-mix {
  .navbar-item,
  .el-icon {
    color: var(--el-color-white);
  }
}

.dark .navbar-item:hover {
  background: rgb(255 255 255 / 20%);
}
</style>
