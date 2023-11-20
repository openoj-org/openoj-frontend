<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
defineProps<{
  value: any
  id: any
}>()
</script>

<template>
  <MdPreview :editor-id="id" :model-value="value"></MdPreview>
</template>
