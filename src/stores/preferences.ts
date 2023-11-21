import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGetItem } from './local'
import i18next from 'i18next'

export const usePreferencesStore = defineStore('preferences', () => {
  const language = ref('')
  const evaluation = ref(false)
  function flush() {
    const tmp = useGetItem('languagePreferences')
    language.value = tmp == undefined ? '' : tmp
    if (language.value != '') i18next.changeLanguage(language.value)
    evaluation.value = useGetItem('evaluationPreferences') == 'true'
  }
  return { language, evaluation, flush }
})
