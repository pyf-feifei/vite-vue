<template>
  <vue-plyr :options="props.options">
    <video ref="plyrVideo" controls crossorigin playsinline data-poster="poster.jpg">
      <source />
    </video>
  </vue-plyr>
</template>

<script setup>
import Hls from 'hls.js'
const { proxy } = getCurrentInstance()

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  options: {
    type: Object,
    default(context) {
      return {
        i18n: {
          speed: '速度',
          normal: '正常',
          ...context?.options,
        },
      }
    },
  },
})

const plyrVideo = ref(null)
// 使用watch监听特定的prop
watch(
  () => props.src,
  (newValue, oldValue) => {
    if (Hls.isSupported()) {
      if (!props.src) return
      const videoElement = plyrVideo.value
      const hls = new Hls()
      hls.loadSource(props.src)
      hls.attachMedia(videoElement)
      props.options.autoplay &&
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play()
        })
    }
  },
  {
    immediate: true,
  }
)

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
