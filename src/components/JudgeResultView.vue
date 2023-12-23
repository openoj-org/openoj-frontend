<script setup lang="ts">
import type { JudgeBaseResult } from '@/types/submission'
import { ElCol, ElRow, ElText } from 'element-plus'
import StatusText from './semiText/StatusText.vue'
import ScoreText from './semiText/ScoreText.vue'
import SemiText from './semiText/SemiText.vue'
defineProps<{
  title: string
  value: JudgeBaseResult
  tab?: boolean
  noScore?: boolean
}>()
</script>

<template>
  <ElRow justify="space-evenly" style="width: 100%; text-align: left">
    <ElCol :span="4">
      <ElRow justify="end" v-if="tab">
        <ElCol :span="22">
          <ElText>{{ title }}</ElText>
        </ElCol>
      </ElRow>
      <ElText v-else>{{ title }}</ElText>
    </ElCol>
    <ElCol :span="4">
      <StatusText :value="value.status" />
    </ElCol>
    <ElCol :span="4">
      <ScoreText :value="value.score" v-if="noScore != true" />
    </ElCol>
    <ElCol :span="4">
      <SemiText :value="value.timeCost" type="timeCost" />
    </ElCol>
    <ElCol :span="4">
      <SemiText :value="value.memoryCost" type="memoryCost" />
    </ElCol>
  </ElRow>
</template>
