// src/composables/useParticles.js
import { ref, onUnmounted } from 'vue'

// Particle icons that burst on card exit
const PARTICLE_ICONS = ['⚡', '✦', '◆', '▲', '●', '🔥', '💎', '⭐']
const CODE_ICONS = ['{ }', '< />', 'fn()', '[]', '#', '01', 'AI', 'ML']

export function useParticles() {
  let canvas = null
  let ctx = null
  let particles = []
  let rafId = null
  let isRunning = false
  const isActive = ref(false)

  class Particle {
    constructor(x, y, type = 'spark') {
      this.x = x
      this.y = y
      this.type = type

      // Random direction
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 6

      this.vx = Math.cos(angle) * speed
      this.vy = Math.sin(angle) * speed - 2 // Slight upward bias
      this.gravity = 0.08

      // Visuals
      this.size = type === 'spark' ? 2 + Math.random() * 4 : 10 + Math.random() * 6
      this.rotation = Math.random() * 360
      this.rotationSpeed = (Math.random() - 0.5) * 8
      this.opacity = 1
      this.decay = 0.008 + Math.random() * 0.012
      this.life = 1

      // Color
      const colors = [
        '#1220e2', '#7b93ff', '#4a5aff',
        '#ff4444', '#22c55e', '#f59e0b',
        '#a855f7', '#00d4ff', '#ff6b6b'
      ]
      this.color = colors[Math.floor(Math.random() * colors.length)]

      // Glow
      this.glowSize = this.size * 3
      this.trail = []
      this.maxTrailLength = type === 'spark' ? 5 : 0

      // Icon for code/icon particles
      if (type === 'icon') {
        this.icon = PARTICLE_ICONS[Math.floor(Math.random() * PARTICLE_ICONS.length)]
      } else if (type === 'code') {
        this.icon = CODE_ICONS[Math.floor(Math.random() * CODE_ICONS.length)]
      }
    }

    update() {
      // Store trail position
      if (this.maxTrailLength > 0) {
        this.trail.push({ x: this.x, y: this.y, opacity: this.opacity })
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift()
        }
      }

      // Physics
      this.vy += this.gravity
      this.x += this.vx
      this.y += this.vy

      // Friction
      this.vx *= 0.99
      this.vy *= 0.99

      // Rotation
      this.rotation += this.rotationSpeed

      // Fade out
      this.life -= this.decay
      this.opacity = Math.max(0, this.life)

      return this.life > 0
    }

    draw(ctx) {
      ctx.save()

      // Draw trail
      if (this.trail.length > 1) {
        for (let i = 0; i < this.trail.length - 1; i++) {
          const t = this.trail[i]
          const trailOpacity = (i / this.trail.length) * this.opacity * 0.3
          ctx.beginPath()
          ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = this.color + Math.floor(trailOpacity * 255).toString(16).padStart(2, '0')
          ctx.fill()
        }
      }

      ctx.translate(this.x, this.y)
      ctx.rotate((this.rotation * Math.PI) / 180)
      ctx.globalAlpha = this.opacity

      if (this.type === 'spark') {
        // Glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.glowSize)
        gradient.addColorStop(0, this.color + '60')
        gradient.addColorStop(1, this.color + '00')
        ctx.beginPath()
        ctx.arc(0, 0, this.glowSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core spark
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // White center
        ctx.beginPath()
        ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      } else if (this.type === 'icon' || this.type === 'code') {
        ctx.font = `${this.size}px ${this.type === 'code' ? '"JetBrains Mono", monospace' : 'sans-serif'}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = this.color
        ctx.fillText(this.icon, 0, 0)
      } else if (this.type === 'ring') {
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        ctx.strokeStyle = this.color
        ctx.lineWidth = 1.5
        ctx.stroke()
      } else if (this.type === 'diamond') {
        ctx.beginPath()
        ctx.moveTo(0, -this.size)
        ctx.lineTo(this.size, 0)
        ctx.lineTo(0, this.size)
        ctx.lineTo(-this.size, 0)
        ctx.closePath()
        ctx.fillStyle = this.color
        ctx.fill()
      }

      ctx.restore()
    }
  }

  function initCanvas(canvasEl) {
    canvas = canvasEl
    ctx = canvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
  }

  function resizeCanvas() {
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    ctx.scale(dpr, dpr)
  }

  function burst(x, y, count = 40) {
    isActive.value = true

    // Mix of particle types
    for (let i = 0; i < count; i++) {
      let type
      const rand = Math.random()
      if (rand < 0.45) type = 'spark'
      else if (rand < 0.65) type = 'icon'
      else if (rand < 0.80) type = 'code'
      else if (rand < 0.90) type = 'ring'
      else type = 'diamond'

      particles.push(new Particle(x, y, type))
    }

    if (!isRunning) {
      isRunning = true
      animate()
    }
  }

  function burstFromElement(element, count = 50) {
    if (!canvas || !element) return

    const canvasRect = canvas.parentElement.getBoundingClientRect()
    const elRect = element.getBoundingClientRect()

    // Burst from center of element
    const x = elRect.left - canvasRect.left + elRect.width / 2
    const y = elRect.top - canvasRect.top + elRect.height / 2

    burst(x, y, count)
  }

  function animate() {
    if (!ctx || !canvas) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    particles = particles.filter(p => {
      const alive = p.update()
      if (alive) p.draw(ctx)
      return alive
    })

    if (particles.length > 0) {
      rafId = requestAnimationFrame(animate)
    } else {
      isRunning = false
      isActive.value = false
    }
  }

  function cleanup() {
    window.removeEventListener('resize', resizeCanvas)
    if (rafId) cancelAnimationFrame(rafId)
    particles = []
    isRunning = false
  }

  onUnmounted(cleanup)

  return {
    initCanvas,
    burst,
    burstFromElement,
    isActive,
    cleanup
  }
}