<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
import { computed } from 'vue'
import { type Language } from '@/types/submission'

const props = defineProps<{
  id: any
  language: Language
  value: any
}>()

function getCodeContent(language: string, content: string) {
  return '```' + language + '\n' + content + '\n```'
}

const content = computed(() => {
  switch (props.language) {
    case 'Python3':
      return getCodeContent('python', props.value)
    case 'C++11':
      return getCodeContent('cpp', props.value)
  }
  return ''
})
</script>

<template>
  <MdPreview :editor-id="id" :model-value="content" showCodeRowNumber></MdPreview>
</template>
