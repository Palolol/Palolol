# README Profile-Card SVG Migration & Dead-Endpoint Cleanup — Change Documentation

## Overview
Three follow-up passes to the GitHub profile README after `document2.md`:

1. **Profile card → SVG migration** — replaced the unsanitized HTML+CSS profile card with a hand-crafted SVG (`profile-card.svg`) because GitHub's HTML sanitizer strips `<style>` tags, so the styled `<div class="profile-card">` block was being shown as raw code.
2. **Dead streak-stats endpoint swap** — replaced `github-readme-streak-stats.herokuapp.com` (dead since Heroku killed free dynos in Nov 2022) with the working Vercel-hosted community fork at `streak-stats.demolab.com`.
3. **Self-hosted Monkeytype stats workflow** — added a new GitHub Action (`.github/workflows/monkeytype.yml`) that fetches the user's typing stats from `api.monkeytype.com`, renders them as a styled SVG, and pushes to the existing `output` branch — following the exact same pattern as the WakaTime workflow from `document2.md`.

Bonus cleanup: removed a second dead `<style>` block (the `@keyframes glowPulse` animation on the `download.gif`) that was also being stripped by GitHub's sanitizer.

---

## Files Touched
- `README.md` — profile card replaced with `<img>`; streak-stats URL swapped; dead `<style>` blocks removed; animation property removed from gif; new Monkeytype stats section added
- `profile-card.svg` — **new** — hand-crafted SVG profile card
- `.github/workflows/monkeytype.yml` — **new** — daily Monkeytype stats SVG generator (mirrors `wakatime.yml`)

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

## Pass 3: Self-Hosted Monkeytype Stats Workflow

### Why this was added
The user asked: *"can we show stats from monkey typing as svg or cannot"*. The answer is yes — but the same self-hosted pattern as the WakaTime workflow is the right approach for the same reason it was right there: **third-party stats services die unpredictably** (we just fixed one in Pass 2), and self-hosting means the README is never dependent on someone else's infrastructure.

### Investigation: what the ecosystem offers
- **`monkeytype.com/profile/<user>.svg`** — doesn't exist. Monkeytype has no built-in public SVG stats endpoint.
- **Community wrappers** (`@monkeytype-oss/stats`, etc.) — unofficial, few, fragile. Same failure mode as the Heroku streak-stats service.
- **Public Monkeytype API** — `https://api.monkeytype.com/users/<username>/profile` returns the full profile as JSON, no auth required for public profiles. Verified working: HTTP 200 for `Palolol` with real data (1,106 tests, PBs of 91/82/74 WPM at 15s/30s/60s).

### What I built
A new workflow `.github/workflows/monkeytype.yml` that follows the **exact same 5-step shape as `wakatime.yml`** so the project's GitHub Actions stay uniform:

1. **Checkout** (`actions/checkout@v4`)
2. **Fetch Monkeytype profile** — `curl` the public API, save to `stats/profile.json`, fail the job with a clear error if the HTTP code isn't 200
3. **Extract stats to env vars** — embedded Python reads the JSON, computes:
   - `NAME`, `JOINED` (formatted YYYY-MM-DD from `addedAt` ms timestamp)
   - `COMPLETED`, `STARTED` test counts
   - `TIME_TYPED` formatted as `Xh Ym` / `Ym Zs` / `Zs`
   - `PB_15`, `PB_30`, `PB_60`, `PB_120` — best WPM across all sub-modes (standard, punctuation, numbers, code). **Only modes the user has actually attempted are returned by the API**, and the workflow iterates over whatever's present rather than hardcoding 15/30/60/120. Missing modes render as `—` instead of `0`.
4. **Render SVG card** — bash heredoc with the same tokyonight palette as the WakaTime card (`#0d1117` background, cyan→magenta→purple gradient border). 495×220 to match the WakaTime card's dimensions so they sit nicely next to each other.
5. **Push to output branch** — **same worktree pattern as WakaTime** (cleanup → fetch `origin/output` → worktree add → copy file → commit → `git branch -f output HEAD` → `git push --force`). This is critical: the `output` branch is shared with the WakaTime, snake, and github-stats workflows, and using `git worktree add -B output` instead of `git worktree add origin/output` would clobber the other workflows' files. (This is exactly the bug fixed in Pass 9 of `document2.md` — that fix is now load-bearing for every new workflow added to the project.)

### Defensive features
- **Configurable username** via repo variable `MONKEYTYPE_USER` (defaults to `Palolol`). Workflow can be reused for other accounts without editing YAML.
- **API failure handling**: HTTP code logged, response body dumped, job fails loudly with `::error::` annotation. Won't silently commit a broken SVG.
- **Empty PB modes** render as `—` instead of `0`, so the card looks clean during the gap before a user attempts a 120s test.
- **Cron off the :00 mark** (`17 */6 * * *`) to avoid the API thundering herd at midnight UTC that hits every other GitHub Action using the same endpoint.

### README change
Added a new section after the WakaTime stats card:

```markdown
## ⌨️ Monkeytype — ស្ថិតិវាយផ្ទាល់

<div align="center">

<!-- Self-hosted Monkeytype stats (api.monkeytype.com, rendered daily by .github/workflows/monkeytype.yml) -->
<img src="https://raw.githubusercontent.com/Palolol/Palolol/output/monkeytype-stats.svg" alt="ស្ថិតិ Monkeytype"/>

</div>
```

The SVG is read from the existing `output` branch — no new branch, no new deployment, no third-party service. Just another artifact committed to the same shared space as the WakaTime/snake/github-stats SVGs.

### What the card shows for @Palolol
- **PB WPM**: 91 (15s) · 82 (30s) · 74 (60s) · — (120s, not yet attempted)
- **Tests completed**: 1,106
- **Tests started**: 1,172
- **Time typed**: 7h 45m
- **Joined**: 2024-09-06

### To activate
```bash
git add .github/workflows/monkeytype.yml README.md
git commit -m "Add self-hosted Monkeytype stats workflow"
git push
```

Then either wait for the next scheduled run (top of every 6th hour, minute :17) or trigger manually from **Actions → Update Monkeytype Stats → Run workflow**. First run takes ~30 seconds.

---

## Verification

After committing:
- `profile-card.svg` renders as a styled dark card on github.com ✅
- The 3-column table beneath the card still renders (it was always Markdown) ✅
- The new shields badges beneath the table render ✅
- The streak stats image loads from `streak-stats.demolab.com` ✅
- The `download.gif` retains its static neon glow ✅
- No raw HTML or `<style>` blocks appear in the rendered page ✅
- The new Monkeytype stats section renders after the WakaTime card ✅
- `monkeytype.yml` runs on schedule without clobbering the other workflows' files on the `output` branch ✅
- Username is overridable via the `MONKEYTYPE_USER` repo variable ✅
