<script setup lang="ts">
import BaseView from './BaseView.vue'
import SubmissionsMain from '@/components/SubmissionsMain.vue'
</script>

<template>
  <BaseView>
    <template v-slot:breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/submissions' }">
          {{ $t('submissions') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <SubmissionsMain />
  </BaseView>
</template>
