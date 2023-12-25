<script setup lang="ts">
import { computed, ref, type Ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import i18next from 'i18next'
import { t } from 'i18next'
import BaseView from './BaseView.vue'
import { useRequestGetFull, useRequestPostFull } from '@/script/service'
import {
  ElAside,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElCard,
  ElContainer,
  ElDescriptions,
  ElDescriptionsItem,
  ElDivider,
  ElMain,
  ElMessage,
  ElPagination
} from 'element-plus'
import { ArrowRight, Plus, RefreshLeft } from '@element-plus/icons-vue'
import { PostBaseInfo, PostContent } from '@/types/post'
import type { ColumnMeta } from '@/types/table'
import SemiText from '@/components/semiText/SemiText.vue'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { MdEditor, MdPreview, type ExposeParam, type FocusOption } from 'md-editor-v3'

const route = useRoute()
const loginInfo = useLoginInfoStore()

const eachpageCount = 10

const currentPage = ref(1)

const start = computed(() => {
  return (currentPage.value - 1) * eachpageCount
})
const end = computed(() => {
  return currentPage.value * eachpageCount - 1
})

const loaded = ref(false)
const count = ref(0)
const postInfo: Ref<PostBaseInfo> = ref(new PostBaseInfo({}))
const postContents: Ref<PostContent[]> = ref([])

function getContent() {
  loaded.value = false
  useRequestGetFull(
    '/forum/info',
    {
      id: route.params.id,
      start: start.value,
      end: end.value
    },
    (data) => {
      postInfo.value = new PostBaseInfo(data)
      postContents.value = PostContent.list(data.commentInfo)
      count.value = data.count
      loaded.value = true
    }
  )
}
getContent()

function currentChange() {
  getContent()
}

const columnMeta: ColumnMeta[] = [
  {
    name: 'username',
    showName: 'originalPoster',
    sortable: false,
    type: 'link',
    linkCallback: (scope) => {
      return {
        name: 'user',
        params: {
          id: scope.userId
          // TODO: use .row and ?? to let it be universal
        }
      }
    }
  },
  {
    name: 'time',
    showName: 'postTime',
    sortable: true,
    type: 'time'
  },
  {
    name: 'commentTime',
    showName: 'followUpTime',
    sortable: true,
    type: 'time'
  },
  {
    name: 'problemTitle',
    showName: 'source',
    sortable: false,
    type: 'link',
    linkCallback: (scope) => {
      switch (scope.type) {
        case 0:
          return {
            name: 'problem',
            params: {
              id: scope.problemId
            }
          }
        case 1:
          return {
            name: 'work',
            params: {
              id: scope.problemId
            }
          }
        default:
          return ''
      }
    }
  },
  {
    name: 'count',
    showName: 'postCount',
    sortable: false
  }
]

const editorRef = ref<ExposeParam>()
const replyContent = ref('')
const option: FocusOption | undefined = 'end'

onMounted(() => {
  editorRef.value?.on('catalog', console.log)
})

function focus() {
  editorRef.value?.focus(option)
}

function convertToReference(item: PostContent) {
  const replyLines = item.content.split('\n')
  for (let i = 0; i < replyLines.length; i++) {
    replyLines[i] = '> ' + replyLines[i]
  }
  return `> ${item.username}: \n> \n${replyLines.join('\n')}\n\n`
}

function replyFocus(item: PostContent) {
  const reference = convertToReference(item)
  editorRef.value?.insert(() => {
    return {
      targetValue: reference,
      select: false,
      deviationStart: reference.length,
      deviationEnd: reference.length
    }
  })
  focus()
}

function reply() {
  useRequestPostFull(
    '/forum/comment',
    {
      cookie: loginInfo.cookie,
      id: route.params.id,
      content: replyContent.value
    },
    () => {
      ElMessage.success(t('somethingSuccess', { value: t('release') }))
      replyContent.value = ''
      getContent()
    }
  )
}
</script>

<template>
  <BaseView :title="postInfo.title">
    <template #breadcrumb>
      <ElBreadcrumb :separator-icon="ArrowRight">
        <ElBreadcrumbItem :to="{ name: 'forum' }">
          {{ $t('forum') }}
        </ElBreadcrumbItem>
        <ElBreadcrumbItem :to="{ name: 'post', params: $route.params }">
          {{ postInfo.title }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </template>
    <div v-if="loaded">
      <ElContainer>
        <ElMain style="padding-right: 60px">
          <ElCard style="margin-bottom: 20px" v-for="(content, index) in postContents" :key="index">
            <template #header>
              <div class="card-header">
                <SemiText
                  type="link"
                  :value="content.username"
                  :link="{ name: 'user', params: { id: content.userId } }"
                />
                <div>
                  <SemiText type="time" :value="content.time" />
                  <ElButton
                    type="primary"
                    :icon="RefreshLeft"
                    style="margin-left: 12px"
                    @click="replyFocus(content)"
                    >{{ $t('replyPost') }}</ElButton
                  >
                </div>
              </div>
            </template>
            <MdPreview :editor-id="'content' + index" :model-value="content.content"></MdPreview>
          </ElCard>
          <ElPagination
            :page-size="eachpageCount"
            v-model:current-page="currentPage"
            @update:current-page="currentChange"
            layout="prev, pager, next"
            :total="count"
          />
        </ElMain>
        <ElAside style="width: 310px">
          <ElCard>
            <template #header>
              <ElDescriptions :title="postInfo.title" :column="1">
                <ElDescriptionsItem
                  :label="$t(item.showName == undefined ? item.name : item.showName)"
                  v-for="item in columnMeta"
                  :key="item.name"
                >
                  <SemiText
                    :type="item.type"
                    :value="postInfo[item.name as keyof PostBaseInfo]"
                    :link="item.type == 'link' ? item.linkCallback!(postInfo) : ''"
                  ></SemiText>
                </ElDescriptionsItem>
              </ElDescriptions>
            </template>
            <ElButton type="primary" :icon="Plus" v-if="loginInfo.login" @click="focus">{{
              $t('followUp')
            }}</ElButton>
          </ElCard>
        </ElAside>
      </ElContainer>
      <ElDivider />
      <MdEditor
        editor-id="reply"
        v-model="replyContent"
        ref="editorRef"
        :language="i18next.language"
      />
      <ElButton type="success" style="margin-top: 12px" @click="reply">{{
        $t('release')
      }}</ElButton>
    </div>
  </BaseView>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
