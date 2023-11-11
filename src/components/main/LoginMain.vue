<template>
  <div class="form-box">
    <div>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('usernameOrMail')" prop="usernameOrMail">
          <el-input type="username" v-model="form.usernameOrMail"></el-input>
        </el-form-item>
        <el-form-item :label="$t('password')" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login(formRef)">{{ $t('login') }}</el-button>
          <el-button type="primary" text @click="$router.push('/forget-password')">{{
            $t('forgetPassword')
          }}</el-button>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-text>
          {{ global.ojName + '·' + $t('slogan') }}
        </el-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import global from '@/assets/global.json'
import { ref, reactive } from 'vue'
import { useRequestPost } from '@/script/service'
import { ElMessage } from 'element-plus'
import { t } from 'i18next'
import type { FormInstance, FormRules } from 'element-plus'
import sha512 from 'crypto-js/sha512'
import { useRouter } from 'vue-router'
import { useSetItem } from '@/stores/local'
import { useLoginInfoStore } from '@/stores/loginInfo'

const router = useRouter()
const loginInfo = useLoginInfoStore()

const formRef = ref<FormInstance>()

const form = reactive({
  usernameOrMail: '',
  password: ''
})

const rules = reactive<FormRules<typeof form>>({
  usernameOrMail: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('usernameOrMail') }),
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('password') }),
      trigger: 'blur'
    }
  ]
})

async function login(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const passwordHash = sha512(form.password).toString()
      useRequestPost('/user/login', {
        usernameOrMail: form.usernameOrMail,
        passwordCode: passwordHash
      })
        .then((result) => {
          if (result.data.success == false) {
            ElMessage.error(result.data.message)
          } else {
            ElMessage.success(t('somethingSuccess', { value: t('login') }))
            useSetItem('login', 'true')
            useSetItem('username', result.data.username)
            useSetItem('id', result.data.id)
            useSetItem('cookie', result.data.cookie)
            loginInfo.flush()
            router.push('/')
          }
        })
        .catch((error) => {
          console.log(error)
          ElMessage.error(t('unknownError'))
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style scoped>
.form-box {
  margin: 0 auto;
  width: 500px;
}
</style>
