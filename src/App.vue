<script lang="ts">
import { defineComponent } from 'vue'
import LevelsPager from './components/LevelsPager.vue'
import { ForbiddenError } from './errors'
import { getDlduData } from './google-sheets'
import { achievedRunPoints, totalRunPoints } from './points'
import { getSecondsPerPage, isSheetIdSuppliedAndValid } from './query-params'
import { DlduData } from './types'
import AboutPanel from './components/AboutPanel.vue'

export default defineComponent({
  name: 'App',

  components: {
    LevelsPager,
    AboutPanel
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
          this.playVideo()
          setTimeout(() => {
            this.dlduData = newDlduData
          }, 600)
        } else {
          this.dlduData = newDlduData
        }
        this.errors.clear()
      } catch (err) {
        console.log('Error during getDlduData', err)
        if (err instanceof ForbiddenError) {
          this.errors.add('No permission to access data from Google Sheets.')
        } else {
          this.errors.add('Couldn\'t retrieve data from Google Sheets.')
        }
      }
      // achievedPoints text is not immediatelly after visible
      setTimeout(this.positionVideo, 100)
    },

    async scheduleGetData () {
      await this.getData()
      setInterval(async () => { await this.getData() }, 10_000)
    },

    positionVideo () {
      const points = this.$refs.achievedPoints as HTMLElement | undefined
      if (!points) {
        return
      }
      const boundingBox = points.getBoundingClientRect()
      const pointsY = boundingBox.top + boundingBox.height / 2
      const pointsX = boundingBox.left + boundingBox.width / 2

      const video = this.$refs.pop as HTMLElement
      const videoX = video.clientWidth / 2
      const videoY = video.clientHeight / 2

      video.style.top = `${pointsY - videoY}px`
      video.style.left = `${pointsX - videoX}px`
    },

    playVideo () {
      const video = this.$refs.pop as HTMLMediaElement
      video.currentTime = 0
      video.play()
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
      Gesamtpunkte: <span ref="achievedPoints">{{ achievedPoints }}</span>/{{ totalPoints }}
    </p>
    <LevelsPager
      :levels="dlduData.levels"
      :secondsPerPage="secondsPerPage"
      class="pager"
    />
  </template>
  <p v-else class="loading">
    Loading
  </p>
  <video class="pop" ref="pop">
    <source src="/pop.webm" type="video/webm">
  </video>
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
.pop {
  position: absolute;
  width: 300px;
}
</style>
