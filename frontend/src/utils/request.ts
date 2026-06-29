import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { getRequestKey, pending, checkPending, removePending } from './requestOptimize'

const CancelToken = axios.CancelToken

const service = axios.create({
  baseURL: import.meta.env.VUE_APP_BASE_API as string || '/api',
  timeout: 600000
})

const tokenKey = 'token'
function getToken() {
  const cookies = document.cookie.split('; ')
  for (const c of cookies) {
    const [k, v] = c.split('=')
    if (k === tokenKey) return decodeURIComponent(v)
  }
  return ''
}

service.interceptors.request.use(
  (config: any) => {
    const t = getToken()
    if (t) {
      config.headers['token'] = t
    } else if (!config.url?.includes('/login')) {
      window.location.href = '/login'
      return false
    }

    if (config.method === 'get' && config.params) {
      let url = config.url + '?'
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName]
        const part = encodeURIComponent(propName) + '='
        if (value !== null && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              const params = propName + '[' + key + ']'
              url += encodeURIComponent(params) + '=' + encodeURIComponent(value[key]) + '&'
            }
          } else {
            url += part + encodeURIComponent(value) + '&'
          }
        }
      }
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    const key = getRequestKey(config)
    if (checkPending(key)) {
      const source = CancelToken.source()
      config.cancelToken = source.token
      source.cancel('重复请求')
    } else {
      pending[key] = true
    }
    return config
  },
  (error: any) => Promise.reject(error)
)

service.interceptors.response.use(
  (response: any) => {
    if (response.data.status === 401) {
      router.push('/login')
    }
    const key = getRequestKey(response.config)
    removePending(key)
    return response
  },
  (error: any) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          router.push('/login')
          break
        case 405:
          error.message = '请求错误'
      }
    }
    const key = getRequestKey(error.config)
    removePending(key)
    return Promise.reject(error)
  }
)

export default service
