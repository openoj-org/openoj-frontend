<script setup lang="ts">
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElText,
  ElSwitch,
  ElSelect,
  ElOption,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage
} from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import BaseView from './BaseView.vue'
import { MdEditor } from 'md-editor-v3'
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import i18next from 'i18next'
import { t } from 'i18next'
import { useRequestPostFull } from '@/script/service'
import { useLoginInfoStore } from '@/stores/loginInfo'
import router from '@/router'

const route = useRoute()
const loginInfo = useLoginInfoStore()

const typeOptions = [
  {
    value: 0,
    label: t('problemSet')
  },
  {
    value: 1,
    label: t('workshop')
  }
]

const haveSourceSwitch = ref(route.query.sourceId != undefined)
const postMeta = reactive({
  type: route.query.sourceType == undefined ? parseInt(route.query.sourceType! as string) : 0,
  problemId: (route.query.sourceId as string) ?? '',
  title: ''
})
const content = ref('')

function release() {
  useRequestPostFull(
    '/forum/post',
    haveSourceSwitch.value
      ? {
          cookie: loginInfo.cookie,
          withProblem: true,
          type: postMeta.type,
          problemId: postMeta.problemId,
          title: postMeta.title,
          content: content.value
        }
      : {
          cookie: loginInfo.cookie,
          withProblem: false,
          title: postMeta.title,
          content: content.value
        },
    (data) => {
      ElMessage.success(
        t('somethingSuccess', { value: t('createSomething', { value: t('talks') }) })
      )
      router.push({ name: 'post', params: { id: data.id } })
    }
  )
}
</script>

<template>
  <BaseView :title="$t('createSomething', { value: $t('talks') })">
    <template v-slot:breadcrumb>
      <ElBreadcrumb :separator-icon="ArrowRight">
        <ElBreadcrumbItem :to="{ name: 'forum', query: $route.query }">
          {{ $t('forum') }}
        </ElBreadcrumbItem>
        <!-- TODO: use query in some breadcrumb -->
        <ElBreadcrumbItem :to="{ name: 'forum-create', query: $route.query }">
          {{ $t('createSomething', { value: $t('talks') }) }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </template>

    <div style="margin-bottom: 6px">
      <ElText>{{ $t('problemRelatedSwitch') }}</ElText>
      <ElSwitch v-model="haveSourceSwitch" style="margin-left: 12px" />
    </div>
    <div v-if="haveSourceSwitch">
      <ElForm inline :model="postMeta">
        <!-- TODO: change problemType(tranditional,...) to a new name -->
        <ElFormItem :label="$t('problemType')">
          <ElSelect v-model="postMeta.type">
            <ElOption
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></ElOption
          ></ElSelect>
        </ElFormItem>
        <ElFormItem :label="$t('problemsSomething', { value: $t('id') })">
          <ElInput v-model="postMeta.problemId"></ElInput>
        </ElFormItem>
      </ElForm>
    </div>
    <div>
      <ElForm :model="postMeta">
        <ElFormItem :label="$t('title')">
          <ElInput v-model="postMeta.title"></ElInput>
        </ElFormItem>
      </ElForm>
    </div>
    <MdEditor editor-id="reply" v-model="content" :language="i18next.language" />
    <ElButton type="success" style="margin-top: 12px" @click="release">{{
      $t('release')
    }}</ElButton>
  </BaseView>
</template>
