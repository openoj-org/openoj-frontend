<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import MenuBar from '@/components/MenuBar.vue'
import global from '@/assets/global.json'
import { watch } from 'vue'
const props = defineProps({
  // true if there should be an extra blank on the top of the main page
  inside: Boolean,
  title: String
})
if (props.title) document.title = `${props.title} | ${global.ojName}`
watch(props, () => {
  if (props.title) document.title = `${props.title} | ${global.ojName}`
})
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
      <el-scrollbar class="main-box">
        <div :class="{ 'main-box-inside': props.inside }">
          <slot></slot>
        </div>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<style scoped>
#divider {
  margin: 0 auto;
}
.main-box {
  width: 100%;
  height: calc(100vh - 101.8px);
  padding: 20px 120px;
}
.main-box-inside {
  width: 100%;
  padding: 40px 0px;
}
</style>
