<script setup lang="ts">
import { ArrowRight, Postcard, User, Files, Plus } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ColumnMeta } from '@/types/table'
import { useRequestGetFull } from '@/script/service'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import FormTable from '@/components/FormTable.vue'
import { PostListInfo } from '@/types/post'
import { useLoginInfoStore } from '@/stores/loginInfo'

const route = useRoute()
const loginInfo = useLoginInfoStore()

const loaded = ref(false)
const count = ref(0)

const searchMeta = [
  {
    name: 'title',
    icon: Postcard
  },
  {
    name: 'author',
    showName: 'originalPoster',
    icon: User
  },
  {
    name: 'source',
    icon: Files
  }
]

const columnMeta: ColumnMeta[] = [
  {
    name: 'id',
    sortable: false
  },
  {
    name: 'title',
    sortable: false,
    type: 'link',
    linkCallback: (scope) => {
      return {
        name: 'post',
        params: {
          id: scope.row.id
        }
      }
    }
  },
  {
    name: 'username',
    showName: 'originalPoster',
    sortable: false,
    type: 'link',
    linkCallback: (scope) => {
      return {
        name: 'user',
        params: {
          id: scope.row.userId
        }
      }
    }
  },
  {
    name: 'time',
    showName: 'postTime',
    sortable: true,
    type: 'time'
  },
  {
    name: 'commentTime',
    showName: 'followUpTime',
    sortable: true,
    type: 'time'
  },
  {
    name: 'problemTitle',
    showName: 'source',
    sortable: false,
    type: 'link',
    linkCallback: (scope) => {
      switch (scope.row.type) {
        case 0:
          return {
            name: 'problem',
            params: {
              id: scope.row.problemId
            }
          }
        case 1:
          return {
            name: 'work',
            params: {
              id: scope.row.problemId
            }
          }
        default:
          return ''
      }
    }
  },
  {
    name: 'count',
    showName: 'postCount',
    sortable: false
  }
]

const tableData: Ref<PostListInfo[]> = ref([])

const getTable = (tableMeta: { [index: string]: any }) => {
  // show loading page first
  tableData.value = []
  loaded.value = false

  let meta = tableMeta
  // TODO: add problemId, userId, etc.
  useRequestGetFull('/forum/list', meta, (data) => {
    count.value = data.count
    tableData.value = PostListInfo.list(data.result)
    loaded.value = true
  })
}

function flushTableData(tableMeta: { [index: string]: any }) {
  if (route.query.sourceType != undefined) tableMeta.sourceType = route.query.sourceType
  if (route.query.sourceId != undefined) tableMeta.sourceId = route.query.sourceId
  if (route.query.authorId != undefined) tableMeta.authorId = route.query.authorId
  getTable(tableMeta)
}
</script>

<template>
  <BaseView :title="$t('forum')">
    <template v-slot:breadcrumb>
      <ElBreadcrumb :separator-icon="ArrowRight">
        <ElBreadcrumbItem :to="{ path: '/forum' }">
          {{ $t('forum') }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </template>
    <FormTable
      title="post"
      default-order-key="time"
      :default-increase="false"
      :loaded="loaded"
      :count="count"
      :search-meta="searchMeta"
      :column-meta="columnMeta"
      :table-data="tableData"
      @flush-table-data="flushTableData"
    >
      <template #extra>
        <ElButton
          style="margin-top: 12px"
          type="primary"
          :icon="Plus"
          v-if="loginInfo.login"
          @click="$router.push({ name: 'forum-create', query: $route.query })"
          >{{ $t('createSomething', { value: $t('talks') }) }}</ElButton
        >
      </template>
    </FormTable>
  </BaseView>
</template>
