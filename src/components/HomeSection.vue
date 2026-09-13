<template>
  <section id="home" class="home-section">
    <div id="yt-background" class="bg-video"></div>

    <div class="content">
      <div class="video-mute-button" @click="$emit('toggle-mute')">
        <span v-if="isVideoMuted">🔊</span>
        <span v-else>🔇</span>
      </div>

      <!-- First Project Card -->
      <div class="first-project-card">
        <div class="first-project-avatar">
          <video :src="animeTeacherUrl" autoplay muted loop playsinline></video>
          <div class="avatar-glow"></div>
          <div class="avatar-tag">Virtual Teacher</div>
        </div>
        <div class="first-project-bubble">
          <div class="bubble-tail"></div>
          <div class="bubble-title">
            <span class="bubble-icon">🎓</span>
            <span>My First Project</span>
          </div>
          <p class="first-project-text">
            My first project? A tiny Python calculator. From one script to
            expert systems, mobile apps, and AI models — every developer
            starts with a single line.
          </p>
        </div>
      </div>

      <!-- Bouncing Title -->
      <h1 class="bouncing-title">
        <span
          v-for="(letter, i) in titleLetters"
          :key="i"
          :style="{ animationDelay: i * 0.08 + 's' }"
        >
          {{ letter }}
        </span>
      </h1>

      <!-- Profile -->
      <div class="profile">
        <h2>Palolol's Portfolio</h2>
        <img
          src="https://pbs.twimg.com/media/GoZdeoVWwAAXp_w?format=jpg&name=small"
          alt="Profile Image"
          class="profile-image"
        />
        <p>Hi! My name is Palolol<br />This name is my game name</p>

        <div
          v-if="audioError || !audioPlaying"
          class="audio-control"
          @click="$emit('toggle-audio')"
        >
          <span v-if="audioError">🔇 Audio blocked - Click to enable</span>
          <span v-else-if="!audioPlaying">▶️ Click to play audio</span>
          <span v-else>🔊 Playing - Click to pause</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import animeTeacherUrl from '../assets/frieren.gif.mp4'

defineProps({
  isVideoMuted: Boolean,
  audioError: Boolean,
  audioPlaying: Boolean
})

defineEmits(['toggle-mute', 'toggle-audio'])

const titleLetters = ['P', 'A', 'L', 'O', 'L', 'O', 'L']
</script>