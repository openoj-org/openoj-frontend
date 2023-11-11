<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';
import BaseView from './BaseView.vue'
import HomeMain from '@/components/main/ProblemsetMain.vue'
</script>

<template>
  <BaseView>
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/problemset' }">
          {{ $t('problemSet') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <HomeMain />
  </BaseView>
</template>
