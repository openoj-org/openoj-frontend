<template>
  <DenyDialog :visible="dialogVisible">
    {{ $t('notAllowedRegisterHint') }}
  </DenyDialog>
  <div class="form-box">
    <el-skeleton :rows="5" animated v-if="!loaded" />
    <div v-if="loaded && allow">
      <el-form ref="mailFormRef" :model="mailForm" :rules="mailRules" label-width="120px">
        <el-form-item :label="$t('mail')" prop="mail">
          <el-input type="email" v-model="mailForm.mail">
            <template #append v-if="loaded && allow && haveList">
              <el-select
                v-model="mailForm.mailSuffix"
                style="width: 150px"
                :placeholder="$t('chooseSuffix')"
              >
                <el-option v-for="suffix in suffixList" :key="suffix" :value="'@' + suffix" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('passcode')" class="flex-box" prop="passcode">
          <el-input v-model="form.passcode" class="flex-item"> </el-input>
          <el-button type="primary" style="margin-left: 12px" @click="sendPasscode(mailFormRef)">{{
            $t('sendPasscode')
          }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('username')" prop="username">
          <el-input type="username" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item :label="$t('password')" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('repeatPassword')" prop="repeatPassword">
          <el-input type="password" v-model="form.repeatPassword"></el-input>
        </el-form-item>
        <el-form-item :label="$t('signature')" prop="signature">
          <el-input type="textarea" v-model="form.signature"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit(formRef)">{{ $t('submit') }}</el-button>
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
import { useRequestGet, useRequestPost } from '@/script/service'
import { ElMessage } from 'element-plus'
import { t } from 'i18next'
import type { FormInstance, FormRules } from 'element-plus'
import sha512 from 'crypto-js/sha512'
import { useRouter } from 'vue-router'
import { useSetItem } from '@/stores/local'
import { useLoginInfoStore } from '@/stores/loginInfo'
import DenyDialog from '../DenyDialog.vue'

const router = useRouter()
const loginInfo = useLoginInfoStore()

const mailFormRef = ref<FormInstance>()
const formRef = ref<FormInstance>()

const mailForm = reactive({
  mail: '',
  mailSuffix: ''
})

const form = reactive({
  passcode: '',
  username: '',
  password: '',
  repeatPassword: '',
  signature: ''
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
  username: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('username') }),
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('password') }),
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
      message: t('canNotBeEmpty', { value: t('repeatPassword') }),
      trigger: 'blur'
    },
    {
      validator: checkRepeatPassword,
      trigger: 'blur'
    }
  ]
})

const loaded = ref(false)
const allow = ref(false)
const haveList = ref(false)
const suffixList = ref([])
const dialogVisible = ref(false)

let sessionId1 = '',
  sessionId2 = ''

useRequestGet('/user/get-allow-register', {})
  .then((result) => {
    allow.value = result.data.allow
    if (allow.value == false) {
      loaded.value = true
      dialogVisible.value = true
    } else {
      useRequestGet('/user/mail-suffix-list', {})
        .then((result) => {
          haveList.value = result.data.haveList
          if (haveList.value) {
            suffixList.value = result.data.suffixList
            mailForm.mailSuffix = '@' + suffixList.value[0]
          }
          loaded.value = true
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

async function sendPasscode(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const address = mailForm.mail + (haveList.value ? mailForm.mailSuffix : '')
      useRequestPost('/user/prepare-mail-code', { address: address, scene: 0 })
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

async function submit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      useRequestPost('/verify-mail-code', { sessionId: sessionId1, code: form.passcode })
        .then((result) => {
          if (result.data.success == false) {
            ElMessage.error(result.data.message)
          } else {
            sessionId2 = result.data.sessionId
            const username = form.username
            const passwordHash = sha512(form.password).toString()
            useRequestPost('/user/register', {
              sessionId: sessionId2,
              username: username,
              passwordCode: passwordHash,
              signature: form.signature
            })
              .then((result) => {
                if (result.data.success == false) {
                  ElMessage.error(result.data.message)
                } else {
                  ElMessage.success(t('somethingSuccess', { value: t('register') }))
                  useSetItem('login', 'true')
                  useSetItem('username', username)
                  useSetItem('character', '3')
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
