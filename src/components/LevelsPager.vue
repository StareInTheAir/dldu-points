<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { DarkSoulsLevel } from '../types'
import LevelPoints from './LevelPoints.vue'
import FakeHideDirective from '../directives/FakeHide'
import AboutPanel from './AboutPanel.vue'
import debounce from 'lodash.debounce'

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
      intervalIdNextPage: undefined as NodeJS.Timer | undefined,
      rollOverCounter: 0,
      pagerSizeChangedEventData: true,
      resizeObserver: undefined as ResizeObserver | undefined
    }
  },

  computed: {
    endIndex (): number {
      // endIndex depends on the size of the container and each child.
      // We access this.pagerSizeChangedEventData here to be recomputed, when any size changes.
      this.pagerSizeChangedEventData.valueOf()

      // For Vues tracking when to recompute this property to work,
      // we need to access all other properties used in the computation,
      // even a loop body is not executed.
      const startIndex = this.startIndex

      const elements = this.getElements()
      let end = startIndex
      let filledHeight = 0
      const containerHeight = this.getContainerHeight()
      for (const [index, element] of elements.slice(startIndex).entries()) {
        if (filledHeight + element.clientHeight <= containerHeight) {
          filledHeight += element.clientHeight
          end = startIndex + index
        } else {
          break
        }
      }
      return end
    },

    elementHidden (): boolean[] {
      const elementCount = this.getElementCount()
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
        clearInterval(this.intervalIdNextPage)
        this.intervalIdNextPage = setInterval(this.nextPage, this.secondsPerPage * 1_000)
      }
    }
  },

  mounted () {
    const debouncedFirePagerSizeChangedEvent = debounce(() => this.firePagerChangedEvent(), 100)
    this.resizeObserver = new ResizeObserver(debouncedFirePagerSizeChangedEvent)

    // Only when in mounted state, refs are available
    const container = this.$refs.container as HTMLDivElement
    new MutationObserver(this.registerResizeObserver).observe(container, { childList: true })
    // MutationObserver callback is not immediatelly called, so we call it initially manually once
    this.registerResizeObserver()
  },

  methods: {
    registerResizeObserver (): void {
      const resizeObserver = this.resizeObserver
      if (resizeObserver != null) {
        resizeObserver.disconnect()

        // ResizeObserver callback is also called immediately after starting observing
        const container = this.$refs.container as HTMLDivElement
        resizeObserver.observe(container)

        for (const element of this.getElements()) {
          resizeObserver.observe(element)
        }
      }
    },

    firePagerChangedEvent (): void {
      this.pagerSizeChangedEventData = !this.pagerSizeChangedEventData
    },

    getContainerHeight (): number {
      const container = this.$refs.container as HTMLDivElement | undefined
      return container != null ? container.clientHeight : Infinity
    },

    getElements (): Element[] {
      const containerRef = this.$refs.container as HTMLDivElement | undefined
      if (containerRef != null) {
        return Array.from(containerRef.children)
      } else {
        return []
      }
    },

    getElementCount (): number {
      return this.getElements().length
    },

    nextPage (): void {
      const nextIndex = this.endIndex + 1
      if (nextIndex < this.getElementCount()) {
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
  <div
    ref="container"
    class="container"
  >
    <LevelPoints
      v-for="[i, level] in levels.entries()"
      :key="level.name"
      v-fake-hide="elementHidden[i]"
      :level="level"
    />
    <AboutPanel
      v-fake-hide="aboutHidden"
    />
  </div>
</template>

<style scoped>
.container {
  overflow: hidden;
}
</style>
