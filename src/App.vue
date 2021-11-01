<template>
  <template v-if="dlduData">
    <p>{{ achievedPoints }}/{{ totalPoints }}</p>
    <Level v-for="level in dlduData.levels" v-bind:key="level.name" v-bind:level="level" />
  </template>
  <p v-else>Loading</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getAccessToken } from './auth'
import Level from './components/Level.vue'
import { getDlduData } from './google-sheets'
import { achievedRunPoints, totalRunPoints } from './points'
import { DlduData } from './types'

export default defineComponent({
  name: 'App',
  data: (): {dlduData?: DlduData} => {
    return {
      dlduData: undefined
    }
  },
  computed: {
    totalPoints () {
      if (!this.dlduData) {
        return 0
      }
      return totalRunPoints(this.dlduData)
    },
    achievedPoints () {
      if (!this.dlduData) {
        return 0
      }
      return achievedRunPoints(this.dlduData)
    }
  },
  components: {
    Level
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      const accessToken = await getAccessToken()
      this.dlduData = await getDlduData(accessToken.token)
    }
  }
})
</script>

<style>
body {
  background-color: #444;
  font-family: "EBGaramond";
  font-size: 2em;
  color: #fff;
}
</style>
