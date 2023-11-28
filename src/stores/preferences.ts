import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGetItem, useSetItem } from './local'
import i18next from 'i18next'

export const usePreferencesStore = defineStore('preferences', () => {
  const menuCollapse = ref(true)
  const language = ref('')
  const evaluation = ref(false)
  function flip() {
    menuCollapse.value = !menuCollapse.value
    useSetItem('menuCollapsePreferences', menuCollapse.value ? 'true' : 'false')
  }
  function flush() {
    let tmp = useGetItem('menuCollapsePreferences')
    menuCollapse.value = tmp == 'true'
    tmp = useGetItem('languagePreferences')
    language.value = tmp == undefined ? '' : tmp
    if (language.value != '') i18next.changeLanguage(language.value)
    evaluation.value = useGetItem('evaluationPreferences') == 'true'
  }
  return { menuCollapse, language, evaluation, flip, flush }
})
