<template>
  <Teleport to="body">
    <div class="right-panel" :style="{ width: show ? '300px' : '0px' }">
      <div
        class="right-panel-btn"
        :style="{
          top: buttonTop + 'px',
        }"
        @click="show = !show"
      >
        <i-ep-close v-show="show" />
        <i-ep-setting v-show="!show" />
      </div>
      <div v-show="show" ref="rightPanel" class="right-panel-in">
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
defineProps({
  buttonTop: {
    default: 250,
    type: Number,
  },
})
const show = ref(false)
watch(show, (value) => {})
</script>

<style lang="scss" scoped>
.right-panel {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 100%;

  background-color: var(--el-bg-color-overlay);
  box-shadow: 0 0 15px 0 rgb(0 0 0 / 5%);
  .right-panel-btn {
    position: absolute;
    left: -36px;
    width: 36px;
    height: 36px;
    color: var(--el-color-white);
    text-align: center;
    cursor: pointer;
    background-color: var(--el-color-primary);
    border-radius: 6px 0 0 6px;

    svg {
      width: 20px;
      height: 20px;
      vertical-align: -10px;
    }
  }
  width: 300px;
}
</style>
