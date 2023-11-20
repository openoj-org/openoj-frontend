<script setup lang="ts">
import { useRequestDownload, useRequestGet } from '@/script/service'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { usePreferencesStore } from '@/stores/preferences'
import {
  ElButton,
  ElCard,
  ElCol,
  ElDescriptions,
  ElDescriptionsItem,
  ElDivider,
  ElMessage,
  ElRow
} from 'element-plus'
import { t } from 'i18next'
import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import SemiText from '../semiText/SemiText.vue'
import { ProblemInfo } from '@/script/types'
import MarkdownText from '../MarkdownText.vue'
import SampleView from '../SampleView.vue'
import { ChatLineRound, Cpu, Download, Edit, Promotion } from '@element-plus/icons-vue'

const route = useRoute()
const loginInfo = useLoginInfoStore()
const preferences = usePreferencesStore()

const problemBaseMeta = (
  [
    {
      name: 'titleEn',
      showName: 'fileName'
    },
    {
      name: 'timeLimit'
    },
    {
      name: 'memoryLimit'
    },
    {
      name: 'source'
    }
  ] as {
    name: keyof ProblemInfo
    showName?: string
    type?: string
  }[]
)
  .concat(
    preferences.evaluation
      ? [
          {
            name: 'submit',
            showName: 'submitCount'
          },
          {
            name: 'pass',
            showName: 'passRate'
          },
          {
            name: 'grade'
          },
          {
            name: 'tags',
            type: 'tags'
          }
        ]
      : []
  )
  .concat(
    loginInfo.login && preferences.evaluation
      ? [
          {
            name: 'score',
            type: 'score'
          }
        ]
      : []
  )

const problemStatementMeta = [
  {
    name: 'background',
    showName: 'problemBackground'
  },
  {
    name: 'statement',
    showName: 'problemStatement'
  },
  {
    name: 'inputStatement'
  },
  {
    name: 'outputStatement'
  },
  {
    name: 'rangeAndHint',
    suffix: true
  }
] as {
  name: keyof ProblemInfo
  showName?: string
  suffix?: boolean
}[]

const loaded = ref(false)
const problemInfo: Ref<ProblemInfo> = ref(new ProblemInfo({}))
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
      problemInfo.value = new ProblemInfo(result.data)
      loaded.value = true
    }
  })
  .catch((error) => {
    console.log(error)
    ElMessage.error(t('unknownError'))
  })
</script>

<template>
  <ElRow v-if="loaded">
    <ElCol :span="17" style="padding-right: 120px">
      <div class="box">
        <div v-for="item in problemStatementMeta" :key="item.name">
          <div
            style="margin-bottom: 24px"
            v-if="problemInfo[item.name] != undefined && item.suffix != true"
          >
            <ElDescriptions :title="$t(item.showName == undefined ? item.name : item.showName)" />
            <div style="margin-top: 0">
              <MarkdownText :value="problemInfo[item.name]" />
            </div>
          </div>
        </div>
        <div
          style="margin-bottom: 24px"
          v-for="(sample, index) in problemInfo.samples"
          :key="index"
        >
          <SampleView :title="problemInfo.titleEn" :id="index + 1" :value="sample" />
        </div>
        <div v-for="item in problemStatementMeta" :key="item.name">
          <div
            style="margin-bottom: 24px"
            v-if="problemInfo[item.name] != undefined && item.suffix == true"
          >
            <ElDescriptions :title="$t(item.showName == undefined ? item.name : item.showName)" />
            <div style="margin-top: 0">
              <MarkdownText :value="problemInfo[item.name]" />
            </div>
          </div>
        </div>
      </div>
    </ElCol>
    <ElCol :span="7">
      <ElCard class="box-card">
        <template #header>
          <div class="card-header">
            <ElDescriptions :title="problemInfo.title" :column="1">
              <template #extra>
                <ElButton
                  type="danger"
                  :icon="Edit"
                  v-if="loginInfo.login && loginInfo.character <= 1"
                  >{{ $t('modifySomething', { value: $t('problem') }) }}</ElButton
                >
              </template>
              <ElDescriptionsItem
                :label="$t(item.showName == undefined ? item.name : item.showName)"
                v-for="item in problemBaseMeta"
                :key="item.name"
              >
                <SemiText :type="item.type" :value="problemInfo[item.name]"></SemiText>
              </ElDescriptionsItem>
            </ElDescriptions>
          </div>
          <div>
            <ElButton
              style="margin-top: 6px"
              type="success"
              :icon="Promotion"
              v-if="loginInfo.login"
              >{{ $t('submit') }}</ElButton
            >
            <ElButton
              style="margin-top: 6px"
              type="primary"
              :icon="Download"
              @click="
                useRequestDownload(
                  '/problem/samples',
                  { id: $route.params.id },
                  `${problemInfo.titleEn}.zip`
                )
              "
              >{{ $t('attach') }}</ElButton
            >
          </div>
        </template>
        <div>
          <ElButton text type="primary" :icon="Cpu">{{
            $t('problemsSomething', { value: $t('submissions') })
          }}</ElButton>
        </div>
        <div style="margin-top: 12px">
          <ElButton text type="primary" :icon="ChatLineRound">{{
            $t('problemsSomething', { value: $t('talks') })
          }}</ElButton>
        </div>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<style scoped>
.box {
  margin: 0 auto;
}
.container {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
