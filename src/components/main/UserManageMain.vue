<script setup lang="ts">
import { useRequestDangerousAction, useRequestGet, useRequestPost } from '@/script/service'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { t } from 'i18next'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { characterTranslate } from '@/script/transform'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import DenyDialog from '../DenyDialog.vue'

const router = useRouter()
const loginInfo = useLoginInfoStore()
const dialogVisible = ref(false)
dialogVisible.value = !loginInfo.login || loginInfo.character > 1

const route = useRoute()
const userInfo = reactive({
  id: '',
  username: '',
  character: 0,
  characterName: ''
})
const loaded = ref(false)

if (loginInfo.login && loginInfo.character <= 1) {
  useRequestGet('/user/info', { id: route.params.id })
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        userInfo.id = route.params.id.toString()
        userInfo.username = result.data.username
        userInfo.character = result.data.character
        userInfo.characterName = characterTranslate(userInfo.character)
        loaded.value = true
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
    })
}

function banUser() {
  useRequestDangerousAction(
    '/user/ban',
    { cookie: loginInfo.cookie, id: userInfo.id },
    t('setToSomething', { value: t('bannedUser') }),
    router,
    `/user/${userInfo.id}`
  )
}

function unbanUser() {
  useRequestDangerousAction(
    '/user/unban',
    { cookie: loginInfo.cookie, id: userInfo.id },
    t('setNotSomething', { value: t('bannedUser') }),
    router,
    `/user/${userInfo.id}`
  )
}

function trustUser() {
  useRequestDangerousAction(
    '/user/trust',
    {
      cookie: loginInfo.cookie,
      id: userInfo.id
    },
    t('setToSomething', { value: t('trustedUser') }),
    router,
    `/user/${userInfo.id}`
  )
}

function untrustUser() {
  useRequestDangerousAction(
    '/user/untrust',
    {
      cookie: loginInfo.cookie,
      id: userInfo.id
    },
    t('setNotSomething', { value: t('trustedUser') }),
    router,
    `/user/${userInfo.id}`
  )
}

function setManager() {
  useRequestDangerousAction(
    '/user/manage',
    {
      cookie: loginInfo.cookie,
      id: userInfo.id
    },
    t('setToSomething', { value: t('manager') }),
    router,
    `/user/${userInfo.id}`
  )
}

function unsetManager() {
  useRequestDangerousAction(
    '/user/unmanage',
    {
      cookie: loginInfo.cookie,
      id: userInfo.id
    },
    t('setNotSomething', { value: t('manager') }),
    router,
    `/user/${userInfo.id}`
  )
}
</script>

<template>
  <DenyDialog :visible="dialogVisible">
    {{ $t('onlyManagerCanManageHint') }}
  </DenyDialog>
  <div class="box">
    <el-skeleton :rows="5" animated v-if="!loaded" />
    <el-descriptions :title="$t('userInfo')" v-if="loaded">
      <el-descriptions-item :label="$t('username')">{{ userInfo.username }}</el-descriptions-item>
      <el-descriptions-item :label="$t('character')">{{
        userInfo.characterName
      }}</el-descriptions-item>
    </el-descriptions>
    <div v-if="loaded && userInfo.character > 1">
      <el-divider />
      <el-descriptions :title="$t('somethingSetting', { value: $t('bannedUser') })">
      </el-descriptions>
      <el-button type="danger" v-if="userInfo.character != 4" @click="banUser()">{{
        $t('setToSomething', { value: $t('bannedUser') })
      }}</el-button>
      <el-button type="danger" v-if="userInfo.character == 4" @click="unbanUser()">{{
        $t('setNotSomething', { value: $t('bannedUser') })
      }}</el-button>
    </div>
    <div v-if="loaded && userInfo.character >= 2 && userInfo.character < 4">
      <el-divider />
      <el-descriptions :title="$t('somethingSetting', { value: $t('trustedUser') })">
      </el-descriptions>
      <el-button type="danger" v-if="userInfo.character == 3" @click="trustUser()">{{
        $t('setToSomething', { value: $t('trustedUser') })
      }}</el-button>
      <el-button type="danger" v-if="userInfo.character == 2" @click="untrustUser()">{{
        $t('setNotSomething', { value: $t('trustedUser') })
      }}</el-button>
    </div>
    <div v-if="loaded && loginInfo.character == 0 && userInfo.character > 0">
      <el-divider />
      <el-descriptions :title="$t('somethingSetting', { value: $t('manager') })"> </el-descriptions>
      <el-button type="danger" v-if="userInfo.character > 1" @click="setManager()">{{
        $t('setToSomething', { value: $t('manager') })
      }}</el-button>
      <el-button type="danger" v-if="userInfo.character == 1" @click="unsetManager()">{{
        $t('setNotSomething', { value: $t('manager') })
      }}</el-button>
    </div>
  </div>
</template>

<style scoped>
.box {
  margin: 0 auto;
  width: 500px;
}
</style>
