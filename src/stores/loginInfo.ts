import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { LoginInfo } from '@/types/user'

export const useLoginInfoStore = defineStore(
  'loginInfo',
  () => {
    const login = ref(false)
    const username = ref('')
    const character = ref(-1)
    const id = ref('')
    const cookie = ref('')
    function setLogin(data: LoginInfo) {
      login.value = true
      username.value = data.username
      character.value = data.character
      id.value = data.id
      cookie.value = data.cookie
    }
    function setLogout() {
      login.value = false
      username.value = ''
      character.value = -1
      id.value = ''
      cookie.value = ''
    }

    return { login, username, character, id, cookie, setLogin, setLogout }
  },
  {
    persist: true
  }
)
