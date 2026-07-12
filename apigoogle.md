# 💰 YouTube Data API v3 — Billing & Cost Deep Dive

> Short answer: **No, it will not cost you money.** This page explains exactly why, in detail, so you can verify it yourself.

---

## 1. The two things people confuse

Google Cloud has **two separate things** that sound similar but work very differently:

| Concept | What it is | Required? |
|---|---|---|
| **API key** | A simple string that identifies your project when calling the API. | ✅ Yes — required for this workflow. |
| **Billing account** | A credit/debit card linked to your Google Cloud project, used to pay for usage that exceeds free quotas. | ❌ **No** — must be turned on manually. |

A common worry: *"If I create an API key, will Google start charging me?"* — **No.** An API key by itself cannot charge anything. Charging only happens if **you** go to **Google Cloud Console → Billing → Link a billing account**, and the project actually exceeds the free quota.

If you have never touched Billing in Google Cloud Console, **you are not being charged and you cannot be charged** for API usage.

---

## 2. How the YouTube Data API v3 quota works

Every Google Cloud project gets a free daily quota of **10,000 "units"** for the YouTube Data API v3. Each API operation costs a different number of units:

| Operation | Cost (units per call) |
|---|---|
| `playlistItems.list` (used by this workflow) | **1** |
| `videos.list` | 1 |
| `channels.list` | 1 |
| `search.list` | 100 |
| `videos.insert` (upload) | 1,600 |
| `captions.*` operations | 400–450 |

> 📌 Source: [YouTube Data API v3 — Quota calculator](https://developers.google.com/youtube/v3/getting-started#quota)

So a single `playlistItems.list` call — which is the **only** call this workflow makes — costs **1 unit**.

---

## 3. How much this workflow actually uses

The workflow is configured in `.github/workflows/youtube.yml`:

```yaml
on:
  schedule:
    - cron: "17 */6 * * *"
```

That cron expression means: **at minute 17 of every 6th hour** — i.e. **4 times per day**.

| Frequency | Calls/day | Units/day | Units/month (×30) |
|---|---|---|---|
| This workflow | 4 | 4 | 120 |
| Free quota | — | **10,000** | **300,000** |
| **Usage vs. free quota** | — | **0.04%** | **0.04%** |

You could run this same workflow **~2,500 times per day** and still not hit the free cap. And the workflow already has built-in **idempotency** (it skips the commit if nothing changed), so you can hit "Run workflow" manually as often as you want — each run still only costs 1 unit.

---

## 4. What happens if you somehow exceed the free quota?

The YouTube API returns an error like:

```json
{
  "error": {
    "code": 403,
    "message": "The request cannot be completed because you have exceeded your quota.",
    "errors": [{ "reason": "quotaExceeded" }]
  }
}
```

The script catches this and logs:

```
[ERROR] YouTube API error 403: The request cannot be completed because you have exceeded your quota.
```

The workflow run **fails** (red ❌ in the Actions tab), the README is **not** updated, and your credit card is **not** charged — because **no billing account is linked**. A `quotaExceeded` error is a hard wall, not a paywall.

> Charging only kicks in if **all three** of these are true:
> 1. You have manually linked a billing account to the project in Google Cloud Console.
> 2. The project has used its free 10,000 units for the day.
> 3. The project is on a paid tier (the default is the free tier).
>
> **None of these apply to this workflow.**

---

## 5. Could a malicious change ever cost me money?

Theoretically, yes — **if** someone:

1. Got write access to your GitHub repository, **and**
2. Modified `.github/scripts/update_youtube.py` to call expensive endpoints (e.g. `search.list` 10,000×/day), **and**
3. You had previously enabled billing on the GCP project,

…then yes, that could cost money. But:

- For a personal profile repo, only **you** have write access.
- The Actions logs show every API call the script makes, so any abuse is visible.
- You should never enable billing on the same project that holds an untrusted key.

**Recommendation:** If you ever decide to enable billing for some unrelated reason, create a **separate Google Cloud project** for that work and don't reuse the same project for this workflow's API key.

---

## 6. Verify it yourself in 60 seconds

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Select the project that owns your `YOUTUBE_API_KEY`.
3. In the left sidebar, click **Billing**.
4. If it says **"This project has no billing account"** — confirmed, you cannot be charged.
5. (Optional) Go to **APIs & Services → YouTube Data API v3 → Quotas** to see the current daily usage graph. It should show **0–4 requests/day** from this workflow.

You can re-check this any time. If "Billing" ever shows a linked account that you didn't add, immediately remove it and rotate your API key.

---

## 7. Summary

- ✅ **Free tier** = 10,000 units/day, more than enough for 4 calls/day.
- ✅ **No billing** is enabled by default — you must opt in manually.
- ✅ **This workflow uses 0.04% of the free daily quota.**
- ✅ **Over-quota requests fail loudly** with a `quotaExceeded` error — they don't silently charge you.
- ❌ **Charges can only happen if you explicitly link a billing account** in Google Cloud Console, which the workflow does not do.
- ❌ **No GitHub Actions feature can turn on GCP billing for you.** That lives in a different account (your Google account) that the workflow has no access to.

**Bottom line: this workflow is safe to run forever without any cost.**
