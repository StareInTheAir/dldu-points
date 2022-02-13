<script lang="ts">
import debounce from 'lodash.debounce'
import { defineComponent, PropType } from 'vue'
import { SVG_CORNER, SVG_TOP } from '../paths/svg'
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

      const hOffset = SVG_CORNER.viewBox.width / 2
      const vOffset = SVG_CORNER.viewBox.height / 2
      this.context.translate(hOffset, vOffset)

      const widthForProgressBar = this.canvas.width - 2 * hOffset
      const heightForProgressBar = this.canvas.height - 2 * vOffset
      this.drawProgressBar(widthForProgressBar, heightForProgressBar)

      this.context.restore()

      this.drawBorder()
    },

    drawProgressBar (width: number, height: number) {
      if (this.canvas == null || this.context == null) {
        return
      }

      this.context.save()
      const totalPoints = totalRunPoints({ levels: this.levels })
      this.context.scale(width / totalPoints, 1)

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

      function rotate (context: CanvasRenderingContext2D, viewBox: DOMRect, degrees: number): void {
        context.translate(viewBox.width / 2, viewBox.height / 2)
        context.rotate(degrees * Math.PI / 180)
        context.translate(-viewBox.width / 2, -viewBox.height / 2)
      }

      this.context.save()
      this.context.fillStyle = 'black'

      // Draw lower left corner
      this.context.save()
      this.context.translate(0, this.canvas.height - SVG_CORNER.viewBox.height)
      this.context.fill(SVG_CORNER.path)
      this.context.restore()

      // Draw top left corner
      this.context.save()
      rotate(this.context, SVG_CORNER.viewBox, 90)
      this.context.fill(SVG_CORNER.path)
      this.context.restore()

      // Draw top right corner
      this.context.save()
      this.context.translate(this.canvas.width - SVG_CORNER.viewBox.width, 0)
      rotate(this.context, SVG_CORNER.viewBox, 180)
      this.context.fill(SVG_CORNER.path)
      this.context.restore()

      // Draw lower right corner
      this.context.save()
      this.context.translate(this.canvas.width - SVG_CORNER.viewBox.width, this.canvas.height - SVG_CORNER.viewBox.height)
      rotate(this.context, SVG_CORNER.viewBox, 270)
      this.context.fill(SVG_CORNER.path)
      this.context.restore()

      // Draw horizontal borders
      this.context.save()
      // Don't draw over corners => clip to region between corners
      this.context.beginPath()
      this.context.rect(SVG_CORNER.viewBox.width, 0, this.canvas.width - 2 * SVG_CORNER.viewBox.width, this.canvas.height)
      this.context.clip()
      for (let tile = 0; tile < Math.ceil(this.canvas.width / SVG_TOP.viewBox.width); tile += 1) {
        // Draw top border
        this.context.save()
        this.context.translate(tile * SVG_TOP.viewBox.width, 0)
        this.context.fill(SVG_TOP.path)
        this.context.restore()

        // Draw bottom border
        this.context.save()
        this.context.translate(tile * SVG_TOP.viewBox.width, this.canvas.height - SVG_TOP.viewBox.height)
        rotate(this.context, SVG_TOP.viewBox, 180)
        this.context.fill(SVG_TOP.path)
        this.context.restore()
      }
      this.context.restore()

      // Draw vertical borders
      this.context.save()
      // Don't draw over corners => clip to region between corners
      this.context.beginPath()
      this.context.rect(0, SVG_CORNER.viewBox.height, this.canvas.width, this.canvas.height - 2 * SVG_CORNER.viewBox.height)
      this.context.clip()
      for (let tile = 0; tile < Math.ceil(this.canvas.height / SVG_TOP.viewBox.width); tile += 1) {
        // Draw right border
        this.context.save()
        this.context.translate(this.canvas.width - SVG_TOP.viewBox.height, tile * SVG_TOP.viewBox.width)
        rotate(this.context, SVG_TOP.viewBox, 90)
        // Correct origin after rotation, so that border is at top left and not center
        this.context.translate(-(SVG_TOP.viewBox.height - SVG_TOP.viewBox.width) / 2, (SVG_TOP.viewBox.width - SVG_TOP.viewBox.height) / 2)
        this.context.fill(SVG_TOP.path)
        this.context.restore()

        // Draw left border
        this.context.save()
        this.context.translate(0, tile * SVG_TOP.viewBox.width)
        rotate(this.context, SVG_TOP.viewBox, 270)
        // Correct origin after rotation, so that border is at top left and not center
        this.context.translate((SVG_TOP.viewBox.height - SVG_TOP.viewBox.width) / 2, -(SVG_TOP.viewBox.width - SVG_TOP.viewBox.height) / 2)
        this.context.fill(SVG_TOP.path)
        this.context.restore()
      }
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
