<template>
  <div class="test">
    {{ testMsg }}
    <el-button type="primary" @click="open">Primary</el-button>

    <el-icon>
      <i-ep-plus />
    </el-icon>

    <el-icon>
      <i-ep-caret-left />
    </el-icon>
    <!--  使用图标  -->
    <el-icon :size="20">
      <i-eos-icons:bubble-loading />
    </el-icon>
    <el-button type="info"
      ><svg-icon icon-class="phone" />SVG 本地图标</el-button
    >
    <el-button type="info" v-testDirective="true" @click="doLogIn"
      >登录</el-button
    >
    <!-- <size-select class="navbar-item" /> -->
    <el-button type="primary" @click="openDialog">测试弹窗</el-button>
    <el-button
      type="primary"
      ref="openPopoverRef"
      v-hoverDirective="handleHoverDirective"
      @click="openPopover"
      >Popover测试</el-button
    >
    <!-- <editor v-model="value" style="height: 600px" /> -->
    <!-- <MdEditorV3 class="mb4" v-model="mdEditorV3Value" style="height: 600px" /> -->
    <!-- <RightPanel v-if="showSettings">
      <settings />
    </RightPanel> -->
    <div @contextmenu.prevent="showContextMenu">自定义右键菜单</div>
    <!-- <zoom></zoom> -->
    <UsePanZoomCom></UsePanZoomCom>
  </div>
</template>

<script setup>
import userStore from '@/store/modules/user'
import settingsStore from '@/store/modules/settings'
// import { Settings } from '@/Layout/components/index'
import Editor from '@/components/WangEditor/index.vue'
import MdEditorV3 from '@/components/MdEditorV3/index.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import TestDialogs from './dialogs/TestDialogs.vue'
import TestDialogs1 from './dialogs/TestDialogs1.vue'
import zoom from './components/zoom.vue'
import UsePanZoomCom from './components/UsePanZoomCom.vue'
import ContextMenu from '@/utils/ContextMenu/index.js'
const { proxy } = getCurrentInstance()
let testMsg = ref('1111111')
let openPopoverRef = ref()
const open = () => {
  ElMessage('this is a message.')
}
const openDialog = () => {
  console.log('proxy', proxy.$dialog)
  proxy.$drawer.show(TestDialogs).then((res) => {
    console.log('res', res)
  })
}
const openPopover = ($event) => {
  ContextMenu.show(
    $event,
    TestDialogs,
    {
      area: '200px', // 打开的vue的宽度
    },
    {
      // 传入任意vue组件的props对象
    }
  )
}
const handleHoverDirective = (hover, events) => {
  console.log('hover', hover)
  // if (hover) {
  //   ContextMenu.show(
  //     events,
  //     TestDialogs,
  //     {
  //       area: '200px', // 打开的vue的宽度
  //     },
  //     {
  //       // 传入任意vue组件的props对象
  //     }
  //   )
  // }
}
const doLogIn = () => {
  userStore.login({ loginName: 'admin', password: 'mima334' }).then(() => {})
}
const value = ref('操')
const mdEditorV3Value = ref('# Hello Editor')
const showSettings = computed(() => settingsStore.showSettings)
/**
 * 自定义右键菜单
 * @param event
 */
const showContextMenu = (event) => {
  console.log('右键显示菜单')
  event.preventDefault()
  ContextMenu.show(
    event,
    TestDialogs,
    {
      area: '200px', // 打开的vue的宽度
    },
    {
      // 传入任意vue组件的props对象
    }
  )
}
</script>
<style scoped lang="scss">
.test {
}
</style>
