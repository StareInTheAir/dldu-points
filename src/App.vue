<template>
  <template v-if="dlduData">
    <p>Punkte: {{ achievedPoints }}/{{ totalPoints }}</p>
    <div id="grid">
      <Level v-for="level in dlduData.levels" v-bind:key="level.name" v-bind:level="level" />
    </div>
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
  background-color: #222;
  font-family: "EBGaramond";
  color: #fff;
}

#grid {
  width: 100%;
  display: grid;
  grid-template-columns: auto 5em;
  column-gap: 20px;
}

#grid * {
  align-self: end;
}
</style>
