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
  ElSkeleton,
  ElTable,
  ElTableColumn
} from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const eachpageCount = 10

const props = defineProps<{
  title: string
  loaded: boolean
  count: number
  searchMeta: {
    name: string
    icon: any
  }[]
  columnMeta: {
    name: string
    sortable: boolean
  }[]
  tableData: any[]
}>()

const currentPage = ref(1)

const start = computed(() => {
  return (currentPage.value - 1) * eachpageCount
})
const end = computed(() => {
  return currentPage.value * eachpageCount
})

let searchData: { [index: string]: any } = {
  order: 'id',
  increase: true
}
for (let i = 0; i < props.searchMeta.length; i++) {
  searchData[`${props.searchMeta[i].name}Keyword`] = ''
}

const tableMeta = reactive(searchData)

const emit = defineEmits(['flushTableData'])

const getTable = () => {
  let Query: { [index: string]: any } = toRaw(tableMeta)
  Query.start = start.value
  Query.end = end.value - 1
  // console.log(Query)
  emit('flushTableData', Query)
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
  router.push(`/${props.title}/${toRaw(row).id}`)
}
</script>

<template>
  <div class="box">
    <ElDescriptions :title="$t('somethingSetting', { value: $t('keyword') })"> </ElDescriptions>
    <ElForm :inline="true" :model="tableMeta">
      <ElFormItem>
        <ElInput
          v-for="meta in searchMeta"
          :key="meta.name"
          v-model="tableMeta[`${meta.name}Keyword`]"
          :placeholder="$t('keywordOfSomething', { value: $t(meta.name) })"
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
        @row-click="rowClick"
      >
        <ElTableColumn
          v-for="column in columnMeta"
          :key="column.name"
          :prop="column.name"
          :label="$t(column.name)"
          :sortable="column.sortable ? 'custom' : false"
        />
      </ElTable>
      <el-pagination
        :page-size="eachpageCount"
        v-model:current-page="currentPage"
        @update:current-page="currentChange"
        layout="prev, pager, next"
        :total="count"
      />
    </div>
  </div>
</template>

<style scoped>
.box {
  margin: 0 auto;
  min-width: 600px;
  max-width: 1200px;
}
</style>