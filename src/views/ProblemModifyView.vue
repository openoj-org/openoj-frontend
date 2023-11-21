<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import ProblemModifyMain from '@/components/main/ProblemModifyMain.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { usePreferencesStore } from '@/stores/preferences'
import { useRequestGet } from '@/script/service'
import { ElBreadcrumb, ElBreadcrumbItem, ElMessage } from 'element-plus'
import { t } from 'i18next'
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
  <BaseView :title="$t('modifySomething', { value: $t('problem') })">
    <template v-slot:breadcrumb>
      <ElBreadcrumb :separator-icon="ArrowRight" v-if="loaded">
        <ElBreadcrumbItem :to="{ path: '/problemset' }">
          {{ $t('problemSet') }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem :to="{ path: `/problem/${$route.params.id}` }">
          {{ title }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem :to="{ path: `/problem/${$route.params.id}/modify` }">
          {{ $t('modifySomething', { value: $t('problem') }) }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </template>
    <ProblemModifyMain />
  </BaseView>
</template>
