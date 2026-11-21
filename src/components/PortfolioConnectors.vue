<!-- src/components/PortfolioConnectors.vue -->
<template>
  <div class="port-connectors-wrapper" aria-hidden="true">
    <svg class="port-connectors-svg">
      <defs>
        <!-- Neon Cyan Glow Filter -->
        <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur1" />
          <feGaussianBlur stdDeviation="7" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <!-- Gradient for Left Line -->
        <linearGradient id="lineGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00d9ff" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#00d9ff" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#1220e2" stop-opacity="0.8" />
        </linearGradient>

        <!-- Gradient for Right Line -->
        <linearGradient id="lineGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#00d9ff" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#00d9ff" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#1220e2" stop-opacity="0.8" />
        </linearGradient>
      </defs>

      <!-- LEFT CONNECTOR 1 -->
      <g v-if="paths.l1">
        <path :d="paths.l1" class="conn-base-line" />
        <path :d="paths.l1" class="conn-pulse-line left" />
        <circle :cx="coords.lx1" :cy="coords.ly1" r="4" class="conn-node" />
        <circle :cx="coords.cx1" :cy="coords.cy1" r="4.5" class="conn-node center" />
      </g>

      <!-- LEFT CONNECTOR 2 -->
      <g v-if="paths.l2">
        <path :d="paths.l2" class="conn-base-line" />
        <path :d="paths.l2" class="conn-pulse-line left delay" />
        <circle :cx="coords.lx2" :cy="coords.ly2" r="4" class="conn-node" />
        <circle :cx="coords.cx2" :cy="coords.cy2" r="4.5" class="conn-node center" />
      </g>

      <!-- RIGHT CONNECTOR 1 -->
      <g v-if="paths.r1">
        <path :d="paths.r1" class="conn-base-line" />
        <path :d="paths.r1" class="conn-pulse-line right" />
        <circle :cx="coords.rx1" :cy="coords.ry1" r="4" class="conn-node" />
        <circle :cx="coords.cx1r" :cy="coords.cy1r" r="4.5" class="conn-node center" />
      </g>

      <!-- RIGHT CONNECTOR 2 -->
      <g v-if="paths.r2">
        <path :d="paths.r2" class="conn-base-line" />
        <path :d="paths.r2" class="conn-pulse-line right delay" />
        <circle :cx="coords.rx2" :cy="coords.ry2" r="4" class="conn-node" />
        <circle :cx="coords.cx2r" :cy="coords.cy2r" r="4.5" class="conn-node center" />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'

const coords = reactive({
  lx1: 0, ly1: 0, cx1: 0, cy1: 0,
  lx2: 0, ly2: 0, cx2: 0, cy2: 0,
  rx1: 0, ry1: 0, cx1r: 0, cy1r: 0,
  rx2: 0, ry2: 0, cx2r: 0, cy2r: 0,
})

const paths = reactive({
  l1: '',
  l2: '',
  r1: '',
  r2: ''
})

let rafId = null

function updateLines() {
  const container = document.querySelector('.port-layout')
  const leftSide = document.querySelector('.port-side-left')
  const centerCol = document.querySelector('.port-main')
  const rightSide = document.querySelector('.port-side-right')

  if (!container || !leftSide || !centerCol || !rightSide) return

  const cRect = container.getBoundingClientRect()
  const lRect = leftSide.getBoundingClientRect()
  const mRect = centerCol.getBoundingClientRect()
  const rRect = rightSide.getBoundingClientRect()

  // Only draw if there is noticeable space between panels and center
  if (mRect.left - lRect.right < 15 || rRect.left - mRect.right < 15) {
    paths.l1 = ''
    paths.l2 = ''
    paths.r1 = ''
    paths.r2 = ''
    return
  }

  // Anchor points relative to .port-layout container
  const leftX = lRect.right - cRect.left
  const centerLeftX = mRect.left - cRect.left

  const centerRightX = mRect.right - cRect.left
  const rightX = rRect.left - cRect.left

  // Heights on left
  const ly1 = lRect.top - cRect.top + 70
  const ly2 = lRect.top - cRect.top + 280

  // Heights on center
  const cy1 = mRect.top - cRect.top + 100
  const cy2 = mRect.top - cRect.top + 340

  // Heights on right
  const ry1 = rRect.top - cRect.top + 80
  const ry2 = rRect.top - cRect.top + 290

  coords.lx1 = leftX
  coords.ly1 = ly1
  coords.cx1 = centerLeftX
  coords.cy1 = cy1

  coords.lx2 = leftX
  coords.ly2 = ly2
  coords.cx2 = centerLeftX
  coords.cy2 = cy2

  coords.rx1 = rightX
  coords.ry1 = ry1
  coords.cx1r = centerRightX
  coords.cy1r = cy1

  coords.rx2 = rightX
  coords.ry2 = ry2
  coords.cx2r = centerRightX
  coords.cy2r = cy2

  // Build circuit-style paths (horizontal -> 45deg -> horizontal)
  const lMidX = leftX + (centerLeftX - leftX) * 0.5
  paths.l1 = `M ${leftX} ${ly1} L ${lMidX - 20} ${ly1} L ${lMidX + 20} ${cy1} L ${centerLeftX} ${cy1}`
  paths.l2 = `M ${leftX} ${ly2} L ${lMidX - 30} ${ly2} L ${lMidX + 30} ${cy2} L ${centerLeftX} ${cy2}`

  const rMidX = centerRightX + (rightX - centerRightX) * 0.5
  paths.r1 = `M ${centerRightX} ${cy1} L ${rMidX - 20} ${cy1} L ${rMidX + 20} ${ry1} L ${rightX} ${ry1}`
  paths.r2 = `M ${centerRightX} ${cy2} L ${rMidX - 30} ${cy2} L ${rMidX + 30} ${ry2} L ${rightX} ${ry2}`
}

function onScroll() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(updateLines)
}

onMounted(() => {
  updateLines()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.port-connectors-wrapper {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: visible;
}

.port-connectors-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Base glowing circuit line */
.conn-base-line {
  fill: none;
  stroke: rgba(0, 217, 255, 0.25);
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
}

/* Bright traveling pulse line */
.conn-pulse-line {
  fill: none;
  stroke: #00d9ff;
  stroke-width: 2.5;
  stroke-linecap: round;
  filter: url(#neon-glow);
  stroke-dasharray: 80 260;
  animation: pulseMove 3.5s linear infinite;
}

.conn-pulse-line.delay {
  animation-delay: 1.75s;
}

.conn-pulse-line.right {
  stroke: #00d9ff;
  animation: pulseMoveRev 3.5s linear infinite;
}

.conn-pulse-line.right.delay {
  animation-delay: 1.75s;
}

@keyframes pulseMove {
  from {
    stroke-dashoffset: 340;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes pulseMoveRev {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 340;
  }
}

/* Neon Terminal Nodes */
.conn-node {
  fill: #00d9ff;
  stroke: #ffffff;
  stroke-width: 1.5;
  filter: drop-shadow(0 0 6px #00d9ff);
  animation: nodeGlow 2s ease-in-out infinite alternate;
}

.conn-node.center {
  fill: #1220e2;
  stroke: #00d9ff;
  stroke-width: 2;
}

@keyframes nodeGlow {
  0% {
    r: 3.5;
    opacity: 0.7;
  }
  100% {
    r: 5;
    opacity: 1;
  }
}

@media (max-width: 1200px) {
  .port-connectors-wrapper {
    display: none;
  }
}
</style>
