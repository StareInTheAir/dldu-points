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
      documentHeight: this.getDocumentHeight(),
      startIndex: 0
    }
  },
  computed: {
    endIndex: function () {
      const refs = this.getRefs()
      let end = 0
      let filledHeight = 0
      for (const [index, ref] of refs.slice(this.startIndex).entries()) {
        if (filledHeight + ref.$el.clientHeight < this.documentHeight) {
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
    getDocumentHeight: function () {
      return window.innerHeight
    },
    setDocumentHeight: function () {
      this.documentHeight = this.getDocumentHeight()
    },
    getRefs: function (): DivRef[] {
      const refs = this.$refs
      const list: DivRef[] = []
      for (const key in refs) {
        list.push(refs[key] as DivRef)
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
      const refs = this.getRefs()
      this.startIndex = this.endIndex + 1 < refs.length ? this.endIndex + 1 : 0
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.setDocumentHeight)
    setInterval(this.paginate, 10_000)
    this.paginate()
  }
})
</script>

<template>
  <div id="pager_container">
    <Level v-for="[i,level] in levels.entries()" :key="level.name"
      :ref="`level${i}`"
      :level="level"
      :class="getVisibilityClass(i)" />
  </div>
</template>

<style scoped>
#pager_container {
  bottom: 0;
}

.hidden {
  position: absolute;
  visibility: hidden;
  top: -1000px;
}
</style>
