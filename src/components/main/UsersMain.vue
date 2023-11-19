<script setup lang="ts">
import { type Ref } from 'vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRequestGet } from '@/script/service'
import { t } from 'i18next'
import { characterTranslate, timeIntToString } from '@/script/transform'
import { User as user } from '@element-plus/icons-vue'
import FormTable from '../FormTable.vue'

const loaded = ref(false)
const count = ref(0)

const searchMeta = [
  {
    name: 'username',
    icon: user
  }
]

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

const getTable = (tableMeta: { [index: string]: any }) => {
  // show loading page first
  tableData.value = []
  loaded.value = false
  useRequestGet('/user/list', tableMeta)
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
</script>

<template>
  <FormTable
    title="user"
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
  ></FormTable>
</template>
