"""
update_youtube.py
=================

Fetch the most recently added video from a YouTube playlist and inject a
clickable thumbnail into README.md between these markers:

    <!-- YOUTUBE:START -->
    <!-- YOUTUBE:END -->

The script is designed to be run inside a GitHub Actions workflow (see
.github/workflows/youtube.yml). It is idempotent: if the new block is
byte-for-byte identical to the existing block, the README is left
untouched so the auto-commit step can skip a no-op commit.

Environment variables
---------------------
YOUTUBE_API_KEY   (required)  YouTube Data API v3 key.
PLAYLIST_ID       (optional)  Override the default playlist.
README_PATH       (optional)  Override the README path (default: ./README.md).
MAX_WIDTH         (optional)  Thumbnail width in px (default: 700).

Exit codes
----------
0   Success (README was updated OR no update was needed).
1   YouTube API call failed.
2   Missing YOUTUBE_API_KEY.
3   README markers not found.
"""

from __future__ import annotations

import html
import logging
import os
import re
import sys
from typing import Tuple

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# --------------------------------------------------------------------------- #
# Configuration                                                                #
# --------------------------------------------------------------------------- #

DEFAULT_PLAYLIST_ID = "PLLKtzYG4mEMLajJa5d59vLcig6oRfXgd6"

PLAYLIST_ID: str = os.environ.get("PLAYLIST_ID", DEFAULT_PLAYLIST_ID)
README_PATH: str = os.environ.get("README_PATH", "README.md")
THUMB_WIDTH: int = int(os.environ.get("MAX_WIDTH", "700"))

# Markers that delimit the section of the README this script owns.
START_MARKER = "<!-- YOUTUBE:START -->"
END_MARKER = "<!-- YOUTUBE:END -->"

YOUTUBE_PLAYLIST_ITEMS = "https://www.googleapis.com/youtube/v3/playlistItems"

# --------------------------------------------------------------------------- #
# Logging                                                                      #
# --------------------------------------------------------------------------- #

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("update_youtube")

# --------------------------------------------------------------------------- #
# Errors                                                                       #
# --------------------------------------------------------------------------- #


class YouTubeAPIError(RuntimeError):
    """Raised when the YouTube Data API call fails or returns an error."""


# --------------------------------------------------------------------------- #
# HTTP session with retry/backoff                                              #
# --------------------------------------------------------------------------- #


def build_session() -> requests.Session:
    """Return a requests Session that retries on transient network/HTTP errors."""
    session = requests.Session()
    retries = Retry(
        total=3,
        backoff_factor=1.0,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=frozenset({"GET"}),
    )
    adapter = HTTPAdapter(max_retries=retries)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


# --------------------------------------------------------------------------- #
# YouTube Data API                                                             #
# --------------------------------------------------------------------------- #


def fetch_latest_video(
    session: requests.Session, api_key: str
) -> Tuple[str, str]:
    """
    Return the (video_id, title) of the most recently added item in the playlist.

    Raises YouTubeAPIError on any failure (network, HTTP, API error, empty
    playlist, or unexpected payload shape).
    """
    params = {
        "part": "snippet",
        "playlistId": PLAYLIST_ID,
        "maxResults": 1,
        "key": api_key,
    }
    log.info("Fetching latest video from playlist %s", PLAYLIST_ID)

    try:
        response = session.get(
            YOUTUBE_PLAYLIST_ITEMS, params=params, timeout=15
        )
    except requests.RequestException as exc:
        raise YouTubeAPIError(
            f"Network error contacting YouTube API: {exc}"
        ) from exc

    if response.status_code != 200:
        raise YouTubeAPIError(
            f"YouTube API returned HTTP {response.status_code}: "
            f"{response.text[:300]}"
        )

    try:
        payload = response.json()
    except ValueError as exc:
        raise YouTubeAPIError(
            f"Invalid JSON response from YouTube: {exc}"
        ) from exc

    if "error" in payload:
        err = payload["error"]
        raise YouTubeAPIError(
            f"YouTube API error {err.get('code')}: {err.get('message')}"
        )

    items = payload.get("items") or []
    if not items:
        raise YouTubeAPIError("Playlist is empty or returned no items.")

    snippet = items[0].get("snippet") or {}
    video_id = (snippet.get("resourceId") or {}).get("videoId")
    title = snippet.get("title")

    if not video_id or not title:
        raise YouTubeAPIError(f"Unexpected item shape: {items[0]!r}")

    log.info("Latest video: %s — %s", video_id, title)
    return video_id, title


# --------------------------------------------------------------------------- #
# README rendering & replacement                                                #
# --------------------------------------------------------------------------- #

# Compile once at import time.
_MARKER_RE = re.compile(
    re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER),
    flags=re.DOTALL,
)


def build_block(video_id: str, title: str) -> str:
    """
    Render the HTML block to be placed between the markers.

    The title is HTML-escaped so quotes / ampersands / angle brackets in
    the video title can't break the surrounding <a>/<img> markup.
    """
    safe_title = html.escape(title, quote=True)
    safe_list = html.escape(PLAYLIST_ID, quote=True)
    return (
        f"{START_MARKER}\n"
        f'<a href="https://www.youtube.com/watch?v={video_id}&list={safe_list}">\n'
        f'  <img src="https://img.youtube.com/vi/{video_id}/maxresdefault.jpg" '
        f'width="{THUMB_WIDTH}" alt="{safe_title}">\n'
        f"</a>\n"
        f"{END_MARKER}"
    )


def update_readme(video_id: str, title: str) -> bool:
    """
    Replace the YouTube block in the README.

    Returns True if the file changed, False if the new block is already
    present (or the README is missing the markers). Errors are logged but
    do not raise — the caller decides what to do.
    """
    if not os.path.isfile(README_PATH):
        log.error("README not found at %s", README_PATH)
        return False

    with open(README_PATH, "r", encoding="utf-8") as fh:
        original = fh.read()

    if START_MARKER not in original or END_MARKER not in original:
        log.error(
            "Markers %s / %s not found in %s. "
            "Add them to your README and re-run this workflow.",
            START_MARKER,
            END_MARKER,
            README_PATH,
        )
        return False

    new_block = build_block(video_id, title)
    existing = _MARKER_RE.search(original)
    if existing and existing.group(0) == new_block:
        log.info("README already up to date; no change needed.")
        return False

    updated = _MARKER_RE.sub(lambda _m: new_block, original, count=1)

    with open(README_PATH, "w", encoding="utf-8") as fh:
        fh.write(updated)

    log.info("Updated %s with the latest video.", README_PATH)
    return True


# --------------------------------------------------------------------------- #
# Entry point                                                                  #
# --------------------------------------------------------------------------- #


def main() -> int:
    api_key = os.environ.get("YOUTUBE_API_KEY", "").strip()
    if not api_key:
        log.error(
            "YOUTUBE_API_KEY environment variable is not set. "
            "Add it to repository Settings → Secrets and variables → Actions."
        )
        return 2

    session = build_session()
    try:
        video_id, title = fetch_latest_video(session, api_key)
    except YouTubeAPIError as exc:
        log.error("Failed to fetch latest video: %s", exc)
        return 1

    if not update_readme(video_id, title):
        # Markers missing or file unchanged. Both are non-fatal: the
        # auto-commit step will simply produce no commit.
        return 0

    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:  # pragma: no cover — last-resort safety net
        log.exception("Unhandled exception in update_youtube.py")
        sys.exit(1)
