<template>
  <teleport to="body">
    <transition>
      <div v-if="visible" class="dialog fixed top-0 left-0 right-0 bottom-0">
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
          <component :is="contentComponent" />
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
  },
  setup(props) {
    const visible = ref(false)
    const contentComponent = ref(null)

    function show(component) {
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

<style>
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
    margin: 15vh auto 50px;
    background: #ffffff;
    border-radius: 2px;
    box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04),
      0px 8px 20px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    padding: 16px;
    width: 50%;
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
        top: 0;
        right: 16px;
      }
    }
  }
}
</style>
