import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const menuCollapse = ref(true)
    const language = ref('')
    const evaluation = ref(false)
    function flip() {
      menuCollapse.value = !menuCollapse.value
    }
    return { menuCollapse, language, evaluation, flip }
  },
  {
    persist: true
  }
)
