<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';
import BaseView from './BaseView.vue'
import UsersMain from '@/components/main/UsersMain.vue'
</script>

<template>
  <BaseView>
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/users' }">
          {{ $t('users') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <UsersMain />
  </BaseView>
</template>
