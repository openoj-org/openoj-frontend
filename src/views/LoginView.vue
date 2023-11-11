<script setup lang="ts">
import LoginMain from '@/components/main/LoginMain.vue';
import BaseView from './BaseView.vue'
import { ArrowRight } from '@element-plus/icons-vue';
</script>

<template>
  <BaseView inside>
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/login' }">
          {{ $t('login') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <LoginMain/>
  </BaseView>
</template>
