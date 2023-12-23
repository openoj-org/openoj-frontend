<script setup lang="ts">
import type { ElText } from 'element-plus'
import { t } from 'i18next'

defineProps<{
  value: number
}>()
function timeIntToString(time: number): string {
  const date = new Date(time)
  return t('timeFormat', {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours().toString().padStart(2, '0'),
    minute: date.getMinutes().toString().padStart(2, '0'),
    second: date.getSeconds().toString().padStart(2, '0')
  })
}
</script>

<template>
  <ElText>{{ timeIntToString(value) }}</ElText>
</template>
