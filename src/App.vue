<script lang="ts">
import { defineComponent } from 'vue'
import { getAccessToken } from './auth'
import LevelsPager from './components/LevelsPager.vue'
import { ForbiddenError, RefreshTokenInvalidError } from './errors'
import { getDlduData } from './google-sheets'
import { achievedRunPoints, totalRunPoints } from './points'
import { getSecondsPerPage, isSheetIdSuppliedAndValid } from './query-params'
import { Token, DlduData } from './types'
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
      let accessToken: Token
      try {
        accessToken = await getAccessToken()
      } catch (err) {
        console.log('Error during getAccessToken', err)
        if (err instanceof RefreshTokenInvalidError) {
          this.errors.add('Token is no longer valid. Contact the author.')
        } else {
          this.errors.add('Couldn\'t get access token for Google Sheets.')
        }
        return
      }

      try {
        this.dlduData = await getDlduData(accessToken.token)
        this.errors.clear()
      } catch (err) {
        if (err instanceof ForbiddenError) {
          this.errors.add('No permission to access data from Google Sheets.')
        } else {
          this.errors.add('Couldn\'t retrieve data from Google Sheets.')
        }
      }
    },

    async scheduleGetData () {
      await this.getData()
      setInterval(async () => { await this.getData() }, 10_000)
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
      Gesamtpunkte: {{ achievedPoints }}/{{ totalPoints }}
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
}
.errors {
  text-align: end;
}
.errors li:before, .errors li:after {
  content: "⚠️";
  padding: 0 5px;
}
</style>
