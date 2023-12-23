<template>
  <div class="form-box">
    <div>
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
        <ElFormItem :label="$t('usernameOrMail')" prop="usernameOrMail">
          <ElInput type="username" v-model="form.usernameOrMail"></ElInput>
        </ElFormItem>
        <ElFormItem :label="$t('password')" prop="password">
          <ElInput type="password" v-model="form.password"></ElInput>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="login(formRef)">{{ $t('login') }}</ElButton>
          <ElButton type="primary" text @click="$router.push('/forget-password')">{{
            $t('forgetPassword')
          }}</ElButton>
        </ElFormItem>
      </ElForm>
      <div class="text-center">
        <ElText>
          {{ global.ojName + '·' + $t('slogan') }}
        </ElText>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import global from '@/assets/global.json'
import { ref, reactive } from 'vue'
import { useRequestPost } from '@/script/service'
import { ElText, ElButton, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
import { t } from 'i18next'
import type { FormInstance, FormRules } from 'element-plus'
import sha512 from 'crypto-js/sha512'
import { useRouter } from 'vue-router'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { LoginInfo } from '@/types/user'

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
      // TODO: clean all useRequestPost
      useRequestPost('/user/login', {
        usernameOrMail: form.usernameOrMail,
        passwordCode: passwordHash
      })
        .then((result) => {
          if (result.data.success == false) {
            ElMessage.error(result.data.message)
          } else {
            ElMessage.success(t('somethingSuccess', { value: t('login') }))
            loginInfo.setLogin(new LoginInfo(result.data))
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
