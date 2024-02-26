<template>
  <div></div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const { params, query } = route
const { path } = params
console.log('redirect', path)
router.replace({ path: '/' + path, query })
</script>
