import { ref } from 'vue'
import { defineStore } from 'pinia'
import i18next from 'i18next'

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const menuCollapse = ref(true)
    const language = ref('')
    const evaluation = ref(true)
    function flip() {
      menuCollapse.value = !menuCollapse.value
    }
    return { menuCollapse, language, evaluation, flip }
  },
  {
    persist: {
      afterRestore: () => {
        const preferences = usePreferencesStore()
        if (preferences.language != '') i18next.changeLanguage(preferences.language)
      }
    }
  }
)
