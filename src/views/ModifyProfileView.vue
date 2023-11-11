<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import ModifyProfileMain from '@/components/main/ModifyProfileMain.vue'
import { ref } from 'vue'
import { useRequestGet } from '@/script/service'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { t } from 'i18next'
const route = useRoute()
const loaded = ref(false)
const username = ref('')
useRequestGet('/user/info', { id: route.params.id })
  .then((result) => {
    if (result.data.success == false) {
      ElMessage.error(result.data.message)
    } else {
      username.value = result.data.username
      loaded.value = true
    }
  })
  .catch((error) => {
    console.log(error)
    ElMessage.error(t('unknownError'))
  })
</script>

<template>
  <BaseView inside>
    <template v-slot:breadcrumb>
      <el-skeleton :rows="1" animated v-if="!loaded"/>
      <el-breadcrumb :separator-icon="ArrowRight" v-else>
        <el-breadcrumb-item :to="{ path: '/users' }">
          {{ $t('users') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/user/${$route.params.id}` }">
          {{ username }}
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/user/${$route.params.id}/modify` }">
          {{ $t('modifyPersonalProfile') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <ModifyProfileMain />
  </BaseView>
</template>
