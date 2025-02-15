import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { standardTypeChecked } from '@vue/eslint-config-standard-with-typescript'

export default defineConfigWithVueTs(
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommendedTypeChecked,
  vueTsConfigs.stylisticTypeChecked,
  standardTypeChecked,
  {
    ignores: ['dist/'],
    languageOptions: {
      globals: {
        API_KEY: 'readonly',
        APP_VERSION: 'readonly',
        GIT_COMMIT_HASH: 'readonly'
      }
    }
  }
)
