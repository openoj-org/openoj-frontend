<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';
import BaseView from './BaseView.vue'
import ForumMain from '@/components/main/ForumMain.vue'
</script>

<template>
  <BaseView>
    <template v-slot:breadcrumb>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/forum' }">
          {{ $t('forum') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <ForumMain />
  </BaseView>
</template>
