# 📺 YouTube README Updater — Setup & Operations Guide

This repo's profile README is automatically kept in sync with the most recent video in a YouTube playlist. This document explains how the system works, how to set it up, and how to operate it.

---

## 1. What it does

Every 6 hours (and on manual trigger), a GitHub Actions workflow:

1. Calls the YouTube Data API v3 for the **most recently added video** in the configured playlist.
2. Renders a clickable thumbnail block.
3. Replaces everything between `<!-- YOUTUBE:START -->` and `<!-- YOUTUBE:END -->` in `README.md` with that block.
4. Commits and pushes the README — but **only if it actually changed** (no spam commits when the latest video is the same).

---

## 2. File layout

```
.github/
├── workflows/
│   └── youtube.yml           # GitHub Actions workflow (cron + manual trigger)
└── scripts/
    ├── update_youtube.py     # The actual script — fetches + rewrites README
    └── requirements.txt      # Python deps (just `requests`)

README.md                     # The file that gets updated
apigoogle.md                  # Billing & cost deep-dive
YOUTUBE_SETUP.md              # ← you are here
```

---

## 3. One-time setup

### Step 1 — Get a YouTube Data API v3 key

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or pick an existing one — **do not enable billing on the same project that holds this key**).
3. **APIs & Services → Library** → search "YouTube Data API v3" → **Enable**.
4. **APIs & Services → Credentials** → **Create credentials** → **API key**.
5. Copy the key string.

> See `apigoogle.md` for the full billing/cost breakdown (short version: it costs $0 — you use 0.04% of the free daily quota).

### Step 2 — Add the key to GitHub Secrets

1. Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
2. **Name:** `YOUTUBE_API_KEY`
3. **Secret:** paste the API key from step 1.
4. Click **Add secret**.

### Step 3 — Make sure the playlist is readable

The script uses a simple API key (not OAuth), so the playlist must be **public**. If the playlist is private or unlisted, the API will return 404 / empty.

### Step 4 — Verify the markers exist in `README.md`

The script replaces only the content between these two lines. They must both be present in `README.md`:

```md
<!-- YOUTUBE:START -->
Loading latest video...
<!-- YOUTUBE:END -->
```

They are already there. Do not delete them.

### Step 5 — Trigger the workflow once

1. Repo → **Actions** tab.
2. Pick **"Update YouTube Playlist"** in the left sidebar.
3. Click **"Run workflow"** → green **"Run workflow"** button.
4. Watch the run. The log should show:
   ```
   [INFO] Fetching latest video from playlist PLLKtzYG4mEMLajJa5d59vLcig6oRfXgd6
   [INFO] Latest video: <VIDEO_ID> — <title>
   [INFO] Updated README.md with the latest video.
   ```
5. After ~30s, a commit `📺 Update latest YouTube video` should appear on `main`.

---

## 4. Day-to-day operation

### Automatic (every 6 hours)

The cron expression is `17 */6 * * *` — fires at 00:17, 06:17, 12:17, 18:17 UTC.

- GitHub Actions cron is **best-effort**: expect 0–30 minutes of delay during peak hours.
- If the repo has no activity for 60+ days, GitHub pauses scheduled workflows (it'll show a banner in the Actions tab — just run one manually to wake it up).
- The workflow has `concurrency.cancel-in-progress: true`, so backlogs are impossible.

### Manual trigger

After uploading a new video and you don't want to wait for the next scheduled run:

- **Actions → Update YouTube Playlist → Run workflow → Run workflow**.

The run takes ~20–30 seconds. The README will update and commit within the same minute.

### What you'll see in the Actions tab

| Outcome | Result | Effect |
|---|---|---|
| API call succeeded, latest video changed | ✅ Green | README updated, commit pushed |
| API call succeeded, latest video unchanged | ✅ Green | No commit (idempotent) |
| API call succeeded, markers missing | ❌ Red | No commit; check the log for the exact error |
| `YOUTUBE_API_KEY` secret missing | ❌ Red | No commit; add the secret |
| YouTube API quota exceeded | ❌ Red | No commit; wait until tomorrow |

---

## 5. Configuration knobs

All optional, all set as environment variables on the workflow step (or in a local shell):

| Variable | Default | What it does |
|---|---|---|
| `YOUTUBE_API_KEY` | *(required)* | YouTube Data API v3 key |
| `PLAYLIST_ID` | `PLLKtzYG4mEMLajJa5d59vLcig6oRfXgd6` | The playlist to read from |
| `README_PATH` | `README.md` | File to update |
| `MAX_WIDTH` | `700` | Thumbnail width in pixels |

To change the playlist: edit `DEFAULT_PLAYLIST_ID` in `.github/scripts/update_youtube.py`, or set the `PLAYLIST_ID` env var in `.github/workflows/youtube.yml`:

```yaml
- name: Run update script
  env:
    YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}
    PLAYLIST_ID: "PLxxxxxxxxxxxxxxxxxxxxxxxxxx"
  run: python .github/scripts/update_youtube.py
```

---

## 6. How the generated HTML looks

Between the markers, the script writes:

```html
<!-- YOUTUBE:START -->
<a href="https://www.youtube.com/watch?v=VIDEO_ID&list=PLLKtzYG4mEMLajJa5d59vLcig6oRfXgd6">
  <img src="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg" width="700" alt="VIDEO_TITLE">
</a>
<!-- YOUTUBE:END -->
```

- The video title is HTML-escaped, so quotes, ampersands, and angle brackets in titles can't break the surrounding markup.
- The playlist ID is also HTML-escaped.
- Clicking the thumbnail opens the video with the playlist attached, so viewers can keep watching in sequence.

---

## 7. Error reference

| Log message | Cause | Fix |
|---|---|---|
| `YOUTUBE_API_KEY environment variable is not set` | Secret missing | Add `YOUTUBE_API_KEY` in Settings → Secrets |
| `YouTube API error 400: API key not valid` | Wrong key, or YouTube Data API v3 not enabled on the project | Re-check the key; enable the API in Google Cloud Console |
| `YouTube API error 403: ...quotaExceeded` | Daily 10k unit quota hit (extremely unlikely — 0.04% usage) | Wait until tomorrow, or raise the quota in Google Cloud Console |
| `YouTube API error 404: ...playlistNotFound` | Playlist is private/unlisted, or the ID is wrong | Make the playlist public, or double-check the ID |
| `Playlist is empty or returned no items` | Playlist has no videos, or it's private | Add a video, or make the playlist public |
| `Markers ... not found in README.md` | Someone deleted the markers | Restore the `<!-- YOUTUBE:START -->` / `<!-- YOUTUBE:END -->` lines in `README.md` |
| `Network error contacting YouTube API` | Transient network issue | The script auto-retries 3×; usually self-heals |

---

## 8. Cost & billing (summary)

See `apigoogle.md` for the full breakdown. Short version:

- Uses **0.04%** of the free daily YouTube Data API v3 quota.
- **No billing account needed.** Do not enable billing on the same GCP project.
- If you ever need paid Google APIs, use a **separate GCP project** with billing enabled, and keep this YouTube key in the free project.

---

## 9. Security notes

- The API key lives in GitHub Secrets, never in the repo.
- The workflow runs on `ubuntu-latest` with `contents: write` permission only — the minimum needed.
- `concurrency` prevents a runaway loop from creating a backlog of runs.
- The script makes **one** outbound HTTP request per run. Nothing else.
- Logs are public on the Actions tab, but they only contain the video title and ID — no secret material.

---

## 10. Troubleshooting checklist

1. **Actions tab shows the workflow but no runs are firing.**
   Check the schedule banner. If it says "scheduled workflows disabled due to inactivity," trigger one manually.
2. **Run succeeds but README doesn't change.**
   Confirm the markers exist in `README.md` exactly as written above.
3. **Commit shows on `main` but the profile doesn't reflect it.**
   GitHub profiles cache for a few minutes. Wait 2–3 minutes and hard-refresh.
4. **You changed the playlist ID but it's still showing the old one.**
   Make sure you edited the file on `main`, not a feature branch.
5. **The thumbnail image is broken (`maxresdefault.jpg` not found).**
   That happens for some older videos. The image still works, but the fallback (`hqdefault.jpg`) won't be tried automatically. You can edit the script to fall back if needed.

---

## 11. Quick reference

- **Trigger a refresh now:** Actions → Update YouTube Playlist → Run workflow
- **Change the playlist:** edit `DEFAULT_PLAYLIST_ID` in `.github/scripts/update_youtube.py`
- **Change thumbnail width:** set `MAX_WIDTH` env var, or edit the default in the script
- **Change the schedule:** edit the `cron` line in `.github/workflows/youtube.yml`
- **Rotate the API key:** generate a new one in Google Cloud Console, update the GitHub Secret
- **Disable the workflow temporarily:** Actions → Update YouTube Playlist → ⋯ → Disable workflow
