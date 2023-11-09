import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'
import App from './App.vue'
import router from './router'

import en from './langs/en.json'
import zh_CN from './langs/zh-CN.json'

i18next.use(LanguageDetector).init({
  detection: {
    // do not use cache to detect language, so it is easy to change language in code for debugging
    caches: []
  },
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  resources: {
    en: {
      translation: en
    },
    'zh-CN': {
      translation: zh_CN
    }
  }
})

// i18next.changeLanguage('en')

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(I18NextVue, { i18next })

app.mount('#app')
