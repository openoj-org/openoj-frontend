<script setup lang="ts">
import type { Sample } from '@/script/types'
import { CopyDocument } from '@element-plus/icons-vue'
import { ElButton, ElCard, ElCol, ElDescriptions, ElMessage, ElRow, ElText } from 'element-plus'
import ClipboardJS from 'clipboard'
import { t } from 'i18next'

defineProps<{
  title: string
  id: number
  value: Sample
}>()

const clipboard = new ClipboardJS('.copy-btn')
clipboard.on('success', () => {
  ElMessage.success(t('somethingSuccess', { value: t('copySomething', { value: t('sample') }) }))
})
clipboard.on('error', () => {
  ElMessage.error(t('somethingFailed', { value: t('copySomething', { value: t('sample') }) }))
})
</script>

<template>
  <ElDescriptions :title="$t('sampleWithId', { id: id })" />
  <ElRow style="margin-top: 0" v-if="value.display" :gutter="60">
    <ElCol :span="12">
      <ElDescriptions :title="$t('sampleInputWithId', { id: id })" size="small">
        <template #extra>
          <ElButton
            class="copy-btn"
            type="success"
            size="small"
            :icon="CopyDocument"
            :data-clipboard-text="value.input"
            >{{ $t('copy') }}</ElButton
          >
        </template></ElDescriptions
      >
      <ElCard shadow="never">
        <pre style="margin: 0"><code>{{ value.input }}</code></pre>
      </ElCard>
    </ElCol>
    <ElCol :span="12">
      <ElDescriptions :title="$t('sampleOutputWithId', { id: id })" size="small">
        <template #extra>
          <ElButton
            class="copy-btn"
            type="success"
            size="small"
            :icon="CopyDocument"
            :data-clipboard-text="value.output"
            >{{ $t('copy') }}</ElButton
          >
        </template></ElDescriptions
      >
      <ElCard shadow="never">
        <pre style="margin: 0"><code>{{ value.output }}</code></pre>
      </ElCard>
    </ElCol>
  </ElRow>
  <div style="margin-top: 0" v-else>
    <ElText
      ><span
        v-html="$t('sampleHideHint', { input: `${title}${id}.in`, output: `${title}${id}.out` })"
      ></span
    ></ElText>
  </div>
</template>
