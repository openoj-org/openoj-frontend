import axios from 'axios'
import global from '@/assets/global.json'

const request = axios.create({
  baseURL: global.backendUrl,
  timeout: 1000
})

export function useRequestGet(url: string, query: object) {
  return request.get(url, { params: query })
}

export function useRequestPost(url: string, query: object) {
  return request.post(url, query)
}
