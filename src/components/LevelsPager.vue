<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { DarkSoulsLevel } from '../types'
import LevelPoints from './LevelPoints.vue'
import FakeHideDirective from '../directives/FakeHide'
import AboutPanel from './AboutPanel.vue'
import debounce from 'lodash.debounce'

type HtmlRef = {
  $el: HTMLElement
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
      lastIntervalHandle: undefined as number | undefined,
      elementCount: 0
    }
  },

  computed: {
    endIndex (): number {
      // For Vues tracking when to recompute this property to work,
      // we need to access all other properties used in the computation,
      // even when this.getElementRefs().length === 0. So we read componentHeight before the loop.
      // When endIndex is computed the first time, this.getElementRefs() still returns an empty list,
      // so when it's first computed, we would never read this.componentHeight.
      const componentHeight = this.componentHeight
      const startIndex = this.startIndex
      // Access this.levels because endIndex depends on the height of each level.
      // If a level changes, the endIndex could also change.
      this.levels.keys()

      const elementRefs = this.getElementRefs()
      let end = 0
      let filledHeight = 0
      for (const [index, ref] of elementRefs.slice(startIndex).entries()) {
        if (filledHeight + ref.$el.clientHeight < componentHeight) {
          filledHeight += ref.$el.clientHeight
          end = startIndex + index
        } else {
          break
        }
      }
      return end
    },

    elementHidden (): boolean[] {
      const elementCount = this.elementCount
      const startIndex = this.startIndex
      const endIndex = this.endIndex
      const hiddenList = Array<boolean>(elementCount)
      for (let index = 0; index < elementCount; index += 1) {
        hiddenList[index] = index < startIndex || index > endIndex
      }
      return hiddenList
    },

    aboutIndex (): number {
      return this.elementCount - 1
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
    const container = this.$refs.container as HTMLDivElement

    // this.setComponentHeight is also called immediately after starting observing
    new ResizeObserver(debounce(this.setComponentHeight, 300)).observe(container)

    this.setElementCount()
    new MutationObserver(this.setElementCount).observe(container, { childList: true })
  },

  methods: {
    setComponentHeight: function () {
      const container = this.$refs.container as HTMLDivElement | undefined
      this.componentHeight = container ? container.clientHeight : Infinity
    },

    setElementCount: function () {
      this.elementCount = this.getElementRefs().length
    },

    getElementRefs: function (): HtmlRef[] {
      const refs = this.$refs
      const list: HtmlRef[] = []
      for (const key in refs) {
        if (key.startsWith('element')) {
          const ref = refs[key] as HtmlRef | null
          // ref can be null when it was removed from the DOM
          if (ref) {
            list.push(refs[key] as HtmlRef)
          }
        }
      }
      return list
    },

    nextPage: function () {
      this.startIndex = this.endIndex + 1 < this.elementCount ? this.endIndex + 1 : 0
    }
  }
})
</script>

<template>
  <div ref="container">
    <LevelPoints
      v-for="[i, level] in levels.entries()"
      :key="level.name"
      :ref="`element${i}`"
      :level="level"
      v-fake-hide="elementHidden[i]"
    />
    <AboutPanel
      ref="element_about"
      v-fake-hide="elementHidden[aboutIndex]"
     />
  </div>
</template>
