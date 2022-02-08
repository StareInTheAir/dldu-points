<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { DarkSoulsLevel } from '../types'
import LevelPoints from './LevelPoints.vue'
import FakeHideDirective from '../directives/FakeHide'
import AboutPanel from './AboutPanel.vue'
import debounce from 'lodash.debounce'

const KEY_ABOUT_ELEMENT = 5886043

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
    },
    showAboutPanelEvery: {
      type: Number,
      default: 15
    }
  },

  data () {
    return {
      componentHeight: 0,
      startIndex: 0,
      lastIntervalHandle: undefined as number | undefined,
      rollOverCounter: 0,
      elementRefs: {} as Record<number, HTMLElement>
    }
  },

  computed: {
    elementCount (): number {
      return Object.keys(this.elementRefs).length
    },

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

      const elementRefs = this.elementRefs
      let end = -1
      let filledHeight = 0
      for (const [index, ref] of Object.entries(elementRefs).slice(startIndex)) {
        if (filledHeight + ref.clientHeight <= componentHeight) {
          filledHeight += ref.clientHeight
          end = startIndex + parseInt(index)
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

    aboutHidden (): boolean {
      // The AboutPanel is always the last element
      const hiddenBasedOnElementHidden = this.elementHidden[this.elementHidden.length - 1]
      const hiddenBasedOnRollover = this.rollOverCounter !== 0
      return hiddenBasedOnElementHidden || hiddenBasedOnRollover
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

  mounted () {
    // Only when in mounted state, refs are available
    const container = this.$refs.container as HTMLDivElement

    // this.setComponentHeight is also called immediately after starting observing
    new ResizeObserver(debounce(this.setComponentHeight, 300)).observe(container)
  },

  beforeUpdate() {
    this.elementRefs = [];
  },

  methods: {
    setLevelsRef (index: number, ref: any): void {
      this.elementRefs[index] = ref.$el
    },

    setLevelsRefPartial (index: number): (ref: any) => void {
      return (ref: any) => this.setLevelsRef(index, ref)
    },

    setAboutRef (ref: any): void {
      this.elementRefs[KEY_ABOUT_ELEMENT] = ref.$el
    },

    setComponentHeight (): void {
      const container = this.$refs.container as HTMLDivElement | undefined
      this.componentHeight = container != null ? container.clientHeight : Infinity
    },

    nextPage (): void {
      const nextIndex = this.endIndex + 1
      if (nextIndex < this.elementCount) {
        this.startIndex = nextIndex
      } else {
        this.startIndex = 0
        this.rollOverCounter = (this.rollOverCounter + 1) % this.showAboutPanelEvery
      }
    }
  }
})
</script>

<template>
  <div ref="container">
    <LevelPoints
      v-for="[i, level] in levels.entries()"
      :key="level.name"
      :ref="setLevelsRefPartial(i)"
      :level="level"
      v-fake-hide="elementHidden[i]"
    />
    <AboutPanel
      :ref="setAboutRef"
      v-fake-hide="aboutHidden"
     />
  </div>
</template>
