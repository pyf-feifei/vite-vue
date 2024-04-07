<template>
  <div class="vue-plyr">
    <vue-plyr
      v-if="plyrPlayerOptions.plyrType === 'video'"
      :options="vuePlyrOptions"
    >
      <video ref="plyrMedia" v-bind="mediaOptions">
        <source
          v-bind="
            plyrPlayerOptions.withHls
              ? null
              : {
                  src: src,
                }
          "
        />
      </video>
    </vue-plyr>
    <vue-plyr
      v-if="plyrPlayerOptions.plyrType === 'audio'"
      :options="vuePlyrOptions"
    >
      <audio ref="plyrMedia" v-bind="mediaOptions">
        <source
          v-bind="
            plyrPlayerOptions.withHls
              ? null
              : {
                  src: src,
                }
          "
        />
      </audio>
    </vue-plyr>
  </div>
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
  //自定义组件的自定义配置
  plyrPlayerOptions: {
    type: [Object],
    default(context) {
      return {
        plyrType: 'video', //video还是audio
        withHls: true, //是否是流播放
        ...context?.plyrPlayerOptions,
      }
    },
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
          // 'play-large',
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
  mediaOptions: {
    type: [Object],
    default(context) {
      return {
        playsinline: true,
        crossorigin: true,
        // 'data-poster': '/static/common/test.jpg',
        ...context?.mediaOptions,
      }
    },
  },
})

const state = reactive({
  height: 0,
  width: 0,
})
const plyrMedia = ref(null)
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
      //判断是否是流播放
      if (!props.plyrPlayerOptions.withHls) {
        console.log('props.src', props.src)
        return
      }
      if (Hls.isSupported()) {
        if (!props.src) return
        const videoElement = plyrMedia.value
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

<style lang="scss" scoped>
.vue-plyr {
  position: relative;
  // width: 100%;
  height: 100%;
}
</style>
