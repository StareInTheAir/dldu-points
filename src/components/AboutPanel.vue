<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutPanel',
  data () {
    return {
      version: process.env.VUE_APP_VERSION,
      gitCommitHash: process.env.VUE_APP_GIT_COMMIT_HASH
    }
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
      Version: {{ version }}-{{ gitCommitHash }}
    </p>
  </div>
</template>

<style scoped>
  div {
    text-align: end;
    padding: 32px 16px 0 16px;
  }
  a, a:visited {
    color: white;
  }
</style>
