<template>
  <vue-plyr :options="vuePlyrOptions">
    <video ref="plyrVideo" v-bind="videoOptions">
      <source />
    </video>
  </vue-plyr>
</template>

<script setup>
import Hls from 'hls.js'
import { getToken } from '@/utils/auth'
const { proxy } = getCurrentInstance()

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  //vue-plyr的官方配置
  vuePlyrOptions: {
    type: Object,
    default(context) {
      return {
        i18n: {
          speed: '速度',
          normal: '正常',
        },
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'captions',
          'settings',
          'pip',
          'airplay',
          'fullscreen',
        ],
        ...context?.vuePlyrOptions,
      }
    },
  },
  //video 原生配置
  videoOptions: {
    type: [Object],
    default(context) {
      return {
        playsinline: true,
        crossorigin: true,
        'data-poster': '/static/common/test.jpg',
        ...context?.videoOptions,
      }
    },
  },
})

const state = reactive({
  height: 0,
  width: 0,
})
const plyrVideo = ref(null)
//创建Hls对象
const hls = new Hls({
  xhrSetup: function (xhr, url) {
    xhr.setRequestHeader('Authorization', getToken())
  },
})
// 使用watch监听特定的prop
watch(
  () => props.src,
  (newValue, oldValue) => {
    proxy.$nextTick(() => {
      //设置播放器宽高
      if (Hls.isSupported()) {
        if (!props.src) return
        const videoElement = plyrVideo.value
        hls.loadSource(props.src)
        hls.attachMedia(videoElement)
        props.vuePlyrOptions.autoplay &&
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play()
          })
      }
    })
  },
  {
    immediate: true,
  }
)

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
