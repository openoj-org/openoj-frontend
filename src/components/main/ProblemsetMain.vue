<script setup lang="ts">
import { type Ref } from 'vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRequestGet } from '@/script/service'
import { t } from 'i18next'
import { Files, Postcard, PriceTag } from '@element-plus/icons-vue'
import FormTable from '../FormTable.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { useLoginInfoStore } from '@/stores/loginInfo'

const loginInfo = useLoginInfoStore()
const preferences = usePreferencesStore()

const loaded = ref(false)
const count = ref(0)

const searchMeta = [
  {
    name: 'title',
    icon: Postcard
  },
  {
    name: 'source',
    icon: Files
  }
].concat(
  preferences.evaluation
    ? [
        {
          name: 'tags',
          icon: PriceTag
        }
      ]
    : []
)

interface Problem {
  id: string
  title: string
  source: string
  submit: number
  pass: number
  score?: number
  grade?: number
  tags?: string[]
}

const columnMeta = (
  (loginInfo.login ? [{ name: 'score', sortable: false, type: 'score' }] : []) as {
    name: string
    showName?: string
    sortable: boolean
    type?: string
  }[]
)
  .concat([
    { name: 'id', sortable: true },
    { name: 'title', sortable: true },
    { name: 'source', sortable: false },
    { name: 'submit', sortable: false },
    { name: 'pass', showName: 'passRate', sortable: false }
  ] as {
    name: string
    showName?: string
    sortable: boolean
    type?: string
  }[])
  .concat(
    preferences.evaluation
      ? [
          { name: 'grade', sortable: true },
          { name: 'tags', sortable: false, type: 'tags' }
        ]
      : []
  )

const marker = loginInfo.login
  ? (row: Problem, rowIndex: number) => {
      if (row.score == undefined) return ''
      else if (row.score == 100) return 'success-row'
      else return 'warning-row'
    }
  : undefined

const tableData: Ref<Problem[]> = ref([])

const getTable = (tableMeta: { [index: string]: any }) => {
  // show loading page first
  tableData.value = []
  loaded.value = false

  let meta = tableMeta
  meta.evaluation = preferences.evaluation
  if (loginInfo.login) meta.cookie = loginInfo.cookie
  useRequestGet('/problem/list', meta)
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        count.value = result.data.count
        tableData.value = result.data.result
        loaded.value = true
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
    })
}
</script>

<template>
  <FormTable
    title="problem"
    :loaded="loaded"
    :count="count"
    :search-meta="searchMeta"
    :column-meta="columnMeta"
    :table-data="tableData"
    :marker="marker"
    @flush-table-data="
      (tableMeta) => {
        getTable(tableMeta)
      }
    "
  ></FormTable>
</template>
