<script setup lang="ts">
import BaseView from './BaseView.vue'
import UsersMain from '@/components/main/UsersMain.vue'
</script>

<template>
  <BaseView>
    <template v-slot:breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/users' }">
          {{ $t('users') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <UsersMain />
  </BaseView>
</template>
