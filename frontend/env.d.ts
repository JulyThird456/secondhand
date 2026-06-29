/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VUE_APP_BASE_API: string
  readonly VUE_APP_URL: string
  readonly VUE_APP_SOCKET_URL: string
  readonly VUE_APP_DELETE_PERMISSIONS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
