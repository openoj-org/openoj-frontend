<script setup lang="ts">
import { ElButton, ElDialog } from 'element-plus'

defineProps<{
  visible: boolean
}>()
</script>

<template>
  <ElDialog :model-value="visible" :title="$t('tips')" width="30%" :show-close="false">
    <span><slot></slot></span>
    <template #footer>
      <span class="dialog-footer">
        <ElButton
          type="primary"
          @click="
            () => {
              $router.push('/')
            }
          "
        >
          {{ $t('confirm') }}
        </ElButton>
      </span>
    </template>
  </ElDialog>
</template>
