<template>
  <template v-if="errors.length > 0">
    Something went wrong:
    <ul>
      <li v-for="error in errors" :key="error">
        {{ error }}
      </li>
    </ul>
  </template>
  <template v-if="dlduData">
    <p>Punkte: {{ achievedPoints }}/{{ totalPoints }}</p>
    <LevelsPager :levels="dlduData.levels" />
  </template>
  <p v-else>Loading</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getAccessToken } from './auth'
import LevelsPager from './components/LevelsPager.vue'
import { getDlduData } from './google-sheets'
import { achievedRunPoints, totalRunPoints } from './points'
import { DlduData } from './types'

export default defineComponent({
  name: 'App',
  data: () => {
    return {
      dlduData: undefined as DlduData | undefined,
      errors: [] as string[]
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
    LevelsPager
  },
  created () {
    this.scheduleGetData()
  },
  methods: {
    async getData () {
      try {
        const accessToken = await getAccessToken()
        try {
          this.dlduData = await getDlduData(accessToken.token)
          this.errors = []
        } catch (err) {
          console.log('Error during getDlduData', err)
          this.errors.push('Couldn\'t retrieve data from Google Sheets')
        }
      } catch (err) {
        console.log('Error during getAccessToken', err)
        this.errors.push('Couldn\'t get access token for Google Sheets')
      }
    },
    async scheduleGetData () {
      await this.getData()
      setInterval(async () => { await this.getData() }, 60_000)
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
</style>
