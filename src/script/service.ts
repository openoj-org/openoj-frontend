import axios from 'axios'
import global from '@/assets/global.json'
import FileSaver from 'file-saver'
import { ElMessage } from 'element-plus'
import { t } from 'i18next'

const request = axios.create({
  baseURL: global.backendUrl,
  timeout: 10000
})

export function useRequestGet(url: string, query: object) {
  return request.get(url, { params: query })
}

export function useRequestPost(url: string, query: object) {
  return request.post(url, query)
}

export function useRequestDownload(url: string, query: object, filename: string) {
  request
    .get(url, {
      params: query,
      responseType: 'blob'
    })
    .then((result) => {
      FileSaver.saveAs(result.data, filename)
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error(t('unknownError'))
    })
}
