<script setup lang="ts">
import { useLoginInfoStore } from '@/stores/loginInfo'
import { ref } from 'vue'
import DenyDialog from '../DenyDialog.vue'
import { ProblemInfoCreateInput, ProblemInfoCreateQuery } from '@/types/problem'
import { useRequestDangerousAction } from '@/script/service'
import { t } from 'i18next'
import {
  type FormInstance,
  ElButton,
  ElOption,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElUpload,
  ElTabs,
  ElTabPane
} from 'element-plus'
import { MdEditor } from 'md-editor-v3'
import i18next from 'i18next'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, UploadRequestHandler } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginInfo = useLoginInfoStore()
const dialogVisible = ref(false)
dialogVisible.value = !loginInfo.login || loginInfo.character > 1

const problemTypeOptions = [
  {
    label: t('traditionalType'),
    value: 0
  }
]

const activeName = ref('regular')

const formRef = ref<FormInstance>()
const form = ref(new ProblemInfoCreateInput({}))

const dataFile = ref<UploadInstance>()

const dataFileHandleExceed: UploadProps['onExceed'] = (files) => {
  dataFile.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  dataFile.value!.handleStart(file)
}

const regularModeSubmit = () => {
  dataFile.value!.submit()
}

const regularModeCreate: UploadRequestHandler = (options: any) => {
  let query: { [index: string]: any } = new ProblemInfoCreateQuery(form.value)
  query.cookie = loginInfo.cookie
  const formData = new FormData()
  for (const [key, value] of Object.entries(query)) {
    formData.append(key, value.toString())
  }
  formData.append('data', options.file)
  useRequestDangerousAction(
    '/problem/create',
    formData,
    t('createSomething', { value: t('problem') }),
    router,
    '/problemset'
  )
  return {} as any
}

const fileModeFormRef = ref<FormInstance>()
const fileModeForm = ref({ id: 0 })

const problemFile = ref<UploadInstance>()

const problemFileHandleExceed: UploadProps['onExceed'] = (files) => {
  problemFile.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  problemFile.value!.handleStart(file)
}

const fileModeSubmit = () => {
  problemFile.value!.submit()
}

const fileModeCreate: UploadRequestHandler = (options: any) => {
  const formData = new FormData()
  formData.append('cookie', loginInfo.cookie)
  formData.append('id', fileModeForm.value.id.toString())
  formData.append('data', options.file)
  useRequestDangerousAction(
    '/problem/create-by-file',
    formData,
    t('createSomething', { value: t('problem') }),
    router,
    '/problemset'
  )
  return {} as any
}
</script>

<template>
  <DenyDialog :visible="dialogVisible">
    {{ $t('onlyManagerCanCreateProblemHint') }}
  </DenyDialog>
  <div class="box">
    <ElTabs v-model="activeName" type="card">
      <ElTabPane style="margin-top: 20px" :label="$t('problemRegularMode')" name="regular">
        <ElForm :inline="true" ref="formRef" :model="form">
          <ElFormItem :label="$t('id')" prop="id">
            <ElInput type="number" v-model="form.id"></ElInput>
          </ElFormItem>
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
        <h4>{{ $t('problemBackground') }}</h4>
        <MdEditor
          editor-id="background"
          v-model="form.background"
          :language="i18next.language"
        ></MdEditor>
        <h4>{{ $t('problemStatement') }}</h4>
        <MdEditor
          editor-id="statement"
          v-model="form.statement"
          :language="i18next.language"
        ></MdEditor>
        <h4>{{ $t('inputStatement') }}</h4>
        <MdEditor
          editor-id="inputStatement"
          v-model="form.inputStatement"
          :language="i18next.language"
        ></MdEditor>
        <h4>{{ $t('outputStatement') }}</h4>
        <MdEditor
          editor-id="outputStatement"
          v-model="form.outputStatement"
          :language="i18next.language"
        ></MdEditor>
        <h4>{{ $t('rangeAndHint') }}</h4>
        <MdEditor
          editor-id="rangeAndHint"
          v-model="form.rangeAndHint"
          :language="i18next.language"
        ></MdEditor>
        <h4>{{ $t('dataFile') }}</h4>
        <ElUpload
          ref="dataFile"
          :limit="1"
          :on-exceed="dataFileHandleExceed"
          :auto-upload="false"
          :http-request="regularModeCreate"
        >
          <template #trigger>
            <ElButton type="primary">{{ $t('selectFile') }}</ElButton>
          </template>
          <ElButton style="margin-left: 12px" type="danger" :icon="Plus" @click="regularModeSubmit">
            {{ $t('createSomething', { value: $t('problem') }) }}
          </ElButton>
        </ElUpload>
      </ElTabPane>
      <ElTabPane style="margin-top: 20px" :label="$t('problemFileMode')" name="file">
        <ElForm :inline="true" ref="fileModeFormRef" :model="fileModeForm">
          <ElFormItem :label="$t('id')" prop="id">
            <ElInput type="number" v-model="fileModeForm.id"></ElInput>
          </ElFormItem>
        </ElForm>
        <h4>{{ $t('problemFile') }}</h4>
        <ElUpload
          ref="problemFile"
          :limit="1"
          :on-exceed="problemFileHandleExceed"
          :auto-upload="false"
          :http-request="fileModeCreate"
        >
          <template #trigger>
            <ElButton type="primary">{{ $t('selectFile') }}</ElButton>
          </template>
          <ElButton style="margin-left: 12px" type="danger" :icon="Plus" @click="fileModeSubmit">
            {{ $t('createSomething', { value: $t('problem') }) }}
          </ElButton>
        </ElUpload>
      </ElTabPane>
    </ElTabs>
    <ElButton type="primary" text @click="$router.push({ name: 'problem-file-statement' })">{{
      $t('problemFileStatement')
    }}</ElButton>
  </div>
</template>

<style scoped>
.box {
  margin: 0 auto;
}
</style>
@/types/types @/types/problem
