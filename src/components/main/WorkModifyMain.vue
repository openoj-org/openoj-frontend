<script setup lang="ts">
import { useLoginInfoStore } from '@/stores/loginInfo'
import { ref } from 'vue'
import DenyDialog from '../DenyDialog.vue'
import { WorkInfoInput, WorkInfoQuery } from '@/script/types'
import { useRequestGet, useRequestDangerousAction } from '@/script/service'
import { useRoute } from 'vue-router'
import { usePreferencesStore } from '@/stores/preferences'
import { t } from 'i18next'
import {
  type FormInstance,
  ElButton,
  ElOption,
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElDivider,
  ElUpload,
  ElTabs,
  ElTabPane
} from 'element-plus'
import { MdEditor } from 'md-editor-v3'
import i18next from 'i18next'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, UploadRequestHandler } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const route = useRoute()
const loginInfo = useLoginInfoStore()
const preferences = usePreferencesStore()
const dialogVisible = ref(false)

const workTypeOptions = [
  {
    label: t('traditionalType'),
    value: 0
  }
]

const loaded = ref(false)

const activeName = ref('regular')

const formRef = ref<FormInstance>()
const form = ref(new WorkInfoInput({}))

useRequestGet(
  '/workshop/info',
  loginInfo.login
    ? { id: route.params.id, evaluation: preferences.evaluation, cookie: loginInfo.cookie }
    : { id: route.params.id, evaluation: preferences.evaluation }
)
  .then((result) => {
    if (result.data.success == false) {
      ElMessage.error(result.data.message)
    } else {
      dialogVisible.value = !loginInfo.login || loginInfo.id != result.data.userId
      form.value = new WorkInfoInput(result.data)
      loaded.value = true
    }
  })
  .catch((error) => {
    console.log(error)
    ElMessage.error(t('unknownError'))
  })

function changeMeta() {
  let query: { [index: string]: any } = new WorkInfoQuery(form.value)
  query.cookie = loginInfo.cookie
  query.id = route.params.id
  useRequestDangerousAction(
    '/workshop/change-meta',
    query,
    t('modifySomething', { value: t('metaData') })
  )
}

const dataFile = ref<UploadInstance>()

const dataFileHandleExceed: UploadProps['onExceed'] = (files) => {
  dataFile.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  dataFile.value!.handleStart(file)
}

const dataFileSubmit = () => {
  dataFile.value!.submit()
}

const dataFileUpload: UploadRequestHandler = (options: any) => {
  const formData = new FormData()
  formData.append('cookie', loginInfo.cookie)
  formData.append('id', route.params.id as string)
  formData.append('data', options.file)
  useRequestDangerousAction(
    '/workshop/change-data',
    formData,
    t('modifySomething', { value: t('dataFile') })
  )
  return {} as any
}

const workFile = ref<UploadInstance>()

const workFileHandleExceed: UploadProps['onExceed'] = (files) => {
  workFile.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  workFile.value!.handleStart(file)
}

const workFileSubmit = () => {
  workFile.value!.submit()
}

const workFileUpload: UploadRequestHandler = (options: any) => {
  const formData = new FormData()
  formData.append('cookie', loginInfo.cookie)
  formData.append('id', route.params.id as string)
  formData.append('data', options.file)
  useRequestDangerousAction(
    '/work/change-by-file',
    formData,
    t('modifySomething', { value: t('workFile') })
  )
  return {} as any
}
</script>

<template>
  <DenyDialog :visible="dialogVisible">
    {{ $t('onlyAuthorCanModifyProblemHint') }}
  </DenyDialog>
  <div class="box" v-if="loaded">
    <ElTabs v-model="activeName" type="card">
      <ElTabPane style="margin-top: 20px" :label="$t('problemRegularMode')" name="regular">
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
                v-for="option in workTypeOptions"
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
        <ElButton style="margin-top: 24px" type="danger" @click="changeMeta">{{
          $t('modifySomething', { value: $t('metaData') })
        }}</ElButton>
        <ElDivider />
        <h4>{{ $t('dataFile') }}</h4>
        <ElUpload
          ref="dataFile"
          :limit="1"
          :on-exceed="dataFileHandleExceed"
          :auto-upload="false"
          :http-request="dataFileUpload"
        >
          <template #trigger>
            <ElButton type="primary">{{ $t('selectFile') }}</ElButton>
          </template>
          <ElButton style="margin-left: 12px" type="danger" :icon="Upload" @click="dataFileSubmit">
            {{ $t('uploadFile') }}
          </ElButton>
          <template #tip>
            <div class="el-upload__tip">
              {{ $t('dataFileOverwriteHint') }}
            </div>
          </template>
        </ElUpload>
      </ElTabPane>
      <ElTabPane :label="$t('problemFileMode')" name="file">
        <h4>{{ $t('problemFile') }}</h4>
        <ElUpload
          ref="workFile"
          :limit="1"
          :on-exceed="workFileHandleExceed"
          :auto-upload="false"
          :http-request="workFileUpload"
        >
          <template #trigger>
            <ElButton type="primary">{{ $t('selectFile') }}</ElButton>
          </template>
          <ElButton style="margin-left: 12px" type="danger" :icon="Upload" @click="workFileSubmit">
            {{ $t('uploadFile') }}
          </ElButton>
          <template #tip>
            <div class="el-upload__tip">
              {{ $t('problemFileOverwriteHint') }}
            </div>
          </template>
        </ElUpload>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped>
.box {
  margin: 0 auto;
}
</style>
