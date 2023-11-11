<script setup lang="ts">
import { ref } from 'vue'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { useRoute } from 'vue-router'
const loginInfo = useLoginInfoStore()
const route = useRoute()
const dialogVisible = ref(false)
console.log(loginInfo.id)
console.log(route.params.id)
dialogVisible.value = loginInfo.login && loginInfo.id != route.params.id


</script>

<template>
  <el-dialog v-model="dialogVisible" :title="$t('tips')" width="30%" :show-close="false">
    <span>{{ $t('onlyModifyYourProfileHint') }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="
            () => {
              dialogVisible = false
              $router.push('/')
            }
          "
        >
          {{ $t('confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="box">
    <!-- <el-skeleton :rows="5" animated v-if="!loaded" /> -->
  </div>
</template>

<style scoped>
.box {
  margin: 0 auto;
  min-width: 600px;
  max-width: 1200px;
}
</style>
