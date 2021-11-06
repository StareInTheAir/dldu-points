<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { DarkSoulsLevel } from '@/types'
import Boss from './Boss.vue'
import { achievedLevelPoints, totalLevelPoints } from '../points'

export default defineComponent({
  name: 'Level',
  components: {
    Boss
  },
  computed: {
    totalPoints () {
      return totalLevelPoints(this.level)
    },
    achievedPoints () {
      return achievedLevelPoints(this.level)
    }
  },
  props: {
    level: {
      type: Object as PropType<DarkSoulsLevel>,
      required: true
    }
  }
})
</script>

<template>
  <div id="grid">
    <span class="name">{{ level.name }}</span>
    <span class="points">{{ achievedPoints }}/{{ totalPoints }}</span>
    <img src="../assets/line.svg" alt="Underline of level name" class="underline" />
    <Boss v-for="boss in level.bosses" :key="level.name + boss.name" :boss="boss" />
  </div>
</template>

<style scoped>
#grid {
  width: 100%;
  display: grid;
  grid-template-columns: auto 5em;
  column-gap: 20px;
}
#grid * {
  align-self: end;
}
.name, .points {
  font-weight: 500;
  font-size: 150%;
}
.name {
  margin-top: 16px;
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
