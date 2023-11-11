<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRequestGet } from '@/script/service'
import { useRoute } from 'vue-router'
import { t } from 'i18next'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { characterTranslate, timeIntToString } from '@/script/transform'
const route = useRoute()
const loginInfo = useLoginInfoStore()
const loaded = ref(false)
const userInfo = reactive({
  username: '',
  character: '',
  signature: '',
  registerTime: '',
  pass: 0,
  mail: ''
})

useRequestGet('/user/info', { id: route.params.id })
  .then((result) => {
    if (result.data.success == false) {
      ElMessage.error(result.data.message)
    } else {
      userInfo.username = result.data.username
      userInfo.character = characterTranslate(result.data.character)
      userInfo.signature = result.data.signature
      userInfo.registerTime = timeIntToString(result.data.registerTime)
      userInfo.pass = result.data.pass
      userInfo.mail = result.data.mail
      loaded.value = true
    }
  })
  .catch((error) => {
    console.log(error)
    ElMessage.error(t('unknownError'))
  })
</script>

<template>
  <div class="box">
    <el-skeleton :rows="5" animated v-if="!loaded" />
    <el-descriptions :title="$t('userInfo')" v-if="loaded">
      <el-descriptions-item :label="$t('username')">{{ userInfo.username }}</el-descriptions-item>
      <el-descriptions-item :label="$t('character')">{{ userInfo.character }}</el-descriptions-item>
      <el-descriptions-item :label="$t('mail')">{{ userInfo.mail }}</el-descriptions-item>
      <el-descriptions-item :label="$t('registerTime')">
        {{ userInfo.registerTime }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('problemPassNumber')">{{
        userInfo.pass
      }}</el-descriptions-item>
      <el-descriptions-item :label="$t('signature')">
        {{ userInfo.signature }}
      </el-descriptions-item>
    </el-descriptions>
    <el-button
      type="primary"
      v-if="loaded && loginInfo.login && loginInfo.id == $route.params.id"
      @click="$router.push(`/user/modify`)"
    >
      {{ $t('modifyPersonalProfile') }}
    </el-button>
  </div>
</template>

<style scoped>
.box {
  margin: 0 auto;
  min-width: 600px;
  max-width: 1200px;
}
</style>
