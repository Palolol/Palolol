<template>
  <div class="app-wrapper">
    <!-- ══════════════════════════════════════════
         NAVBAR (UNCHANGED)
    ══════════════════════════════════════════ -->
    <nav
      class="navbar"
      :class="{ scrolled: isScrolled, 'menu-open': menuOpen }"
    >
      <div class="nav-inner">
        <a href="#home" class="nav-logo" @click="goTo('home')">
          PALO<span>LOL</span>
        </a>
        <ul class="nav-links">
          <li v-for="link in navLinks" :key="link.id">
            <a
              class="nav-link"
              :class="{ active: activeSection === link.id }"
              @click="goTo(link.id)"
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
              @click="
                goTo(link.id);
                menuOpen = false;
              "
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
        <a href="mailto:palolol1165@gmail.com" class="nav-cta mobile-cta"
          >Hire Me</a
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

    <!-- ══════════════════════════════════════════
         HOME SECTION (UNCHANGED)
    ══════════════════════════════════════════ -->
    <section id="home" class="home-section">
      <div id="yt-background" class="bg-video"></div>

      <div class="content">
        <div class="video-mute-button" @click="toggleVideoMute">
          <span v-if="isVideoMuted">🔊</span>
          <span v-else>🔇</span>
        </div>

        <div class="first-project-card">
          <div class="first-project-avatar">
            <video
              :src="animeTeacherUrl"
              autoplay
              muted
              loop
              playsinline
            ></video>
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

        <h1 class="bouncing-title">
          <span
            v-for="(letter, i) in titleLetters"
            :key="i"
            :style="{ animationDelay: i * 0.08 + 's' }"
          >
            {{ letter }}
          </span>
        </h1>

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
            @click="toggleAudio"
          >
            <span v-if="audioError">🔇 Audio blocked - Click to enable</span>
            <span v-else-if="!audioPlaying">▶️ Click to play audio</span>
            <span v-else>🔊 Playing - Click to pause</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════
         PORTFOLIO SECTION (REDESIGNED)
    ══════════════════════════════════════════ -->
    <section id="portfolio" class="port-section">
      <!-- Hero -->
      <div
        :ref="setHeroRef"
        class="port-hero reveal"
        :class="{ visible: isHeroVisible }"
      >
        <div class="port-hero-inner">
          <span class="port-hero-tag">Portfolio · AI/ML · 2025</span>
          <h2 class="port-hero-name">PALO<span>LOL</span></h2>
          <p class="port-hero-sub">
            College student &amp; AI/ML builder — Tomato diagnosis expert
            systems, mobile food delivery, and AI models built on a laptop.
          </p>
          <div class="port-hero-pills">
            <span class="pill">🤖 AI/ML</span>
            <span class="pill">🍅 Expert Systems</span>
            <span class="pill">📱 Mobile Dev</span>
            <span class="pill">🧠 Deep Learning</span>
            <span class="pill">🐍 Python</span>
          </div>
        </div>
        <div class="port-hero-avatar">
          <video :src="animeTeacherUrl" autoplay muted loop playsinline></video>
        </div>
      </div>

      <!-- Stats -->
      <div
        :ref="setStatsRef"
        class="stats-grid reveal-stagger"
        :class="{ visible: isStatsVisible }"
      >
        <div class="stat-card">
          <div class="stat-num">5+</div>
          <div class="stat-lbl">Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">3+</div>
          <div class="stat-lbl">Years Exp</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">1</div>
          <div class="stat-lbl">Models Trained</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">AI/ML</div>
          <div class="stat-lbl">Research Focus</div>
        </div>
      </div>

      <!-- Showcase header -->
      <div
        :ref="setShowcaseHeaderRef"
        class="showcase-header reveal"
        :class="{ visible: isShowcaseHeaderVisible }"
      >
        <h3>What I Do</h3>
        <p>Scroll to explore my projects, skills, and experience.</p>
      </div>

      <!-- Sticky Showcase -->
      <div class="showcase" :ref="showcase.setContainer">
        <svg
          class="showcase-line"
          viewBox="0 0 24 1000"
          preserveAspectRatio="none"
        >
          <line
            x1="12"
            y1="0"
            x2="12"
            y2="1000"
            stroke="#EEF2F6"
            stroke-width="1.5"
            stroke-linecap="round"
            :stroke-dasharray="1000"
            :stroke-dashoffset="1000 - showcase.lineProgress.value * 1000"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <div class="showcase-viewport">
          <div class="showcase-progress">
            <span
              v-for="(card, i) in showcaseCards"
              :key="'pip-' + i"
              class="showcase-pip"
              :class="{
                active: showcase.activeIndex.value === i,
                past: i < showcase.activeIndex.value,
              }"
            ></span>
          </div>

          <div class="showcase-label">
            {{ showcaseCards[showcase.activeIndex.value]?.label }}
          </div>
          <div class="showcase-counter">
            <span>{{ showcase.activeIndex.value + 1 }}</span>
            <span>/</span>
            <span>{{ showcaseCards.length }}</span>
          </div>

          <div class="showcase-stack">
            <div
              v-for="(card, i) in showcaseCards"
              :key="card.id"
              data-card
              class="showcase-card"
              :class="{
                'is-active': showcase.cards.value[i]?.phase === 'holding',
              }"
              :style="cardStyle(i)"
            >
              <!-- PROJECTS -->
              <div v-if="card.type === 'projects'" class="card-inner">
                <div class="card-header">
                  <div class="card-icon">💼</div>
                  <div class="card-head-text">
                    <h4>Featured Projects</h4>
                    <p>Selected work</p>
                  </div>
                  <span class="card-index">01</span>
                </div>
                <div class="projects-list">
                  <div
                    v-for="project in projects"
                    :key="project.title"
                    class="project-item"
                  >
                    <div class="project-top">
                      <span class="project-emoji">{{ project.icon }}</span>
                      <div class="project-name">{{ project.title }}</div>
                    </div>
                    <p class="project-desc">{{ project.desc }}</p>
                    <div class="project-tags">
                      <span
                        v-for="tag in project.tags"
                        :key="tag"
                        class="project-tag"
                        >{{ tag }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- SKILLS -->
              <div v-if="card.type === 'skills'" class="card-inner">
                <div class="card-header">
                  <div class="card-icon">⚡</div>
                  <div class="card-head-text">
                    <h4>Technical Skills</h4>
                    <p>Tools I work with</p>
                  </div>
                  <span class="card-index">02</span>
                </div>
                <div class="skills-list">
                  <div
                    v-for="skill in skills"
                    :key="skill.name"
                    class="skill-item"
                  >
                    <div class="skill-meta">
                      <span class="skill-name">{{ skill.name }}</span>
                      <span class="skill-pct">{{ skill.pct }}%</span>
                    </div>
                    <div class="skill-track">
                      <div
                        class="skill-bar"
                        :style="{
                          width:
                            showcase.cards.value[i]?.phase === 'holding'
                              ? skill.pct + '%'
                              : '0%',
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- EXPERIENCE -->
              <div v-if="card.type === 'experience'" class="card-inner">
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
                    :class="{
                      active: showcase.cards.value[i]?.phase === 'holding',
                    }"
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
            </div>
          </div>
        </div>

        <div
          v-for="(card, i) in showcaseCards"
          :key="'sp-' + i"
          class="showcase-spacer"
        ></div>
      </div>

      <!-- Contact -->
      <div
        id="contact"
        :ref="setContactRef"
        class="contact-card reveal"
        :class="{ visible: isContactVisible }"
      >
        <h3 class="contact-title">Let's Build Something</h3>
        <p class="contact-sub">
          Open to AI/ML research collaborations and student projects.
        </p>
        <div class="contact-btns">
          <a href="mailto:palolol1165@gmail.com" class="btn-primary"
            >Send a message</a
          >
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

      <div class="port-footer">Palolol © 2025 — All vibes reserved</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import animeTeacherUrl from "./assets/frieren.gif.mp4";
import { useScrollReveal } from "./composables/useScrollReveal";
import { useStickyShowcase } from "./composables/useStickyShowcase";

// ── Audio state ──
const audio = ref(null);
const audioError = ref(false);
const audioPlaying = ref(false);

// ── Video state ──
const isVideoMuted = ref(true);
let ytPlayer = null;
const YOUTUBE_VIDEO_ID = "98gTjFi7XaE";

// ── Navbar ──
const isScrolled = ref(false);
const menuOpen = ref(false);
const activeSection = ref("home");

const navLinks = [
  { id: "home", label: "Home" },
  { id: "portfolio", label: "Portfolio" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function goTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
  activeSection.value = id;
  menuOpen.value = false;
}

function onScroll() {
  isScrolled.value = window.scrollY > 20;
  const sections = ["home", "portfolio", "contact"];
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el) {
      const { top } = el.getBoundingClientRect();
      if (top <= 80) activeSection.value = id;
    }
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

// ── YouTube init (unchanged) ──
onMounted(() => {
  const initYouTubePlayer = () => {
    const container = document.getElementById("yt-background");
    if (!container) return;
    try {
      ytPlayer = new YT.Player("yt-background", {
        width: "100%",
        height: "100%",
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            isVideoMuted.value = true;
          },
          onError: (event) => {
            console.error("[YT] error:", event.data);
          },
        },
      });
    } catch (error) {
      console.error("[YT] failed to create player:", error);
    }
  };

  if (window.YT && window.YT.loaded) {
    initYouTubePlayer();
  } else {
    let existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (!existingScript) {
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    window.onYouTubeIframeAPIReady = () => initYouTubePlayer();
  }
});

function toggleVideoMute() {
  if (ytPlayer) {
    const muted = ytPlayer.isMuted();
    ytPlayer[muted ? "unMute" : "mute"]();
    isVideoMuted.value = !muted;
  }
}

function toggleAudio() {
  if (!audio.value) return;
  if (audioPlaying.value) {
    audio.value.pause();
    audioPlaying.value = false;
  } else {
    audio.value
      .play()
      .then(() => {
        audioPlaying.value = true;
        audioError.value = false;
      })
      .catch(() => {
        audioError.value = true;
        audioPlaying.value = false;
      });
  }
}

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  if (ytPlayer) {
    ytPlayer.destroy();
    ytPlayer = null;
  }
});

// ── Home bouncing title ──
const titleLetters = ["P", "A", "L", "O", "L", "O", "L"];

// ── Scroll reveals ──
const [isHeroVisible, setHeroRef] = useScrollReveal({ threshold: 0.15 });
const [isStatsVisible, setStatsRef] = useScrollReveal({ threshold: 0.2 });
const [isShowcaseHeaderVisible, setShowcaseHeaderRef] = useScrollReveal({
  threshold: 0.2,
});
const [isContactVisible, setContactRef] = useScrollReveal({ threshold: 0.2 });

// ── Sticky showcase ──
const showcase = useStickyShowcase();

const showcaseCards = [
  { id: "projects", type: "projects", label: "Projects" },
  { id: "skills", type: "skills", label: "Skills" },
  { id: "experience", type: "experience", label: "Experience" },
];

function cardStyle(i) {
  const c = showcase.cards.value[i];
  if (!c) {
    return {
      opacity: 0,
      transform: "translateY(40px) scale(0.94)",
      zIndex: 0,
      pointerEvents: "none",
    };
  }
  return {
    opacity: c.opacity,
    transform: `translateY(${c.y}px) scale(${c.scale})`,
    zIndex: c.phase === "holding" ? 10 : c.phase === "entering" ? 5 : 1,
    pointerEvents: c.phase === "holding" ? "auto" : "none",
  };
}

// ── Data ──
const projects = [
  {
    title: "Tomato Diagnosis Expert System",
    desc: "Rule-based expert system diagnosing tomato plant diseases from observed symptoms.",
    icon: "🍅",
    tags: ["Python", "Prolog", "Rule-based"],
  },
  {
    title: "Mobile Food Delivery",
    desc: "University project — food ordering app with restaurant listings, cart & tracking.",
    icon: "🛵",
    tags: ["Flutter", "Dart", "Firebase"],
  },
  {
    title: "Laptop AI Models",
    desc: "ML/DL models trained on a laptop — image classification & NLP experiments.",
    icon: "🧠",
    tags: ["Python", "PyTorch", "TensorFlow"],
  },
  {
    title: "Portfolio v2",
    desc: "Clean portfolio built in Vue 3 with subtle scroll animations.",
    icon: "🌐",
    tags: ["Vue.js", "CSS", "JS"],
  },
];

const skills = [
  { name: "Python", pct: 90 },
  { name: "Machine Learning", pct: 85 },
  { name: "PyTorch / TensorFlow", pct: 80 },
  { name: "Data Analysis", pct: 75 },
  { name: "Flutter / Dart", pct: 70 },
  { name: "Expert Systems / Prolog", pct: 65 },
];

const experience = [
  {
    role: "AI/ML Self-Study & Model Building",
    place: "Personal Laptop — Independent",
    year: "2024 – Present",
  },
  {
    role: "Mobile Food Delivery — University Project",
    place: "University Course Project",
    year: "2023 – 2024",
  },
  {
    role: "Tomato Diagnosis Expert System",
    place: "University AI Course",
    year: "2023",
  },
];
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");

/* ══════════════════════════════════════════
   THEME TOKENS
   Outer bg: #27384C  |  Box bg: #EEF2F6  |  Text: #1A2532
══════════════════════════════════════════ */
:root {
  --p-outer: #27384c;
  --p-box: #eef2f6;
  --p-box-2: #dfe6ee;
  --p-text: #1a2532;
  --p-text-muted: #55637a;
  --p-text-soft: #7f8ba0;
  --p-border: rgba(26, 37, 50, 0.12);
  --p-border-strong: rgba(26, 37, 50, 0.22);
  --p-outer-border: rgba(255, 255, 255, 0.08);
  --p-outer-soft: rgba(255, 255, 255, 0.06);
  --p-accent: #1a2532;
  --p-accent-bg: rgba(26, 37, 50, 0.06);
  --p-shadow: 0 12px 40px -12px rgba(0, 0, 0, 0.35);
  --p-shadow-sm: 0 4px 14px -4px rgba(0, 0, 0, 0.15);
  --p-radius: 12px;
  --p-radius-sm: 8px;
  --p-radius-lg: 16px;
  --p-mono: "JetBrains Mono", ui-monospace, Consolas, monospace;
}

/* ── RESET ── */
*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  overflow-y: scroll;
  font-family: "Luckiest Guy", cursive;
  background: var(--p-outer);
}

/* ══════════════════════════════════════════
   NAVBAR (UNCHANGED)
══════════════════════════════════════════ */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.06);
  transition:
    background 0.3s,
    box-shadow 0.3s;
}
.navbar.scrolled {
  background: rgba(10, 10, 10, 0.96);
  box-shadow: 0 2px 24px rgba(18, 32, 226, 0.15);
}
.nav-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 62px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.nav-logo {
  font-family: "Bebas Neue", cursive;
  font-size: 26px;
  color: #fff;
  text-decoration: none;
  letter-spacing: 1px;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.2s;
}
.nav-logo:hover {
  opacity: 0.8;
}
.nav-logo span {
  color: #1220e2;
}
.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0.15rem;
  flex: 1;
}
.nav-link {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition:
    color 0.2s,
    background 0.2s;
  display: block;
}
.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.07);
}
.nav-link.active {
  color: #fff;
  background: rgba(18, 32, 226, 0.25);
  border: 0.5px solid rgba(18, 32, 226, 0.4);
}
.nav-cta {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: #1220e2;
  padding: 8px 18px;
  border-radius: 8px;
  text-decoration: none;
  flex-shrink: 0;
  transition:
    opacity 0.2s,
    transform 0.15s;
}
.nav-cta:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}
.nav-tg {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
  transition:
    color 0.2s,
    border-color 0.2s,
    background 0.2s;
}
.nav-tg:hover {
  color: #fff;
  border-color: rgba(18, 32, 226, 0.6);
  background: rgba(18, 32, 226, 0.18);
}
.nav-tg.mobile-tg {
  margin-top: 0.4rem;
  text-align: center;
  display: block;
  border-color: rgba(18, 32, 226, 0.35);
  background: rgba(18, 32, 226, 0.12);
  color: #c8d2ff;
}
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  margin-left: auto;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition:
    transform 0.3s,
    opacity 0.3s;
}
.menu-open .hamburger span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.menu-open .hamburger span:nth-child(2) {
  opacity: 0;
}
.menu-open .hamburger span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 0 1.25rem;
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.35s ease,
    padding 0.35s ease;
}
.mobile-menu.open {
  max-height: 400px;
  padding-bottom: 1.25rem;
}
.mobile-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.mobile-link {
  font-family: "DM Sans", sans-serif;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  padding: 10px 14px;
  border-radius: 8px;
  display: block;
  cursor: pointer;
  transition:
    color 0.2s,
    background 0.2s;
}
.mobile-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.07);
}
.mobile-link.active {
  color: #fff;
  background: rgba(18, 32, 226, 0.25);
  border: 0.5px solid rgba(18, 32, 226, 0.4);
}
.mobile-cta {
  margin-top: 0.5rem;
  text-align: center;
  display: block;
}

/* ══════════════════════════════════════════
   APP WRAPPER
══════════════════════════════════════════ */
.app-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 62px;
  min-height: 100vh;
  background: var(--p-outer);
}

/* ══════════════════════════════════════════
   HOME SECTION (UNCHANGED)
══════════════════════════════════════════ */
.home-section {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1220e2;
  overflow: hidden;
  padding: 20px 1rem 60px;
}
.home-section .bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.home-section .content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bouncing-title {
  margin: 0 0 8px;
  text-align: center;
  position: relative;
  z-index: 1;
}
.bouncing-title span {
  display: inline-block;
  animation: bounce 0.3s ease infinite alternate;
  font-size: 60px;
  color: #1220e2;
  text-shadow:
    0 1px 0 #ccc,
    2px 0 #ccc,
    0 3px 0 #ccc,
    4px 0 #ccc,
    0 5px 0 #ccc,
    0 6px 0 transparent,
    0 7px 0 transparent,
    0 8px 0 transparent,
    0 9px 0 transparent,
    0 10px 10px rgba(0, 0, 0, 0.4);
}
@keyframes bounce {
  100% {
    transform: translateY(-20px);
    text-shadow:
      0 1px 0 #48ff00,
      0 2px 0 hsl(133, 100%, 50%),
      0 3px 0 #00ff00,
      0 4px 0 #ccc,
      0 5px 0 #ccc,
      0 6px 0 #ccc,
      0 7px 0 #ccc,
      8px 0 #ccc,
      0 9px 0 #ccc,
      0 50px 25px rgba(0, 0, 0, 0.2);
  }
}

.audio-control {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  z-index: 1000;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}
.audio-control:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}
.audio-control:active {
  transform: scale(0.9);
}

.video-mute-button {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1001;
  font-size: 18px;
  transition: all 0.3s ease;
}
.video-mute-button:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}
.video-mute-button:active {
  transform: scale(0.9);
}

.profile {
  text-align: center;
  color: white;
}
.profile h2 {
  font-size: 24px;
  margin-bottom: 10px;
}
.profile-image {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.3);
  margin-bottom: 15px;
  object-fit: cover;
}
.profile p {
  font-size: 16px;
  line-height: 1.5;
  font-family: "Arial", sans-serif;
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0.336);
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* ══════════════════════════════════════════
   FIRST PROJECT — VIRTUAL TEACHER (UNCHANGED)
══════════════════════════════════════════ */
.first-project-card {
  width: min(90%, 720px);
  margin: 0 auto 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border: 0.5px solid rgba(18, 32, 226, 0.25);
  border-radius: 18px;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  position: relative;
  z-index: 5;
  animation: fadeInUp 0.7s ease both;
  font-family: "DM Sans", sans-serif;
}
.first-project-avatar {
  position: relative;
  flex-shrink: 0;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
}
.first-project-avatar video {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #1220e2;
  box-shadow: 0 6px 18px rgba(18, 32, 226, 0.4);
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, #1220e2, #7b93ff);
}
.avatar-glow {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(18, 32, 226, 0.5) 0%,
    transparent 70%
  );
  animation: avatarGlow 2.4s ease-in-out infinite;
  z-index: 1;
}
.avatar-tag {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #1220e2;
  color: #fff;
  font-size: 10px;
  letter-spacing: 0.06em;
  padding: 3px 10px;
  border-radius: 10px;
  white-space: nowrap;
  z-index: 3;
  font-weight: 500;
}
.first-project-bubble {
  flex: 1;
  position: relative;
  background: #f7f8ff;
  border: 1px solid rgba(18, 32, 226, 0.2);
  border-radius: 14px;
  padding: 0.9rem 1rem 0.8rem;
  min-height: 110px;
}
.bubble-tail {
  position: absolute;
  left: -8px;
  top: 24px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 10px solid #f7f8ff;
}
.bubble-title {
  font-size: 13px;
  font-weight: 500;
  color: #1220e2;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.bubble-icon {
  font-size: 15px;
}
.first-project-text {
  font-size: 14px;
  line-height: 1.55;
  color: #222;
  margin: 0;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes avatarGlow {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

/* ══════════════════════════════════════════
   PORTFOLIO SECTION — NEW COLORS
   Outer: #27384C  |  Boxes: #EEF2F6  |  Text: #1A2532
══════════════════════════════════════════ */
.port-section {
  width: 100%;
  max-width: 900px;
  padding: 4rem 1.5rem 3rem;
  font-family: "DM Sans", system-ui, sans-serif;
  color: #ffffff;
  background: var(--p-outer);
}

/* Reveal */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1),
    transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-stagger > * {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1),
    transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}
.reveal-stagger.visible > *:nth-child(1) {
  transition-delay: 0.05s;
  opacity: 1;
  transform: translateY(0);
}
.reveal-stagger.visible > *:nth-child(2) {
  transition-delay: 0.12s;
  opacity: 1;
  transform: translateY(0);
}
.reveal-stagger.visible > *:nth-child(3) {
  transition-delay: 0.19s;
  opacity: 1;
  transform: translateY(0);
}
.reveal-stagger.visible > *:nth-child(4) {
  transition-delay: 0.26s;
  opacity: 1;
  transform: translateY(0);
}

/* ── Hero ── */
.port-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  background: var(--p-box);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius-lg);
  padding: 2.25rem 2rem;
  margin-bottom: 1.5rem;
  color: var(--p-text);
  box-shadow: var(--p-shadow);
}
.port-hero-inner {
  flex: 1;
  min-width: 0;
}
.port-hero-tag {
  display: inline-block;
  font-size: 12px;
  color: var(--p-text);
  background: rgba(26, 37, 50, 0.08);
  border: 1px solid var(--p-border-strong);
  padding: 4px 12px;
  border-radius: 999px;
  letter-spacing: 0.06em;
  margin-bottom: 1rem;
  font-weight: 500;
}
.port-hero-name {
  font-family: system-ui, "Segoe UI", Roboto, sans-serif;
  font-size: clamp(2.25rem, 5vw, 3rem);
  font-weight: 600;
  color: var(--p-text);
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin: 0 0 0.6rem;
}
.port-hero-name span {
  color: var(--p-outer);
}
.port-hero-sub {
  font-size: 15px;
  line-height: 1.6;
  color: var(--p-text-muted);
  margin: 0 0 1.25rem;
  max-width: 44ch;
}
.port-hero-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.pill {
  font-size: 12px;
  color: var(--p-text);
  background: #ffffff;
  border: 1px solid var(--p-border);
  padding: 5px 12px;
  border-radius: 999px;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;
}
.pill:hover {
  transform: translateY(-1px);
  border-color: var(--p-border-strong);
}
.port-hero-avatar {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffffff;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
.port-hero-avatar video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Stats ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--p-border);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius);
  overflow: hidden;
  margin-bottom: 3rem;
  box-shadow: var(--p-shadow-sm);
}
.stat-card {
  background: var(--p-box);
  padding: 1.25rem 1rem;
  text-align: center;
  color: var(--p-text);
}
.stat-num {
  font-family: system-ui, sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: var(--p-text);
  line-height: 1;
  margin-bottom: 4px;
  letter-spacing: -0.03em;
}
.stat-lbl {
  font-size: 12px;
  color: var(--p-text-muted);
  letter-spacing: 0.02em;
}

/* ── Showcase header ── */
.showcase-header {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #ffffff;
}
.showcase-header h3 {
  font-family: system-ui, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
}
.showcase-header p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* ══════════════════════════════════════════
   STICKY SHOWCASE
══════════════════════════════════════════ */
.showcase {
  position: relative;
}

.showcase-line {
  position: absolute;
  left: -1.5rem;
  top: 0;
  width: 1.5rem;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  opacity: 0.3;
}

.showcase-viewport {
  position: sticky;
  top: 82px;
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
}

.showcase-spacer {
  height: 100vh;
  pointer-events: none;
}

.showcase-progress {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 3;
}
.showcase-pip {
  width: 24px;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.15);
  transition:
    background 0.3s ease,
    width 0.3s ease;
}
.showcase-pip.active {
  background: var(--p-box);
  width: 32px;
}
.showcase-pip.past {
  background: rgba(238, 242, 246, 0.4);
}

.showcase-label {
  position: absolute;
  top: 6px;
  left: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.55);
  z-index: 3;
}
.showcase-counter {
  position: absolute;
  top: 6px;
  right: 0;
  font-family: var(--p-mono);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  gap: 2px;
  z-index: 3;
}
.showcase-counter span:first-child {
  color: #ffffff;
  font-weight: 500;
}

@media (max-width: 640px) {
  .showcase-label {
    display: none;
  }
  .showcase-line {
    display: none;
  }
}

/* ── Cards ── */
.showcase-stack {
  position: relative;
  width: 100%;
  max-width: 720px;
  height: clamp(460px, 68vh, 500px);
}
.showcase-card {
  position: absolute;
  inset: 0;
  background: var(--p-box);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius-lg);
  box-shadow: var(--p-shadow);
  overflow: hidden;
  will-change: transform, opacity;
  color: var(--p-text);
}
.showcase-card.is-active {
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.45);
}

.card-inner {
  padding: 1.75rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--p-border);
}
.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: var(--p-outer);
  color: #ffffff;
  flex-shrink: 0;
}
.card-head-text h4 {
  font-family: system-ui, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--p-text);
  margin: 0 0 2px;
  letter-spacing: -0.01em;
}
.card-head-text p {
  font-size: 13px;
  color: var(--p-text-muted);
  margin: 0;
}
.card-index {
  margin-left: auto;
  font-family: var(--p-mono);
  font-size: 12px;
  color: var(--p-text-soft);
}

/* ── Projects list ── */
.projects-list {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  overflow: auto;
}
.project-item {
  padding: 0.9rem;
  background: #ffffff;
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.project-item:hover {
  border-color: var(--p-outer);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.12);
}
.project-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.project-emoji {
  font-size: 20px;
}
.project-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--p-text);
}
.project-desc {
  font-size: 12px;
  line-height: 1.55;
  color: var(--p-text-muted);
  margin: 0;
}
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: auto;
}
.project-tag {
  font-family: var(--p-mono);
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 5px;
  background: var(--p-outer);
  color: #ffffff;
  font-weight: 500;
}

/* ── Skills ── */
.skills-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  overflow: auto;
}
.skill-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.skill-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.skill-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--p-text);
}
.skill-pct {
  font-family: var(--p-mono);
  font-size: 12px;
  color: var(--p-outer);
  font-weight: 500;
}
.skill-track {
  height: 5px;
  background: var(--p-box-2);
  border-radius: 999px;
  overflow: hidden;
}
.skill-bar {
  height: 100%;
  background: var(--p-outer);
  border-radius: 999px;
  transition: width 1.05s cubic-bezier(0.23, 1, 0.32, 1) 0.15s;
}

/* ── Timeline ── */
.timeline {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.timeline-item {
  display: flex;
  gap: 14px;
  padding-bottom: 1.25rem;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1),
    transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
}
.timeline-item.active {
  opacity: 1;
  transform: translateY(0);
}
.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 4px;
}
.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--p-outer);
  border: 2px solid var(--p-box);
  box-shadow: 0 0 0 2px var(--p-outer);
}
.timeline-line {
  width: 1px;
  flex: 1;
  margin-top: 4px;
  background: var(--p-border-strong);
}
.timeline-content {
  flex: 1;
}
.timeline-role {
  font-size: 14px;
  font-weight: 600;
  color: var(--p-text);
  margin-bottom: 2px;
}
.timeline-place {
  font-size: 13px;
  color: var(--p-text-muted);
  margin-bottom: 6px;
}
.timeline-year {
  font-family: var(--p-mono);
  font-size: 11px;
  color: var(--p-text);
  background: #ffffff;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid var(--p-border);
  display: inline-block;
}

/* ── Contact ── */
.contact-card {
  text-align: center;
  background: var(--p-box);
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius-lg);
  padding: 2.5rem 2rem;
  margin: 3rem 0 1.5rem;
  color: var(--p-text);
  box-shadow: var(--p-shadow);
}
.contact-title {
  font-family: system-ui, sans-serif;
  font-size: 26px;
  font-weight: 600;
  color: var(--p-text);
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
}
.contact-sub {
  font-size: 14px;
  color: var(--p-text-muted);
  margin: 0 0 1.5rem;
}
.contact-btns {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.btn-primary {
  background: var(--p-outer);
  color: #ffffff;
  border: none;
  padding: 11px 24px;
  border-radius: var(--p-radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition:
    opacity 0.2s,
    transform 0.15s;
}
.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.btn-outline {
  background: #ffffff;
  color: var(--p-text);
  border: 1px solid var(--p-border-strong);
  padding: 10px 22px;
  border-radius: var(--p-radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.btn-outline:hover {
  border-color: var(--p-outer);
  background: var(--p-box-2);
}
.btn-email {
  font-family: var(--p-mono);
  font-size: 13px;
  color: var(--p-text-muted);
  padding: 10px 14px;
  background: #ffffff;
  border: 1px solid var(--p-border);
  border-radius: var(--p-radius-sm);
}
.port-footer {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  padding: 0.5rem 0 1rem;
}

/* ══════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════ */
@media (max-width: 640px) {
  .nav-links,
  .nav-cta:not(.mobile-cta) {
    display: none;
  }
  .hamburger {
    display: flex;
  }
  .mobile-menu {
    display: flex;
  }
  .bouncing-title span {
    font-size: 54px;
  }
  .profile-image {
    width: 200px;
    height: 200px;
  }

  .port-hero {
    flex-direction: column;
    text-align: center;
    padding: 1.75rem 1.25rem;
    gap: 1.5rem;
  }
  .port-hero-sub {
    max-width: 100%;
  }
  .port-hero-pills {
    justify-content: center;
  }
  .port-hero-avatar {
    width: 100px;
    height: 100px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .projects-list {
    grid-template-columns: 1fr;
  }
  .showcase-stack {
    height: clamp(500px, 72vh, 540px);
  }

  .first-project-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1rem;
  }
  .first-project-avatar {
    margin-bottom: 0.5rem;
  }
  .bubble-tail {
    display: none;
  }
}

@media (max-width: 480px) {
  .bouncing-title span {
    font-size: 44px;
  }
  .card-inner {
    padding: 1.25rem;
  }
  .card-head-text h4 {
    font-size: 16px;
  }
  .port-hero-name {
    font-size: 2rem;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal-stagger > *,
  .skill-bar,
  .timeline-item {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
