<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRequestGetFull } from '@/script/service'
import { ElCollapse, ElCollapseItem, ElSkeleton } from 'element-plus'
import { JudgeResult } from '@/types/submission'
import JudgeResultView from '@/components/JudgeResultView.vue'
import DataInfoView from '@/components/DataInfoView.vue'

defineProps<{
  subtaskInfo: JudgeResult[]
}>()

const subtaskLoaded = ref(false)
const subtaskId = ref('')
const subtaskDataInfo: Ref<JudgeResult[]> = ref([])

function subtaskChange(activeNames: any) {
  if (activeNames.toString() == '') return
  subtaskLoaded.value = false
  const id = activeNames.toString()
  if (subtaskId.value == id) {
    subtaskLoaded.value = true
    return
  }
  subtaskId.value = id
  useRequestGetFull('/judge/info-subtask', { id: id }, (data) => {
    subtaskDataInfo.value = JudgeResult.list(data.dataInfo)
    subtaskLoaded.value = true
  })
}
</script>

<template>
  <ElCollapse accordion @change="subtaskChange">
    <ElCollapseItem v-for="(item, index) in subtaskInfo" :key="item.id" :name="item.id">
      <template #title>
        <JudgeResultView :title="$t('subtaskWithId', { id: index + 1 })" :value="item" />
      </template>
      <DataInfoView tab no-score :dataInfo="subtaskDataInfo" v-if="subtaskLoaded" />
      <ElCollapse v-else>
        <ElCollapseItem>
          <template #title>
            <ElSkeleton :rows="1" animated />
          </template>
        </ElCollapseItem>
      </ElCollapse>
    </ElCollapseItem>
  </ElCollapse>
</template>
