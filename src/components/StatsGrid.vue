<!-- src/components/StatsGrid.vue -->
<template>
  <div
    ref="targetRef"
    class="stats-grid reveal-stagger"
    :class="{ visible: isVisible }"
  >
    <div v-for="stat in stats" :key="stat.label" class="stat-card">
      <div class="stat-num">{{ stat.num }}</div>
      <div class="stat-lbl">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'

// Destructure the reactive ref directly
const [isVisible, targetRef] = useScrollReveal({ threshold: 0.1 })

const stats = [
  { num: '5+', label: 'Projects' },
  { num: '3+', label: 'Years Exp' },
  { num: '1', label: 'Models Trained' },
  { num: 'AI/ML', label: 'Research Focus' }
]
</script>