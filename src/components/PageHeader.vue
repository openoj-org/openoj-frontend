<script setup lang="ts">
import { useGetItem } from '@/stores/local'
import global from '@/assets/global.json'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { Document, Search, SwitchButton } from '@element-plus/icons-vue'
const router = useRouter()
const toMain = () => {
  router.push('/')
}
const isLoggedIn = computed(() => {
  return useGetItem('login') == 'true'
})
const myUsername = computed(() => {
  if (isLoggedIn.value) return useGetItem('username')
  return ''
})
const searchContent = ref('')
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
        <el-col :span="9" v-if="isLoggedIn">
          <div>
            <el-dropdown>
              <el-button text type="primary">
                <el-icon class="el-icon--left"><User /></el-icon>
                {{ myUsername }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
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
                  <el-dropdown-item divided
                    ><el-icon class="el-icon--left"><SwitchButton /></el-icon
                    >{{ $t('logout') }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-col>
        <el-col :span="9" v-else>
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