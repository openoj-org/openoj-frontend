<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import MenuBar from '@/components/MenuBar.vue'
</script>

<template>
  <el-container>
    <el-header>
      <PageHeader>
        <slot name="breadcrumb"></slot>
      </PageHeader>
    </el-header>
    <el-divider id="divider" />
    <el-container>
      <MenuBar />
      <div>
        <slot></slot>
      </div>
    </el-container>
  </el-container>
</template>

<style scoped>
#divider {
  margin: 0 auto;
}
</style>
