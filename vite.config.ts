import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const encoding = 'utf-8'
const apiKey = process.env.DLDU_POINTS_API_KEY ?? readFileSync('api.key', { encoding })
const gitHash =
  process.env.DLDU_POINTS_GIT_HASH ?? execSync('git rev-parse --short HEAD', { encoding })

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    API_KEY: JSON.stringify(apiKey.trim()),
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    GIT_COMMIT_HASH: JSON.stringify(gitHash.trim()),
  },
})
