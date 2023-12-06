<script setup lang="ts">
import { ElCollapse, ElCollapseItem, ElDescriptions, ElCard, ElText } from 'element-plus'
import JudgeResultView from './JudgeResultView.vue'
import { JudgeResult } from '@/types/submission'
import { ref } from 'vue'
import { useRequestGetFull } from '@/script/service'

defineProps<{
  dataInfo: JudgeResult[]
  tab?: boolean
  noScore?: boolean
}>()

const loaded = ref(false)
const dataId = ref('')
const dataInputPart = ref('')
const dataOutputPart = ref('')
const dataAnswerPart = ref('')
const dataJudgeContent = ref('')

function dataChange(activeNames: any) {
  if (activeNames.toString() == '') return
  loaded.value = false
  const id = activeNames.toString()
  if (dataId.value == id) {
    loaded.value = true
    return
  }
  dataId.value = id
  useRequestGetFull('/judge/info-data', { id: id }, (data) => {
    dataInputPart.value = data.inputPart
    dataOutputPart.value = data.outputPart
    dataAnswerPart.value = data.answerPart
    dataJudgeContent.value = data.judgeContent
    loaded.value = true
  })
}
</script>

<template>
  <ElCollapse accordion @change="dataChange">
    <ElCollapseItem v-for="(item, index) in dataInfo" :key="item.id" :name="item.id">
      <template #title>
        <JudgeResultView
          :tab="tab"
          :no-score="noScore"
          :title="$t('dataWithId', { id: index + 1 })"
          :value="item"
        />
      </template>
      <ElDescriptions :title="$t('input')"></ElDescriptions>
      <ElCard shadow="never">
        <pre class="content" style="margin: 0"><code>{{ dataInputPart }}</code></pre>
      </ElCard>
      <ElDescriptions style="margin-top: 12px" :title="$t('output')"></ElDescriptions>
      <ElCard shadow="never">
        <pre class="content" style="margin: 0"><code>{{ dataOutputPart }}</code></pre>
      </ElCard>
      <ElDescriptions style="margin-top: 12px" :title="$t('answer')"></ElDescriptions>
      <ElCard shadow="never">
        <pre class="content" style="margin: 0"><code>{{ dataAnswerPart }}</code></pre>
      </ElCard>
      <div style="margin-top: 12px; margin-bottom: 12px">
        <ElText>{{ dataJudgeContent }}</ElText>
      </div>
    </ElCollapseItem>
  </ElCollapse>
</template>

<style scoped>
.content {
  font-size: var(--el-font-size-medium);
}
</style>
