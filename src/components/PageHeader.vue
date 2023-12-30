<script setup lang="ts">
import global from '@/assets/global.json'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import {
  ArrowDown,
  ChatLineRound,
  Cpu,
  Document,
  EditPen,
  MagicStick,
  Search,
  Setting,
  SwitchButton,
  User
} from '@element-plus/icons-vue'
import { useRequestPostFull } from '@/script/service'
import {
  ElButton,
  ElCol,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElMessage,
  ElPageHeader,
  ElRow
} from 'element-plus'
import { t } from 'i18next'
import { useLoginInfoStore } from '@/stores/loginInfo'
const router = useRouter()
const loginInfo = useLoginInfoStore()

const loaded = ref(false)
loaded.value = true

const toMain = () => {
  router.push('/')
}
const searchContent = ref('')

function logout() {
  useRequestPostFull('/user/logout', { cookie: loginInfo.cookie }, () => {
    ElMessage.success(t('somethingSuccess', { value: t('logout') }))
    loginInfo.setLogout()
    router.push('/')
  })
}
</script>

<template>
  <ElPageHeader id="pageheader" @back="toMain" icon="ChromeFilled">
    <template #title>
      <h1>
        {{ global.ojName }}
      </h1>
    </template>
    <template #content>
      <slot></slot>
    </template>
    <template #extra>
      <div v-if="loaded && loginInfo.login">
        <ElDropdown>
          <ElButton text type="primary">
            <ElIcon class="el-icon--left"><User /></ElIcon>
            {{ loginInfo.username }}
            <ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem @click="$router.push(`/user/${loginInfo.id}`)"
                ><ElIcon class="el-icon--left"><Document /></ElIcon
                >{{ $t('myProfile') }}</ElDropdownItem
              >
              <ElDropdownItem
                divided
                @click="$router.push({ name: 'workshop', query: { authorId: loginInfo.id } })"
                ><ElIcon class="el-icon--left"><MagicStick /></ElIcon
                >{{ $t('myWorkshop') }}</ElDropdownItem
              >
              <ElDropdownItem
                @click="$router.push({ name: 'submissions', query: { userId: loginInfo.id } })"
                ><ElIcon class="el-icon--left"><Cpu /></ElIcon
                >{{ $t('mySubmission') }}</ElDropdownItem
              >
              <ElDropdownItem
                @click="$router.push({ name: 'forum', query: { authorId: loginInfo.id } })"
                ><ElIcon class="el-icon--left"><ChatLineRound /></ElIcon
                >{{ $t('myDiscussion') }}</ElDropdownItem
              >
              <ElDropdownItem divided @click="$router.push('/user/modify')">
                <ElIcon class="el-icon--left"><EditPen /></ElIcon>
                {{ $t('modifyPersonalProfile') }}
              </ElDropdownItem>
              <ElDropdownItem
                v-if="loginInfo.character == 0"
                @click="$router.push('/instance-settings')"
              >
                <ElIcon class="el-icon--left"><Setting /></ElIcon>
                {{ $t('instanceSettings') }}
              </ElDropdownItem>
              <ElDropdownItem divided @click="logout"
                ><ElIcon class="el-icon--left"><SwitchButton /></ElIcon
                >{{ $t('logout') }}</ElDropdownItem
              >
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
      <div v-else-if="loaded && !loginInfo.login">
        <ElButton @click="$router.push('/login')">
          {{ $t('login') }}
        </ElButton>
        <ElButton type="primary" @click="$router.push('/register')">
          {{ $t('register') }}
        </ElButton>
      </div>
    </template>
  </ElPageHeader>
</template>

<style scoped>
#pageheader {
  margin: 0 auto;
  min-width: 20cm;
  max-width: 35cm;
}
</style>
