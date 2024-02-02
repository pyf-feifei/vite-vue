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
let testMsg = ref('1111111')
const open = () => {
  ElMessage('this is a message.')
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
