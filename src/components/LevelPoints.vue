<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DarkSoulsLevel } from '../types'
import BossPoints from './BossPoints.vue'
import { achievedLevelPoints, totalLevelPoints } from '../points'

export default defineComponent({
  name: 'LevelPoints',
  components: {
    BossPoints
  },
  props: {
    level: {
      type: Object as PropType<DarkSoulsLevel>,
      required: true
    }
  },
  computed: {
    totalPoints () {
      return totalLevelPoints(this.level)
    },
    achievedPoints () {
      return achievedLevelPoints(this.level)
    },
    levelInProgress () {
      return true
      // return this.achievedPoints > 0 && this.achievedPoints < this.totalPoints
    },
    filteredBosses() {
      if (this.levelInProgress) {
        return this.level.bosses
      } else {
        return []
      }
    }
  }
})
</script>

<template>
  <div class="grid">
    <span v-if="levelInProgress" class="spacer" />
    <span class="name">
      {{ level.name }}
    </span>
    <span class="points">
      {{ achievedPoints }}/{{ totalPoints }}
    </span>
    <img
      v-if="levelInProgress"
      src="../assets/line.svg"
      alt="Underline of level name"
      class="underline"
    />
    <BossPoints
      v-for="boss in filteredBosses"
      :key="level.name + boss.name"
      :boss="boss"
    />
    <span v-if="levelInProgress" class="spacer" />
  </div>
</template>

<style scoped>
.grid {
  width: 100%;
  display: grid;
  grid-template-columns: auto 5em;
  column-gap: 20px;
}
.grid * {
  align-self: end;
}
.spacer {
  grid-column: span 2;
  height: 8px;
}
.name, .points {
  font-size: 150%;
}
.name {
  text-align: end;
}
.points {
  text-align: start;
}
.underline {
  width: 100%;
  height: 4px;
  grid-column: span 2;
}
</style>
