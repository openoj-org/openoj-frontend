<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import WorkshopCreateMain from '@/components/main/WorkshopCreateMain.vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
</script>

<template>
  <BaseView :title="$t('createSomething', { value: $t('problem') })">
    <template v-slot:breadcrumb>
      <ElBreadcrumb :separator-icon="ArrowRight">
        <ElBreadcrumbItem :to="{ path: '/workshop' }">
          {{ $t('workshop') }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem :to="{ path: `/workshop/create` }">
          {{ $t('createSomething', { value: $t('problem') }) }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </template>
    <WorkshopCreateMain />
  </BaseView>
</template>
