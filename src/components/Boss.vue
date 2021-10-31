<script lang="ts">
import { DarkSoulsBoss } from '@/types'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Boss',
  props: {
    boss: {
      type: Object as PropType<DarkSoulsBoss>,
      required: true
    }
  },
  computed: {
    className () {
      return this.boss.beaten ? 'beaten' : 'alive'
    }
  }
})
</script>

<template>
  <tr v-bind:class="className">
    <td class="boss_name">{{ boss.name }}</td>
    <td class="boss_points">{{ boss.points }}</td>
    <td class="boss_beaten">{{ boss.beaten ? 'X' : 'O' }}</td>
  </tr>
</template>

<style scoped>
.beaten {
  color: rgb(255, 255, 255);
}

.alive {
  color: rgba(255, 255, 255, 0.5);
}
</style>
