<script setup lang="ts">
import RegisterMain from '@/components/main/RegisterMain.vue';
import BaseView from './BaseView.vue'
import { ArrowRight } from '@element-plus/icons-vue';
</script>

<template>
  <BaseView inside>
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/register' }">
          {{ $t('register') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <RegisterMain/>
  </BaseView>
</template>
