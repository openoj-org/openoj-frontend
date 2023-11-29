<script setup lang="ts">
import { useRequestDangerousAction, useRequestDownload, useRequestGet } from '@/script/service'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { usePreferencesStore } from '@/stores/preferences'
import {
  ElAside,
  ElButton,
  ElCard,
  ElContainer,
  ElDescriptions,
  ElDescriptionsItem,
  ElMain,
  ElMessage
} from 'element-plus'
import { t } from 'i18next'
import { ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SemiText from '../semiText/SemiText.vue'
import { ProblemInfo } from '@/types/problem'
import MarkdownText from '../MarkdownText.vue'
import SampleView from '../SampleView.vue'
import { ChatLineRound, Cpu, Delete, Download, Edit, Promotion } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
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

function deleteProblem() {
  useRequestDangerousAction(
    '/problem/delete',
    {
      cookie: loginInfo.cookie,
      id: route.params.id
    },
    t('deleteSomething', { value: t('problem') }),
    router,
    '/problemset'
  )
}
</script>

<template>
  <ElContainer v-if="loaded">
    <ElMain style="padding-right: 60px">
      <div class="box">
        <div v-for="item in problemStatementMeta" :key="item.name">
          <div
            v-if="
              problemInfo[item.name] != undefined &&
              problemInfo[item.name] != '' &&
              item.suffix != true
            "
          >
            <h4 style="margin-block-end: 0">
              {{ $t(item.showName == undefined ? item.name : item.showName) }}
            </h4>
            <MarkdownText :id="item.name" :value="problemInfo[item.name]" />
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
            v-if="
              problemInfo[item.name] != undefined &&
              problemInfo[item.name] != '' &&
              item.suffix == true
            "
          >
            <h4 style="margin-block-end: 0">
              {{ $t(item.showName == undefined ? item.name : item.showName) }}
            </h4>
            <MarkdownText :id="item.name" :value="problemInfo[item.name]" />
          </div>
        </div>
      </div>
    </ElMain>
    <ElAside style="width: 310px">
      <ElCard class="box-card">
        <template #header>
          <div class="card-header">
            <ElDescriptions :title="problemInfo.title" :column="1">
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
          <div>
            <ElButton
              style="margin-top: 12px"
              type="danger"
              :icon="Edit"
              v-if="loginInfo.login && loginInfo.character <= 1"
              @click="$router.push(`/problem/${$route.params.id}/modify`)"
              >{{ $t('modify') }}</ElButton
            >
            <ElButton
              style="margin-top: 12px"
              type="danger"
              :icon="Delete"
              v-if="loginInfo.login && loginInfo.character <= 0"
              @click="deleteProblem"
              >{{ $t('delete') }}</ElButton
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
    </ElAside>
  </ElContainer>
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
@/types/types @/types/problem
