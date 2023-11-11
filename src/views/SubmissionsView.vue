<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';
import BaseView from './BaseView.vue'
import SubmissionsMain from '@/components/main/SubmissionsMain.vue'
</script>

<template>
  <BaseView>
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/submissions' }">
          {{ $t('submissions') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <SubmissionsMain />
  </BaseView>
</template>
