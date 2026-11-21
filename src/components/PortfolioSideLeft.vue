<!-- src/components/PortfolioSideLeft.vue -->
<template>
  <aside class="port-side port-side-left">
    <!-- Quick Index Card -->
    <div class="port-side-card">
      <div class="port-side-header">
        <span class="port-side-icon">🧭</span>
        <h4 class="port-side-title">Quick Index</h4>
      </div>
      <nav class="port-side-nav">
        <button
          class="port-nav-btn"
          :class="{ active: activeSection === 'projects' }"
          @click="$emit('goto', 'projects')"
        >
          <span class="nav-btn-icon">🚀</span>
          <span class="nav-btn-text">Projects</span>
          <span class="nav-btn-badge">3</span>
        </button>
        <button
          class="port-nav-btn"
          :class="{ active: activeSection === 'skills' }"
          @click="$emit('goto', 'skills')"
        >
          <span class="nav-btn-icon">🛠️</span>
          <span class="nav-btn-text">Skills</span>
        </button>
        <button
          class="port-nav-btn"
          :class="{ active: activeSection === 'experience' }"
          @click="$emit('goto', 'experience')"
        >
          <span class="nav-btn-icon">💼</span>
          <span class="nav-btn-text">Experience</span>
        </button>
        <button
          class="port-nav-btn"
          :class="{ active: activeSection === 'testimonials' }"
          @click="$emit('goto', 'testimonials')"
        >
          <span class="nav-btn-icon">⭐</span>
          <span class="nav-btn-text">Testimonials</span>
        </button>
        <button
          class="port-nav-btn"
          :class="{ active: activeSection === 'contact' }"
          @click="$emit('goto', 'contact')"
        >
          <span class="nav-btn-icon">📬</span>
          <span class="nav-btn-text">Contact</span>
        </button>
      </nav>
    </div>

    <!-- Status & Focus Card -->
    <div class="port-side-card">
      <div class="port-side-header">
        <span class="status-dot-pulse"></span>
        <h4 class="port-side-title">Current Status</h4>
      </div>
      <div class="port-status-badge">Available for Projects</div>
      <ul class="port-status-list">
        <li>
          <span class="list-label">Role</span>
          <span class="list-val">AI/ML &amp; Web</span>
        </li>
        <li>
          <span class="list-label">Location</span>
          <span class="list-val">Cambodia (GMT+7)</span>
        </li>
        <li>
          <span class="list-label">Focus</span>
          <span class="list-val">Edge AI &amp; Vision</span>
        </li>
        <li>
          <span class="list-label">Status</span>
          <span class="list-val">College Student</span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  activeSection: {
    type: String,
    default: 'home'
  }
})

defineEmits(['goto'])
</script>
