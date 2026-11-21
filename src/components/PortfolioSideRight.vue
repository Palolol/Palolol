<!-- src/components/PortfolioSideRight.vue -->
<template>
  <aside class="port-side port-side-right">
    <!-- Key Highlights Card -->
    <div class="port-side-card">
      <div class="port-side-header">
        <span class="port-side-icon">⚡</span>
        <h4 class="port-side-title">Key Highlights</h4>
      </div>
      <div class="port-highlight-items">
        <div class="highlight-item">
          <div class="highlight-top">
            <span class="highlight-tag">🍅 Tomato AI</span>
            <span class="highlight-metric">94.8% Acc</span>
          </div>
          <p class="highlight-desc">
            Deep learning expert system for tomato disease diagnosis on mobile.
          </p>
        </div>

        <div class="highlight-item">
          <div class="highlight-top">
            <span class="highlight-tag">🛵 Food Delivery</span>
            <span class="highlight-metric">Mobile App</span>
          </div>
          <p class="highlight-desc">
            Complete ordering, live tracking, and dispatch system.
          </p>
        </div>

        <div class="highlight-item">
          <div class="highlight-top">
            <span class="highlight-tag">💻 Laptop AI Lab</span>
            <span class="highlight-metric">Edge AI</span>
          </div>
          <p class="highlight-desc">
            Trained and benchmarked lightweight neural networks locally.
          </p>
        </div>
      </div>
    </div>

    <!-- Direct Connect Card -->
    <div class="port-side-card">
      <div class="port-side-header">
        <span class="port-side-icon">🔗</span>
        <h4 class="port-side-title">Connect</h4>
      </div>
      <div class="port-connect-links">
        <a
          href="https://t.me/palolol"
          target="_blank"
          rel="noopener noreferrer"
          class="connect-link"
        >
          <span>✈️ Telegram</span>
          <span class="connect-arrow">↗</span>
        </a>
        <a
          href="https://github.com/Palolol"
          target="_blank"
          rel="noopener noreferrer"
          class="connect-link"
        >
          <span>🐙 GitHub</span>
          <span class="connect-arrow">↗</span>
        </a>
        <a
          href="https://www.youtube.com/playlist?list=PLLKtzYG4mEMLajJa5d59vLcig6oRfXgd6"
          target="_blank"
          rel="noopener noreferrer"
          class="connect-link"
        >
          <span>📺 YouTube</span>
          <span class="connect-arrow">↗</span>
        </a>
        <a
          href="mailto:palolol1165@gmail.com"
          class="connect-link"
        >
          <span>📧 Email Me</span>
          <span class="connect-arrow">↗</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup>
// Pure presentation component
</script>
