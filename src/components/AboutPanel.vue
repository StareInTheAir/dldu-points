<script lang="ts">
import { defineComponent } from 'vue'
import { getApiKeyHash } from '../api-key-hash'

export default defineComponent({
  name: 'AboutPanel',
  data () {
    return {
      version: APP_VERSION,
      gitCommitHash: GIT_COMMIT_HASH,
      apiKeyHash: ''
    }
  },
  created () {
    void getApiKeyHash().then((hash) => {
      this.apiKeyHash = hash
    })
  }
})
</script>

<template>
  <div>
    <p>
      <a
        href="https://github.com/StareInTheAir/dldu-points"
        target="_blank"
      >
        github.com/StareInTheAir/dldu-points
      </a>
    </p>
    <p>
      Version: {{ version }}-{{ gitCommitHash }}-{{ apiKeyHash }}
    </p>
  </div>
</template>

<style scoped>
  div {
    text-align: end;
    padding: 32px 16px 0 16px;
  }
  div, a, a:visited {
    color: rgba(255, 255, 255, 0.5);
  }
</style>
