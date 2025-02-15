<script lang="ts">
import { defineComponent } from 'vue'
import debounce from 'lodash.debounce'

export default defineComponent({
  name: 'PointsAnimation',

  created () {
    const body = document.querySelector('body')
    if (body != null) {
      // this.positionVideo is also called immediately after starting observing
      new ResizeObserver(debounce(() => this.positionVideo(), 1000)).observe(body)
    }
    const animationPosition = document.querySelector('.animationPosition')
    if (animationPosition != null) {
      new MutationObserver(() => this.positionVideo()).observe(animationPosition, { childList: true })
    }
  },

  methods: {
    positionVideo (): void {
      const animationPosition = document.querySelector('.animationPosition')
      if (animationPosition == null) {
        return
      }
      const boundingBox = animationPosition.getBoundingClientRect()
      const pointsY = boundingBox.top + boundingBox.height / 2
      const pointsX = boundingBox.left + boundingBox.width / 2

      const video = this.$refs.animation as HTMLElement
      const videoX = video.clientWidth / 2
      const videoY = video.clientHeight / 2

      video.style.top = `${pointsY - videoY}px`
      video.style.left = `${pointsX - videoX}px`
    },

    async play (): Promise<void> {
      const video = this.$refs.animation as HTMLMediaElement | undefined
      if (video != null) {
        video.currentTime = 0
        await video.play()
      }
    }
  }
})
</script>

<template>
  <video
    ref="animation"
    class="animation"
  >
    <source
      src="../assets/pop.webm"
      type="video/webm"
    >
  </video>
</template>

<style scoped>
.animation {
  position: absolute;
  width: 300px;
}
</style>
