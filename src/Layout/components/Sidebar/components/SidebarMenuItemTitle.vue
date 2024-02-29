<template>
  <el-icon v-if="icon && icon.startsWith('el-icon')" class="sub-el-icon">
    <component :is="renderIcon(icon.replace('el-icon-', ''))" />
  </el-icon>
  <SvgIcon v-else-if="icon" :icon-class="icon" />
  <SvgIcon v-else icon-class="menu" />
  <span v-if="title" class="ml-1">{{ title }}</span>
</template>

<script setup >
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

defineProps({
  icon: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
});
/**
 * 渲染图标组件
 */
const renderIcon = (iconName) => {
  const iconComponent = ElementPlusIconsVue[iconName];
  if (iconComponent) {
    return h(resolveComponent(iconComponent.name));
  }
  return null;
};
</script>

<style lang="scss" scoped>
.sub-el-icon {
  width: 14px !important;
  margin-right: 0 !important;
  font-size: 14px !important;
  color: currentcolor;
}

.hideSidebar {

  .el-sub-menu,
  .el-menu-item {

    .svg-icon,
    .sub-el-icon {
      margin-left: 20px;
    }
  }
}
</style>
