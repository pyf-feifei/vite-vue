<template>
  <div
    class="dialogtitle"
    :style="{
      padding: titlePadding,
    }"
  >
    <span>{{ title }}</span>
    <span
      class="clossicon"
      v-if="showCloseButton"
      @click="closeDialog"
      type="link"
    >
      +
    </span>
  </div>
</template>

<script>
export default {
  props: {
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '请输入标题',
    },
    titlePadding: {
      type: String,
      default: '20px',
    },
  },
  mounted() {},
  methods: {
    closeDialog() {
      // 触发关闭弹窗的逻辑，例如通过事件或者调用相关方法
      this.$emit('close-dialog')
    },
  },
}
</script>

<style lang="less" scoped>
.dialogtitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  color: #303133;
  .clossicon {
    color: #606266;
    font-size: 24px;
    transform: rotate(45deg);
    cursor: pointer;
  }
}
</style>
