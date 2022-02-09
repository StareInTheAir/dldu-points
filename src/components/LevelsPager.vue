<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { DarkSoulsLevel } from '../types'
import LevelPoints from './LevelPoints.vue'
import FakeHideDirective from '../directives/FakeHide'
import AboutPanel from './AboutPanel.vue'
import debounce from 'lodash.debounce'

interface HtmlRef {
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
    },
    showAboutPanelEvery: {
      type: Number,
      default: 15
    }
  },

  data () {
    return {
      startIndex: 0,
      intervalIdNextPage: undefined as number | undefined,
      rollOverCounter: 0,
      pagerSizeChangedEventData: true,
      resizeObserver: undefined as ResizeObserver | undefined
    }
  },

  computed: {
    endIndex (): number {
      // endIndex depends on the size of the container and each child.
      // We access this.pagerSizeChangedEventData here to be recomputed, when any size changes.
      this.pagerSizeChangedEventData;

      // For Vues tracking when to recompute this property to work,
      // we need to access all other properties used in the computation,
      // even a loop body is not executed.
      const startIndex = this.startIndex

      const elementRefs = this.getElementRefs()
      let end = -1
      let filledHeight = 0
      const containerHeight = this.getContainerHeight()
      for (const [index, ref] of elementRefs.slice(startIndex).entries()) {
        if (filledHeight + ref.$el.clientHeight <= containerHeight) {
          filledHeight += ref.$el.clientHeight
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
    this.resizeObserver = new ResizeObserver(debouncedFirePagerSizeChangedEvent);

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

        for(const elementRef of this.getElementRefs()) {
          resizeObserver.observe(elementRef.$el)
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

    getElementRefs (): HtmlRef[] {
      const refs = this.$refs
      const list: HtmlRef[] = []
      for (const key in refs) {
        if (key.startsWith('element')) {
          const ref = refs[key] as HtmlRef | null
          // ref can be null when it was removed from the DOM
          if (ref != null) {
            list.push(ref)
          }
        }
      }
      return list
    },

    getElementCount (): number {
      return this.getElementRefs().length
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
  <div ref="container" class="container">
    <LevelPoints
      v-for="[i, level] in levels.entries()"
      :key="level.name"
      :ref="`element${i}`"
      :level="level"
      v-fake-hide="elementHidden[i]"
    />
    <AboutPanel
      ref="element_about"
      v-fake-hide="aboutHidden"
     />
  </div>
</template>


<style scoped>
.container {
  overflow: hidden;
}
</style>