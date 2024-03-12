<template>
  <MdEditor :toolbars="props.toolbars" v-model="defaultText"></MdEditor>
</template>

<script setup>
import 'md-editor-v3/lib/style.css'
import { MdEditor } from 'md-editor-v3'
const props = defineProps({
  modelValue: {
    type: [String],
    default: '',
  },
  toolbars: {
    type: [Object, Array],
    default(context) {
      console.log('context', context.toolbars)
      return [
        'bold',
        'underline',
        'italic',
        '-',
        'title',
        'strikeThrough',
        'sub',
        'sup',
        'quote',
        'unorderedList',
        'orderedList',
        'task',
        '-',
        'codeRow',
        'code',
        'link',
        'image',
        'table',
        'mermaid',
        'katex',
        '-',
        'revoke',
        'next',
        '=',
        'pageFullscreen',
        'fullscreen',
        'preview',
        'catalog',
        ...(context.toolbars || []),
      ]
    },
  },
})
const emit = defineEmits(['update:modelValue'])
const defaultText = useVModel(props, 'modelValue', emit)
</script>
<style scoped lang="scss"></style>
