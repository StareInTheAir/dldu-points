<script lang="ts">
import type { DarkSoulsBoss } from '../types'
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'BossPoints',
  props: {
    boss: {
      type: Object as PropType<DarkSoulsBoss>,
      required: true
    }
  },
  computed: {
    className (): string {
      return this.boss.beaten ? 'beaten' : 'alive'
    }
  }
})
</script>

<template>
  <p
    :class="className"
    class="name"
  >
    {{ boss.name }}
  </p>
  <p
    :class="className"
    class="points"
  >
    {{ boss.points }}
  </p>
</template>

<style scoped>
.beaten {
  color: rgb(255, 255, 255);
}
.alive {
  color: rgba(255, 255, 255, 0.5);
}
.name {
  text-align: end;
}
.points {
  text-align: start;
}
</style>
