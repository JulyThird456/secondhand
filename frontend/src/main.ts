import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'normalize.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as echarts from 'echarts'

import App from './App.vue'
import router from './router'
import '@/styles/index.scss'
import '@/styles/home.scss'
import '@/styles/element-variables.scss'
import '@/styles/newRJWMsystem.scss'

import './permission'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })

// Register all Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$echarts = echarts

app.mount('#app')
