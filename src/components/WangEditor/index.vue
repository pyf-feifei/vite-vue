<template>
  <div style="border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      style="border-bottom: 1px solid #ccc"
      :mode="mode"
    />
    <!-- 编辑器 -->
    <Editor
      :defaultConfig="editorConfig"
      v-model="defaultHtml"
      @onChange="handleChange"
      style="height: 500px; overflow-y: hidden"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Boot } from '@wangeditor/editor'
// 引入markdown语法
import markdownModule from '@wangeditor/plugin-md'

const props = defineProps({
  modelValue: {
    type: [String],
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
const defaultHtml = useVModel(props, 'modelValue', emit)

Boot.registerModule(markdownModule)

const editorRef = shallowRef() // 编辑器实例，必须用 shallowRef
const mode = ref('default') // 编辑器模式
const toolbarConfig = ref({}) // 工具条配置
// 编辑器配置
const editorConfig = ref({
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 自定义图片上传
      async customUpload(file, insertFn) {
        const url = ''
        insertFn(url)
      },
    },
  },
})

const handleCreated = (editor) => {
  console.log('editor', editor)
  editorRef.value = editor // 记录 editor 实例，重要！
}

function handleChange(editor) {
  emit('update:modelValue', editor.getHtml())
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
