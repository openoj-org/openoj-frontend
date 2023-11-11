import global from '../assets/global.json'

export function useSetItem(key: string, value: string | null) {
  if (value == null) localStorage.removeItem(global.localStoragePrefix + key)
  else localStorage.setItem(global.localStoragePrefix + key, value)
}

export function useGetItem(key: string): string | null {
  return localStorage.getItem(global.localStoragePrefix + key)
}
