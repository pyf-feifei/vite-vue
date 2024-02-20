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
    <el-button type="primary" @click="openDialog">测试弹窗</el-button>
    <editor v-model="value" style="height: 600px" />
    <RightPanel v-if="showSettings">
      <settings />
    </RightPanel>
  </div>
</template>

<script setup>
import userStore from '@/store/modules/user'
import settingsStore from '@/store/modules/settings'
import { Settings } from '@/Layout/components/index'
import Editor from '@/components/WangEditor/index.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import TestDialogs from './dialogs/TestDialogs.vue'
import TestDialogs1 from './dialogs/TestDialogs1.vue'
const { proxy } = getCurrentInstance()
let testMsg = ref('1111111')
const open = () => {
  ElMessage('this is a message.')
}
const openDialog = () => {
  console.log('proxy', proxy.$dialog)
  proxy.$dialog.show(TestDialogs).then((res) => {
    console.log('res', res)
  })
}
const doLogIn = () => {
  userStore.login({ name: '', password: '' }).then(() => {})
}
const value = ref('操')
const showSettings = computed(() => settingsStore.showSettings)
</script>
<style scoped lang="scss">
.test {
}
</style>
