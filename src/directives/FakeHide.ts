import type { ObjectDirective } from 'vue'

const ANIMATION_DURATION_MS = 314
const ANIMATION_DURATION_CSS_STRING = `${ANIMATION_DURATION_MS / 1_000}s`
const ANIMATION_PAUSE_MS = 314
const ATTRIBUTE_NAME_LAST_TIMEOUT_ID = 'dldu-hide-timeout-id'

function fadeIn (el: HTMLElement): void {
  el.style.opacity = '1'
}

function fadeOut (el: HTMLElement): void {
  el.style.opacity = '0'
}

function setupOpacityTranstion (el: HTMLElement): void {
  fadeOut(el) // doesn't fade out, since transitionProperty is not set yet
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

function clearAndSetTimeout (handler: Function, timeout: number, el: HTMLElement): void {
  const lastTimeoutId = el.getAttribute(ATTRIBUTE_NAME_LAST_TIMEOUT_ID)
  if (lastTimeoutId != null) {
    clearTimeout(parseInt(lastTimeoutId))
  }
  const newTimeoutId = window.setTimeout(handler, timeout, el)
  el.setAttribute(ATTRIBUTE_NAME_LAST_TIMEOUT_ID, `${newTimeoutId}`)
}

const FakeHideDirective: ObjectDirective<HTMLElement, boolean> = {
  mounted (el) {
    setupOpacityTranstion(el)
    // All elements are hidden at the start
    hideElement(el)
  },

  updated (el, binding) {
    if (binding.value) {
      // el should be fake hidden
      fadeOut(el)
      clearAndSetTimeout(hideElement, ANIMATION_DURATION_MS, el)
    } else {
      // el should visible
      clearAndSetTimeout((el: HTMLElement) => {
        unhideElement(el)
        fadeIn(el)
      }, ANIMATION_DURATION_MS + ANIMATION_PAUSE_MS, el)
    }
  }
}

export default FakeHideDirective
