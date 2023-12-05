<script setup lang="ts">
import type { Status } from '@/types/submission'
import { statusTransform } from '@/types/submission'
import {
  Check,
  Close,
  Coin,
  Timer,
  Cpu,
  Warning,
  QuestionFilled,
  Loading
} from '@element-plus/icons-vue'
import { ElIcon, ElText } from 'element-plus'

defineProps<{
  value: Status
}>()

function getStatusType(value: Status) {
  switch (value) {
    case 'AC':
      return 'success'
    case 'WA':
    case 'TLE':
    case 'MLE':
    case 'RE':
      return 'danger'
    case 'CE':
      return 'warning'
    case 'UKE':
      return 'info'
    case 'Judging':
      return 'primary'
  }
}
</script>

<template>
  <ElText :type="getStatusType(value)">
    <ElIcon>
      <Check v-if="value == 'AC'" />
      <Close v-else-if="value == 'WA'" />
      <Timer v-else-if="value == 'TLE'" />
      <Coin v-else-if="value == 'MLE'" />
      <Cpu v-else-if="value == 'RE'" />
      <Warning v-else-if="value == 'CE'" />
      <QuestionFilled v-else-if="value == 'UKE'" />
      <Loading v-else />
    </ElIcon>
    {{ statusTransform(value) }}
  </ElText>
</template>
