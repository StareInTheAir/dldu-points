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
  <span class="zone_name">&nbsp;&nbsp;&nbsp;&nbsp;{{ level.name }}&nbsp;&nbsp;&nbsp;</span>
  <span class="zone_points">{{ achievedPoints }}/ {{ totalPoints }}</span>
  <table>
    <Boss v-for="boss in level.bosses" v-bind:key="level.name + boss.name" v-bind:boss="boss" />
  </table>
</template>

<style scoped>
table {
  width: 100%;
}
.zone_name {
  font-weight: 500;
  font-size: 130%;
  text-decoration: underline;
}
</style>
