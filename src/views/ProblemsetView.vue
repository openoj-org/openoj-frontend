<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import ProblemsetMain from '@/components/main/ProblemsetMain.vue'
</script>

<template>
  <BaseView :title="$t('problemSet')">
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/problemset' }">
          {{ $t('problemSet') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <ProblemsetMain />
  </BaseView>
</template>
