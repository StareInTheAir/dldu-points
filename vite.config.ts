import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

const encodingOption = { encoding: 'utf-8' }

let apiKey: string
if (process.env.DLDU_POINTS_API_KEY) {
  apiKey = `${process.env.DLDU_POINTS_API_KEY}`
} else {
  apiKey = readFileSync('api.key', encodingOption)
}

let gitHash: string
if (process.env.DLDU_POINTS_GIT_HASH) {
  gitHash = `${process.env.DLDU_POINTS_GIT_HASH}`
} else {
  gitHash = execSync("git rev-parse --short HEAD", encodingOption)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  define: {
    API_KEY: JSON.stringify(apiKey.trim()),
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    GIT_COMMIT_HASH: JSON.stringify(gitHash.trim())
  }
})
