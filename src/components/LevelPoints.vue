<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DarkSoulsBoss, DarkSoulsLevel } from '../types'
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
    totalPoints (): number {
      return totalLevelPoints(this.level)
    },
    achievedPoints (): number {
      return achievedLevelPoints(this.level)
    },
    bossesVisible (): boolean {
      const levelInProgress = this.achievedPoints > 0 && this.achievedPoints < this.totalPoints
      return this.level.alwaysShowBosses || levelInProgress
    },
    filteredBosses (): DarkSoulsBoss[] {
      if (this.bossesVisible) {
        return this.level.bosses
      } else {
        return []
      }
    },
    isIncomplete (): boolean {
      return this.achievedPoints !== this.totalPoints
    }
  }
})
</script>

<template>
  <div class="grid">
    <span
      v-if="bossesVisible"
      class="spacer"
    />
    <span class="name">
      {{ level.name }}
    </span>
    <span
      class="points"
      :class="{ incomplete: isIncomplete }"
    >
      {{ achievedPoints }}/{{ totalPoints }}
    </span>
    <BossPoints
      v-for="boss in filteredBosses"
      :key="level.name + boss.name"
      :boss="boss"
    />
    <span
      v-if="bossesVisible"
      class="spacer"
    />
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
  height: 12px;
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
.incomplete {
  color: rgba(255, 255, 255, 0.5);
}
</style>
