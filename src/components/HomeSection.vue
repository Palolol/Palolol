<template>
  
  <section id="home" class="home-section">
    <div id="yt-background" class="bg-video"></div>

    <div class="home-layout">
      <!-- LEFT PANEL -->
      <aside class="side side-left">
        <div class="side-card">
          <h3 class="side-title">📍 Navigate</h3>
          <nav class="side-nav">
            <a href="#home">🏠 Home</a>
            <a href="#projects">🚀 Projects</a>
            <a href="#skills">🛠️ Skills</a>
            <a href="#contact">📨 Contact</a>
          </nav>
        </div>

        <div class="side-card">
          <h3 class="side-title">📚 Currently Learning</h3>
          <ul class="side-list">
            <li>Advanced Vue</li>
            <li>Deep Learning</li>
            <li>AI Research</li>
          </ul>
        </div>
      </aside>

      <!-- CENTER (your original content) -->
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
          <h2>RATANA's Portfolio</h2>

          <div
            class="profile-swap"
            @mouseenter="startCycle"
            @mouseleave="stopCycle"
          >
            <img
              v-for="(src, i) in profileImages"
              :key="i"
              :src="src"
              alt="Profile Image"
              class="profile-image"
              :class="{ active: i === activeProfile }"
            />
          </div>

          <p>Hi! My name is Palolol<br />This name is my game name</p>

          <!-- <div
            v-if="audioError || !audioPlaying"
            class="audio-control"
            @click="$emit('toggle-audio')"
          >
            <span v-if="audioError">🔇 Audio blocked - Click to enable</span>
            <span v-else-if="!audioPlaying">▶️ Click to play audio</span>
            <span v-else>🔊 Playing - Click to pause</span>
          </div> -->
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <aside class="side side-right">
        <div class="side-card">
          <h3 class="side-title">🔗 Find Me</h3>
          <div class="social-links">
            <a href="https://t.me/palolol" target="_blank" rel="noopener">✈️ Telegram</a>
            <a href="https://github.com/Palolol" target="_blank" rel="noopener">🐙 GitHub</a>
            <a href="mailto:palolol1165@gmail.com">📧 Gmail</a>
          </div>
        </div>

        <div class="side-card">
          <h3 class="side-title">⚡ Tech Stack</h3>
          <div class="chips">
            <span v-for="tech in techStack" :key="tech" class="chip">{{ tech }}</span>
          </div>
        </div>

        <div class="side-card clock-card">
          <h3 class="side-title">🕒 Local Time</h3>
          <div class="clock">{{ clock }}</div>
          <div class="clock-date">{{ dateText }}</div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import sumireko from "../assets/Sumireko_Sanshokuin.png";
import ohtoAI from "../assets/Ohto_AI.png";
import animeTeacherUrl from "../assets/frieren.gif.mp4";

const profileImages = [
  "https://pbs.twimg.com/media/GoZdeoVWwAAXp_w?format=jpg&name=small",
  // Facebook links expire: download this photo into src/assets/ and import it
  "https://scontent.fpnh1-2.fna.fbcdn.net/v/t39.30808-6/893165427_1070649369359107_3478513503394284684_n.avif?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=111&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=0dGydO9WEhsQ7kNvwHX4MTP&_nc_oc=Adot-JKx9X9xYEt0KhRffllvtb9L4iA4Tcl-YCglI9o_ErE-ldAa_NVnw7wQMhHLULg&_nc_zt=23&_nc_ht=scontent.fpnh1-2.fna&_nc_gid=_34w5XMMgv2EDVoCLQRAzQ&_nc_ss=7b2a8&oh=00_AQS330SZgDFlMTcst1KBvrolPZHY8qvJQ1pYyBNkDo7KCg&oe=6B071A4C",
  sumireko,
  ohtoAI,
];

const activeProfile = ref(0);
let timer = null;

const DELAY = 1000; // ms between photo changes (1000 = 1 second)

// Hover: change photo every DELAY ms
const startCycle = () => {
  clearInterval(timer);
  timer = setInterval(() => {
    activeProfile.value = (activeProfile.value + 1) % profileImages.length;
  }, DELAY);
};

// Mouse leaves: stop and keep the current photo
const stopCycle = () => {
  clearInterval(timer);
  timer = null;
};

// Live clock for the right panel
const clock = ref("");
const dateText = ref("");
let clockTimer = null;

const updateClock = () => {
  const now = new Date();
  clock.value = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  dateText.value = now.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

onMounted(() => {
  updateClock();
  clockTimer = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
  clearInterval(clockTimer);
});

const techStack = [
  "Python",
  "C++",
  "Vue.js",
  "JavaScript",
  "PyTorch",
  "TensorFlow",
  "Flutter",
  "Firebase",
];

defineProps({
  isVideoMuted: Boolean,
  audioError: Boolean,
  audioPlaying: Boolean,
});

defineEmits(["toggle-mute", "toggle-audio"]);

const titleLetters = ["R", "A", "T", "A", "N", "A"];
</script>

<style scoped>
/* ===== 3-column layout: left panel | your content | right panel ===== */
.home-layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 240px;
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  align-items: start;
}

/* ===== Side panels ===== */
.side {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.side-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.35);
}

.side-title {
  margin: 0 0 12px;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.side-nav,
.social-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.side-nav a,
.social-links a {
  color: #fff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.9rem;
  transition: background 0.25s ease, transform 0.25s ease;
}

.side-nav a:hover,
.social-links a:hover {
  background: rgba(0, 217, 255, 0.25);
  transform: translateX(4px);
}

.side-list {
  margin: 0;
  padding-left: 18px;
  font-size: 0.9rem;
  line-height: 1.8;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 217, 255, 0.18);
  border: 1px solid rgba(0, 217, 255, 0.4);
}

.clock {
  font-size: 1.6rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.clock-date {
  font-size: 0.8rem;
  opacity: 0.75;
  margin-top: 4px;
}

/* Hide side panels on tablets and phones */
@media (max-width: 1100px) {
  .home-layout {
    grid-template-columns: 1fr;
  }
  .side {
    display: none;
  }
}

/* ===== Profile photo swap ===== */
.profile-swap {
  position: relative;
  width: clamp(220px, 40vw, 320px);
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.profile-swap .profile-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.profile-swap .profile-image.active {
  opacity: 1;
}
</style>