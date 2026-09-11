// src/composables/useStickyScroll.js
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

export function useStickyScroll(options = {}) {
  const {
    onCardEnter = null,
    onCardExit = null,
    onCardHold = null
  } = options

  const activeIndex = ref(0)
  const scrollProgress = ref(0)
  const cardProgress = ref([])
  const lineDrawProgress = ref(0)
  let containerEl = null
  let rafId = null
  let prevPhases = []

  const setContainerRef = (el) => {
    if (el) containerEl = el
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  function easeInCubic(t) {
    return t * t * t
  }

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  function calculateProgress() {
    if (!containerEl) return

    const rect = containerEl.getBoundingClientRect()
    const containerHeight = containerEl.offsetHeight
    const viewportHeight = window.innerHeight

    const totalScrollable = containerHeight - viewportHeight
    const scrolled = -rect.top
    const rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollable))

    scrollProgress.value = rawProgress
    lineDrawProgress.value = easeInOutCubic(rawProgress)

    const cards = containerEl.querySelectorAll('[data-sticky-card]')
    const cardCount = cards.length
    if (cardCount === 0) return

    const segmentSize = 1 / cardCount
    const newCardProgress = []

    for (let i = 0; i < cardCount; i++) {
      const segmentStart = i * segmentSize
      const localProgress = Math.max(0, Math.min(1,
        (rawProgress - segmentStart) / segmentSize
      ))

      let cardState = {
        progress: localProgress,
        opacity: 0,
        scale: 0.8,
        y: 80,
        blur: 12,
        rotateX: 15,
        phase: 'hidden'
      }

      if (localProgress <= 0) {
        cardState.phase = 'hidden'
      } else if (localProgress <= 0.2) {
        const t = localProgress / 0.2
        const eased = easeOutCubic(t)
        cardState.phase = 'entering'
        cardState.opacity = eased
        cardState.scale = 0.8 + 0.2 * eased
        cardState.y = 80 * (1 - eased)
        cardState.blur = 12 * (1 - eased)
        cardState.rotateX = 15 * (1 - eased)
      } else if (localProgress <= 0.75) {
        cardState.phase = 'holding'
        cardState.opacity = 1
        cardState.scale = 1
        cardState.y = 0
        cardState.blur = 0
        cardState.rotateX = 0
      } else if (localProgress <= 1) {
        const t = (localProgress - 0.75) / 0.25
        const eased = easeInCubic(t)
        cardState.phase = 'exiting'
        cardState.opacity = 1 - eased
        cardState.scale = 1 + 0.1 * eased
        cardState.y = -50 * eased
        cardState.blur = 10 * eased
        cardState.rotateX = -8 * eased
      }

      newCardProgress.push(cardState)
    }

    // Detect phase transitions for callbacks
    for (let i = 0; i < newCardProgress.length; i++) {
      const prev = prevPhases[i]
      const curr = newCardProgress[i].phase

      if (prev !== curr) {
        if (curr === 'entering' && onCardEnter) onCardEnter(i)
        if (curr === 'holding' && onCardHold) onCardHold(i)
        if (curr === 'exiting' && onCardExit) onCardExit(i)
      }
    }

    prevPhases = newCardProgress.map(c => c.phase)
    cardProgress.value = newCardProgress

    const holdingIndex = newCardProgress.findIndex(c => c.phase === 'holding')
    if (holdingIndex !== -1) {
      activeIndex.value = holdingIndex
    } else {
      const enteringIndex = newCardProgress.findIndex(c => c.phase === 'entering')
      if (enteringIndex !== -1) activeIndex.value = enteringIndex
    }
  }

  function onScroll() {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(calculateProgress)
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    nextTick(calculateProgress)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (rafId) cancelAnimationFrame(rafId)
  })

  return {
    activeIndex,
    scrollProgress,
    cardProgress,
    lineDrawProgress,
    setContainerRef
  }
}