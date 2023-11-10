import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuCollapseStore = defineStore('menuCollapse', () => {
  const collapse = ref(true)
  function flip() {
    collapse.value = !collapse.value
  }

  return { collapse, flip }
})
