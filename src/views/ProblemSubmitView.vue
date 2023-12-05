<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'
import { useRequestGet } from '@/script/service'
import { ElBreadcrumb, ElBreadcrumbItem, ElMessage } from 'element-plus'
import { t } from 'i18next'
import SubmitCode from '@/components/SubmitCode.vue'
const route = useRoute()
const loaded = ref(false)
const title = ref('')
const preferences = usePreferencesStore()
useRequestGet('/problem/info', { id: route.params.id, evaluation: preferences.evaluation })
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
  <BaseView :title="$t('submit')">
    <template v-slot:breadcrumb>
      <ElBreadcrumb :separator-icon="ArrowRight" v-if="loaded">
        <ElBreadcrumbItem :to="{ path: '/problemset' }">
          {{ $t('problemSet') }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem :to="{ path: `/problem/${$route.params.id}` }">
          {{ title }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem :to="{ path: `/problem/${$route.params.id}/submit` }">
          {{ $t('submit') }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </template>
    <div class="box">
      <SubmitCode :type="0" :problem-id="$route.params.id" />
    </div>
  </BaseView>
</template>

<style scoped>
.box {
  margin: 0 auto;
}
</style>
