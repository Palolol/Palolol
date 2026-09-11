// src/composables/useStickyShowcase.js
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export function useStickyShowcase() {
  const activeIndex = ref(0)
  const progress = ref(0)
  const cards = ref([])
  const lineProgress = ref(0)

  let containerEl = null
  let rafId = null

  const setContainer = (el) => { if (el) containerEl = el }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  }

  function calculate() {
    if (!containerEl) return
    const rect = containerEl.getBoundingClientRect()
    const h = containerEl.offsetHeight
    const vh = window.innerHeight
    const scrollable = h - vh
    const scrolled = -rect.top
    const raw = Math.max(0, Math.min(1, scrolled / scrollable))

    progress.value = raw
    lineProgress.value = easeInOut(raw)

    const items = containerEl.querySelectorAll('[data-card]')
    const count = items.length
    if (!count) return

    const seg = 1 / count
    const result = []

    for (let i = 0; i < count; i++) {
      const start = i * seg
      const local = Math.max(0, Math.min(1, (raw - start) / seg))

      const state = { opacity: 0, scale: 0.94, y: 40, phase: 'hidden' }

      if (local <= 0) {
        state.phase = 'hidden'
      } else if (local <= 0.16) {
        const t = easeInOut(local / 0.16)
        state.phase = 'entering'
        state.opacity = t
        state.scale = 0.94 + 0.06 * t
        state.y = 40 * (1 - t)
      } else if (local <= 0.8) {
        state.phase = 'holding'
        state.opacity = 1
        state.scale = 1
        state.y = 0
      } else {
        const t = easeInOut((local - 0.8) / 0.2)
        state.phase = 'exiting'
        state.opacity = 1 - t
        state.scale = 1 + 0.02 * t
        state.y = -24 * t
      }
      result.push(state)
    }

    cards.value = result
    const holding = result.findIndex(c => c.phase === 'holding')
    if (holding !== -1) activeIndex.value = holding
    else {
      const entering = result.findIndex(c => c.phase === 'entering')
      if (entering !== -1) activeIndex.value = entering
    }
  }

  function onScroll() {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(calculate)
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    nextTick(calculate)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { activeIndex, progress, cards, lineProgress, setContainer }
}