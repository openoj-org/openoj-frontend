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
import { WorkInfo, type LinkBody } from '@/script/types'
import MarkdownText from '../MarkdownText.vue'
import SampleView from '../SampleView.vue'
import { ChatLineRound, Cpu, Delete, Download, Edit, Promotion } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const loginInfo = useLoginInfoStore()
const preferences = usePreferencesStore()

const workBaseMeta = (
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
    },
    {
      name: 'username',
      showName: 'author',
      type: 'link',
      linkBody: {
        head: 'user',
        idName: 'userId'
      }
    }
  ] as {
    name: keyof WorkInfo
    showName?: string
    type?: string
    linkBody?: LinkBody
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

const workStatementMeta = [
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
  name: keyof WorkInfo
  showName?: string
  suffix?: boolean
}[]

const loaded = ref(false)
const workInfo: Ref<WorkInfo> = ref(new WorkInfo({}))
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
      workInfo.value = new WorkInfo(result.data)
      loaded.value = true
    }
  })
  .catch((error) => {
    console.log(error)
    ElMessage.error(t('unknownError'))
  })

function deleteWork() {
  useRequestDangerousAction(
    '/workshop/delete',
    {
      cookie: loginInfo.cookie,
      id: route.params.id
    },
    t('deleteSomething', { value: t('workProblem') }),
    router,
    '/workshop'
  )
}
</script>

<template>
  <ElContainer v-if="loaded">
    <ElMain style="padding-right: 60px">
      <div class="box">
        <div v-for="item in workStatementMeta" :key="item.name">
          <div
            v-if="
              workInfo[item.name] != undefined && workInfo[item.name] != '' && item.suffix != true
            "
          >
            <h4 style="margin-block-end: 0">
              {{ $t(item.showName == undefined ? item.name : item.showName) }}
            </h4>
            <MarkdownText :id="item.name" :value="workInfo[item.name]" />
          </div>
        </div>
        <div style="margin-bottom: 24px" v-for="(sample, index) in workInfo.samples" :key="index">
          <SampleView :title="workInfo.titleEn" :id="index + 1" :value="sample" />
        </div>
        <div v-for="item in workStatementMeta" :key="item.name">
          <div
            v-if="
              workInfo[item.name] != undefined && workInfo[item.name] != '' && item.suffix == true
            "
          >
            <h4 style="margin-block-end: 0">
              {{ $t(item.showName == undefined ? item.name : item.showName) }}
            </h4>
            <MarkdownText :id="item.name" :value="workInfo[item.name]" />
          </div>
        </div>
      </div>
    </ElMain>
    <ElAside style="width: 300px">
      <ElCard class="box-card">
        <template #header>
          <div class="card-header">
            <ElDescriptions :title="workInfo.title" :column="1">
              <template #extra>
                <ElButton
                  type="danger"
                  :icon="Edit"
                  v-if="loginInfo.login && loginInfo.character <= 1"
                  @click="$router.push(`/work/${$route.params.id}/modify`)"
                  >{{ $t('modify') }}</ElButton
                >
                <ElButton
                  type="danger"
                  :icon="Delete"
                  v-if="loginInfo.login && loginInfo.character <= 0"
                  @click="deleteWork"
                  >{{ $t('delete') }}</ElButton
                >
              </template>
              <ElDescriptionsItem
                :label="$t(item.showName == undefined ? item.name : item.showName)"
                v-for="item in workBaseMeta"
                :key="item.name"
              >
                <SemiText
                  :type="item.type"
                  :value="workInfo[item.name]"
                  :link="
                    item.linkBody == undefined
                      ? undefined
                      : `/${item.linkBody.head}/${workInfo[item.linkBody.idName as keyof WorkInfo]}`
                  "
                ></SemiText>
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
                  '/workshop/samples',
                  { id: $route.params.id },
                  `${workInfo.titleEn}.zip`
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
