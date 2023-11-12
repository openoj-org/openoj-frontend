<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import InstanceSettingsMain from '@/components/main/InstanceSettingsMain.vue'
</script>

<template>
  <BaseView :title="$t('instanceSettings')">
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/instance-settings' }">
          {{ $t('instanceSettings') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <InstanceSettingsMain />
  </BaseView>
</template>
