<template>
  <div class="card-inner">
    <div class="card-header">
      <div class="card-icon">⚡</div>
      <div class="card-head-text">
        <h4>Technical Skills</h4>
        <p>Tools I work with</p>
      </div>
      <span class="card-index">02</span>
    </div>
    <div class="skills-list">
      <div v-for="skill in skills" :key="skill.name" class="skill-item">
        <div class="skill-meta">
          <span class="skill-name">{{ skill.name }}</span>
          <span class="skill-pct">{{ skill.pct }}%</span>
        </div>
        <div class="skill-track">
          <div
            class="skill-bar"
            :style="{ width: isActive ? skill.pct + '%' : '0%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { skills } from '../../data/skills'

defineProps({
  isActive: Boolean
})
</script>