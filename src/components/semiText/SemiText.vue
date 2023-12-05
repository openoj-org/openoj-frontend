<script setup lang="ts">
import { ElLink, ElText } from 'element-plus'
import ScoreText from './ScoreText.vue'
import TagsText from './TagsText.vue'
import type { RouteLocationRaw } from 'vue-router'
import TimeText from './TimeText.vue'
import StatusText from './StatusText.vue'
import { convertTimeLimit, convertMemoryLimit } from '@/types/problem'

defineProps<{
  type?: string
  value: any
  link?: RouteLocationRaw
}>()
</script>

<template>
  <ScoreText :value="value" v-if="type == 'score' && value != undefined" />
  <TagsText :value="value" v-else-if="type == 'tags'" />
  <ElLink
    :underline="false"
    type="primary"
    @click="$router.push(link ?? '')"
    v-else-if="type == 'link'"
    >{{ value }}</ElLink
  >
  <TimeText :value="value" v-else-if="type == 'time'" />
  <StatusText :value="value" v-else-if="type == 'status'" />
  <ElText v-else-if="type == 'timeCost'">{{ convertTimeLimit(value) }}</ElText>
  <ElText v-else-if="type == 'memoryCost'">{{ convertMemoryLimit(value) }}</ElText>
  <ElText v-else>{{ value }}</ElText>
</template>
