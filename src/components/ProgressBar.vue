<script lang="ts">
import debounce from 'lodash.debounce'
import { defineComponent, PropType } from 'vue'
import { totalRunPoints } from '../points'
import { DarkSoulsLevel } from '../types'

export default defineComponent({
  name: 'ProgressBar',

  props: {
    levels: {
      type: Object as PropType<DarkSoulsLevel[]>,
      required: true
    }
  },

  data () {
    return {
      canvas: undefined as HTMLCanvasElement | undefined,
      context: null as CanvasRenderingContext2D | null
    }
  },

  methods: {
    setupCanvas () {
      if (this.canvas == null || this.context == null) {
        return
      }

      const dpr = window.devicePixelRatio
      const rect = this.canvas.getBoundingClientRect()
      this.canvas.width = rect.width * dpr
      this.canvas.height = rect.height * dpr
      this.context.scale(dpr, dpr)
    },

    drawProgressBar () {
      if (this.canvas == null || this.context == null) {
        return
      }

      const width = this.canvas.clientWidth
      const height = this.canvas.clientHeight
      const totalPoints = totalRunPoints({ levels: this.levels })
      const pixelsPerPoints = width / totalPoints
      let drawnPoints = 0

      this.context.clearRect(0, 0, width, height)
      for (const level of this.levels) {
        for (const boss of level.bosses) {
          if (boss.beaten) {
            this.context.fillStyle = 'green'
          } else {
            this.context.fillStyle = 'gray'
          }
          this.context.fillRect(drawnPoints * pixelsPerPoints, 0, (drawnPoints + boss.points) * pixelsPerPoints, height)
          drawnPoints += boss.points
        }
      }
    }
  },

  watch: {
    levels: {
      immediate: true,
      handler () {
        this.drawProgressBar()
      }
    }
  },

  mounted () {
    this.canvas = this.$refs.canvas as HTMLCanvasElement | undefined

    if (this.canvas != null) {
      this.context = this.canvas.getContext('2d')

      const onResize: () => void = () => {
        this.setupCanvas()
        this.drawProgressBar()
      }
      new ResizeObserver(debounce(onResize, 100)).observe(this.canvas)
    }
  }
})
</script>

<template>
  <canvas class="progressbar" ref="canvas">
    A progress bar visualizing how many points have been gained (in green) and how many are still open (in gray).
  </canvas>
</template>

<style scoped>
  .progressbar {
    width: 100%;
    height: 12px;
  }
</style>
