<script setup lang="ts">
import { computed, reactive, toRaw, type Ref } from 'vue'
import { ref } from 'vue'
import {
  ElButton,
  ElDescriptions,
  ElForm,
  ElFormItem,
  ElMessage,
  ElSkeleton,
  ElTable,
  ElTableColumn
} from 'element-plus'
import { useRequestGet } from '@/script/service'
import { t } from 'i18next'
import { characterTranslate, timeIntToString } from '@/script/transform'
import type { User as user } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const eachpageCount = 10

const loaded = ref(false)
const currentPage = ref(1)
const count = ref(0)

interface OriginUser {
  id: string
  username: string
  character: number
  signature: string
  registerTime: number
  pass: number
}

interface User {
  id: string
  username: string
  character: string
  signature: string
  registerTime: string
  pass: number
}

const columnMeta = [
  { name: 'id', sortable: true },
  { name: 'username', sortable: true },
  { name: 'character', sortable: true },
  { name: 'signature', sortable: false },
  { name: 'registerTime', sortable: true },
  { name: 'pass', sortable: false }
]

const tableData: Ref<User[]> = ref([])

const start = computed(() => {
  return (currentPage.value - 1) * eachpageCount
})
const end = computed(() => {
  return currentPage.value * eachpageCount
})

const tableMeta = reactive({
  order: 'id',
  increase: true,
  usernameKeyword: '',
  start: start,
  end: end
})

function userInfoTranslate(origin: OriginUser[]) {
  let result: User[] = []
  for (let i = 0; i < origin.length; i++) {
    result.push({
      id: origin[i].id,
      username: origin[i].username,
      character: characterTranslate(origin[i].character),
      signature: origin[i].signature,
      registerTime: timeIntToString(origin[i].registerTime),
      pass: origin[i].pass
    })
  }
  return result
}

const getTable = () => {
  // show loading page first
  tableData.value = []
  loaded.value = false
  useRequestGet('/user/list', toRaw(tableMeta))
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        count.value = result.data.count
        tableData.value = userInfoTranslate(result.data.result)
        loaded.value = true
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
    })
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
  router.push(`/user/${toRaw(row).id}`)
}
</script>

<template>
  <div class="box">
    <ElDescriptions :title="$t('somethingSetting', { value: $t('keyword') })"> </ElDescriptions>
    <ElForm :inline="true" :model="tableMeta">
      <ElFormItem>
        <el-input
          v-model="tableMeta.usernameKeyword"
          :placeholder="$t('keywordOfSomething', { value: $t('username') })"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><user /></el-icon>
          </template>
        </el-input>
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
