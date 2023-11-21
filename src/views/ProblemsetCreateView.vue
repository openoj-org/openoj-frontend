<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import ProblemsetCreateMain from '@/components/main/ProblemsetCreateMain.vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
</script>

<template>
  <BaseView :title="$t('createSomething', { value: $t('problem') })">
    <template v-slot:breadcrumb>
      <ElBreadcrumb :separator-icon="ArrowRight">
        <ElBreadcrumbItem :to="{ path: '/problemset' }">
          {{ $t('problemSet') }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem :to="{ path: `/problemset/create` }">
          {{ $t('createSomething', { value: $t('problem') }) }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </template>
    <ProblemsetCreateMain />
  </BaseView>
</template>
