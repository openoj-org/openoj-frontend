<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import ProblemMain from '@/components/main/ProblemMain.vue'
import { ref } from 'vue'
import { useRequestGet } from '@/script/service'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { t } from 'i18next'
import { usePreferencesStore } from '@/stores/preferences'
import { useLoginInfoStore } from '@/stores/loginInfo'
const route = useRoute()
const loaded = ref(false)
const title = ref('')
const loginInfo = useLoginInfoStore()
const preferences = usePreferencesStore()
useRequestGet(
  '/problem/info',
  loginInfo.login
    ? { id: route.params.id, evaluation: preferences.evaluation, cookie: loginInfo.cookie }
    : { id: route.params.id, evaluation: preferences.evaluation }
)
  .then((result) => {
    if (result.data.success == false) {
      ElMessage.error(result.data.message)
    } else {
      title.value = result.data.title
      loaded.value = true
    }
  })
  .catch((error) => {
    console.log(error)
    ElMessage.error(t('unknownError'))
  })
</script>

<template>
  <BaseView :title="title">
    <template v-slot:breadcrumb>
      <el-skeleton :rows="1" animated v-if="!loaded" />
      <el-breadcrumb :separator-icon="ArrowRight" v-else>
        <el-breadcrumb-item :to="{ path: '/problemset' }">
          {{ $t('problemSet') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/problem/${$route.params.id}` }">
          {{ title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <ProblemMain />
  </BaseView>
</template>
