<script setup lang="ts">
import BaseView from './BaseView.vue'
import HomeMain from '@/components/ProblemsetMain.vue'
</script>

<template>
  <BaseView>
    <template v-slot:breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/problemset' }">
          {{ $t('problemSet') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <HomeMain />
  </BaseView>
</template>
