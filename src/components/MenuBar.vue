<script setup lang="ts">
import {
  ChatLineRound,
  Collection,
  Cpu,
  Expand,
  Fold,
  MagicStick,
  User
} from '@element-plus/icons-vue'
import { usePreferencesStore } from '@/stores/preferences'
import { ElIcon, ElMenu, ElMenuItem } from 'element-plus'

const preferences = usePreferencesStore()
function switchCollapse() {
  preferences.flip()
}
</script>

<template>
  <div>
    <ElMenu router id="main-menu" class="menu-bar" :collapse="preferences.menuCollapse">
      <ElMenuItem index="/problemset">
        <ElIcon><Collection /></ElIcon>
        <template #title>{{ $t('problemSet') }}</template>
      </ElMenuItem>
      <ElMenuItem index="/workshop">
        <ElIcon><MagicStick /></ElIcon>
        <template #title>{{ $t('workshop') }}</template>
      </ElMenuItem>
      <ElMenuItem index="/submissions">
        <ElIcon><Cpu /></ElIcon>
        <template #title>{{ $t('submissions') }}</template>
      </ElMenuItem>
      <ElMenuItem index="/users">
        <ElIcon><User /></ElIcon>
        <template #title>{{ $t('users') }}</template>
      </ElMenuItem>
      <ElMenuItem index="/forum">
        <ElIcon><ChatLineRound /></ElIcon>
        <template #title>{{ $t('forum') }}</template>
      </ElMenuItem>
    </ElMenu>
    <ElMenu id="extra-menu" class="menu-bar no-highlight" :collapse="preferences.menuCollapse">
      <ElMenuItem index="1" @click="switchCollapse">
        <ElIcon>
          <Expand v-if="preferences.menuCollapse" />
          <Fold v-else />
        </ElIcon>
        <template #title>{{
          preferences.menuCollapse ? $t('menuExpand') : $t('menuCollapse')
        }}</template>
      </ElMenuItem>
    </ElMenu>
  </div>
</template>

<style>
.menu-bar:not(.el-menu--collapse) {
  width: 200px;
}
.no-highlight > .el-menu-item.is-active {
  color: var(--el-menu-text-color);
}
#main-menu {
  height: calc(100vh - 121.8px);
}
#extra-menu {
  height: 60px;
}
</style>
