import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGetItem } from './local'

export const usePreferencesStore = defineStore('preferences', () => {
  const language = ref('')
  const evaluation = ref(false)
  function flush() {
    const tmp = useGetItem('languagePreferences')
    language.value = tmp == undefined ? '' : tmp
    evaluation.value = useGetItem('evaluationPreferences') == 'true'
  }
  return { language, evaluation, flush }
})
