<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { DarkSoulsLevel } from '@/types'
import Level from './Level.vue'

type DivRef = {
  $el: HTMLDivElement
}

export default defineComponent({
  name: 'LevelsPager',
  components: {
    Level
  },
  props: {
    levels: {
      type: Object as PropType<DarkSoulsLevel[]>,
      required: true
    }
  },
  data: function () {
    return {
      componentHeight: Infinity,
      startIndex: 0
    }
  },
  computed: {
    endIndex: function () {
      // For Vues tracking when to recompute this property to work,
      // we need to access all other properties used in the computation,
      // even when this.getLevelRefs().length === 0, so we read componentHeight before the loop.
      // When endIndex is computed the first time, this.getLevelRefs() still returns an empty list,
      // so when it's first computed, we would never read this.componentHeight.
      const componentHeight = this.componentHeight
      const levelRefs = this.getLevelRefs()
      let end = 0
      let filledHeight = 0
      for (const [index, ref] of levelRefs.slice(this.startIndex).entries()) {
        if (filledHeight + ref.$el.clientHeight < componentHeight) {
          filledHeight += ref.$el.clientHeight
          end = this.startIndex + index
        } else {
          break
        }
      }
      return end
    }
  },
  methods: {
    setComponentHeight: function () {
      const container = this.$refs.container as HTMLDivElement | undefined
      this.componentHeight = container ? container.clientHeight : Infinity
    },
    getLevelRefs: function (): DivRef[] {
      const refs = this.$refs
      const list: DivRef[] = []
      for (const key in refs) {
        if (key.startsWith('level')) {
          list.push(refs[key] as DivRef)
        }
      }
      return list
    },
    getVisibilityClass: function (index: number): string {
      if (index < this.startIndex || index > this.endIndex) {
        return 'hidden'
      } else {
        return ''
      }
    },
    paginate: function () {
      this.startIndex = this.endIndex + 1 < this.getLevelRefs().length ? this.endIndex + 1 : 0
    }
  },
  mounted: function () {
    this.setComponentHeight()
    window.addEventListener('resize', this.setComponentHeight)
    // new ResizeObserver(this.setComponentHeight).observe(this.$refs.container as HTMLDivElement)

    setInterval(this.paginate, 10_000)
  }
})
</script>

<template>
  <div ref="container">
    <Level v-for="[i, level] in levels.entries()" :key="level.name"
      :ref="`level${i}`"
      :level="level"
      :class="getVisibilityClass(i)" />
  </div>
</template>

<style scoped>
.hidden {
  position: absolute;
  visibility: hidden;
  top: -1000px;
}
</style>
