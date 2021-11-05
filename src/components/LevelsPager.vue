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
      const refs = this.getLevelRefs()
      let end = 0
      let filledHeight = 0
      for (const [index, ref] of refs.slice(this.startIndex).entries()) {
        if (filledHeight + ref.$el.clientHeight < this.componentHeight) {
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
      const refs = this.getLevelRefs()
      this.startIndex = this.endIndex + 1 < refs.length ? this.endIndex + 1 : 0
    }
  },
  mounted: function () {
    this.setComponentHeight()
    window.addEventListener('resize', this.setComponentHeight)

    this.paginate()
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
