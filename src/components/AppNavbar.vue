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
        href="https://www.youtube.com/playlist?list=PLLKtzYG4mEMLajJa5d59vLcig6oRfXgd6"
        target="_blank"
        rel="noopener noreferrer"
        class="nav-tg"
        aria-label="YouTube Playlist"
        >📺 YouTube</a
      >
      <a
        href="https://t.me/palolol"
        target="_blank"
        rel="noopener noreferrer"
        class="nav-tg"
        aria-label="Message on Telegram"
        >✈️ Telegram</a
      >
      <a href="mailto:palolol1165@gmail.com" class="nav-cta">Hire Me</a>
    <!-- More ▾ : dropdown anchored to the top-right corner -->
    <div class="nav-more" ref="moreRef">
      <button
        class="nav-more-btn"
        :class="{ open: moreOpen }"
        aria-haspopup="menu"
        :aria-expanded="moreOpen"
        @click="moreOpen = !moreOpen"
      >
        More <span class="caret">▾</span>
      </button>
      <transition name="drop">
        <div v-if="moreOpen" class="more-panel" role="menu">
          <!-- top row: left → right -->
          <ul class="more-row">
            <li v-for="item in rowLinks" :key="item.label" role="none">
              <a
                class="more-item"
                role="menuitem"
                :href="item.href || '#'"
                :target="item.external ? '_blank' : null"
                :rel="item.external ? 'noopener noreferrer' : null"
                @click="handleMoreClick(item, $event)"
              >
                <span v-if="item.icon" class="more-icon">{{ item.icon }}</span>
                <span class="more-text">{{ item.label }}</span>
              </a>
            </li>
          </ul>
          <!-- overflow: continues down the right edge, text wraps -->
          <ul v-if="colLinks.length" class="more-col">
            <li v-for="item in colLinks" :key="item.label" role="none">
              <a
                class="more-item"
                role="menuitem"
                :href="item.href || '#'"
                :target="item.external ? '_blank' : null"
                :rel="item.external ? 'noopener noreferrer' : null"
                @click="handleMoreClick(item, $event)"
              >
                <span v-if="item.icon" class="more-icon">{{ item.icon }}</span>
                <span class="more-text">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>
      </transition>
    </div>

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
      <li v-for="item in moreLinks" :key="'m-' + item.label">
        <a
          class="mobile-link"
          :href="item.href || '#'"
          :target="item.external ? '_blank' : null"
          :rel="item.external ? 'noopener noreferrer' : null"
          @click="handleMoreClick(item, $event)"
        >
          <span>{{ item.icon }} {{ item.label }}</span>
        </a>
      </li>
    </ul>
      <a href="mailto:palolol1165@gmail.com" class="nav-cta mobile-cta">
        Hire Me
      </a>
      <a
        href="https://www.youtube.com/playlist?list=PLLKtzYG4mEMLajJa5d59vLcig6oRfXgd6"
        target="_blank"
        rel="noopener noreferrer"
        class="nav-tg mobile-tg"
        >📺 YouTube Playlist</a
      >
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { navLinks, moreLinks, MORE_ROW_MAX } from '../data/navLinks'

defineProps({
  isScrolled: Boolean,
  activeSection: String
})

const emit = defineEmits(['goto'])
const menuOpen = ref(false)
const moreOpen = ref(false)
const moreRef = ref(null)
const rowLinks = computed(() => moreLinks.slice(0, MORE_ROW_MAX))
const colLinks = computed(() => moreLinks.slice(MORE_ROW_MAX))

function handleMoreClick(item, event) {
  if (item.id) {
    event.preventDefault()
    emit('goto', item.id)
  }
  moreOpen.value = false
  menuOpen.value = false
}

function onDocClick(e) {
  if (moreRef.value && !moreRef.value.contains(e.target)) moreOpen.value = false
}
function onKey(e) {
  if (e.key === 'Escape') moreOpen.value = false
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

function handleMobileClick(id) {
  emit('goto', id)
  menuOpen.value = false
}
</script>