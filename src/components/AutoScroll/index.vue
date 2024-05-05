<template>
  <div ref="scrollRef">
    <slot></slot>
  </div>
</template>

<script setup>
const scrollRef = ref(null)

// 传入一个外部响应式数据源作为 props
const props = defineProps({
  watchData: {
    required: true,
  },
})

// 平滑滚动到底部的函数
const scrollToBottom = () => {
  const { scrollHeight, clientHeight, scrollTop } = scrollRef.value
  nextTick(() => {
    if (scrollTop + clientHeight >= scrollHeight - 80) {
      scrollRef.value?.scrollTo({
        top: scrollRef.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  })
}

// 监视传入的响应式数据
watch(
  () => props.watchData,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

onMounted(() => {
  scrollToBottom()
})
</script>

<style lang="scss" scoped></style>
