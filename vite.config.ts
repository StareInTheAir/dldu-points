import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

import vue from '@vitejs/plugin-vue'
import { defineConfig, lazyPlugins } from 'vite-plus'

const encoding = 'utf-8'
const apiKey = process.env.DLDU_POINTS_API_KEY ?? readFileSync('api.key', { encoding })
const appVersion = JSON.parse(readFileSync('package.json', { encoding })).version
const gitHash =
  process.env.DLDU_POINTS_GIT_HASH ?? execSync('git rev-parse --short HEAD', { encoding })

// https://vite.dev/config/
export default defineConfig({
  fmt: {
    ignorePatterns: ['src/assets/minireset.min.css'],
    semi: false,
    singleQuote: true,
    sortImports: true,
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
    plugins: ['typescript', 'unicorn', 'oxc', 'vue', 'import', 'promise'],
    categories: {
      correctness: 'error',
    },
  },
  plugins: lazyPlugins(() => [vue()]),
  define: {
    API_KEY: JSON.stringify(apiKey.trim()),
    APP_VERSION: JSON.stringify(appVersion.trim()),
    GIT_COMMIT_HASH: JSON.stringify(gitHash.trim()),
  },
})
