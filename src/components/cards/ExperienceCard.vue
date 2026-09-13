<template>
  <div class="card-inner">
    <div class="card-header">
      <div class="card-icon">🚀</div>
      <div class="card-head-text">
        <h4>Experience</h4>
        <p>Learning &amp; building</p>
      </div>
      <span class="card-index">03</span>
    </div>
    <div class="timeline">
      <div
        v-for="(exp, j) in experience"
        :key="exp.role"
        class="timeline-item"
        :class="{ active: isActive }"
        :style="{ transitionDelay: j * 0.12 + 0.15 + 's' }"
      >
        <div class="timeline-marker">
          <span class="timeline-dot"></span>
          <span
            v-if="j < experience.length - 1"
            class="timeline-line"
          ></span>
        </div>
        <div class="timeline-content">
          <div class="timeline-role">{{ exp.role }}</div>
          <div class="timeline-place">{{ exp.place }}</div>
          <span class="timeline-year">{{ exp.year }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { experience } from '../../data/experience'

defineProps({
  isActive: Boolean
})
</script>