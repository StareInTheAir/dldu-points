declare const API_KEY: string
declare const APP_VERSION: string
declare const GIT_COMMIT_HASH: string

declare module '*.svg?raw' {
  const content: string
  export default content
}
