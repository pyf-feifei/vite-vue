<template>
  <div class="box">首页{{ count }}</div>
  <HelloWorld msg="你好啊"></HelloWorld>
</template>

<script setup>
import useAppStore from '@/store/modules/app'
const appStore = useAppStore()
let count = appStore.count
</script>

<style lang="scss" scoped>
.box {
  color: #747bff;
  height: 100px;
}
</style>
