<script lang="ts">
import { defineComponent } from 'vue'
import LevelsPager from './components/LevelsPager.vue'
import AboutPanel from './components/AboutPanel.vue'
import PointsAnimation from './components/PointsAnimation.vue'
import { BadRequestError, ForbiddenError } from './errors'
import { getDlduData } from './google-sheets'
import { achievedLevelPoints, achievedRunPoints, totalRunPoints } from './points'
import { getSecondsPerPage, isHideLevelsWithNoPointsSupplied, isSheetIdSuppliedAndValid, isHideProgressBarSupplied } from './query-params'
import type { DlduData, DarkSoulsLevel } from './types'
import ProgressBar from './components/ProgressBar.vue'

export default defineComponent({
  name: 'App',

  components: {
    LevelsPager,
    AboutPanel,
    PointsAnimation,
    ProgressBar
  },

  data () {
    return {
      dlduData: undefined as DlduData | undefined,
      errors: new Set<string>(),
      secondsPerPage: getSecondsPerPage() ?? 10,
      hideProgressBar: isHideProgressBarSupplied(),
      hideLevelsWithNoPoints: isHideLevelsWithNoPointsSupplied(),
      timeoutIdSetDlduData: undefined as number | undefined
    }
  },

  computed: {
    totalPoints (): number {
      if (this.dlduData == null) {
        return 0
      }
      return totalRunPoints(this.dlduData)
    },

    achievedPoints (): number {
      if (this.dlduData == null) {
        return 0
      }
      return achievedRunPoints(this.dlduData)
    },

    allLevels (): DarkSoulsLevel[] {
      if (this.dlduData == null) {
        return []
      }
      return this.dlduData.levels
    },

    filteredLevels (): DarkSoulsLevel[] {
      if (this.dlduData == null) {
        return []
      }
      if (this.hideLevelsWithNoPoints) {
        return this.dlduData.levels.filter((level) => achievedLevelPoints(level) !== 0)
      }
      return this.dlduData.levels
    }
  },

  created () {
    if (!isSheetIdSuppliedAndValid()) {
      this.errors.add('Sheet ID is missing in URL')
    } else {
      void this.scheduleGetData()
    }
  },

  methods: {
    async getData (): Promise<void> {
      try {
        const newDlduData = await getDlduData()
        if (this.didAchievedPointsChange(newDlduData)) {
          void this.$refs.animation.play()
          clearTimeout(this.timeoutIdSetDlduData)
          this.timeoutIdSetDlduData = window.setTimeout(() => {
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
        } else if (err instanceof BadRequestError) {
          this.errors.add('Couldn\'t retrieve data from Google Sheets.')
          this.errors.add('You are probably using an old and no longer supported sheet structure. Go through the setup steps again.')
        } else {
          this.errors.add('Couldn\'t retrieve data from Google Sheets.')
        }
      }
    },

    async scheduleGetData (): Promise<void> {
      await this.getData()
      window.setInterval(() => this.getData(), 9_901)
    },

    didAchievedPointsChange (newData: DlduData): boolean {
      const currentData = this.dlduData
      if (currentData != null) {
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
    <ProgressBar
      v-if="!hideProgressBar"
      class="progress"
      :levels="allLevels"
    />
    <LevelsPager
      :levels="filteredLevels"
      :seconds-per-page="secondsPerPage"
      class="pager"
    />
    <PointsAnimation ref="animation" />
  </template>
  <p
    v-else
    class="loading"
  >
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
  text-shadow:
    1px 0px #000,
    0.540302px 0.841471px #000,
    -0.416147px 0.909297px #000,
    -0.989993px 0.14112px #000,
    -0.653644px -0.756803px #000,
    0.283662px -0.958924px #000,
    0.96017px -0.279416px #000;
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
.progress {
  height: 48px;
}
.errors {
  text-align: end;
}
.errors li:before, .errors li:after {
  content: "⚠️";
  padding: 0 5px;
}
</style>
