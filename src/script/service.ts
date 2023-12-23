import axios, { type AxiosResponse } from 'axios'
import global from '@/assets/global.json'
import FileSaver from 'file-saver'
import { ElMessage, ElMessageBox } from 'element-plus'
import { t } from 'i18next'
import type { Router } from 'vue-router'

const request = axios.create({
  baseURL: global.backendUrl,
  timeout: 10000
})

export function useRequestGet(url: string, query: object) {
  return request.get(url, { params: query })
}

export function useRequestGetFull(url: string, query: object, callback: (data: any) => void) {
  useRequestGet(url, query)
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        callback(result.data)
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
    })
}

export function useRequestPost(url: string, query: object) {
  return request.post(url, query)
}

export function useRequestPostFull(url: string, query: object, callback: (data: any) => void) {
  useRequestPost(url, query)
    .then((result) => {
      if (result.data.success == false) {
        ElMessage.error(result.data.message)
      } else {
        callback(result.data)
      }
    })
    .catch((error) => {
      console.log(error)
      ElMessage.error(t('unknownError'))
    })
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

export function useRequestDangerousAction(
  url: string,
  query: object,
  actionName: string,
  router?: Router,
  link?: string
) {
  ElMessageBox.confirm(
    t('dangerousAction', {
      value: actionName
    }),
    t('warning'),
    {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      type: 'warning'
    }
  )
    .then(() => {
      useRequestPost(url, query)
        .then((result) => {
          if (result.data.success) {
            ElMessage.success(
              t('somethingSuccess', {
                value: actionName
              })
            )
            if (router != undefined) router.push(link!)
          } else ElMessage.error(result.data.message)
        })
        .catch((error) => {
          console.log(error)
          ElMessage.error(t('unknownError'))
        })
    })
    .catch(() => {
      ElMessage.info(t('cancel'))
    })
}
