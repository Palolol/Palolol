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

# Second Pass — Avatar + Home Section Overhaul

## Overview
Two visual additions to the portfolio:
1. **`port-avatar`** — Replaced the static "PAL" gradient blob in the portfolio hero with a circular **anime-teacher** illustration. The avatar is a framed portrait of an anime-style teacher character with a soft glow, representing the developer's virtual mentor/guide concept.
2. **`home-section` — "First Project" virtual teacher** — Added a new component at the top of the home section: a "Virtual Teacher" card that introduces the developer's very first project. The card shows the same anime-teacher image next to a dialogue-style narrative that types itself out, telling the story of the developer's first piece of code.

The concept: a virtual anime teacher is "telling" / narrating the developer's origin story — the first project they ever built.

## Specific Changes

### A. `port-avatar` (around line 146 in the original layout)
- **Before:** A static `div.port-avatar` with text "PAL" on a blue gradient.
- **After:** Same circular slot, but now displays an `<img>` of an anime teacher character. Kept the same dimensions and border style for layout consistency.
- **Image source:** An anime-teacher illustration (e.g. from a free public anime CDN). Uses a fallback if the image fails to load.

### B. New `first-project` block in `#home`
- **Location:** Inserted at the very top of `home-section`, above the bouncing title.
- **Structure:**
  - Outer card with a soft border + glow
  - Left side: anime teacher avatar (same image as the portfolio hero)
  - Right side: a "speech bubble" containing the developer's first-project story
  - The story types itself out character-by-character (typing animation) when the page loads
  - Has a "▶ Replay" button to re-trigger the animation
- **Content of the story (told by the virtual anime teacher):**
  > "Hello! I'm your virtual teacher. Let me tell you about the very first project this developer ever built… It was a simple program — a small calculator in Python. It was messy, it had bugs, but it ran. That little `print('Hello, World')` was the moment the developer knew — code was the path. From that tiny calculator, they went on to build expert systems, mobile apps, and now AI models. Every great developer starts with a single line."

### C. New CSS
Added a new style block for:
- `.first-project-card` — the outer card
- `.first-project-avatar` — the anime teacher portrait
- `.first-project-bubble` — the dialogue speech bubble
- `.first-project-text` — the typing-text area
- `.first-project-replay` — the replay button
- Keyframe animations:
  - `blink` — for the typing cursor
  - `fadeInUp` — entrance animation for the card
  - `avatarGlow` — soft pulsing glow around the anime avatar
- A "responsive" override: on small screens the card stacks vertically (avatar on top, bubble below).

## Files Touched
- `src/App.vue` — template, script, and style sections
- `document.md` — this new section appended

## Implementation Notes
- Typing animation is implemented in pure Vue (no new libraries) using `setInterval` and a reactive `typedText` ref.
- The avatar image uses a free-to-use anime illustration URL with an `onerror` fallback to a CSS gradient placeholder, so the page never shows a broken image.
- The card is added to the existing `home-section` so it lives above the bouncing title but does not interfere with the existing date-checker / Tic Tac Toe / profile blocks.

