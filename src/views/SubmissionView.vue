<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import { useRoute } from 'vue-router'
import { ref, type Ref } from 'vue'
import { useRequestGetFull } from '@/script/service'
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElDescriptions,
  ElDescriptionsItem,
  ElTable,
  ElTableColumn
} from 'element-plus'
import { SubmissionInfo } from '@/types/submission'
import SemiText from '@/components/semiText/SemiText.vue'
import type { ColumnMeta } from '@/types/table'
import StatusText from '@/components/semiText/StatusText.vue'
import ScoreText from '@/components/semiText/ScoreText.vue'
import CodeView from '@/components/CodeView.vue'
import SubtaskInfoView from '@/components/SubtaskInfoView.vue'
import DataInfoView from '@/components/DataInfoView.vue'

const route = useRoute()
const loaded = ref(false)

const submissionInfo: Ref<SubmissionInfo> = ref(new SubmissionInfo({}))

useRequestGetFull(
  '/judge/info',
  {
    id: route.params.id
  },
  (data) => {
    submissionInfo.value = new SubmissionInfo(data)
    loaded.value = true
  }
)

const columnMeta: ColumnMeta[] = [
  {
    name: 'problemTitle',
    sortable: false,
    type: 'link',
    linkCallback: (scope) => {
      switch (scope.type) {
        case 0:
          return {
            name: 'problem',
            params: {
              id: scope.problemId
            }
          }
        case 1:
          return {
            name: 'work',
            params: {
              id: scope.problemId
            }
          }
        default:
          return ''
      }
    }
  },
  {
    name: 'username',
    showName: 'submitter',
    sortable: false,
    type: 'link',
    linkCallback: (scope) => {
      return {
        name: 'user',
        params: scope.userId
      }
    }
  },
  {
    name: 'time',
    showName: 'submitTime',
    sortable: true,
    type: 'time'
  }
]
</script>

<template>
  <BaseView :title="$t('submissionResult')">
    <template #breadcrumb>
      <ElBreadcrumb :separator-icon="ArrowRight" v-if="loaded">
        <ElBreadcrumbItem :to="{ name: 'submissions' }">{{ $t('submissions') }}</ElBreadcrumbItem>
        <ElBreadcrumbItem :to="{ name: 'submission', params: $route.params }">{{
          $route.params.id
        }}</ElBreadcrumbItem>
      </ElBreadcrumb>
    </template>
    <div class="box" v-if="loaded">
      <ElDescriptions>
        <ElDescriptionsItem
          v-for="column in columnMeta"
          :key="column.name"
          :label="$t(column.showName ?? column.name)"
        >
          <SemiText
            :type="column.type"
            :value="submissionInfo[column.name as keyof SubmissionInfo]"
            :link="
              column.linkCallback == undefined ? undefined : column.linkCallback(submissionInfo)
            "
          />
        </ElDescriptionsItem>
      </ElDescriptions>
      <ElTable :data="[submissionInfo]">
        <ElTableColumn prop="language" :label="$t('language')" />
        <ElTableColumn prop="status" :label="$t('status')">
          <template #default="scope">
            <StatusText :value="scope.row.status" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="score" :label="$t('score')">
          <template #default="scope">
            <ScoreText :value="scope.row.score" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="timeCost" :label="$t('timeCost')">
          <template #default="scope">
            <SemiText :value="scope.row.timeCost" type="timeCost" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="memoryCost" :label="$t('memoryCost')">
          <template #default="scope">
            <SemiText :value="scope.row.memoryCost" type="memoryCost" />
          </template>
        </ElTableColumn>
      </ElTable>
      <CodeView
        id="sourceCode"
        :language="submissionInfo.language"
        :value="submissionInfo.sourceCode"
      />
      <div v-if="submissionInfo.subtask">
        <SubtaskInfoView :subtask-info="submissionInfo.subtaskInfo!" />
      </div>
      <div v-else>
        <DataInfoView :tab="false" :data-info="submissionInfo.dataInfo!" />
      </div>
    </div>
  </BaseView>
</template>

<style scoped>
.box {
  margin: 0 auto;
}
</style>
