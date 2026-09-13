<!-- src/components/PortfolioHero.vue -->
<template>
  <div
    ref="targetRef"
    class="port-hero reveal"
    :class="{ visible: isVisible }"
  >
    <div class="port-hero-inner">
      <span class="port-hero-tag">Portfolio · AI/ML · 2025</span>
      <h2 class="port-hero-name">PALO<span>LOL</span></h2>
      <p class="port-hero-sub">
        College student &amp; AI/ML builder — Tomato diagnosis expert
        systems, mobile food delivery, and AI models built on a laptop.
      </p>
      <div class="port-hero-pills">
        <span class="pill">🤖 AI/ML</span>
        <span class="pill">🍅 Expert Systems</span>
        <span class="pill">📱 Mobile Dev</span>
        <span class="pill">🧠 Deep Learning</span>
        <span class="pill">🐍 Python</span>
      </div>
    </div>
    <div class="port-hero-avatar">
      <video :src="animeTeacherUrl" autoplay muted loop playsinline></video>
    </div>
  </div>
</template>

<script setup>
import animeTeacherUrl from '../assets/frieren.gif.mp4'
import { useScrollReveal } from '../composables/useScrollReveal'

const [isVisible, targetRef] = useScrollReveal({ threshold: 0.1 })
</script>