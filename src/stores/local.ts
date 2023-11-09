import global from '../assets/global.json'

export function useSet(key: string, value: string | null) {
  if (value == null) localStorage.removeItem(key)
  else localStorage.setItem(global.localStoragePrefix + key, value)
}

export function useGet(key: string): string | null {
  return localStorage.getItem(global.localStoragePrefix + key)
}
