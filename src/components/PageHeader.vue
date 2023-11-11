<script setup lang="ts">
import { useGetItem, useSetItem } from '@/stores/local'
import global from '@/assets/global.json'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Document, Search, SwitchButton } from '@element-plus/icons-vue'
import { useRequestPost } from '@/script/service'
import { ElMessage } from 'element-plus'
import { t } from 'i18next'
import { useLoginInfoStore } from '@/stores/loginInfo'
const router = useRouter()
const loginInfo = useLoginInfoStore()

const loaded = ref(false)
loginInfo.flush()
loaded.value = true

const toMain = () => {
  router.push('/')
}
const searchContent = ref('')

function logout() {
  useRequestPost('/user/logout', { cookie: useGetItem('cookie') })
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        ElMessage.success(t('somethingSuccess', { value: t('logout') }))
        useSetItem('login', null)
        useSetItem('username', null)
        useSetItem('character', null)
        useSetItem('id', null)
        useSetItem('cookie', null)
        loginInfo.flush()
        router.push('/')
      }
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error(t('unknownError'))
    })
}
</script>

<template>
  <el-page-header id="pageheader" @back="toMain" icon="ChromeFilled">
    <template #title>
      <h1>
        {{ global.ojName }}
      </h1>
    </template>
    <template #content>
      <slot></slot>
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: './page-header.html' }"> homepage </el-breadcrumb-item>
        <el-breadcrumb-item><a href="./page-header.html">route 1</a></el-breadcrumb-item>
        <el-breadcrumb-item>route 2</el-breadcrumb-item>
      </el-breadcrumb> -->
    </template>
    <template #extra>
      <el-row :gutter="12" justify="space-evenly">
        <el-col :span="12">
          <el-input v-model="searchContent" :placeholder="$t('searchHint')">
            <template #append>
              <el-button :icon="Search" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="9" v-if="loaded && loginInfo.login">
          <div>
            <el-dropdown>
              <el-button text type="primary">
                <el-icon class="el-icon--left"><User /></el-icon>
                {{ loginInfo.username }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push(`/user/${loginInfo.id}`)"
                    ><el-icon class="el-icon--left"><Document /></el-icon
                    >{{ $t('myProfile') }}</el-dropdown-item
                  >
                  <el-dropdown-item divided
                    ><el-icon class="el-icon--left"><MagicStick /></el-icon
                    >{{ $t('myWorkshop') }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    ><el-icon class="el-icon--left"><Cpu /></el-icon
                    >{{ $t('mySubmission') }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    ><el-icon class="el-icon--left"><ChatLineRound /></el-icon
                    >{{ $t('myDiscussion') }}</el-dropdown-item
                  >
                  <el-dropdown-item divided @click="$router.push('/user/modify')">
                    <el-icon class="el-icon--left"><EditPen /></el-icon>
                    {{ $t('modifyPersonalProfile') }}
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="logout"
                    ><el-icon class="el-icon--left"><SwitchButton /></el-icon
                    >{{ $t('logout') }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-col>
        <el-col :span="12" v-else-if="loaded && !loginInfo.login">
          <div>
            <el-button @click="$router.push('/login')">
              {{ $t('login') }}
            </el-button>
            <el-button type="primary" @click="$router.push('/register')">
              {{ $t('register') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </template>
  </el-page-header>
</template>

<style scoped>
#pageheader {
  margin: 0 auto;
  min-width: 20cm;
  max-width: 35cm;
}
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
