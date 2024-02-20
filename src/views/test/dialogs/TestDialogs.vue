<template>
  <div class="test">测试弹窗</div>
  <el-button type="primary" @click="openDialog">测试弹窗里</el-button>
  <div>
    <el-button type="primary" @click="openCancle">取消</el-button>
    <el-button type="primary" @click="openSave">确定</el-button>
  </div>
</template>

<script setup>
import TestDialogs1 from './TestDialogs1.vue'
const { proxy } = getCurrentInstance()

const openDialog = () => {
  console.log('proxy', proxy.$dialog)
  proxy.$dialog.show(TestDialogs1)
}
const openCancle = () => {
  // this.$dialogClose()

  proxy.$dialogClose(false, 1111)
}
const openSave = () => {
  console.log('proxy1', proxy)
  proxy.$dialogClose(true, 2222)
}
</script>
<style scoped lang="scss">
.test {
  background: red;
}
</style>
