<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { DarkSoulsLevel } from '@/types'
import LevelPoints from './LevelPoints.vue'
import FakeHideDirective from '@/directives/FakeHide'
import AboutPanel from './AboutPanel.vue'

type DivRef = {
  $el: HTMLDivElement
}

export default defineComponent({
  name: 'LevelsPager',

  components: {
    LevelPoints,
    AboutPanel
  },

  directives: {
    'fake-hide': FakeHideDirective
  },

  props: {
    levels: {
      type: Object as PropType<DarkSoulsLevel[]>,
      required: true
    },
    secondsPerPage: {
      type: Number,
      required: true
    }
  },

  data: function () {
    return {
      componentHeight: Infinity,
      startIndex: 0,
      lastIntervalHandle: undefined as number | undefined
    }
  },

  computed: {
    endIndex (): number {
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
    },

    levelVisible (): boolean[] {
      const levelCount = this.levels.length
      const startIndex = this.startIndex
      const endIndex = this.endIndex
      const visibleList = Array<boolean>(levelCount)
      for (let index = 0; index < levelCount; index += 1) {
        visibleList[index] = index < startIndex || index > endIndex
      }
      return visibleList
    },

    aboutIndex (): number {
      return this.levels.length - 1
    }
  },

  watch: {
    secondsPerPage: {
      immediate: true,
      handler () {
        clearInterval(this.lastIntervalHandle)
        this.lastIntervalHandle = setInterval(this.nextPage, this.secondsPerPage * 1_000)
      }
    }
  },

  mounted: function () {
    // Only when in mounted state, refs are available
    new ResizeObserver(this.setComponentHeight).observe(this.$refs.container as HTMLDivElement)
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

    nextPage: function () {
      this.startIndex = this.endIndex + 1 < this.getLevelRefs().length ? this.endIndex + 1 : 0
    }
  }
})
</script>

<template>
  <div ref="container">
    <LevelPoints
      v-for="[i, level] in levels.entries()"
      :key="level.name"
      :ref="`level${i}`"
      :level="level"
      v-fake-hide="levelVisible[i]"
      class="transition-opacity"
    />
    <AboutPanel
      ref="level_about"
      v-fake-hide="levelVisible[aboutIndex]"
     />
  </div>
</template>
