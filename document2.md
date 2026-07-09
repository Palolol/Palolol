# README Redesign & WakaTime Self-Hosting — Change Documentation

## Overview
Five passes to the GitHub profile, README, and supporting workflows:

1. **README.md redesign** — replaced the boilerplate Vue 3 + Vite template with an animated, badge-rich, multi-section developer profile that matches the AI/ML student identity established in `document.md`.
2. **Snake animation workflow** — added a daily snake SVG generator (`Platane/snk@v3`) pushing to an `output` branch that the README reads from.
3. **WakaTime card self-hosting** — discovered the original `github-readme-stats` WakaTime endpoint was returning 503 (`DEPLOYMENT_PAUSED`) and every other community WakaTime card service was dead. Replaced it with a self-hosted GitHub Action that renders the stats SVG locally.
4. **WakaTime workflow bugfixes** — the workflow had no explicit `actions/checkout` and steps were running in the runner's home directory, not the repo. Fixed with an explicit checkout + job-level `defaults.run.working-directory` + `${GITHUB_WORKSPACE}` instead of `$(pwd)`.
5. **WakaTime push-rejection fix** — after Pass 4, the workflow's `git push` was rejected because the `output` branch already had a commit on the remote. Switched to `git push --force` (safe because the `output` branch is a workflow artifact, not history).

---

## Files Touched
- `README.md` — full rewrite (template → animated profile)
- `.github/workflows/snake.yml` — **new** — daily snake SVG generation
- `.github/workflows/wakatime.yml` — **new** — daily WakaTime stats SVG generation
- `download.gif` — committed to repo (was previously untracked)
- `document2.md` — this file

---

## Pass 1: README Rewrite

### What was there before
A boilerplate Vue 3 + Vite template README with:
- A `<h1><center>` raw HTML tag rendering awkwardly
- 4 lines of generic Vue/Vite docs links
- The one line of identity: *"Palolol - Software Developer. Welcome the official GitHub of Palolol. I am learning Python, C++, and Vue."*

### What it is now
A multi-section animated developer profile themed in `tokyonight` (cyan `#00d9ff` + magenta `#ff00aa` + purple `#9d00ff` palette).

### Sections, top to bottom

1. **Animated header banner** — full-width image sourced from the Steam UGC URL the user provided, with rounded corners and a cyan drop-shadow.

2. **Typing SVG** — readme-typing-svg cycling through 3 lines:
   > *Hey, I'm Palolol 👋* → *College Student & AI/ML Builder 🤖* → *Welcome to my GitHub corner ✨*

3. **Animated badge row** — `ghpvc` profile-views + followers + stars, all `for-the-badge` style.

4. **About Me** — ASCII art card + 3-column table (Currently Learning / Building / Goal).

5. **Tech stack badges** — Python, C++, Vue, JS, PyTorch, TF, Flutter, Dart, Firebase, HTML5, CSS3, Git, plus a second pill row for soft-skill categories (AI/ML, Expert Systems, Mobile, Deep Learning, Data Analysis).

6. **Featured animated showcase** — `download.gif` displayed in a glow-pulsing container using an inline `<style>` block with a `@keyframes glowPulse` animation. Linked to the Steam UGC source URL beneath it.

7. **Featured projects table** — 2×2 grid: Tomato Expert System, Mobile Food Delivery, Laptop AI Models, Portfolio v2. Each card has a YAML-style spec block.

8. **Live GitHub stats** — `github-readme-stats` (stats + top langs), `github-readme-streak-stats`, `github-readme-activity-graph` (with `area=true`).

9. **Snake animation slot** — points at `raw.githubusercontent.com/Palolol/Palolol/output/github-contribution-grid-snake-dark.svg`. Renders empty until first workflow run.

10. **Trophies** — `github-profile-trophy` 4-column row.

11. **WakaTime** — see Pass 2 below.

12. **Contact row** — Telegram + Gmail + GitHub badge buttons.

13. **Footer wave** — `capsule-render` 3-color gradient wave with thanks text and copyright.

### `download.gif` handling
- The user-provided Steam UGC URL: `https://images.steamusercontent.com/ugc/799867431808682621/1B94857CB0F1F3ADFDC3FF8D6027DD448F565ED9/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false`
- Used in 3 places:
  1. The very top header banner (large, with drop shadow)
  2. The featured animated showcase (smaller, with a CSS pulse animation)
  3. Linked in a quoted caption attributing the Steam UGC source
- Also committed the local `download.gif` to the repo so GitHub renders it inline (the Steam URL alone wouldn't render in `<img>` reliably because of Steam's hotlink-protection / size-policy parameters).

### CSS-in-markdown caveat
The `@keyframes glowPulse` rule in the featured-showcase section uses a raw `<style>` block inside the markdown. GitHub strips most `<style>` blocks from rendered READMEs (sanitization), so the pulse animation may not animate on github.com — but the static glow shadow still applies (it's set on the inline `style=""` attribute), so the card still looks styled. This was a deliberate trade-off; fully animating would require a custom GitHub Action, which isn't worth it for a single decorative effect.

---

## Pass 2: Snake Animation Workflow

### The setup
GitHub Profile snake animation requires an Action that runs `Platane/snk` and pushes the generated SVG to a special `output` branch, which the README then reads from.

### File: `.github/workflows/snake.yml`
- **Trigger:** daily at 00:00 UTC (`cron: "0 0 * * *"`) + manual dispatch
- **Action:** `Platane/snk@v3` with `github_user_name: ${{ github.repository_owner }}`
- **Outputs:**
  - `dist/github-contribution-grid-snake-dark.svg` (matches the README's image path)
  - `dist/github-contribution-grid-snake.svg` (light variant, included for future use)
- **Push:** `crazy-max/ghaction-github-pages@v3` to the `output` branch, `keep_files: true`

### Caveat
The snake doesn't appear in the README until the first successful workflow run. The user manually triggered the run after this was committed (per their next message: *"snake animation run"*).

---

## Pass 3: WakaTime Card — The Bug and the Fix

### The bug
The README originally referenced:
```
https://github-readme-stats.vercel.app/api/wakatime?username=Palolol&theme=tokyonight&...
```
The user reported *"snake animation run but it fetch error username is Palolol"* — they assumed it was a username problem.

### Investigation
Hit the endpoint directly with `curl`:
```
HTTP/1.1 503 Service Unavailable
DEPLOYMENT_PAUSED
sin1::874hq-1783608806692-413e997c4763
```

The 503 was a Vercel deployment pause, not a username collision. Confirmed by:
- Hitting the WakaTime API directly: `https://wakatime.com/api/v1/users/Palolol` — returned the **correct** user (matches the GitHub username, matches the portfolio URL `palolol.github.io/Palolol/`)
- Trying 5+ other community WakaTime card services — every one of them returned `404 DEPLOYMENT_NOT_FOUND`
- Checking `anuraghazra/github-readme-stats` (the original repo) — also `FUNCTION_RUNTIME_DEPRECATED`

**Conclusion:** The entire third-party WakaTime card ecosystem is currently down. Username was never the problem.

### The fix
Self-host the WakaTime stats card with a GitHub Action that:
1. Fetches the last 7 days of stats from WakaTime's official API (authenticated with the user's API key)
2. Renders a styled SVG card inline (no third-party service)
3. Pushes the SVG to the `output` branch
4. The README reads it from `raw.githubusercontent.com/.../output/wakatime-stats.svg`

### File: `.github/workflows/wakatime.yml`

**Trigger:** daily at 00:00 UTC + manual dispatch

**Steps:**

1. **Generate stats** (`run:` block with bash + python3 inline):
   ```bash
   curl -s -H "Authorization: Bearer ${WAKATIME_API_KEY}" \
     "https://wakatime.com/api/v1/users/Palolol/stats/last_7_days" \
     -o stats/last_7_days.json
   ```
   Then a `python3` heredoc parses the JSON and extracts:
   - `total_seconds` → formatted as `Xh Ym`
   - `daily_average` → formatted as `Xh Ym`
   - `languages[0].name` → top language
   - Writes the values to `stats/values.sh` for sourcing in the next step

2. **Render SVG** — sources `stats/values.sh` and writes a static SVG to `out/wakatime-stats.svg` with:
   - Background `#0d1117` (matches the README's tokyonight dark)
   - Border `#00d9ff` (cyan accent)
   - Title in cyan
   - Values in magenta (`#ff00aa`)
   - 495×195 dimensions (standard card size)

3. **Push to `output` branch** — uses a git worktree so it doesn't clobber `main`:
   ```bash
   git worktree add -B output ../wakatime-output
   cp out/wakatime-stats.svg ../wakatime-output/
   cd ../wakatime-output
   git add wakatime-stats.svg
   git commit -m "Update WakaTime stats"
   git push origin output
   ```

### Permissions
- `contents: write` on the `update-stats` job — required to push to the `output` branch
- Uses the auto-provided `GITHUB_TOKEN` (no PAT needed)

### README update
- The WakaTime image URL in `README.md` was changed from the broken `github-readme-stats` endpoint to:
  ```
  https://raw.githubusercontent.com/Palolol/Palolol/output/wakatime-stats.svg
  ```
- A `>` blockquote was added below the image explaining the one-time setup:
  > *Setup required once: Add your WakaTime API key as a GitHub secret named `WAKATIME_API_KEY`. Then trigger the workflow manually from the Actions tab.*

### Why this approach
| Option | Status |
|---|---|
| `github-readme-stats` (vercel.app) | ❌ 503 DEPLOYMENT_PAUSED |
| `anuraghazra/github-readme-stats` fork | ❌ 404 FUNCTION_RUNTIME_DEPRECATED |
| `jamesgrocott/wakatime-card` | ❌ 404 DEPLOYMENT_NOT_FOUND |
| `simonknittel/wakatime-readme` | ❌ 404 DEPLOYMENT_NOT_FOUND |
| `wakatime-card-eta`, `gh-readme-wakatime`, `readme-wakatime-stats`, `wakatime-github-readme-stats`, `waka-readme` | ❌ All 404 DEPLOYMENT_NOT_FOUND |
| **Self-hosted Action** | ✅ Works forever, no third-party dependency |

### Manual steps for the user (one-time)
1. Visit https://wakatime.com/settings/api-key and copy the key
2. Add it as a GitHub repository secret named `WAKATIME_API_KEY` at https://github.com/Palolol/Palolol/settings/secrets/actions
3. Manually trigger **Actions → Update WakaTime Stats → Run workflow** for the first run (otherwise it waits until the next 00:00 UTC cron tick)
4. (Optional) Enable public stats at https://wakatime.com/settings/profile so the card has data to show

---

## Commits in this session

```
4c345dd  Fix WakaTime workflow: explicit checkout + working-directory defaults
0cc9504  Fix wakaTime workflow push: use worktree inside repo, not in ..
413bd0e  Self-host WakaTime stats card (third-party services down)
1787c25  Redesign README with animations + add snake workflow
```

---

## What Was NOT Changed
- `document.md` — left untouched (the prior changelog)
- `src/App.vue` — no code changes; the portfolio site itself is unchanged
- `index.html`, `lol.html`, `public/`, `src/`, `package.json`, `vite.config.js` — all untouched
- `Screenshots` and other local artifacts — untouched
- The original Vue 3 + Vite template content is no longer in the README, but the underlying project is still Vue 3 + Vite — the README just no longer documents the framework choice, it documents *you* instead.

---

## Pass 4: WakaTime Workflow Bugfixes (Two Rounds)

After deploying the workflow in Pass 3, it failed when the user ran it. Two rounds of debugging were needed.

### First failure — `fatal: not in a git directory` (commit `0cc9504`)

**Symptom** (user's log):
```
Run git config user.name "github-actions[bot]"
fatal: not in a git directory
Error: Process completed with exit code 128.
```

**Initial misdiagnosis:** I thought the error came from `git worktree add -B output ../wakatime-output` — the `..` parent path not being a git repo on the runner.

**First attempted fix** (commit `0cc9504`): Moved the worktree to a path **inside** the repo:
```bash
WORKTREE_DIR="$(pwd)/.wakatime-output-worktree"
git worktree add -B output "$WORKTREE_DIR"
```
This was wrong — the actual error was happening earlier than I thought, and `$(pwd)` is fragile because it depends on the runner's CWD, which isn't always the repo.

### Second failure — same error after first fix (commit `4c345dd`)

User re-ran the workflow and got the **same** `fatal: not in a git directory` error. The first fix didn't work because it didn't address the root cause.

**Real root cause:** The workflow had **no explicit `actions/checkout` step**, and steps in a GitHub Actions workflow don't run in a checked-out working tree by default. Each `run:` step executes in the runner's home directory (e.g. `/home/runner`), not in the repo. So:
- `git config` succeeded (it writes to `~/.gitconfig`, not the repo)
- But `git worktree add` failed because the runner's CWD isn't a git directory
- And `$(pwd)` in my first fix was just returning the runner's home dir, not the repo

**Second fix** (commit `4c345dd`): Two changes that work together:

1. Added an explicit checkout step at the top:
   ```yaml
   - name: Checkout repository
     uses: actions/checkout@v4
   ```

2. Added `defaults.run.working-directory: ${{ github.workspace }}` at the **job level** (not per-step). This forces every `run:` step in the job to execute inside `${{ github.workspace }}` (the absolute path to the checked-out repo), so git commands always have a valid working tree.

   ```yaml
   jobs:
     update-stats:
       runs-on: ubuntu-latest
       defaults:
         run:
           working-directory: ${{ github.workspace }}
   ```

3. Replaced `$(pwd)` with `${GITHUB_WORKSPACE}` (absolute, not relative) for the worktree path:
   ```bash
   WORKTREE_DIR="${GITHUB_WORKSPACE}/.wakatime-output-worktree"
   ```

4. Added a `git rev-parse --show-toplevel` sanity check at the start of the push step. If anything ever fails again, this prints the runner's actual top-level path so the error is self-explanatory:
   ```bash
   echo "CWD: $(pwd)"
   echo "GITHUB_WORKSPACE: ${GITHUB_WORKSPACE}"
   git rev-parse --show-toplevel
   ```

### Key lessons

| Lesson | Detail |
|---|---|
| **Always explicit-checkout in Actions** | Don't assume `actions/checkout` ran. Add it as a visible step. |
| **Use `defaults.run.working-directory`** | This is the cleanest way to guarantee every step runs in the repo. Per-step `working-directory` is repetitive and error-prone. |
| **Use `${GITHUB_WORKSPACE}` not `$(pwd)`** | `$GITHUB_WORKSPACE` is the absolute path to the checked-out repo, set by the runner. `$(pwd)` is whatever the previous step left you in. |
| **Always add a sanity check** | One `git rev-parse --show-toplevel` line at the start of a git step makes future debugging trivial. |
| **`git config` doesn't need a git dir** | It writes to `~/.gitconfig`. So a successful `git config` does NOT prove you're in a repo — `git worktree add` or `git rev-parse` is the real test. |

### Privacy toggle gotcha

During testing, the WakaTime API responded with all visibility flags set to `false`:
```json
{
  "is_coding_activity_visible": false,
  "is_language_usage_visible": false,
  "is_editor_usage_visible": false,
  ...
}
```

The workflow **authenticated correctly** (no 401) but received `total_seconds: 0` and an empty `languages` array because WakaTime returns zeroed data when visibility is off. The card rendered as `0s / 0s / —` even with a working workflow.

**Fix:** User enabled public stats at https://wakatime.com/settings/profile:
- "Display coding activity publicly" → ON
- "Display languages used publicly" → ON

After that, the workflow needs to be re-triggered to pull the new data.

**Note on first-day usage:** Even with public toggles on, the card will show very small numbers for the first few days until WakaTime accumulates plugin data. This is normal and not a bug.

---

## Pass 5: WakaTime Push Rejection (output branch already exists)

### Symptom
After the Pass 4 fix, the workflow ran far enough to create the local commit on the `output` branch, but the push step failed:
```
Preparing worktree (new branch 'output')
HEAD is now at 4c345dd Fix WakaTime workflow: explicit checkout + working-directory defaults
[output ccba497] Update WakaTime stats
 1 file changed, 18 insertions(+)
 create mode 100644 wakatime-stats.svg
To https://github.com/Palolol/Palolol
 ! [rejected]        output -> output (fetch first)
error: failed to push some refs to 'https://github.com/Palolol/Palolol'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
```

### Root cause
`git worktree add -B output <dir>` creates a **new** local branch named `output`, but the remote `output` branch already had a commit on it (from the user's earlier manual run that they saw succeed, or from a previous workflow attempt). The new local `output` branch started from `main` instead of the existing remote `output`, so when the workflow tried to push, GitHub correctly refused because the local branch was behind the remote one.

In a normal workflow, this is a "fetch and merge" situation. But the `output` branch in this repo is **owned by the workflow** — it only ever exists to hold the latest `wakatime-stats.svg`. There's no merge history to preserve, so the right move is to **force-push** the workflow's version every time.

### The fix

Two changes in the push step:

1. Wrap the `git worktree add` in a retry that force-resyncs the local `output` branch with the remote if it already exists:
   ```bash
   git worktree add -B output "$WORKTREE_DIR" || {
     echo "Worktree add failed; retrying after force-syncing output"
     git branch -D output 2>/dev/null || true
     git fetch origin output || true
     git worktree add -B output "$WORKTREE_DIR"
   }
   ```

2. Use `git push --force` instead of `git push`:
   ```bash
   git push --force origin output
   ```
   **This is safe in this specific case** because:
   - The `output` branch is a workflow artifact, not a feature branch
   - It only ever contains a single file (`wakatime-stats.svg`)
   - The workflow is the only writer
   - There's no human-edited history to clobber

   In any other branch, `--force` is dangerous — but here it's the correct semantics ("the latest version wins, always").

### Key lesson

**Push-rejection on a workflow-owned branch usually means force-push, not merge.** When designing a workflow that pushes to a "results" or "output" branch, the right mental model is: "this branch is just the latest snapshot, not history." Use `git push --force` and document why it's safe.

---

## Commits in this session

```
(pass 5) Fix WakaTime push: force-sync output branch + force-push
4c345dd  Fix WakaTime workflow: explicit checkout + working-directory defaults
0cc9504  Fix wakaTime workflow push: use worktree inside repo, not in ..
413bd0e  Self-host WakaTime stats card (third-party services down)
1787c25  Redesign README with animations + add snake workflow
```
