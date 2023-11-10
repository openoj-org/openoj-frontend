<template>
  <div>
    <el-menu router id="main-menu" class="el-menu-vertical-demo" :collapse="isCollapse.collapse">
      <el-menu-item index="/problemset">
        <el-icon><Collection /></el-icon>
        <template #title>{{ $t('problemSet') }}</template>
      </el-menu-item>
      <el-menu-item index="/workshop">
        <el-icon><MagicStick /></el-icon>
        <template #title>{{ $t('workshop') }}</template>
      </el-menu-item>
      <el-menu-item index="/submissions">
        <el-icon><Cpu /></el-icon>
        <template #title>{{ $t('submissions') }}</template>
      </el-menu-item>
      <el-menu-item index="/users">
        <el-icon><User /></el-icon>
        <template #title>{{ $t('users') }}</template>
      </el-menu-item>
      <el-menu-item index="/forum">
        <el-icon><ChatLineRound /></el-icon>
        <template #title>{{ $t('forum') }}</template>
      </el-menu-item> </el-menu
    ><el-menu
      id="extra-menu"
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse.collapse"
      active-text-color="#303133"
    >
      <el-menu-item index="1" @click="switchCollapse">
        <el-icon>
          <Expand v-if="isCollapse.collapse" />
          <Fold v-else />
        </el-icon>
        <template #title>{{
          isCollapse.collapse ? $t('menuExpand') : $t('menuCollapse')
        }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  ChatLineRound,
  Collection,
  Cpu,
  Expand,
  Fold,
  MagicStick,
  User
} from '@element-plus/icons-vue'
import { useMenuCollapseStore } from '@/stores/menuCollapse'

const isCollapse = useMenuCollapseStore()
function switchCollapse() {
  isCollapse.flip()
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
#main-menu {
  height: calc(100vh - 121.8px);
}
#extra-menu {
  height: 60px;
}
</style>
