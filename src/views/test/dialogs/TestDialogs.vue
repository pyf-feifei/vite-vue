<template>
  <div class="test">测试弹窗</div>
  <el-button type="primary" @click="openDialog">测试弹窗里</el-button>
</template>

<script setup>
import TestDialogs1 from './TestDialogs1.vue'
const { proxy } = getCurrentInstance()

const openDialog = () => {
  console.log('proxy', proxy.$dialog)
  proxy.$dialog.show(TestDialogs1)
}
</script>
<style scoped lang="scss">
.test {
  background: red;
}
</style>
