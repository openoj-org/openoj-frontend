import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGetItem } from './local'

export const useLoginInfoStore = defineStore('loginInfo', () => {
  const login = ref(false)
  const username = ref('')
  const id = ref('')
  const cookie = ref('')
  function flush() {
    login.value = useGetItem('login') == 'true'
    let tmp = useGetItem('username')
    if (tmp != null) username.value = tmp
    else username.value = ''
    tmp = useGetItem('id')
    if (tmp != null) id.value = tmp
    else id.value = ''
    tmp = useGetItem('cookie')
    if (tmp != null) cookie.value = tmp
    else cookie.value = ''
  }

  return { login, username, id, cookie, flush }
})
