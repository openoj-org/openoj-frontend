<script setup lang="ts">
import { ElText } from 'element-plus'

const props = defineProps<{
  value: number
}>()

function getScoreType(score: number) {
  if (score == 100) return 'success'
  else if (score >= 60) return 'warning'
  else return 'danger'
}
</script>

<template>
  <ElText tag="b" :type="getScoreType(props.value)">
    {{ value }}
  </ElText>
</template>
