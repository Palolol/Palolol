<template>
  <div class="app-wrapper">
    <!-- ══════════════════════════════════════════
         NAVBAR
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
        <a href="mailto:palolol@email.com" class="nav-cta">Hire Me</a>
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
        <a href="mailto:palolol@email.com" class="nav-cta mobile-cta"
          >Hire Me</a
        >
      </div>
    </nav>

    <!-- ══════════════════════════════════════════
         HOME SECTION
    ══════════════════════════════════════════ -->
    <section id="home" class="home-section">
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

      <!-- Corner Images -->
      <img
        src="https://pbs.twimg.com/media/GfkGhe6asAArJ2l?format=jpg&name=large"
        alt="Top Left"
        class="corner-image top-left"
      />
      <img
        src="https://pbs.twimg.com/media/GeMg0CGbMAEjAOp?format=jpg&name=large"
        alt="Top Right"
        class="corner-image top-right"
      />
      <img
        src="https://pbs.twimg.com/media/Gckr_ZqXUAA7X3f?format=jpg&name=large"
        alt="Bottom Left"
        class="corner-image bottom-left"
      />
      <img
        src="https://pbs.twimg.com/media/GfkGhe8aEAA0eQF?format=jpg&name=360x360"
        alt="Bottom Right"
        class="corner-image bottom-right"
      />

      <!-- Main Container -->
      <div class="rainbow-container">
        <!-- Profile -->
        <div class="profile">
          <h2>Palolol's Portfolio</h2>
          <img
            src="https://pbs.twimg.com/media/GoZdeoVWwAAXp_w?format=jpg&name=small"
            alt="Profile Image"
            class="profile-image"
          />
          <p>Hi! My name is Palolol<br />This name is my game name</p>
        </div>

        <!-- Date Checker -->
        <h2 class="section-h2">Check Today's Day and Date</h2>
        <button class="fun-btn" @click="displayDate">Check</button>
        <p class="date-output">{{ dateOutput }}</p>

        <!-- Tic Tac Toe -->
        <h2 class="section-h2">Tic Tac Toe Game</h2>
        <div class="game-board">
          <div
            v-for="(cell, index) in cells"
            :key="index"
            class="cell"
            @click="handleClick(index)"
          >
            {{ cell || "" }}
          </div>
        </div>
        <div class="game-status">{{ status }}</div>
        <button class="fun-btn" @click="restartGame">Restart Game</button>
      </div>
    </section>

    <!-- ══════════════════════════════════════════
         PORTFOLIO SECTION
    ══════════════════════════════════════════ -->
    <section id="portfolio" class="port-section">
      <!-- Hero -->
      <div class="port-hero">
        <div class="port-grid"></div>
        <div class="port-glow"></div>
        <div class="port-tag">Portfolio · AI/ML · 2025</div>
        <div class="port-name">PALO<span>LOL</span></div>
        <div class="port-sub">
          College Student &amp; AI/ML Builder — Tomato diagnosis expert systems,
          mobile food delivery, and AI models built on a laptop
        </div>
        <div class="port-pills">
          <span class="pill">🤖 AI/ML</span>
          <span class="pill">🍅 Expert Systems</span>
          <span class="pill">📱 Mobile Dev</span>
          <span class="pill">🧠 Deep Learning</span>
          <span class="pill">🐍 Python</span>
        </div>
        <div class="port-avatar">PAL</div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-num">12</div>
          <div class="stat-lbl">Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">3+</div>
          <div class="stat-lbl">Years Exp</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">06</div>
          <div class="stat-lbl">Models Trained</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">AI/ML</div>
          <div class="stat-lbl">Research Focus</div>
        </div>
      </div>

      <!-- Projects -->
      <div class="sec-label">Featured projects</div>
      <div class="projects-grid">
        <div v-for="project in projects" :key="project.title" class="proj-card">
          <div class="proj-thumb" :class="project.thumbClass">
            <div class="proj-dots"></div>
            <span class="proj-icon">{{ project.icon }}</span>
            <span class="proj-badge">{{ project.badge }}</span>
          </div>
          <div class="proj-body">
            <div class="proj-title">{{ project.title }}</div>
            <div class="proj-desc">{{ project.desc }}</div>
            <div class="proj-tags">
              <span v-for="tag in project.tags" :key="tag" class="proj-tag">{{
                tag
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div class="sec-label">Skills</div>
      <div class="skills-grid">
        <div v-for="skill in skills" :key="skill.name" class="skill-row">
          <div class="skill-name">
            {{ skill.name }}<span class="skill-pct">{{ skill.pct }}%</span>
          </div>
          <div class="skill-bar">
            <div
              class="skill-fill"
              :style="{ width: skillsAnimated ? skill.pct + '%' : '0%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Experience -->
      <div class="sec-label">Experience</div>
      <div class="exp-card">
        <div v-for="(exp, i) in experience" :key="exp.role" class="exp-item">
          <div class="exp-dot" :style="{ opacity: 1 - i * 0.3 }"></div>
          <div>
            <div class="exp-role">{{ exp.role }}</div>
            <div class="exp-place">{{ exp.place }}</div>
            <div class="exp-year">{{ exp.year }}</div>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div id="contact" class="contact-card">
        <div class="port-grid"></div>
        <div class="contact-title">Let's Build Something</div>
        <div class="contact-sub">
          Open to AI/ML research collaborations and student projects
        </div>
        <div class="contact-btns">
          <a href="mailto:palolol@email.com" class="btn-primary"
            >Send a message</a
          >
          <span class="btn-ghost">palolol@email.com</span>
        </div>
      </div>

      <div class="port-footer">Palolol © 2025 — All vibes reserved</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// ── Navbar ────────────────────────────────────────────────────────
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

// ── Skills bar animation on scroll ───────────────────────────────
const skillsAnimated = ref(false);

function checkSkillsVisible() {
  const grid = document.querySelector(".skills-grid");
  if (grid && !skillsAnimated.value) {
    const { top } = grid.getBoundingClientRect();
    if (top < window.innerHeight - 80) skillsAnimated.value = true;
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll);
  window.addEventListener("scroll", checkSkillsVisible);
  setTimeout(() => checkSkillsVisible(), 400);
});
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("scroll", checkSkillsVisible);
});

// ── Home: Bouncing title ──────────────────────────────────────────
const titleLetters = ["P", "A", "L", "O", "L", "O", "L"];

// ── Home: Date Checker ────────────────────────────────────────────
const dateOutput = ref("");
function displayDate() {
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
  const fullDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  dateOutput.value = `Today is ${dayOfWeek}, ${fullDate}.`;
}

// ── Home: Tic Tac Toe ─────────────────────────────────────────────
const cells = ref(Array(9).fill(null));
const currentPlayer = ref("X");
const status = ref("It's X's turn.");

const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner() {
  for (const [a, b, c] of WIN_COMBOS) {
    if (
      cells.value[a] &&
      cells.value[a] === cells.value[b] &&
      cells.value[b] === cells.value[c]
    )
      return cells.value[a];
  }
  return cells.value.every((c) => c) ? "Draw" : null;
}

function handleClick(index) {
  if (cells.value[index] || checkWinner()) return;
  cells.value[index] = currentPlayer.value;
  const winner = checkWinner();
  if (winner) {
    status.value = winner === "Draw" ? "It's a draw!" : `${winner} wins!`;
  } else {
    currentPlayer.value = currentPlayer.value === "X" ? "O" : "X";
    status.value = `It's ${currentPlayer.value}'s turn.`;
  }
}

function restartGame() {
  cells.value = Array(9).fill(null);
  currentPlayer.value = "X";
  status.value = "It's X's turn.";
}

// ── Portfolio data ────────────────────────────────────────────────
const projects = [
  {
    title: "Tomato Diagnosis Expert System",
    desc: "An expert system that diagnoses tomato plant diseases from observed symptoms using a rule-based inference engine. Built for a university AI course.",
    icon: "🍅",
    badge: "Expert System",
    thumbClass: "proj-thumb-1",
    tags: ["Python", "Prolog", "Expert System", "Rule-based"],
  },
  {
    title: "Mobile Food Delivery",
    desc: "University project: a full mobile food ordering and delivery app with restaurant listings, cart, and order tracking.",
    icon: "🛵",
    badge: "Mobile",
    thumbClass: "proj-thumb-2",
    tags: ["Flutter", "Dart", "Firebase", "Mobile"],
  },
  {
    title: "Laptop AI Models",
    desc: "A personal collection of ML/DL models trained on a laptop — image classification, NLP experiments, and small-scale research.",
    icon: "🧠",
    badge: "AI/ML",
    thumbClass: "proj-thumb-3",
    tags: ["Python", "PyTorch", "TensorFlow", "Jupyter"],
  },
  {
    title: "Portfolio v2",
    desc: "Personal portfolio built in Vue 3 with a clean layout, skills, and contact section.",
    icon: "🌐",
    badge: "Web",
    thumbClass: "proj-thumb-4",
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
@import url("https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap");

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
}

/* ══════════════════════════════════════════
   NAVBAR
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
}

/* ══════════════════════════════════════════
   HOME SECTION
══════════════════════════════════════════ */
.home-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url("https://media.npr.org/assets/img/2023/08/28/_36a8456_sy_nj_wide-8834a4249492d4821e770582082edbe89b89ea2e.jpg");
  background-color: #1220e2;
  background-size: contain;
  padding: 20px 1rem 60px;
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
  font-size: 80px;
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
.corner-image {
  width: 150px;
  height: auto;
  position: fixed;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.top-left {
  top: 72px;
  left: 10px;
}
.top-right {
  top: 72px;
  right: 10px;
}
.bottom-left {
  bottom: 10px;
  left: 10px;
}
.bottom-right {
  bottom: 10px;
  right: 10px;
}
.rainbow-container {
  width: min(90%, 600px);
  animation: rainbow 5s infinite;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
@keyframes rainbow {
  0% {
    background-color: red;
  }
  14% {
    background-color: orange;
  }
  28% {
    background-color: yellow;
  }
  42% {
    background-color: green;
  }
  57% {
    background-color: blue;
  }
  71% {
    background-color: indigo;
  }
  85% {
    background-color: violet;
  }
  100% {
    background-color: red;
  }
}
.profile {
  text-align: center;
  margin-top: 20px;
  padding: 20px;
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
.section-h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 22px;
}
.fun-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-family: "Luckiest Guy", cursive;
  transition: background-color 0.2s;
}
.fun-btn:hover {
  background-color: #0056b3;
}
.date-output {
  margin-top: 20px;
  font-size: 18px;
  color: #333;
  min-height: 28px;
}
.game-board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 5px;
  justify-content: center;
  margin-top: 20px;
}
.cell {
  background-color: white;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.15s;
}
.cell:hover {
  background-color: #f0f0f0;
}
.game-status {
  margin: 16px 0 12px;
  font-size: 20px;
  color: #000;
}

/* ══════════════════════════════════════════
   PORTFOLIO SECTION
══════════════════════════════════════════ */
.port-section {
  width: 100%;
  max-width: 900px;
  padding: 3rem 1.5rem 2rem;
  font-family: "DM Sans", sans-serif;
}
.port-hero {
  background: #0a0a0a;
  border-radius: 16px;
  padding: 3rem 2rem 2rem;
  position: relative;
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.port-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(18, 32, 226, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 32, 226, 0.15) 1px, transparent 1px);
  background-size: 40px 40px;
}
.port-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(18, 32, 226, 0.4) 0%,
    transparent 70%
  );
  top: -80px;
  right: -60px;
  border-radius: 50%;
}
.port-tag {
  display: inline-block;
  background: rgba(18, 32, 226, 0.3);
  border: 1px solid rgba(18, 32, 226, 0.6);
  color: #7b93ff;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 1rem;
  letter-spacing: 0.08em;
  position: relative;
  z-index: 1;
}
.port-name {
  font-family: "Bebas Neue", cursive;
  font-size: 80px;
  color: #fff;
  line-height: 0.9;
  margin: 0 0 0.5rem;
  position: relative;
  z-index: 1;
  letter-spacing: 2px;
}
.port-name span {
  color: #1220e2;
}
.port-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 2rem;
  position: relative;
  z-index: 1;
  font-weight: 300;
}
.port-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  z-index: 1;
}
.pill {
  background: rgba(255, 255, 255, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 20px;
}
.port-avatar {
  position: absolute;
  right: 2rem;
  bottom: 0;
  z-index: 1;
  width: 160px;
  height: 160px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: linear-gradient(135deg, #1220e2, #7b93ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Bebas Neue", cursive;
  font-size: 52px;
  color: #fff;
  border: 3px solid rgba(255, 255, 255, 0.1);
}
.sec-label {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #888;
  text-transform: uppercase;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sec-label::after {
  content: "";
  flex: 1;
  height: 0.5px;
  background: #e0e0e0;
}
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 1.5rem;
}
.stat-card {
  background: #f5f5f5;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
}
.stat-num {
  font-family: "Bebas Neue", cursive;
  font-size: 36px;
  color: #1220e2;
  line-height: 1;
  margin-bottom: 4px;
}
.stat-lbl {
  font-size: 12px;
  color: #888;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 1.5rem;
}
.proj-card {
  background: #fff;
  border: 0.5px solid #e0e0e0;
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.proj-card:hover {
  border-color: #1220e2;
}
.proj-thumb {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.proj-thumb-1 {
  background: #0a0a1a;
}
.proj-thumb-2 {
  background: #001a0a;
}
.proj-thumb-3 {
  background: #1a0a00;
}
.proj-thumb-4 {
  background: #1a001a;
}
.proj-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.06) 1px,
    transparent 1px
  );
  background-size: 16px 16px;
}
.proj-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
}
.proj-icon {
  font-size: 40px;
  position: relative;
  z-index: 1;
}
.proj-body {
  padding: 1rem;
}
.proj-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px;
}
.proj-desc {
  font-size: 12px;
  color: #666;
  margin: 0 0 10px;
  line-height: 1.5;
}
.proj-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.proj-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  background: rgba(18, 32, 226, 0.08);
  color: #3040c0;
  border: 0.5px solid rgba(18, 32, 226, 0.2);
}
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 1.5rem;
}
.skill-row {
  background: #fff;
  border: 0.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 0.9rem 1rem;
}
.skill-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}
.skill-pct {
  font-size: 12px;
  color: #1220e2;
  font-weight: 500;
}
.skill-bar {
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}
.skill-fill {
  height: 100%;
  background: #1220e2;
  border-radius: 2px;
  transition: width 1s ease;
}
.exp-card {
  background: #fff;
  border: 0.5px solid #e0e0e0;
  border-radius: 14px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}
.exp-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 0.5px solid #e0e0e0;
}
.exp-item:last-child {
  border-bottom: none;
}
.exp-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1220e2;
  margin-top: 5px;
  flex-shrink: 0;
}
.exp-role {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 2px;
}
.exp-place {
  font-size: 13px;
  color: #666;
  margin: 0 0 4px;
}
.exp-year {
  font-size: 11px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 8px;
  display: inline-block;
}
.contact-card {
  background: #0a0a0a;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
}
.contact-title {
  font-family: "Bebas Neue", cursive;
  font-size: 42px;
  color: #fff;
  margin: 0 0 0.5rem;
  position: relative;
  z-index: 1;
}
.contact-sub {
  color: rgba(255, 255, 255, 0.45);
  font-size: 14px;
  margin: 0 0 1.5rem;
  position: relative;
  z-index: 1;
}
.contact-btns {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}
.btn-primary {
  background: #1220e2;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  transition: opacity 0.2s;
}
.btn-primary:hover {
  opacity: 0.85;
}
.btn-ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 14px;
  cursor: default;
  font-family: "DM Sans", sans-serif;
}
.port-footer {
  text-align: center;
  font-size: 12px;
  color: #aaa;
  padding: 0.5rem 0 1rem;
  font-family: "DM Sans", sans-serif;
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
  .corner-image {
    width: 80px;
  }
  .top-left,
  .top-right {
    top: 70px;
  }
  .cell {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }
  .game-board {
    grid-template-columns: repeat(3, 80px);
    grid-template-rows: repeat(3, 80px);
  }
  .port-name {
    font-size: 54px;
  }
  .port-avatar {
    width: 100px;
    height: 100px;
    font-size: 32px;
    right: 1rem;
  }
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .projects-grid {
    grid-template-columns: 1fr;
  }
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .bouncing-title span {
    font-size: 44px;
  }
  .corner-image {
    display: none;
  }
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
