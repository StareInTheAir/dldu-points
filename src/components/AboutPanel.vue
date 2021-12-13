<script lang="ts">
import { getAuthDataHash } from '../auth'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutPanel',
  data () {
    return {
      version: APP_VERSION,
      gitCommitHash: GIT_COMMIT_HASH,
      authDataHash: ''
    }
  },
  created () {
    getAuthDataHash().then((hash) => {
      this.authDataHash = hash
    })
  }
})
</script>

<template>
  <div>
    <p>
      <a
        href="https://github.com/StareInTheAir/dldu-points"
        target="_blank">
        github.com/StareInTheAir/dldu-points
      </a>
    </p>
    <p>
      Version: {{ version }}-{{ gitCommitHash }}-{{ authDataHash }}
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
