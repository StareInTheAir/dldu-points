import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig, lazyPlugins } from 'vite-plus'

const encoding = 'utf-8'
const apiKey = process.env.DLDU_POINTS_API_KEY ?? readFileSync('api.key', { encoding })
const gitHash =
  process.env.DLDU_POINTS_GIT_HASH ?? execSync('git rev-parse --short HEAD', { encoding })

// https://vite.dev/config/
export default defineConfig({
  lint: {
    plugins: ['typescript', 'unicorn', 'oxc', 'vue', 'import', 'promise'],
    categories: {
      correctness: 'error',
    },
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    ignorePatterns: ['src/assets/minireset.min.css'],
    semi: false,
    singleQuote: true,
    sortImports: true,
  },
  plugins: lazyPlugins(() => [vue()]),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    API_KEY: JSON.stringify(apiKey.trim()),
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    GIT_COMMIT_HASH: JSON.stringify(gitHash.trim()),
  },
})
