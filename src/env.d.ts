/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare const API_KEY: string
declare const APP_VERSION: string
declare const GIT_COMMIT_HASH: string
