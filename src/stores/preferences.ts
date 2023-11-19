import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGetItem } from './local'

export const usePreferencesStore = defineStore('preferences', () => {
  const evaluation = ref(false)
  function flush() {
    evaluation.value = useGetItem('evaluationPreferences') == 'true'
  }
  return { evaluation, flush }
})
