<!-- src/App.vue -->
<template>
  <div class="app-wrapper">
    <AppNavbar
      :is-scrolled="isScrolled"
      :active-section="activeSection"
      @goto="goTo"
    />

    <HomeSection
      :is-video-muted="isVideoMuted"
      :audio-error="audioError"
      :audio-playing="audioPlaying"
      @toggle-mute="toggleVideoMute"
      @toggle-audio="toggleAudio"
    />

    <section id="portfolio" class="port-section">
      <PortfolioHero />
      <StatsGrid />
      <StickyShowcase />
      <ContactCard />
      <div class="port-footer">Palolol © 2025 — All vibes reserved</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppNavbar from './components/AppNavbar.vue'
import HomeSection from './components/HomeSection.vue'
import PortfolioHero from './components/PortfolioHero.vue'
import StatsGrid from './components/StatsGrid.vue'
import StickyShowcase from './components/StickyShowcase.vue'
import ContactCard from './components/ContactCard.vue'

// ── Audio ──
const audio = ref(null)
const audioError = ref(false)
const audioPlaying = ref(false)

// ── Video ──
const isVideoMuted = ref(true)
let ytPlayer = null
const YOUTUBE_VIDEO_ID = '98gTjFi7XaE'

// ── Navbar ──
const isScrolled = ref(false)
const activeSection = ref('home')

// Nav link → showcase card index mapping (for cards inside sticky showcase)
const showcaseCardIndex = {
  projects: 0,
  skills: 1,
  experience: 2
}

// Standalone section IDs (for cards outside showcase)
const standaloneSections = {
  home: 'home',
  portfolio: 'portfolio',
  contact: 'contact'
}

/**
 * Calculate the exact scroll position where a showcase card
 * is in its "holding" phase center.
 */
function scrollToShowcaseCard(cardIndex) {
  const container = document.querySelector('.showcase')
  if (!container) return

  const rect = container.getBoundingClientRect()
  const containerTop = window.scrollY + rect.top
  const containerHeight = container.offsetHeight
  const viewportHeight = window.innerHeight
  const scrollable = containerHeight - viewportHeight

  const totalCards = 3
  const segmentSize = 1 / totalCards
  // 48% into the segment = center of the holding phase (16% - 80%)
  const holdingCenter = 0.48
  const targetRatio = cardIndex * segmentSize + segmentSize * holdingCenter

  const targetY = containerTop + scrollable * targetRatio

  window.scrollTo({
    top: targetY,
    behavior: 'smooth'
  })
}

function goTo(id) {
  // Handle showcase cards (projects, skills, experience)
  if (id in showcaseCardIndex) {
    scrollToShowcaseCard(showcaseCardIndex[id])
    activeSection.value = id
    return
  }

  // Handle standalone sections (home, portfolio, contact)
  const targetId = standaloneSections[id] || id
  const el = document.getElementById(targetId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
  activeSection.value = id
}

function onScroll() {
  isScrolled.value = window.scrollY > 20

  const offsetBuffer = 120
  let active = 'home'

  // Check standalone sections first
  const home = document.getElementById('home')
  if (home && home.getBoundingClientRect().top <= offsetBuffer) {
    active = 'home'
  }
  const portfolio = document.getElementById('portfolio')
  if (portfolio && portfolio.getBoundingClientRect().top <= offsetBuffer) {
    active = 'portfolio'
  }

  // Check if we're inside the showcase — spy on the sticky container
  const showcase = document.querySelector('.showcase')
  if (showcase) {
    const rect = showcase.getBoundingClientRect()
    const containerHeight = showcase.offsetHeight
    const viewportHeight = window.innerHeight
    const scrollable = containerHeight - viewportHeight

    if (rect.top <= offsetBuffer && rect.bottom > viewportHeight) {
      // We're inside the sticky showcase — determine which card is active
      const scrolled = -rect.top
      const rawProgress = Math.max(0, Math.min(1, scrolled / scrollable))
      const totalCards = 3
      const cardIndex = Math.min(
        totalCards - 1,
        Math.floor(rawProgress * totalCards)
      )

      const cardKeys = ['projects', 'skills', 'experience']
      active = cardKeys[cardIndex] || 'projects'
    }
  }

  // Check contact last (overrides showcase if we've scrolled past it)
  const contact = document.getElementById('contact')
  if (contact && contact.getBoundingClientRect().top <= offsetBuffer) {
    active = 'contact'
  }

  activeSection.value = active
}

// ── YouTube init ──
function initYouTubePlayer() {
  const container = document.getElementById('yt-background')
  if (!container) return
  try {
    ytPlayer = new YT.Player('yt-background', {
      width: '100%',
      height: '100%',
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 1, controls: 0, showinfo: 0,
        rel: 0, modestbranding: 1, loop: 1,
        playlist: YOUTUBE_VIDEO_ID
      },
      events: {
        onReady: (event) => {
          event.target.mute()
          isVideoMuted.value = true
        },
        onError: (event) => {
          console.error('[YT] error:', event.data)
        }
      }
    })
  } catch (error) {
    console.error('[YT] failed to create player:', error)
  }
}

function toggleVideoMute() {
  if (ytPlayer) {
    const muted = ytPlayer.isMuted()
    ytPlayer[muted ? 'unMute' : 'mute']()
    isVideoMuted.value = !muted
  }
}

function toggleAudio() {
  if (!audio.value) return
  if (audioPlaying.value) {
    audio.value.pause()
    audioPlaying.value = false
  } else {
    audio.value
      .play()
      .then(() => {
        audioPlaying.value = true
        audioError.value = false
      })
      .catch(() => {
        audioError.value = true
        audioPlaying.value = false
      })
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  if (window.YT && window.YT.loaded) {
    initYouTubePlayer()
  } else {
    let existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    )
    if (!existingScript) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.async = true
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }
    window.onYouTubeIframeAPIReady = () => initYouTubePlayer()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (ytPlayer) {
    ytPlayer.destroy()
    ytPlayer = null
  }
})
</script>

<style>
@import './assets/css/main.css';
@import './assets/css/navbar.css';
@import './assets/css/home.css';
@import './assets/css/portfolio.css';
@import './assets/css/showcase.css';
</style>