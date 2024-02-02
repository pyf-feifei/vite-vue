<template>
  <div class="box">首页{{ count }}</div>
  <HelloWorld msg="你好啊"></HelloWorld>
</template>

<script setup>
import appStore from '@/store/modules/app'
let count = appStore.count
</script>

<style lang="scss" scoped>
.box {
  color: #747bff;
  height: 100px;
}
</style>
