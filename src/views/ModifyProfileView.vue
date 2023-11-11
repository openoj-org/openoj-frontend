<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import ModifyProfileMain from '@/components/main/ModifyProfileMain.vue'
</script>

<template>
  <BaseView inside>
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/users' }">
          {{ $t('users') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/user/modify` }">
          {{ $t('modifyPersonalProfile') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <ModifyProfileMain />
  </BaseView>
</template>
