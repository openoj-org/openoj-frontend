<script setup lang="ts">
import { ElTag } from 'element-plus'

defineProps<{
  value: string[]
}>()
</script>

<template>
  <ElTag style="margin-right: 6px; margin-bottom: 6px" v-for="tag in value" :key="tag">
    {{ tag }}
  </ElTag>
</template>
