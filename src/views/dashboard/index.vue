<template>
  <div>
    <HelloWorld msg="dashboard"></HelloWorld>

    <!-- <IkuiIcon></IkuiIcon> -->
  </div>
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
