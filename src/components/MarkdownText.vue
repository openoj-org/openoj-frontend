<script setup lang="ts">
import { markdown } from '@/script/markdown'
import { ElText } from 'element-plus'
defineProps<{
  value: any
}>()
</script>

<template>
  <ElText><span v-html="markdown(value)"></span></ElText>
</template>
