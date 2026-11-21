// src/composables/useZoomCounter.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useZoomCounter() {
  const zoomScale = ref(1)

  function calculateZoom() {
    if (typeof window === 'undefined') return

    // Physical screen width vs browser window innerWidth
    const screenWidth = window.screen?.width || 1920
    const innerWidth = window.innerWidth

    let scale = 1

    // If innerWidth is significantly larger than screen width (user zoomed out via Ctrl -)
    if (innerWidth > screenWidth * 1.05) {
      scale = innerWidth / screenWidth
    } else if (window.devicePixelRatio && window.devicePixelRatio < 0.95) {
      // Direct devicePixelRatio reduction during zoom out
      scale = 1 / window.devicePixelRatio
    }

    // Clamp between 1x and 4x (4x corresponds to 25% zoom)
    scale = Math.min(4, Math.max(1, scale))
    zoomScale.value = scale

    // Export as CSS custom property for styles
    document.documentElement.style.setProperty('--zoom-counter', scale.toFixed(3))
  }

  onMounted(() => {
    calculateZoom()
    window.addEventListener('resize', calculateZoom, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calculateZoom)
  })

  return { zoomScale }
}
