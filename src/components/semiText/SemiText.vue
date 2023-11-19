<script setup lang="ts">
import { ElText } from 'element-plus'
import ScoreText from './ScoreText.vue'
import TagsText from './TagsText.vue'

const props = defineProps<{
  type?: string
  value: any
}>()

console.log(props)
</script>

<template>
  <ElText v-if="type == undefined"> {{ value }} </ElText>
  <ScoreText :value="value" v-if="type == 'score' && value != undefined" />
  <TagsText :value="value" v-if="type == 'tags'" />
</template>
