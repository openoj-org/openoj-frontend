<script setup lang="ts">
import { computed, reactive, toRaw } from 'vue'
import { ref } from 'vue'
import {
  ElButton,
  ElDescriptions,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElOption,
  ElSelect,
  ElSkeleton,
  ElTable,
  ElTableColumn
} from 'element-plus'
import SemiText from './semiText/SemiText.vue'
import type { ColumnMeta } from '@/types/table'
import { useRouter, type RouteLocationRaw } from 'vue-router'

const router = useRouter()

const eachpageCount = 10

const props = defineProps<{
  title: string
  defaultOrderKey?: string
  defaultIncrease?: boolean
  loaded: boolean
  count: number
  searchMeta: {
    name: string
    showName?: string
    icon: any
    type?: string
    options?: {
      value: string
      label: string
    }[]
  }[]
  columnMeta: ColumnMeta[]
  tableData: any[]
  linkCallback?: (row: any) => RouteLocationRaw
  // TODO: set linkCallback as a necessary value
}>()

const currentPage = ref(1)

const start = computed(() => {
  return (currentPage.value - 1) * eachpageCount
})
const end = computed(() => {
  return currentPage.value * eachpageCount
})

let searchData: { [index: string]: any } = {
  order: props.defaultOrderKey ?? 'id',
  increase: props.defaultIncrease ?? true
}
for (let i = 0; i < props.searchMeta.length; i++) {
  if (props.searchMeta[i].type == 'select') searchData[props.searchMeta[i].name] = ''
  else searchData[`${props.searchMeta[i].name}Keyword`] = ''
}

const tableMeta = reactive(searchData)

const emit = defineEmits(['flushTableData'])

const getTable = () => {
  let query: { [index: string]: any } = toRaw(tableMeta)
  query.start = start.value
  query.end = end.value - 1
  emit('flushTableData', query)
}

getTable()

function currentChange() {
  getTable()
}

function sortChange(arg: any) {
  if (arg.order == 'ascending') {
    tableMeta.order = arg.prop
    tableMeta.increase = true
    getTable()
  } else if (arg.order == 'descending') {
    tableMeta.order = arg.prop
    tableMeta.increase = false
    getTable()
  }
}

function rowClick(row: any) {
  if (props.linkCallback) router.push(props.linkCallback(toRaw(row)))
}
</script>

<template>
  <div class="box">
    <ElDescriptions :title="$t('somethingSetting', { value: $t('keyword') })"> </ElDescriptions>
    <ElForm :inline="true" :model="tableMeta">
      <ElFormItem
        v-for="meta in searchMeta"
        :key="meta.name"
        style="margin-left: 0; margin-right: 12px"
      >
        <ElSelect
          clearable
          v-model="tableMeta[meta.name]"
          :placeholder="$t(meta.showName ?? meta.name)"
          v-if="meta.type == 'select'"
        >
          <template #prefix>
            <ElIcon><component :is="meta.icon" /></ElIcon>
          </template>
          <ElOption
            v-for="item in meta.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </ElOption>
        </ElSelect>
        <ElInput
          v-model="tableMeta[`${meta.name}Keyword`]"
          :placeholder="$t('keywordOfSomething', { value: $t(meta.showName ?? meta.name) })"
          v-else
        >
          <template #prefix>
            <ElIcon class="el-input__icon"><component :is="meta.icon" /></ElIcon>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" :disabled="!loaded" @click="getTable">{{ $t('search') }}</ElButton>
      </ElFormItem>
    </ElForm>
    <el-skeleton :rows="5" animated v-if="!loaded" />
    <div v-show="loaded">
      <ElTable
        :data="tableData"
        style="width: 100%"
        @sort-change="sortChange"
        table-layout="auto"
        @row-click="rowClick"
      >
        <ElTableColumn
          v-for="column in columnMeta"
          :key="column.name"
          :prop="column.name"
          :label="$t(column.showName == undefined ? column.name : column.showName)"
          :sortable="column.sortable ? 'custom' : false"
        >
          <template #default="scope">
            <SemiText
              :type="column.type"
              :value="scope.row[column.name]"
              :link="
                column.type == 'link'
                  ? column.linkbody == undefined
                    ? column.linkCallback == undefined
                      ? `/${props.title}/${scope.row.id}`
                      : column.linkCallback(scope)
                    : `/${column.linkbody.head}/${scope.row[column.linkbody.idName]}`
                  : undefined
              "
            />
          </template>
        </ElTableColumn>
      </ElTable>
      <el-pagination
        :page-size="eachpageCount"
        v-model:current-page="currentPage"
        @update:current-page="currentChange"
        layout="prev, pager, next"
        :total="count"
      />
    </div>
    <slot name="extra"></slot>
  </div>
</template>

<style scoped>
.box {
  margin: 0 auto;
  min-width: 600px;
  max-width: 1200px;
}
</style>
