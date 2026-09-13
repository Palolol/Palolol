<!-- src/components/ContactCard.vue -->
<template>
  <div
    id="contact"
    ref="targetRef"
    class="contact-card reveal"
    :class="{ visible: isVisible }"
  >
    <h3 class="contact-title">Let's Build Something</h3>
    <p class="contact-sub">
      Open to AI/ML research collaborations and student projects.
    </p>
    <div class="contact-btns">
      <a href="mailto:palolol1165@gmail.com" class="btn-primary">
        Send a message
      </a>
      <a
        href="https://t.me/palolol"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-outline"
        >💬 Telegram</a
      >
      <span class="btn-email">palolol1165@gmail.com</span>
    </div>
  </div>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'

const [isVisible, targetRef] = useScrollReveal({ threshold: 0.1 })
</script>