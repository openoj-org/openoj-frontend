<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElDescriptions,
  ElDivider,
  ElInput,
  ElMessage,
  ElRate,
  ElTag
} from 'element-plus'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { useRequestDangerousAction, useRequestGet, useRequestPost } from '@/script/service'
import { ref, type Ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { t } from 'i18next'
import DenyDialog from '@/components/DenyDialog.vue'

const route = useRoute()
const loaded = ref(false)
const title = ref('')
const loginInfo = useLoginInfoStore()

const dialogVisible = ref(false)
dialogVisible.value = !loginInfo.login || loginInfo.character > 2

const haveRate = ref(false)
const rate = ref(0)
const recommended = ref(false)

const dynamicTags: Ref<string[]> = ref([])

useRequestGet('/workshop/info', { id: route.params.id, evaluation: true })
  .then((result) => {
    if (result.data.success == false) {
      ElMessage.error(result.data.message)
    } else {
      title.value = result.data.title
      dynamicTags.value = result.data.tags
      useRequestGet('/evaluate/get-evalue', {
        cookie: loginInfo.cookie,
        type: 1,
        problemId: route.params.id
      })
        .then((result) => {
          if (result.data.success == false) {
            ElMessage.error(result.data.message)
          } else {
            if (result.data.comment) {
              haveRate.value = true
              rate.value = result.data.grade
            } else {
              haveRate.value = false
              rate.value = 0
            }
            useRequestGet('/evaluate/get-recommend', {
              cookie: loginInfo.cookie,
              problemId: route.params.id
            })
              .then((result) => {
                if (result.data.success == false) {
                  ElMessage.error(result.data.message)
                } else {
                  recommended.value = result.data.recommend
                  loaded.value = true
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

function setRate(newHaveRate: boolean, newRate?: number) {
  useRequestPost(
    '/evaluate/evalue',
    newHaveRate
      ? {
          cookie: loginInfo.cookie,
          type: 1,
          problemId: route.params.id,
          comment: true,
          grade: newRate
        }
      : {
          cookie: loginInfo.cookie,
          type: 1,
          problemId: route.params.id,
          comment: false
        }
  )
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        haveRate.value = newHaveRate
        if (newHaveRate) rate.value = newRate!
        else rate.value = 0
        ElMessage.success(
          t('somethingSuccess', {
            value: newHaveRate ? t('evaluate') : t('cancelSomething', { value: t('evaluation') })
          })
        )
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
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

function changeTags() {
  useRequestDangerousAction(
    '/evaluate/edit-tag',
    {
      cookie: loginInfo.cookie,
      type: 1,
      problemId: route.params.id,
      tags: dynamicTags.value
    },
    t('modifySomething', { value: t('tags') })
  )
}

function recommend(value: boolean) {
  useRequestPost('/evaluate/recommend', {
    cookie: loginInfo.cookie,
    id: route.params.id,
    recommend: value
  })
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        recommended.value = value
        ElMessage.success(
          t('somethingSuccess', {
            value: value
              ? t('recommendSomething', { value: t('problem') })
              : t('cancelSomething', { value: t('recommendation') })
          })
        )
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
    })
}
</script>

<template>
  <BaseView :title="$t('instanceSettings')">
    <template #breadcrumb>
      <ElBreadcrumb :separator-icon="ArrowRight" v-if="loaded">
        <ElBreadcrumbItem :to="{ name: 'workshop' }">
          {{ $t('workshop') }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem :to="{ name: 'work', params: $route.params }">
          {{ title }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem :to="{ name: 'work-evaluate', params: $route.params }">
          {{ $t('evaluation') }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </template>
    <DenyDialog :visible="dialogVisible">
      {{ $t('onlyTrustedUserCanEvaluateHint') }}
    </DenyDialog>
    <div class="box">
      <ElDescriptions :title="$t('difficultyRating')"></ElDescriptions>
      <ElRate
        v-model="rate"
        :texts="[
          $t('difficultyVeryEasy'),
          $t('difficultyEasy'),
          $t('difficultyNormal'),
          $t('difficultyHard'),
          $t('difficultyVeryHard')
        ]"
        show-text
      />
      <div>
        <ElButton style="margin-top: 12px" type="primary" @click="setRate(true, rate)">
          {{ $t('evaluate') }}
        </ElButton>
        <ElButton style="margin-top: 12px" v-if="haveRate" @click="setRate(false)">
          {{ $t('cancelSomething', { value: $t('evaluation') }) }}
        </ElButton>
      </div>
      <ElDivider />
      <ElDescriptions :title="$t('modifySomething', { value: $t('tags') })"></ElDescriptions>
      <div>
        <ElTag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          style="margin-right: 12px; margin-bottom: 12px"
        >
          {{ tag }}
        </ElTag>
        <ElInput
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
          style="margin-right: 12px; width: 64px; margin-bottom: 12px"
        />
        <ElButton
          v-else
          size="small"
          @click="showInput"
          style="margin-right: 12px; margin-bottom: 12px"
        >
          + {{ t('tags') }}
        </ElButton>
      </div>
      <div>
        <ElButton type="danger" @click="changeTags">{{
          $t('modifySomething', { value: $t('tags') })
        }}</ElButton>
      </div>
      <ElDivider />
      <ElDescriptions :title="$t('recommendation')"></ElDescriptions>
      <div>
        <ElButton type="primary" v-if="recommended == false" @click="recommend(true)">
          {{ $t('recommendSomething', { value: $t('problem') }) }}
        </ElButton>
        <ElButton type="primary" v-else @click="recommend(false)">
          {{ $t('cancelSomething', { value: $t('recommendation') }) }}
        </ElButton>
      </div>
    </div>
  </BaseView>
</template>

<style scoped>
.box {
  margin: 0 auto;
  width: 500px;
}
</style>
