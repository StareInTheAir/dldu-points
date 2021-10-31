<template>
  <h1>DLDU S3</h1>
  <p>{{ achievedPoints }}/{{ totalPoints }}</p>
  <Level v-for="level in dlduData.levels" v-bind:key="level.name" v-bind:level="level" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Level from './components/Level.vue'
import DataService from './DataService'
import { achievedRunPoints, totalRunPoints } from './points'

export default defineComponent({
  name: 'App',
  data: () => {
    return {
      dlduData: DataService.fetchData()
    }
  },
  computed: {
    totalPoints () {
      return totalRunPoints(this.dlduData)
    },
    achievedPoints () {
      return achievedRunPoints(this.dlduData)
    }
  },
  components: {
    Level
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
