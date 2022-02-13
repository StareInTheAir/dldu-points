<script lang="ts">
import debounce from 'lodash.debounce'
import { defineComponent, PropType } from 'vue'
import { SVG_END, SVG_SEPARATOR, SVG_TOP } from '../paths/svg'
import { totalLevelPoints, totalRunPoints } from '../points'
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

      // const dpr = window.devicePixelRatio
      const dpr = 1
      this.canvas.width = this.canvas.clientWidth * dpr
      this.canvas.height = this.canvas.clientHeight * dpr
      // this.context.scale(dpr, dpr)
    },

    draw () {
      if (this.canvas == null || this.context == null) {
        return
      }

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.context.save()

      const hOffset = SVG_END.viewBox.width / 2
      const vOffset = SVG_TOP.viewBox.height / 2
      this.context.translate(hOffset, vOffset)

      const widthForProgressBar = this.canvas.width - 2 * hOffset
      const heightForProgressBar = this.canvas.height - 2 * vOffset
      this.drawProgressBar(widthForProgressBar, heightForProgressBar)
      // this.drawLevelSeparators(widthForProgressBar, heightForProgressBar)

      this.context.restore()

      this.drawBorder()
    },

    drawLevelSeparators (width: number, height: number) {
      if (this.canvas == null || this.context == null) {
        return
      }
      this.context.save()

      this.context.fillStyle = 'black'

      const totalPoints = totalRunPoints({ levels: this.levels })
      // this.context.scale(width / totalPoints, 1)

      // Normalize SVG_SEPARATOR width to be 1
      // this.context.scale(1 / SVG_SEPARATOR.viewBox.width, 1)

      // Move to center of separator
      this.context.translate(-SVG_SEPARATOR.viewBox.width / 2, 0)

      // Draw separators vertically centered
      this.context.translate(0, (height - SVG_SEPARATOR.viewBox.height) / 2)

      // Draw separator between two levels
      this.context.translate(0.5, 0)

      for (const level of this.levels.slice(0, this.levels.length - 2)) {
        const levelPoints = totalLevelPoints(level)
        this.context.translate(levelPoints, 0)
        this.context.fill(SVG_SEPARATOR.path)
      }
      this.context.restore()
    },

    drawProgressBar (width: number, height: number) {
      if (this.canvas == null || this.context == null) {
        return
      }

      this.context.save()
      const totalPoints = totalRunPoints({ levels: this.levels })
      // this.context.scale(width / totalPoints, 1)

      let drawnPoints = 0
      for (const level of this.levels) {
        for (const boss of level.bosses) {
          if (boss.beaten) {
            this.context.fillStyle = 'green'
          } else {
            this.context.fillStyle = 'gray'
          }
          this.context.fillRect(drawnPoints, 0, drawnPoints + boss.points, height)
          drawnPoints += boss.points
        }
      }

      this.context.restore()
    },

    drawBorder () {
      if (this.canvas == null || this.context == null) {
        return
      }

      this.context.save()
      this.context.fillStyle = 'black'

      const endScaleFactor = this.canvas.clientHeight / SVG_END.viewBox.height
      this.context.scale(1, endScaleFactor)

      this.context.save()
      this.context.translate(SVG_END.viewBox.width / 2, SVG_END.viewBox.height / 2)
      this.context.rotate(Math.PI)
      this.context.translate(-SVG_END.viewBox.width / 2, -SVG_END.viewBox.height / 2)
      this.context.fill(SVG_END.path)
      this.context.restore()

      this.context.save()
      this.context.translate(this.canvas.width - SVG_END.viewBox.width, 0)
      this.context.fill(SVG_END.path)
      this.context.restore()

      this.context.save()
      this.context.translate(SVG_END.viewBox.width, 0)
      this.context.fill(SVG_TOP.path)
      this.context.restore()

      this.context.save()
      this.context.translate(SVG_END.viewBox.width, SVG_END.viewBox.height - SVG_TOP.viewBox.height)
      this.context.translate(SVG_TOP.viewBox.width / 2, SVG_TOP.viewBox.height / 2)
      this.context.rotate(Math.PI)
      this.context.translate(-SVG_TOP.viewBox.width / 2, -SVG_TOP.viewBox.height / 2)
      this.context.fill(SVG_TOP.path)
      this.context.restore()

      this.context.restore()
    }
  },

  watch: {
    levels: {
      immediate: true,
      handler () {
        this.draw()
      }
    }
  },

  mounted () {
    this.canvas = this.$refs.canvas as HTMLCanvasElement | undefined

    if (this.canvas != null) {
      this.context = this.canvas.getContext('2d')

      const onResize: () => void = () => {
        this.setupCanvas()
        this.draw()
      }
      new ResizeObserver(debounce(onResize, 100)).observe(this.canvas)
    }
  }
})
</script>

<template>
  <canvas ref="canvas">
    A progress bar visualizing how many points have been gained (in green) and how many are still open (in gray).
  </canvas>
</template>
