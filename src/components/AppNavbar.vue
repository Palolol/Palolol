<template>
  <nav class="navbar" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
    <div class="nav-inner">
      <a href="#home" class="nav-logo" @click.prevent="$emit('goto', 'home')">
        PALO<span>LOL</span>
      </a>
      <ul class="nav-links">
        <li v-for="link in navLinks" :key="link.id">
          <a
            class="nav-link"
            :class="{ active: activeSection === link.id }"
            @click.prevent="$emit('goto', link.id)"
            >{{ link.label }}</a
          >
        </li>
      </ul>
      <a
        href="https://t.me/palolol"
        target="_blank"
        rel="noopener noreferrer"
        class="nav-tg"
        aria-label="Message on Telegram"
        >✈️ Telegram</a
      >
      <a href="mailto:palolol1165@gmail.com" class="nav-cta">Hire Me</a>
      <button
        class="hamburger"
        @click="menuOpen = !menuOpen"
        aria-label="Toggle menu"
      >
        <span></span><span></span><span></span>
      </button>
    </div>

    <div class="mobile-menu" :class="{ open: menuOpen }">
      <ul>
        <li v-for="link in navLinks" :key="link.id">
          <a
            class="mobile-link"
            :class="{ active: activeSection === link.id }"
            @click.prevent="handleMobileClick(link.id)"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
      <a href="mailto:palolol1165@gmail.com" class="nav-cta mobile-cta">
        Hire Me
      </a>
      <a
        href="https://t.me/palolol"
        target="_blank"
        rel="noopener noreferrer"
        class="nav-tg mobile-tg"
        >✈️ Message on Telegram</a
      >
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { navLinks } from '../data/navLinks'

defineProps({
  isScrolled: Boolean,
  activeSection: String
})

const emit = defineEmits(['goto'])
const menuOpen = ref(false)

function handleMobileClick(id) {
  emit('goto', id)
  menuOpen.value = false
}
</script>