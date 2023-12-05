<script setup lang="ts">
import { ArrowRight, ChatDotSquare, Postcard, QuestionFilled, User } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import { SubmissionListInfo, languages, status } from '@/types/submission'
import { ref, type Ref } from 'vue'
import type { ColumnMeta } from '@/types/table'
import { useRequestGet } from '@/script/service'
import { ElMessage } from 'element-plus'
import { t } from 'i18next'
import FormTable from '@/components/FormTable.vue'

const loaded = ref(false)
const count = ref(0)

const searchMeta = [
  {
    name: 'problem',
    showName: 'problemTitle',
    icon: Postcard
  },
  {
    name: 'user',
    showName: 'submitter',
    icon: User
  },
  {
    name: 'language',
    icon: ChatDotSquare,
    type: 'select',
    options: languages
  },
  {
    name: 'status',
    icon: QuestionFilled,
    type: 'select',
    options: status
  }
]

const columnMeta: ColumnMeta[] = [
  {
    name: 'id',
    sortable: false
  },
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
    name: 'language',
    sortable: false
  },
  {
    name: 'time',
    showName: 'submitTime',
    sortable: true,
    type: 'time'
  },
  {
    name: 'status',
    sortable: false,
    type: 'status'
  },
  {
    name: 'score',
    sortable: true,
    type: 'score'
  },
  {
    name: 'timeCost',
    sortable: true,
    type: 'timeCost'
  },
  {
    name: 'memoryCost',
    sortable: true,
    type: 'memoryCost'
  }
]
const tableData: Ref<SubmissionListInfo[]> = ref([])
const getTable = (tableMeta: { [index: string]: any }) => {
  // show loading page first
  tableData.value = []
  loaded.value = false

  let meta = tableMeta
  if (meta.language == '') delete meta.language
  if (meta.status == '') delete meta.status
  // TODO: add problemId, useId, etc.
  useRequestGet('/judge/list', meta)
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        count.value = result.data.count
        tableData.value = SubmissionListInfo.list(result.data.result)
        loaded.value = true
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
    })
}

function click(row: any) {
  return {
    name: 'submission',
    params: {
      id: row.id
    }
  }
}
</script>

<template>
  <BaseView :title="$t('submissions')">
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/submissions' }">
          {{ $t('submissions') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>

    <FormTable
      title="submission"
      default-order-key="time"
      :default-increase="false"
      :loaded="loaded"
      :count="count"
      :search-meta="searchMeta"
      :column-meta="columnMeta"
      :table-data="tableData"
      :link-callback="click"
      @flush-table-data="
        (tableMeta) => {
          getTable(tableMeta)
        }
      "
    />
  </BaseView>
</template>
