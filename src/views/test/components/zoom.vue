<template>
  <div ref="containerRef" class="canvas-container">
    <canvas
      ref="canvasRef"
      :style="{
        cursor: panState.isDragging ? 'move' : 'default',
        transform: `translate(${panState.translateX}px, ${panState.translateY}px) scale(${zoomState.scale})`,
      }"
      @mousedown="startDrag"
      @wheel="handleWheel"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

const props = defineProps({
  imageUrl: {
    type: String,
    default:
      'https://img2.baidu.com/it/u=1337068678,3064275007&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750',
  },
})

const containerRef = ref(null)
const canvasRef = ref(null)
const ctx = ref(null)
const imageObj = ref(null)

// Pan state
const panState = reactive({
  translateX: 0,
  translateY: 0,
  prevTranslateX: 0,
  prevTranslateY: 0,
  isDragging: false,
})

// Zoom state
const zoomState = reactive({
  scale: 1,
  ZOOM_SPEED: 0.1,
  MIN_SCALE: 0.1,
  MAX_SCALE: 5,
})

// Image state
const imageState = reactive({
  width: 0,
  height: 0,
})

onMounted(() => {
  loadImage()
})

// Watch for image URL changes
watch(
  () => props.imageUrl,
  () => {
    loadImage()
  }
)

function loadImage() {
  const img = new Image()
  img.src = props.imageUrl
  img.crossOrigin = 'anonymous' // 处理跨域问题

  img.onload = () => {
    imageObj.value = img
    imageState.width = img.width
    imageState.height = img.height

    initCanvas()
  }

  img.onerror = () => {
    console.error('Image failed to load')
  }
}

function initCanvas() {
  const canvas = canvasRef.value
  ctx.value = canvas.getContext('2d')

  // 设置canvas尺寸为容器尺寸
  const container = containerRef.value
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight

  // 计算图片适应容器的缩放比例
  const containerRatio = container.clientWidth / container.clientHeight
  const imageRatio = imageState.width / imageState.height

  let finalWidth, finalHeight

  if (containerRatio > imageRatio) {
    // 容器更宽，以高度为准
    finalHeight = container.clientHeight
    finalWidth = finalHeight * imageRatio
  } else {
    // 容器更高，以宽度为准
    finalWidth = container.clientWidth
    finalHeight = finalWidth / imageRatio
  }

  // 调整canvas尺寸为图片尺寸
  canvas.width = finalWidth
  canvas.height = finalHeight

  // 居中canvas
  centerCanvas()

  // 绘制图片
  drawImage()
}

function centerCanvas() {
  const canvas = canvasRef.value
  const container = containerRef.value

  panState.translateX = (container.clientWidth - canvas.width) / 2
  panState.translateY = (container.clientHeight - canvas.height) / 2
  panState.prevTranslateX = panState.translateX
  panState.prevTranslateY = panState.translateY
}

function drawImage() {
  if (!imageObj.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制图片，填充整个canvas
  ctx.drawImage(imageObj.value, 0, 0, canvas.width, canvas.height)
}

// 拖动功能
function startDrag(event) {
  if (event.button !== 0) return // 只响应左键

  panState.isDragging = true
  const startX = event.clientX
  const startY = event.clientY

  function onMouseMove(event) {
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY

    panState.translateX = panState.prevTranslateX + deltaX
    panState.translateY = panState.prevTranslateY + deltaY
  }

  function onMouseUp() {
    panState.isDragging = false
    panState.prevTranslateX = panState.translateX
    panState.prevTranslateY = panState.translateY

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

// 缩放功能
function handleWheel(event) {
  event.preventDefault()

  const { x: mouseX, y: mouseY } = getRelativeMousePos(event)

  // 确定缩放方向
  const zoomFactor =
    event.deltaY > 0 ? 1 - zoomState.ZOOM_SPEED : 1 + zoomState.ZOOM_SPEED

  // 计算新的缩放值
  const newScale = zoomState.scale * zoomFactor

  // 检查缩放范围
  if (newScale < zoomState.MIN_SCALE || newScale > zoomState.MAX_SCALE) return

  // 更新缩放值
  zoomState.scale = newScale

  // 计算新的位置，使缩放以鼠标位置为中心
  panState.translateX = (panState.translateX - mouseX) * zoomFactor + mouseX
  panState.translateY = (panState.translateY - mouseY) * zoomFactor + mouseY

  panState.prevTranslateX = panState.translateX
  panState.prevTranslateY = panState.translateY
}

function getRelativeMousePos(event) {
  const rect = containerRef.value.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}
</script>

<style scoped>
.canvas-container {
  width: 400px;
  height: 400px;
  overflow: hidden;
  position: relative;
  background: #f5f5f5;
  margin: auto;
  border: 1px solid #ccc;
}

canvas {
  position: absolute;
  transform-origin: 0 0;
}
</style>
