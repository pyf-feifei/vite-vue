<template>
  <div
    ref="containerRef"
    class="container"
    @mousedown="startDrag"
    @wheel="handleWheel"
  >
    <div class="content" :style="transformStyle">
      <!-- 你的内容 -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDragAndRoom } from '@/hooks/useDragAndRoom.js'

const containerRef = ref(null)

const { transformStyle, startDrag, handleWheel } = useDragAndRoom(
  containerRef,
  {
    minScale: 0.1,
    maxScale: 5,
    zoomSpeed: 0.1,
    initialScale: 1,
    onZoomChange: (scale) => {
      console.log('Zoom changed:', scale)
    },
    onPanChange: ({ x, y }) => {
      console.log('Pan position:', x, y)
    },
  }
)
</script>

<style scoped>
.container {
  width: 400px;
  height: 400px;
  overflow: hidden;
  position: relative;
  border: 1px solid #ccc;
  background: #f0f0f0;
  margin: auto;
}

.content {
  position: absolute;
  transform-origin: 0 0;
  width: 100%;
  height: 100%;
  background: rebeccapurple;
}
</style>
