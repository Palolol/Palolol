// src/composables/useScrollReveal.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollReveal(options = {}) {
  const isVisible = ref(false)
  let observer = null
  let targetElement = null

  const {
    threshold = 0.12,
    rootMargin = '0px 0px -60px 0px',
    once = true
  } = options

  const setRef = (el) => {
    if (el) {
      targetElement = el
      if (observer) observer.observe(el)
    }
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (once && observer) observer.unobserve(entry.target)
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      { threshold, rootMargin }
    )
    if (targetElement) observer.observe(targetElement)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return [isVisible, setRef]
}