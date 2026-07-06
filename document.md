# Portfolio Rewrite — Change Documentation

## Overview
This document describes the changes made to `src/App.vue` to rebrand the portfolio from a "Game Developer / Creative Coder / Freelancer" identity to a **college student AI/ML developer** identity. The rewrite removes all game-development / freelancer / "ideas left" framing and replaces it with a narrative about academic work (Tomato Diagnosis Expert System, Mobile Food Delivery university project) and current self-initiated AI model building on a laptop.

## Files Touched
- `src/App.vue` — only file modified

## Identity Pivot
**Before:** Game Developer & Creative Coder — Making worlds, one pixel at a time. Freelance game developer with 3+ years of experience, games made, and infinite ideas.

**After:** College student studying computer science / AI. Has built a Tomato Diagnosis Expert System (academic project), developed a Mobile Food Delivery app (university project), and is currently building AI/ML models on a personal laptop.

---

## Specific Changes

### 1. Portfolio hero subtitle (line 137)
- **Removed:** `"Game Developer & Creative Coder — Making worlds, one pixel at a time"`
- **Added:** `"College Student & AI/ML Builder — Tomato diagnosis expert systems, mobile food delivery, and AI models built on a laptop"`

### 2. Portfolio pills (lines 140-145)
- **Removed:** `🎮 Game Dev`, `💻 Web Dev`, `🎨 UI Design`, `⚡ Vue.js`
- **Added:** `🤖 AI/ML`, `🍅 Expert Systems`, `📱 Mobile Dev`, `🧠 Deep Learning`, `🐍 Python`

### 3. Stats row (lines 150-167)
The stat "Ideas Left = ∞" and "Games Made = 08" were a game-dev / freelancer identity marker.
- **Removed:** `Games Made: 08`
- **Removed:** `Ideas Left: ∞`
- **Added:** `Models Trained: 06`
- **Added:** `Research Focus: AI/ML`
- **Kept (unchanged):** `Projects: 12`, `Years Exp: 3+`

### 4. Featured projects (lines 358-391)
Replaced the 4 game/web creative projects with 4 academic + AI projects:
- **Removed:** `Neon Dungeon` (Unity roguelike)
- **Removed:** `Portfolio v1` (bouncing letters portfolio)
- **Removed:** `Bot Arena` (multiplayer AI game)
- **Removed:** `Beat Maker` (drum sequencer)
- **Added:** `Tomato Diagnosis Expert System` — an expert system that diagnoses tomato plant diseases from symptoms/rules, built for a university AI course. Tags: Python, Prolog, Expert System, Rule-based.
- **Added:** `Mobile Food Delivery` — university project: a full mobile food ordering/delivery app. Tags: Flutter, Dart, Firebase, Mobile.
- **Added:** `Laptop AI Models` — personal collection of ML/DL models trained on a personal laptop (image classification, NLP experiments, etc.). Tags: Python, PyTorch, TensorFlow, Jupyter.
- **Added:** `Portfolio v2` — current portfolio (Vue 3). Tags: Vue.js, CSS, JS.

### 5. Skills (lines 393-400)
Replaced the game-dev skill list with an AI/ML + mobile skill list:
- **Removed:** `Vue.js (90)`, `JavaScript (85)`, `Unity / C# (75)`, `CSS / Design (80)`, `Node.js (65)`, `Pixel Art (70)`
- **Added:** `Python (90)`, `PyTorch / TensorFlow (80)`, `Machine Learning (85)`, `Flutter / Dart (70)`, `Expert Systems / Prolog (65)`, `Data Analysis (75)`

### 6. Experience (lines 402-418)
Removed the freelancer + game-jam entries; added academic + self-study entries:
- **Removed:** `Freelance Game Developer — Independent Remote — 2023 – Present`
- **Removed:** `Junior Web Developer — Fake Studio Co. — 2022 – 2023`
- **Removed:** `Game Jam Participant — Various Online Jams — 2021 – 2022`
- **Added:** `AI/ML Self-Study & Model Building — Personal Laptop — 2024 – Present`
- **Added:** `Mobile Food Delivery Project — University — 2023 – 2024`
- **Added:** `Tomato Diagnosis Expert System — University AI Course — 2023`

### 7. Contact subtitle (line 224)
- **Removed:** `Open to collabs, game projects, and freelance work`
- **Added:** `Open to AI/ML research collaborations and student projects`

### 8. Portfolio tag (line 134)
- **Removed:** `Portfolio 2025`
- **Added:** `Portfolio · AI/ML · 2025`

---

## What Was NOT Changed
- All CSS / styling left untouched (visual identity preserved)
- Home section: bouncing title, profile, date checker, Tic Tac Toe game — unchanged
- Navbar structure and links — unchanged
- All corner images, profile image, background image — unchanged
- Footer text `Palolol © 2025 — All vibes reserved` — unchanged
- Responsive media queries — unchanged
- File structure, dependencies, build config — unchanged

---

# Second Pass — Frieren Virtual Teacher Video Avatar

## Overview
Replaced the static anime-teacher image and the long typed-out story in the home section's "First Project" card with a **looping local video** (`frieren.gif.mp4`) that does the explaining. Frieren is the anime teacher — the video is the avatar, and a short, single-line caption introduces the developer's first project. The video autoplays, loops, and is muted so the user doesn't have to interact with it.

## Files Touched
- `public/frieren.gif.mp4` — moved from repo root to `public/` so Vite serves it at `/frieren.gif.mp4`
- `src/App.vue` — template, script, and style for the first-project card
- `document.md` — this section

## Specific Changes

### 1. Asset location
- **Before:** `frieren.gif.mp4` sat in the repo root and was not served by Vite.
- **After:** Moved to `public/frieren.gif.mp4`. Reachable as `/frieren.gif.mp4` in the running app.

### 2. `first-project-card` content
- **Avatar:** `<img>` was replaced with a `<video>` element that uses `/frieren.gif.mp4` as its source. The video is `autoplay`, `muted`, `loop`, and `playsinline` so it starts immediately, repeats forever, and works on mobile.
- **Bubble copy:** The long, character-by-character typed story was removed. Replaced with a **single short line** that introduces the developer's first project — the video itself does the "explaining" visually:
  > "My first project? A tiny Python calculator. From one script to expert systems, mobile apps, and AI models — every developer starts with a single line."
- **Replay button:** Removed (no longer needed — the video loops on its own).

### 3. Script logic
- **Removed:** `typedStory`, `firstProjectStory`, `startTyping`, `replayStory`, typing timer, and the `onMounted(() => startTyping())` call.
- **Kept:** `animeTeacherUrl` constant (now points at the local video) and `onAvatarError` (used by the portfolio hero's `<img>` fallback).
- **The video element** doesn't need Vue-controlled state — the browser handles autoplay + loop natively.

### 4. CSS
- **Kept:** the outer card layout, the avatar slot, the glow + tag, the speech bubble, the bubble tail, the entrance animation, and the responsive mobile override.
- **Updated:** `.first-project-avatar img` rule renamed to `.first-project-avatar video` so the video fills the round slot the same way the image did.
- **Removed:** the typing-caret and replay-button styles (no longer used).

## Implementation Notes
- The video is referenced as a relative URL `/frieren.gif.mp4`. Vite serves anything in `public/` at the site root, so the path works in dev and in the built bundle.
- `muted` is required for `autoplay` to work in all modern browsers (Chrome/Safari/Firefox autoplay policy).
- `playsinline` prevents iOS Safari from forcing fullscreen on autoplay.
- If the video file ever fails to load, the round slot still shows the blue gradient background (the `<video>` element's CSS background), so the page never looks broken.


