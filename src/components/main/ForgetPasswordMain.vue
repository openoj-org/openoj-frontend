<template>
  <div class="form-box">
    <div>
      <el-form ref="mailFormRef" :model="mailForm" :rules="mailRules" label-width="120px">
        <el-form-item :label="$t('mail')" prop="mail">
          <el-input type="email" v-model="mailForm.mail"> </el-input>
        </el-form-item>
      </el-form>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('passcode')" class="flex-box" prop="passcode">
          <el-input v-model="form.passcode" class="flex-item"> </el-input>
          <el-button type="primary" style="margin-left: 12px" @click="sendPasscode(mailFormRef)">{{
            $t('sendPasscode')
          }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('newPassword')" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('repeatNewPassword')" prop="repeatPassword">
          <el-input type="password" v-model="form.repeatPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPassword(formRef)">{{
            $t('resetPassword')
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

const router = useRouter()

const mailFormRef = ref<FormInstance>()
const formRef = ref<FormInstance>()
const mailForm = reactive({
  mail: ''
})
const form = reactive({
  passcode: '',
  password: '',
  repeatPassword: ''
})

function checkPassword(rule: any, value: any, callback: any) {
  if (form.repeatPassword != '') {
    // possibly change password to match
    if (formRef.value) formRef.value.validateField('repeatPassword', () => null)
  }
  callback()
}

function checkRepeatPassword(rule: any, value: any, callback: any) {
  if (form.password != form.repeatPassword) callback(new Error(t('passwordNotMatch')))
  callback()
}

const mailRules = reactive<FormRules<typeof mailForm>>({
  mail: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('mail') }),
      trigger: 'blur'
    }
  ]
})
const rules = reactive<FormRules<typeof form>>({
  passcode: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('passcode') }),
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('newPassword') }),
      trigger: 'blur'
    },
    {
      validator: checkPassword,
      trigger: 'blur'
    }
  ],
  repeatPassword: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('repeatNewPassword') }),
      trigger: 'blur'
    },
    {
      validator: checkRepeatPassword,
      trigger: 'blur'
    }
  ]
})

let sessionId1 = '',
  sessionId2 = ''

async function sendPasscode(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const address = mailForm.mail
      useRequestPost('/user/prepare-mail-code', { address: address, scene: 2 })
        .then((result) => {
          if (result.data.success == false) {
            ElMessage.error(result.data.message)
          } else {
            ElMessage.success(t('somethingSuccess', { value: t('sendPasscode') }))
            sessionId1 = result.data.sessionId
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

async function resetPassword(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      useRequestPost('/verify-mail-code', { sessionId: sessionId1, code: form.passcode })
        .then((result) => {
          if (result.data.success == false) {
            ElMessage.error(result.data.message)
          } else {
            sessionId2 = result.data.sessionId
            const passwordHash = sha512(form.password).toString()
            useRequestPost('/user/reset-password', {
              sessionId: sessionId2,
              passwordCode: passwordHash
            })
              .then((result) => {
                if (result.data.success == false) {
                  ElMessage.error(result.data.message)
                } else {
                  ElMessage.success(t('somethingSuccess', { value: t('resetPassword') }))
                  router.push('/login')
                }
              })
              .catch((error) => {
                console.log(error)
                ElMessage.error(t('unknownError'))
              })
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
.flex-box {
  display: flex;
}
.flex-item {
  width: auto;
  flex-grow: 1;
}
</style>
