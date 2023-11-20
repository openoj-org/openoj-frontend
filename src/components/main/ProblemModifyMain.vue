<script setup lang="ts">
import { useLoginInfoStore } from '@/stores/loginInfo'
import { reactive, ref, type Ref } from 'vue'
import DenyDialog from '../DenyDialog.vue'
import { ProblemInfoInput } from '@/script/types'
import { useRequestGet } from '@/script/service'
import { useRoute } from 'vue-router'
import { usePreferencesStore } from '@/stores/preferences'
import { t } from 'i18next'
import type { FormInstance, FormRules } from 'element-plus'
import {
  ElOption,
  ElDescriptions,
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect
} from 'element-plus'
import { MdEditor } from 'md-editor-v3'
import i18next from 'i18next'

const route = useRoute()
const loginInfo = useLoginInfoStore()
const preferences = usePreferencesStore()
const dialogVisible = ref(false)
dialogVisible.value = !loginInfo.login || loginInfo.character > 1

const problemTypeOptions = [
  {
    label: t('traditionalType'),
    value: 0
  }
]

const loaded = ref(false)

const formRef = ref<FormInstance>()
const form = ref(new ProblemInfoInput({}))

useRequestGet(
  '/problem/info',
  loginInfo.login
    ? { id: route.params.id, evaluation: preferences.evaluation, cookie: loginInfo.cookie }
    : { id: route.params.id, evaluation: preferences.evaluation }
)
  .then((result) => {
    if (result.data.success == false) {
      ElMessage.error(result.data.message)
    } else {
      form.value = new ProblemInfoInput(result.data)
      loaded.value = true
    }
  })
  .catch((error) => {
    console.log(error)
    ElMessage.error(t('unknownError'))
  })
</script>

<template>
  <DenyDialog :visible="dialogVisible">
    {{ $t('onlyManagerCanModifyProblemHint') }}
  </DenyDialog>
  <div class="box" v-if="loaded">
    <ElForm :inline="true" ref="formRef" :model="form">
      <ElFormItem :label="$t('title')" prop="title">
        <ElInput v-model="form.title"></ElInput>
      </ElFormItem>
      <ElFormItem :label="$t('fileName')" prop="titleEn">
        <ElInput v-model="form.titleEn"></ElInput>
      </ElFormItem>
      <ElFormItem :label="$t('problemType')" prop="type">
        <ElSelect v-model="form.type">
          <ElOption
            v-for="option in problemTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        :label="$t('unitDescription', { value: $t('timeLimit'), unit: 'ms' })"
        prop="timeLimit"
      >
        <ElInput type="number" v-model="form.timeLimit"></ElInput>
      </ElFormItem>
      <ElFormItem
        :label="$t('unitDescription', { value: $t('memoryLimit'), unit: 'MB' })"
        prop="memoryLimit"
      >
        <ElInput type="number" v-model="form.memoryLimit"></ElInput>
      </ElFormItem>
      <ElFormItem :label="$t('source')" prop="source">
        <ElInput v-model="form.source"></ElInput>
      </ElFormItem>
    </ElForm>
    <h3>{{ $t('problemBackground') }}</h3>
    <MdEditor
      editor-id="background"
      v-model="form.background"
      :language="i18next.language"
    ></MdEditor>
    <h3>{{ $t('problemStatement') }}</h3>
    <MdEditor
      editor-id="statement"
      v-model="form.statement"
      :language="i18next.language"
    ></MdEditor>
    <h3>{{ $t('inputStatement') }}</h3>
    <MdEditor
      editor-id="inputStatement"
      v-model="form.inputStatement"
      :language="i18next.language"
    ></MdEditor>
    <h3>{{ $t('outputStatement') }}</h3>
    <MdEditor
      editor-id="outputStatement"
      v-model="form.outputStatement"
      :language="i18next.language"
    ></MdEditor>
    <h3>{{ $t('rangeAndHint') }}</h3>
    <MdEditor
      editor-id="rangeAndHint"
      v-model="form.rangeAndHint"
      :language="i18next.language"
    ></MdEditor>
    <h3>{{ $t('dataFile') }}</h3>
  </div>
</template>

<style scoped>
.box {
  margin: 0 auto;
}
</style>
