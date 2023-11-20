<script setup lang="ts">
import { useRequestGet, useRequestPost } from '@/script/service'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { ElInput, ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { t } from 'i18next'
import { nextTick, reactive, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import sha512 from 'crypto-js/sha512'
import DenyDialog from '../DenyDialog.vue'

const router = useRouter()
const loginInfo = useLoginInfoStore()
const dialogVisible = ref(false)
dialogVisible.value = !loginInfo.login || loginInfo.character > 0
const loaded = ref(false)
const allow = ref(false)
const haveList = ref(false)
const suffixList: Ref<string[]> = ref([])
const dynamicTags: Ref<string[]> = ref([])
const haveListSwitch = ref(false)

if (loginInfo.login && loginInfo.character == 0) {
  useRequestGet('/user/get-allow-register', {})
    .then((result) => {
      allow.value = result.data.allow
      useRequestGet('/user/mail-suffix-list', {})
        .then((result) => {
          haveList.value = result.data.haveList
          haveListSwitch.value = result.data.haveList
          suffixList.value = result.data.suffixList
          dynamicTags.value = result.data.suffixList
          loaded.value = true
        })
        .catch((error) => {
          console.log(error)
          ElMessage.error(t('unknownError'))
        })
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
    })
}

function allowRegisterSet(allow: boolean) {
  ElMessageBox.confirm(
    t('dangerousAction', {
      value: t(allow ? 'setToSomething' : 'setNotSomething', { value: t('allowRegister') })
    }),
    t('warning'),
    {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning'
    }
  )
    .then(() => {
      useRequestPost('/user/allow-register', {
        cookie: loginInfo.cookie,
        allow: allow
      })
        .then((result) => {
          if (result.data.success) {
            ElMessage.success(
              t('somethingSuccess', {
                value: t(allow ? 'setToSomething' : 'setNotSomething', {
                  value: t('allowRegister')
                })
              })
            )
            router.push('/')
          } else ElMessage.error(result.data.message)
        })
        .catch((error) => {
          console.log(error)
          ElMessage.error(t('unknownError'))
        })
    })
    .catch(() => {
      ElMessage.info(t('cancel'))
    })
}
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

function mailSuffixLimitSet(newHaveList: boolean, newSuffixList?: string[]) {
  ElMessageBox.confirm(
    t('dangerousAction', {
      value: t('modifySomething', { value: t('mailSuffixLimit') })
    }),
    t('warning'),
    {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning'
    }
  )
    .then(() => {
      useRequestPost(
        '/user/set-mail-suffix-list',
        newHaveList
          ? {
              cookie: loginInfo.cookie,
              haveList: newHaveList
            }
          : {
              cookie: loginInfo.cookie,
              haveList: newHaveList,
              suffixList: newSuffixList
            }
      )
        .then((result) => {
          if (result.data.success) {
            ElMessage.success(
              t('somethingSuccess', {
                value: t('modifySomething', { value: t('mailSuffixLimit') })
              })
            )
            router.push('/')
          } else ElMessage.error(result.data.message)
        })
        .catch((error) => {
          console.log(error)
          ElMessage.error(t('unknownError'))
        })
    })
    .catch(() => {
      ElMessage.info(t('cancel'))
    })
}

const formRef = ref<FormInstance>()

const form = reactive({
  usernamePrefix: '',
  password: '',
  repeatPassword: '',
  count: 0
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
const rules = reactive<FormRules<typeof form>>({
  usernamePrefix: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('usernamePrefix') }),
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
  ],
  count: [
    {
      required: true,
      message: t('canNotBeEmpty', { value: t('count') }),
      trigger: 'blur'
    }
  ]
})

async function batchRegister(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessageBox.confirm(t('dangerousAction', { value: t('batchRegister') }), t('warning'), {
        confirmButtonText: t('confirm'),
        cancelButtonText: t('cancel'),
        type: 'warning'
      })
        .then(() => {
          const passwordCode = sha512(form.password).toString()
          useRequestPost('/user/generate-user', {
            cookie: loginInfo.cookie,
            usernamePrefix: form.usernamePrefix,
            passwordCode: passwordCode,
            count: form.count
          })
            .then((result) => {
              if (result.data.success == false) {
                ElMessage.error(result.data.message)
              } else {
                ElMessage.success(t('somethingSuccess', { value: t('batchRegister') }))
                router.push('/')
              }
            })
            .catch((error) => {
              console.log(error)
              ElMessage.error(t('unknownError'))
            })
        })
        .catch(() => {
          ElMessage.info(t('cancel'))
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<template>
  <DenyDialog :visible="dialogVisible">
    {{ $t('onlyRootCanManageInstanceHint') }}
  </DenyDialog>
  <div class="box">
    <el-skeleton :rows="5" animated v-if="!loaded" />
    <div v-else>
      <el-descriptions :title="$t('instanceInfo')">
        <el-descriptions-item :label="$t('allowRegister')">{{
          allow ? $t('yes') : t('no')
        }}</el-descriptions-item>
        <el-descriptions-item :label="$t('mailSuffixLimit')">{{
          haveList ? $t('yes') : t('no')
        }}</el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <el-descriptions :title="$t('somethingSetting', { value: $t('allowRegister') })">
      </el-descriptions>
      <el-button type="danger" v-if="!allow" @click="allowRegisterSet(true)">
        {{ $t('setToSomething', { value: $t('allowRegister') }) }}
      </el-button>
      <el-button type="danger" v-else @click="allowRegisterSet(false)">
        {{ $t('setNotSomething', { value: $t('allowRegister') }) }}
      </el-button>
      <el-divider />
      <el-descriptions :title="$t('somethingSetting', { value: $t('mailSuffixLimit') })">
      </el-descriptions>
      <div style="margin-bottom: 6px">
        <el-text>{{ $t('somethingSwitch', { value: $t('mailSuffixLimit') }) }}</el-text>
        <el-switch v-model="haveListSwitch" style="margin-left: 12px" />
      </div>
      <div v-if="haveListSwitch">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          style="margin-right: 12px; margin-bottom: 12px"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
          style="margin-right: 12px; width: 64px; margin-bottom: 12px"
        />
        <el-button
          v-else
          size="small"
          @click="showInput"
          style="margin-right: 12px; margin-bottom: 12px"
        >
          + {{ t('mailSuffix') }}
        </el-button>
      </div>
      <div>
        <el-button type="danger" @click="mailSuffixLimitSet(haveListSwitch, dynamicTags)">{{
          $t('modifySomething', { value: $t('mailSuffixLimit') })
        }}</el-button>
      </div>
      <el-divider />
      <el-descriptions :title="$t('batchRegister')"> </el-descriptions>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('usernamePrefix')" prop="usernamePrefix">
          <el-input type="username" v-model="form.usernamePrefix"></el-input>
        </el-form-item>
        <el-form-item :label="$t('password')" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('repeatPassword')" prop="repeatPassword">
          <el-input type="password" v-model="form.repeatPassword"></el-input>
        </el-form-item>
        <el-form-item :label="$t('count')" prop="count">
          <el-input type="number" v-model="form.count"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="batchRegister(formRef)">{{
            $t('batchRegister')
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.box {
  margin: 0 auto;
  width: 500px;
}
</style>
