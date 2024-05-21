<template>
  <teleport to="body">
    <transition>
      <div
        v-if="visible"
        class="dialog fixed top-0 left-0 right-0 bottom-0 z-1000"
      >
        <!-- 动态组件渲染 -->
        <div
          class="dialog-in"
          :style="{
            width: props.width,
          }"
        >
          <header class="dialog-in-title">
            <span>{{ props.title }}</span>
            <div
              class="dialog-in-title-icon cursor-pointer"
              @click="closeDialog"
            >
              +
            </div>
          </header>
          <template v-if="contentComponent">
            <component :is="contentComponent" v-bind="componentProps" />
          </template>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    onClose: {
      type: Function,
    },
    title: {
      type: String,
      default: '标题',
    },
    width: {
      type: String,
      default: '800px',
    },
    componentProps: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const visible = ref(false)
    const contentComponent = ref(null)

    function show(component, componentPropsOut) {
      contentComponent.value = component
      visible.value = true
    }

    function hide() {
      visible.value = false
    }
    /**
     * 关闭弹窗
     */
    function closeDialog() {
      this.hide()
      props.onClose()
    }
    return {
      props,
      visible,
      contentComponent,
      show,
      hide,
      closeDialog,
    }
  },
}
</script>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.dialog {
  height: 100%;
  background-color: var(--el-overlay-color-lighter);
  overflow: auto;
  .dialog-in {
    position: relative;
    --el-dialog-margin-top: 15vh;
    --el-dialog-bg-color: var(--el-bg-color);
    --el-dialog-box-shadow: var(--el-box-shadow);
    --el-dialog-title-font-size: var(--el-font-size-large);
    --el-dialog-content-font-size: 14px;
    --el-dialog-font-line-height: var(--el-font-line-height-primary);
    --el-dialog-padding-primary: 16px;
    --el-dialog-border-radius: var(--el-border-radius-small);
    position: relative;
    margin: var(--el-dialog-margin-top, 15vh) auto 50px;
    background: var(--el-dialog-bg-color);
    border-radius: var(--el-dialog-border-radius);
    box-shadow: var(--el-dialog-box-shadow);
    box-sizing: border-box;
    padding: var(--el-dialog-padding-primary);
    width: var(--el-dialog-width, 50%);
    overflow-wrap: break-word;
    .dialog-in-title {
      padding-bottom: 16px;
      padding-right: 16px;
      line-height: var(--el-dialog-font-line-height);
      font-size: var(--el-dialog-title-font-size);
      color: var(--el-text-color-primary);
      .dialog-in-title-icon {
        font-size: 28px;
        transform: rotate(45deg);
        position: absolute;
        color: #909399;
        top: 10px;
        right: 16px;
      }
    }
  }
}
</style>
