<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import ForgetPasswordMain from '@/components/main/ForgetPasswordMain.vue'
</script>

<template>
  <BaseView inside :title="$t('forgetPassword')">
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/forget-password' }">
          {{ $t('forgetPassword') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <ForgetPasswordMain />
  </BaseView>
</template>
