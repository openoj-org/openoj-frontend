<script setup lang="ts">
import { useRequestGet } from '@/script/service'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { usePreferencesStore } from '@/stores/preferences'
import { ElDescriptions, ElDescriptionsItem, ElMessage } from 'element-plus'
import { t } from 'i18next'
import { ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import SemiText from '../semiText/SemiText.vue'

const route = useRoute()
const loginInfo = useLoginInfoStore()
const preferences = usePreferencesStore()

class ProblemBaseInfo {
  title: string
  source: string
  submit: number
  pass: string
  score?: number
  grade?: number
  tags?: string[]
  constructor(data: any) {
    this.title = data.title == undefined ? '' : data.title
    this.source = data.source == undefined ? '' : data.source
    this.submit = data.submit == undefined ? '' : data.submit
    this.pass = data.pass == undefined ? '' : `${data.pass * 100}%`
    if (data.score != undefined) this.score = data.score
    if (data.grade != undefined) this.grade = data.grade
    if (data.tags != undefined) this.tags = data.tags
  }
}

interface Sample {
  display: boolean
  input?: string
  output?: string
}

class ProblemInfo extends ProblemBaseInfo {
  titleEn: string
  type: 0
  timeLimit: string
  memoryLimit: string
  background?: string
  statement: string
  inputStatement: string
  outputStatement: string
  rangeAndHint: string
  samples: Sample[]
  static convertTimeLimit(data: number) {
    if (data >= 1000) return `${data / 1000}s`
    return `${data}ms`
  }
  static convertMemoryLimit(data: number) {
    if (data >= 1024) return `${data / 1024}GB`
    return `${data}MB`
  }
  constructor(data: any) {
    super(data)
    this.titleEn = data.titleEn == undefined ? '' : data.titleEn
    this.type = data.type == undefined ? 0 : data.type
    this.timeLimit = data.timeLimit == undefined ? '' : ProblemInfo.convertTimeLimit(data.timeLimit)
    this.memoryLimit =
      data.memoryLimit == undefined ? '' : ProblemInfo.convertMemoryLimit(data.memoryLimit)
    if (data.background != undefined) this.background = data.background
    this.statement = data.statement == undefined ? '' : data.statement
    this.inputStatement = data.inputStatement == undefined ? '' : data.inputStatement
    this.outputStatement = data.outputStatement == undefined ? '' : data.outputStatement
    this.rangeAndHint = data.rangeAndHint == undefined ? '' : data.rangeAndHint
    this.samples = data.samples == undefined ? [] : data.samples
  }
}

const problemBaseMeta = (
  [
    {
      name: 'timeLimit'
    },
    {
      name: 'memoryLimit'
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
  <div class="box">
    <div v-if="loaded">
      <h1>{{ problemInfo.title }}</h1>
      <ElDescriptions>
        <ElDescriptionsItem
          :label="$t(item.showName == undefined ? item.name : item.showName)"
          v-for="item in problemBaseMeta"
          :key="item.name"
        >
          <SemiText :type="item.type" :value="problemInfo[item.name]"></SemiText>
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
  </div>
</template>

<style scoped>
.box {
  margin: 0 auto;
  min-width: 600px;
  max-width: 1200px;
}
</style>
