import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execSync } from 'child_process'

const gitHash = execSync("git rev-parse --short HEAD", { encoding: 'utf-8' }).trim();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    GIT_COMMIT_HASH: JSON.stringify(gitHash)
  }
})
