<script setup lang="ts">
import { type Ref } from 'vue'
import { ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useRequestGet } from '@/script/service'
import { t } from 'i18next'
import { Files, Plus, Postcard, PriceTag, User } from '@element-plus/icons-vue'
import FormTable from '../FormTable.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { WorkListInfo, type ColumnMeta } from '@/script/types'

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
  },
  {
    name: 'author',
    icon: User
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

const columnMeta = (
  (loginInfo.login ? [{ name: 'score', sortable: false, type: 'score' }] : []) as ColumnMeta[]
)
  .concat([
    { name: 'id', sortable: true },
    { name: 'title', sortable: true, type: 'link' },
    { name: 'source', sortable: false },
    { name: 'submit', sortable: false },
    { name: 'pass', showName: 'passRate', sortable: false },
    {
      name: 'username',
      showName: 'author',
      sortable: false,
      type: 'link',
      linkbody: {
        head: 'user',
        idName: 'userId'
      }
    },
    {
      name: 'recommendation',
      showName: 'recommendationCount',
      sortable: true
    }
  ] as ColumnMeta[])
  .concat(
    preferences.evaluation
      ? [
          { name: 'grade', sortable: true },
          { name: 'tags', sortable: false, type: 'tags' }
        ]
      : []
  )

const tableData: Ref<WorkListInfo[]> = ref([])

const getTable = (tableMeta: { [index: string]: any }) => {
  // show loading page first
  tableData.value = []
  loaded.value = false

  let meta = tableMeta
  meta.evaluation = preferences.evaluation
  if (loginInfo.login) meta.cookie = loginInfo.cookie
  useRequestGet('/workshop/list', meta)
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        count.value = result.data.count
        tableData.value = WorkListInfo.list(result.data.result)
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
    title="work"
    :loaded="loaded"
    :count="count"
    :search-meta="searchMeta"
    :column-meta="columnMeta"
    :table-data="tableData"
    @flush-table-data="
      (tableMeta) => {
        getTable(tableMeta)
      }
    "
  >
    <template #extra>
      <ElButton
        style="margin-top: 12px"
        type="danger"
        :icon="Plus"
        v-if="loginInfo.login"
        @click="$router.push('/workshop/create')"
        >{{ $t('createSomething', { value: $t('problem') }) }}</ElButton
      >
    </template>
  </FormTable>
</template>
