<script setup lang="ts">
import { useLoginInfoStore } from '@/stores/loginInfo'
import { ref } from 'vue'
import DenyDialog from '../DenyDialog.vue'

const loginInfo = useLoginInfoStore()
const dialogVisible = ref(false)
dialogVisible.value = !loginInfo.login || loginInfo.character > 1
</script>

<template>
  <DenyDialog :visible="dialogVisible">
    {{ $t('onlyManagerCanModifyProblemHint') }}
  </DenyDialog>
</template>
