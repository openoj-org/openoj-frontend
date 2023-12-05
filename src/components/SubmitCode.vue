<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Codemirror } from 'vue-codemirror'
import { cpp } from '@codemirror/lang-cpp'
import { python } from '@codemirror/lang-python'
import { useRequestPost } from '@/script/service'
import { useLoginInfoStore } from '@/stores/loginInfo'
import { ElButton, ElMessage, ElOption, ElSelect } from 'element-plus'
import { t } from 'i18next'
import { languages } from '@/types/submission'

const router = useRouter()
const loginInfo = useLoginInfoStore()

const props = defineProps<{
  type: number
  problemId: any
}>()

const code = ref('')
const language = ref('')
const extensions = computed(() => {
  if (language.value == 'C++11') return [cpp()]
  else if (language.value == 'Python3') return [python()]
  else return []
})

function submit() {
  useRequestPost('/judge/submit', {
    cookie: loginInfo.cookie,
    type: props.type,
    problemId: props.problemId,
    language: language.value,
    sourceCode: code.value
  })
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        ElMessage.success(t('somethingSuccess', { value: t('submit') }))
        const submissionId = result.data.id
        router.push({ name: 'submission', params: { id: submissionId } })
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
    })
}
</script>

<template>
  <div>
    <ElSelect v-model="language" :placeholder="$t('chooseLanguageHint')">
      <ElOption v-for="item in languages" :key="item.value" :label="item.label" :value="item.value">
      </ElOption>
    </ElSelect>
    <ElButton style="margin-left: 12px" type="success" @click="submit">{{ $t('submit') }}</ElButton>
  </div>
  <Codemirror style="margin-top: 20px" v-model="code" :extensions="extensions"> </Codemirror>
</template>
