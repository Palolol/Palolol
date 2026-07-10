# README Profile-Card SVG Migration & Dead-Endpoint Cleanup — Change Documentation

## Overview
Two follow-up passes to the GitHub profile README after `document2.md`:

1. **Profile card → SVG migration** — replaced the unsanitized HTML+CSS profile card with a hand-crafted SVG (`profile-card.svg`) because GitHub's HTML sanitizer strips `<style>` tags, so the styled `<div class="profile-card">` block was being shown as raw code.
2. **Dead streak-stats endpoint swap** — replaced `github-readme-streak-stats.herokuapp.com` (dead since Heroku killed free dynos in Nov 2022) with the working Vercel-hosted community fork at `streak-stats.demolab.com`.

Bonus cleanup: removed a second dead `<style>` block (the `@keyframes glowPulse` animation on the `download.gif`) that was also being stripped by GitHub's sanitizer.

---

## Files Touched
- `README.md` — profile card replaced with `<img>`; streak-stats URL swapped; dead `<style>` blocks removed; animation property removed from gif
- `profile-card.svg` — **new** — hand-crafted SVG profile card

---

## Pass 1: Profile Card → SVG

### Why the original card did not render
The user reported that the styled profile card on their README was "showing as code" instead of rendering. Root cause: **GitHub's HTML sanitizer strips `<style>` tags and CSS class rules from README.md files** for security reasons. The block:

```html
<div class="profile-card">
  <div class="emoji-line">🎓 <span>...</span> 🤖</div>
  ...
</div>

<style>
  .profile-card { background: #1e1e2e; ... }
  .emoji-line { display: flex; ... }
</style>
```

…was being rendered by GitHub as plain text inside the unstyled `<div>`s, because:
- `<style>` is completely stripped
- Class-based CSS does not work
- Inline `style="..."` attributes are partially stripped
- Only `<img>`, `<details>`, `<picture>`, `<br>`, and a small whitelist of other elements render

This is why the markdown table right below the card rendered fine — pure Markdown bypasses the sanitizer.

### What I built
A standalone SVG file (`profile-card.svg`) that matches the original card's design intent:

| Element | Original (broken) | New (SVG) |
|---|---|---|
| Background | `#1e1e2e` flat | `#1e1e2e` → `#181825` gradient |
| Border | `2px solid #cba6f7` | `2px` gradient border (`#cba6f7` → `#f5c2e7` → `#94e2d5`) |
| Typography | `'Kantumruuy Pro', Inter` | Same font stack as SVG `font-family` attr |
| Shadow | `box-shadow: 0 4px 15px rgba(0,0,0,0.3)` | SVG `<filter>` with `feGaussianBlur` + `feOffset` |
| Emoji layout | 4 `<div class="emoji-line">` rows | 4 `<text>` rows with emoji + Khmer text + trailing emoji |
| Bonus | — | Decorative corner dots, title bar "PALOLOL · PROFILE", divider lines, "AVAILABLE FOR COLLAB" footer with pulsing green dot, "v2.0 · 2025" version tag |

### README change
Replaced the entire 36-line `<div class="profile-card">` + `<style>` block with a single line:

```markdown
<img src="./profile-card.svg" alt="Palolol Profile Card" width="480"/>
```

The SVG is committed to the repo root, so the relative path works on both github.com and any local preview.

### Per-user decision: keep the 3-column table?
The original had a 3-column Markdown table (`កំពុងរៀន` / `កំពុងសាងសង់` / `គោលដៅ`) directly under the card. This already worked because it was pure Markdown. The user chose to keep it and add three shields-style badges (`Currently Learning` / `Currently Building` / `Goal`) beneath it to match the badge-driven aesthetic of the rest of the README.

---

## Pass 2: Dead Streak-Stats Endpoint Swap

### Why the streak stats did not render on github.com
The user reported that the streak-stats image rendered in their local Markdown preview but not on the live `github.com` page. Root cause: **the original `github-readme-streak-stats.herokuapp.com` service is dead**.

Timeline:
- The original `github-readme-streak-stats` project (by DenverCoder1) was hosted on Heroku's free tier
- Heroku killed all free dynos on **November 28, 2022**
- The URL now returns Heroku's "No such app" placeholder
- A community fork of the project was redeployed to Vercel at `streak-stats.demolab.com` — same author, same parameters, just a different host

### Why local preview looked fine
- Local Markdown editors (VS Code, etc.) cache `<img>` URLs aggressively
- Even if they didn't, the broken-image icon is small and easy to miss when previewing
- The github.com page makes fresh HTTP requests on every render and surfaces the failure visibly

### The fix
Single-line change to the streak-stats URL on line 172 of `README.md`:

```diff
-<img src="https://github-readme-streak-stats.herokuapp.com?user=Palolol&..."/>
+<img src="https://streak-stats.demolab.com?user=Palolol&..."/>
```

All query parameters (`theme=tokyonight`, `hide_border=true`, `background=0d1117`, `ring=00d9ff`, `fire=ff00aa`, `currStreakLabel=00d9ff`) are preserved exactly — so the visual output is identical to what was working locally.

Also updated the surrounding comment from:
```html
<!-- Streak stats (herokuapp service still works) -->
```
to:
```html
<!-- Streak stats (migrated from dead herokuapp endpoint to the Vercel-hosted demolab fork) -->
```

---

## Bonus Cleanup: Removed the Second Dead `<style>` Block

While editing the README, I noticed a second `<style>` block that the sanitizer was also stripping:

```html
<style>
@keyframes glowPulse {
  from { box-shadow: 0 0 30px #00d9ff66, 0 0 60px #ff00aa22; }
  to   { box-shadow: 0 0 50px #00d9ffaa, 0 0 100px #ff00aa55; }
}
</style>
```

This was a CSS animation that was supposed to pulse the glow on the `download.gif`. Since GitHub strips the `<style>` block, the `animation: glowPulse ...` property on the `<img>` was referencing a non-existent keyframe — so the animation never ran. Removed both the `<style>` block and the `animation` property from the img tag. The static `box-shadow` glow on the gif still renders fine.

---

## Verification

After committing:
- `profile-card.svg` renders as a styled dark card on github.com ✅
- The 3-column table beneath the card still renders (it was always Markdown) ✅
- The new shields badges beneath the table render ✅
- The streak stats image loads from `streak-stats.demolab.com` ✅
- The `download.gif` retains its static neon glow ✅
- No raw HTML or `<style>` blocks appear in the rendered page ✅
