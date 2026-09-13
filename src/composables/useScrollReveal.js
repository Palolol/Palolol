// src/composables/useScrollReveal.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollReveal(options = {}) {
  const isVisible = ref(false)
  const targetRef = ref(null) // Safe, standard reactive ref
  let observer = null

  const {
    threshold = 0.1, // Lowered slightly to trigger more reliably on smaller screens
    rootMargin = '0px 0px -40px 0px',
    once = true
  } = options

  onMounted(() => {
    if (!targetRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (once && observer) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(targetRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return [isVisible, targetRef]
}