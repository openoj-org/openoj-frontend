<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import WorkshopMain from '@/components/main/WorkshopMain.vue'
</script>

<template>
  <BaseView :title="$t('workshop')">
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/workshop' }">
          {{ $t('workshop') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <WorkshopMain />
  </BaseView>
</template>
