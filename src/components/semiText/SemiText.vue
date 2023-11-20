<script setup lang="ts">
import { ElLink, ElText } from 'element-plus'
import ScoreText from './ScoreText.vue'
import TagsText from './TagsText.vue'

defineProps<{
  type?: string
  value: any
  link?: string
}>()
</script>

<template>
  <ElText v-if="type == undefined"> {{ value }} </ElText>
  <ScoreText :value="value" v-if="type == 'score' && value != undefined" />
  <TagsText :value="value" v-if="type == 'tags'" />
  <ElLink
    :underline="false"
    type="primary"
    @click="$router.push(link == undefined ? '' : link)"
    v-if="type == 'link'"
    >{{ value }}</ElLink
  >
</template>
