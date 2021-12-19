<script lang="ts">
import { defineComponent } from 'vue'
import LevelsPager from './components/LevelsPager.vue'
import AboutPanel from './components/AboutPanel.vue'
import PointsAnimation from './components/PointsAnimation.vue'
import { ForbiddenError } from './errors'
import { getDlduData } from './google-sheets'
import { achievedRunPoints, totalRunPoints } from './points'
import { getSecondsPerPage, isSheetIdSuppliedAndValid } from './query-params'
import { DlduData } from './types'


export default defineComponent({
  name: 'App',

  components: {
    LevelsPager,
    AboutPanel,
    PointsAnimation
  },

  data: () => {
    return {
      dlduData: undefined as DlduData | undefined,
      errors: new Set<string>(),
      secondsPerPage: getSecondsPerPage() || 10
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

  created () {
    if (!isSheetIdSuppliedAndValid()) {
      this.errors.add('Sheet ID is missing in URL')
    } else {
      this.scheduleGetData()
    }
  },

  methods: {
    async getData () {
      try {
        const newDlduData = await getDlduData()
        if (this.didAchievedPointsChange(newDlduData)) {
          (this.$refs.animation as any).play()
          setTimeout(() => {
            this.dlduData = newDlduData
          }, 1_000)
        } else {
          this.dlduData = newDlduData
        }
        this.errors.clear()
      } catch (err) {
        console.error('Error during getDlduData', err)
        if (err instanceof ForbiddenError) {
          this.errors.add('No permission to access data from Google Sheets.')
        } else {
          this.errors.add('Couldn\'t retrieve data from Google Sheets.')
        }
      }
    },

    async scheduleGetData () {
      await this.getData()
      setInterval(async () => { await this.getData() }, 9_901)
    },

    didAchievedPointsChange (newData: DlduData): boolean {
      const currentData = this.dlduData
      if (currentData) {
        return achievedRunPoints(currentData) < achievedRunPoints(newData)
      } else {
        return false
      }
    }
  }
})
</script>

<template>
  <div
    v-if="errors.size > 0"
    class="errors"
  >
    Something went wrong:
    <ul>
      <li
        v-for="error in errors"
        :key="error"
      >
        {{ error }}
      </li>
    </ul>
    <AboutPanel />
  </div>
  <template v-if="dlduData">
    <p class="total">
      Gesamtpunkte: <span class="animationPosition">{{ achievedPoints }}</span>/{{ totalPoints }}
    </p>
    <LevelsPager
      :levels="dlduData.levels"
      :secondsPerPage="secondsPerPage"
      class="pager"
    />
    <PointsAnimation ref="animation" />
  </template>
  <p v-else class="loading">
    Loading
  </p>

</template>

<style>
html, body {
  height: 100%;
}
body {
  background-color: #222;
  font-family: "EBGaramond", serif;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>

<style scoped>
.errors, .total, .loading {
  flex: 0;
}
.pager {
  flex: 1;
}
.total, .loading {
  text-align: end;
  font-weight: 600;
  font-size: 200%;
  margin-top: 20px;
}
.errors {
  text-align: end;
}
.errors li:before, .errors li:after {
  content: "⚠️";
  padding: 0 5px;
}
</style>
