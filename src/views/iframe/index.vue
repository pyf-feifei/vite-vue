<template>
  gpt镜像
  <div class="app-container">
    <iframe
      ref="iframe"
      src="https://www.coze.com/space/7343656197662900231/bot"
      frameborder="0"
    ></iframe>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const iframe = ref(null)
console.log('iframe', document.getElementsByTagName('iframe')[0])
</script>
<style lang="scss" scoped>
/** 关闭tag标签  */
.app-container {
  /* 50px = navbar = 50px */
  height: calc(100vh - 50px);
}

/** 开启tag标签  */
.hasTagsView {
  .app-container {
    /* 84px = navbar + tags-view = 50px + 34px */
    height: calc(100vh - 84px);
  }
}

iframe {
  width: 100%;
  height: 100%;
}
</style>
