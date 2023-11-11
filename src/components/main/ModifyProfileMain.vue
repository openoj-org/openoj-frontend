<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { useRequestGet, useRequestPost } from '@/script/service'
import { ElMessage } from 'element-plus'
import { t } from 'i18next'
import type { FormInstance, FormRules } from 'element-plus'
import { timeDeltaIntToString } from '@/script/transform'
import { useSetItem } from '@/stores/local'
import router from '@/router'
import sha512 from 'crypto-js/sha512'

const loginInfo = useLoginInfoStore()
const dialogVisible = ref(false)
dialogVisible.value = !loginInfo.login

const usernameFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const mailFormRef = ref<FormInstance>()
const passcodeFormRef = ref<FormInstance>()

const loaded = ref(false)

const haveList = ref(false)
const suffixList = ref([])

const form = reactive({
  username: '',
  password: '',
  repeatPassword: '',
  passcode: '',
  mail: '',
  mailSuffix: '',
  signature: ''
})

const remainTime = reactive({
  username: 0,
  mail: 0
})

const usernameRules = reactive<FormRules<typeof form>>({
  username: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('username') }),
      trigger: 'blur'
    }
  ]
})

function checkPassword(rule: any, value: any, callback: any) {
  if (form.repeatPassword != '') {
    // possibly change password to match
    if (passwordFormRef.value) passwordFormRef.value.validateField('repeatPassword', () => null)
  }
  callback()
}

function checkRepeatPassword(rule: any, value: any, callback: any) {
  if (form.password != form.repeatPassword) callback(new Error(t('passwordNotMatch')))
  callback()
}

const passwordRules = reactive<FormRules<typeof form>>({
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

const mailRules = reactive<FormRules<typeof form>>({
  mail: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('mail') }),
      trigger: 'blur'
    }
  ]
})

const passcodeRules = reactive<FormRules<typeof form>>({
  passcode: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('passcode') }),
      trigger: 'blur'
    }
  ]
})

if (loginInfo.login) {
  useRequestGet('/user/info', { id: loginInfo.id })
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        form.username = result.data.username
        form.signature = result.data.signature
        useRequestGet('/user/username-change-time', { cookie: loginInfo.cookie })
          .then((result) => {
            if (result.data.success == false) {
              ElMessage.error(result.data.message)
            } else {
              remainTime.username = result.data.time
              useRequestGet('/user/mail-change-time', { cookie: loginInfo.cookie })
                .then((result) => {
                  if (result.data.success == false) {
                    ElMessage.error(result.data.message)
                  } else {
                    remainTime.mail = result.data.time
                    useRequestGet('/user/mail-suffix-list', {})
                      .then((result) => {
                        haveList.value = result.data.haveList
                        if (haveList.value) {
                          suffixList.value = result.data.suffixList
                          form.mailSuffix = '@' + suffixList.value[0]
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
}

async function changeUsername(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const newUsername = form.username
      useRequestPost('/user/change-username', { cookie: loginInfo.cookie, username: newUsername })
        .then((result) => {
          if (result.data.success == false) {
            ElMessage.error(result.data.message)
          } else {
            ElMessage.success(t('somethingSuccess', { value: t('modify') }))
            useSetItem('username', newUsername)
            loginInfo.flush()
            router.push(`/user/${loginInfo.id}`)
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

async function changePassword(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const passwordHash = sha512(form.password).toString()
      useRequestPost('/user/change-password', {
        cookie: loginInfo.cookie,
        passwordCode: passwordHash
      })
        .then((result) => {
          if (result.data.success == false) {
            ElMessage.error(result.data.message)
          } else {
            ElMessage.success(t('somethingSuccess', { value: t('modify') }))
            router.push(`/user/${loginInfo.id}`)
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

let sessionId1 = '',
  sessionId2 = ''

async function sendPasscode(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const address = form.mail + (haveList.value ? form.mailSuffix : '')
      useRequestPost('/user/prepare-mail-code', { address: address, scene: 1 })
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

async function changeMail(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      useRequestPost('/verify-mail-code', { sessionId: sessionId1, code: form.passcode })
        .then((result) => {
          if (result.data.success == false) {
            ElMessage.error(result.data.message)
          } else {
            sessionId2 = result.data.sessionId
            useRequestPost('/user/change-email', {
              cookie: loginInfo.cookie,
              sessionId: sessionId2
            })
              .then((result) => {
                if (result.data.success == false) {
                  ElMessage.error(result.data.message)
                } else {
                  ElMessage.success(t('somethingSuccess', { value: t('modify') }))
                  router.push(`/user/${loginInfo.id}`)
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

function changeSignature() {
  useRequestPost('/user/change-signature', { cookie: loginInfo.cookie, signature: form.signature })
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        ElMessage.success(t('somethingSuccess', { value: t('modify') }))
        router.push(`/user/${loginInfo.id}`)
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
    })
}
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="$t('tips')" width="30%" :show-close="false">
    <span>{{ $t('notLoginHint') }}</span>
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
  <div class="form-box">
    <el-skeleton :rows="5" animated v-if="!loaded" />
    <div v-if="loaded && loginInfo.login">
      <el-descriptions :title="$t('modifySomething', { value: $t('username') })"> </el-descriptions>
      <el-form ref="usernameFormRef" :model="form" :rules="usernameRules" label-width="120px">
        <el-form-item
          :label="$t('newSomething', { value: $t('username') })"
          class="flex-box"
          prop="username"
        >
          <el-input v-model="form.username" class="flex-item"> </el-input>
          <el-button
            type="primary"
            style="margin-left: 12px"
            :disabled="remainTime.username > 0"
            @click="changeUsername(usernameFormRef)"
            >{{ $t('modify') }}</el-button
          >
          <el-text v-if="remainTime.username > 0">{{
            $t('remainModifyTime', { value: timeDeltaIntToString(remainTime.username) })
          }}</el-text>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-descriptions :title="$t('modifySomething', { value: $t('password') })"> </el-descriptions>
      <el-form ref="passwordFormRef" :model="form" :rules="passwordRules" label-width="120px">
        <el-form-item :label="$t('newPassword')" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('repeatNewPassword')" prop="repeatPassword">
          <el-input type="password" v-model="form.repeatPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword(passwordFormRef)">{{
            $t('modify')
          }}</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-descriptions :title="$t('modifySomething', { value: $t('mail') })"> </el-descriptions>
      <el-form ref="mailFormRef" :model="form" :rules="mailRules" label-width="120px">
        <el-form-item :label="$t('newSomething', { value: $t('mail') })" prop="mail">
          <el-input type="email" v-model="form.mail">
            <template #append v-if="loaded && haveList">
              <el-select
                v-model="form.mailSuffix"
                style="width: 150px"
                :placeholder="$t('chooseSuffix')"
              >
                <el-option v-for="suffix in suffixList" :key="suffix" :value="'@' + suffix" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-form ref="passcodeFormRef" :model="form" :rules="passcodeRules" label-width="120px">
        <el-form-item :label="$t('passcode')" class="flex-box" prop="passcode">
          <el-input v-model="form.passcode" class="flex-item"> </el-input>
          <el-button
            type="primary"
            style="margin-left: 12px"
            @click="sendPasscode(mailFormRef)"
            :disabled="remainTime.mail > 0"
            >{{ $t('sendPasscode') }}</el-button
          >
          <el-text v-if="remainTime.username > 0">{{
            $t('remainModifyTime', { value: timeDeltaIntToString(remainTime.mail) })
          }}</el-text>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="changeMail(passcodeFormRef)"
            :disabled="remainTime.mail > 0"
            >{{ $t('modify') }}</el-button
          >
        </el-form-item>
      </el-form>
      <el-divider />
      <el-descriptions :title="$t('modifySomething', { value: $t('signature') })">
      </el-descriptions>
      <el-form :model="form" label-width="120px">
        <el-form-item :label="$t('signature')" prop="signature">
          <el-input type="textarea" v-model="form.signature"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeSignature()">{{ $t('modify') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

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
