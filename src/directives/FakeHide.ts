import { ObjectDirective } from 'vue'

const ANIMATION_DURATION_MS = 314
const ANIMATION_DURATION_CSS_STRING = `${ANIMATION_DURATION_MS / 1_000}s`
const ANIMATION_PAUSE_MS = 314

function fadeIn (el: HTMLElement): void {
  el.style.opacity = '0'
}

function fadeOut (el: HTMLElement): void {
  el.style.opacity = '1'
}

function setupOpacityTranstion (el: HTMLElement): void {
  fadeOut(el) // doesn't fade out, since transitionProperty is not set yet
  // Cubic ease-in
  // el.style.transitionTimingFunction = 'cubic-bezier(.55,.06,.68,.19)'
  el.style.transitionTimingFunction = 'ease-in'
  el.style.transitionProperty = 'opacity'
  el.style.transitionDuration = ANIMATION_DURATION_CSS_STRING
}

function hideElement (el: HTMLElement): void {
  el.style.position = 'absolute'
  el.style.top = '-99999px'
}

function unhideElement (el: HTMLElement): void {
  el.style.position = ''
  el.style.top = '0'
}

const FakeHideDirective: ObjectDirective<HTMLElement, boolean> = {
  mounted (el) {
    setupOpacityTranstion(el)
    // All elements are hidden at the start
    hideElement(el)
  },

  updated (el, binding) {
    if (binding.value) {
      fadeIn(el)
      setTimeout(hideElement, ANIMATION_DURATION_MS, el)
    } else {
      setTimeout(function () {
        unhideElement(el)
        fadeOut(el)
      }, ANIMATION_DURATION_MS + ANIMATION_PAUSE_MS)
    }
  }
}

export default FakeHideDirective
