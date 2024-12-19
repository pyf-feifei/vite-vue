<template>
  <div ref="containerRef" class="canvas-container">
    <canvas
      ref="canvasRef"
      :style="{
        cursor: isDragging ? 'move' : 'default',
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      }"
      @mousedown="startDrag"
      @wheel="handleWheel"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

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
const translateX = ref(0)
const translateY = ref(0)
const prevTranslateX = ref(0)
const prevTranslateY = ref(0)
const isDragging = ref(false)

// Zoom state
const scale = ref(1)
const ZOOM_SPEED = 0.1
const MIN_SCALE = 0.1
const MAX_SCALE = 5

// Image state
const imageWidth = ref(0)
const imageHeight = ref(0)

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
    imageWidth.value = img.width
    imageHeight.value = img.height

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
  const imageRatio = imageWidth.value / imageHeight.value

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

  translateX.value = (container.clientWidth - canvas.width) / 2
  translateY.value = (container.clientHeight - canvas.height) / 2
  prevTranslateX.value = translateX.value
  prevTranslateY.value = translateY.value
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

  isDragging.value = true
  const startX = event.clientX
  const startY = event.clientY

  function onMouseMove(event) {
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY

    translateX.value = prevTranslateX.value + deltaX
    translateY.value = prevTranslateY.value + deltaY
  }

  function onMouseUp() {
    isDragging.value = false
    prevTranslateX.value = translateX.value
    prevTranslateY.value = translateY.value

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
  const zoomFactor = event.deltaY > 0 ? 1 - ZOOM_SPEED : 1 + ZOOM_SPEED

  // 计算新的缩放值
  const newScale = scale.value * zoomFactor

  // 检查缩放范围
  if (newScale < MIN_SCALE || newScale > MAX_SCALE) return

  // 更新缩放值
  scale.value = newScale

  // 计算新的位置，使缩放以鼠标位置为中心
  const scaleRatio = zoomFactor
  translateX.value = (translateX.value - mouseX) * scaleRatio + mouseX
  translateY.value = (translateY.value - mouseY) * scaleRatio + mouseY

  prevTranslateX.value = translateX.value
  prevTranslateY.value = translateY.value
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
