<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { DarkSoulsLevel } from '../types'
import LevelPoints from './LevelPoints.vue'
import FakeHideDirective from '../directives/FakeHide'
import AboutPanel from './AboutPanel.vue'

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
      startIndex: 0,
      lastIntervalHandle: undefined as number | undefined,
      rollOverCounter: 0,
      containerHeight: Infinity,
      pagerElements: new Array<HTMLElement>()
    }
  },

  computed: {

    endIndex (): number {
      // For Vues tracking when to recompute this property to work,
      // we need to access all other properties used in the computation,
      // even when this.getElementRefs().length === 0. So we read componentHeight before the loop.
      // When endIndex is computed the first time, this.getElementRefs() still returns an empty list,
      // so when it's first computed, we would never read this.componentHeight.
      const containerHeight = this.containerHeight
      const startIndex = this.startIndex
      // Access this.levels because endIndex depends on the height of each level.
      // If a level changes, the endIndex could also change.
      this.levels.keys()

      const pagerElements = this.pagerElements
      let end = -1
      let filledHeight = 0
      for (const [index, ref] of pagerElements.slice(startIndex).entries()) {
        if (filledHeight + ref.clientHeight <= containerHeight) {
          filledHeight += ref.clientHeight
          end = startIndex + index
        } else {
          break
        }
      }
      return end
    },

    elementHidden (): boolean[] {
      const pagerElementCount = this.pagerElements.length
      const startIndex = this.startIndex
      const endIndex = this.endIndex
      const hiddenList = Array<boolean>(pagerElementCount)
      for (let index = 0; index < pagerElementCount; index += 1) {
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

  beforeUpdate () {
    this.pagerElements = []
  },

  methods: {
    setContainerElement (directElement: any): void {
      const el: HTMLElement | null = directElement
      this.containerHeight = el != null ? el.clientHeight : Infinity
    },

    setPagerElement (ref: any): void {
      const el: HTMLElement | null = ref.$el
      if (el != null) {
        this.pagerElements.push(el)
      }
    },

    nextPage (): void {
      const nextIndex = this.endIndex + 1
      if (nextIndex < this.pagerElements.length) {
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
  <div :ref="setContainerElement">
    <LevelPoints
      v-for="[i, level] in levels.entries()"
      :key="level.name"
      :ref="setPagerElement"
      :level="level"
      v-fake-hide="elementHidden[i]"
    />
    <AboutPanel
      :ref="setPagerElement"
      v-fake-hide="aboutHidden"
     />
  </div>
</template>
