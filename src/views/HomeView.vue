<script setup lang="ts">
import BaseView from './BaseView.vue'
import HomeMain from '@/components/main/HomeMain.vue'
</script>

<template>
  <BaseView :title="$t('homepage')">
    <HomeMain />
  </BaseView>
</template>
