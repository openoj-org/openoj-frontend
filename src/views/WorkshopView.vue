<script setup lang="ts">
import BaseView from './BaseView.vue'
import WorkshopMain from '@/components/WorkshopMain.vue'
</script>

<template>
  <BaseView>
    <template v-slot:breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/workshop' }">
          {{ $t('workshop') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <WorkshopMain />
  </BaseView>
</template>
