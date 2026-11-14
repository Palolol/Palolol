# GitHub Pages Deployment & Custom Domain Troubleshooting Guide

This guide documents the root cause, diagnosis, and resolution for the issue where the custom domain (`www.palolol.top`) loaded a blank white screen instead of the Vue 3 + Vite portfolio application.

---

## 1. Problem Overview

- **Symptom:** Navigating to `https://www.palolol.top` resulted in a completely blank white screen.
- **Console Error:**
  ```text
  Uncaught TypeError: Failed to resolve module specifier "vue". Relative references must start with either "/", "./", or "../".
  ```
- **Network Request:** The browser loaded `GET /src/main.js` as an ES module directly from the web server.

---

## 2. Root Cause Analysis

### Issue A: GitHub Pages Source Set to "Deploy from a branch"
GitHub Pages supports two deployment methods:
1. **Deploy from a branch (Legacy/Jekyll default):** Directly serves files from a chosen branch (`main`) and folder (`/` or `/docs`).
2. **GitHub Actions (Modern):** Deploys packaged build artifacts uploaded via GitHub Actions workflows (`upload-pages-artifact` + `deploy-pages`).

Because repository settings were set to **Deploy from a branch (`main` / root)**:
- GitHub Pages was serving the **raw repository files** instead of the compiled `dist/` directory.
- The browser loaded the uncompiled `index.html` referencing `<script type="module" src="/src/main.js"></script>`.
- Inside `src/main.js`, the code executes:
  ```javascript
  import { createApp } from 'vue'
  import App from './App.vue'
  ```
- Browsers cannot natively resolve bare npm package specifiers (`"vue"`) or Single File Components (`.vue`) without an import map or bundling step, causing JavaScript execution to halt immediately.
- Furthermore, scheduled bot workflows (such as YouTube playlist and GitHub stats updaters) push periodic commits to `main`. Every push triggered GitHub's internal branch runner (`dynamic/pages/pages-build-deployment`), repeatedly overwriting any compiled deployments with raw source code.

### Issue B: Missing `CNAME` in the `public/` Directory
In Vite, only static files placed in the `public/` directory are copied to the root of `dist/` during `npm run build`.
- The `CNAME` file existed only in the repository root (`/CNAME`).
- When GitHub Actions built the project into `dist/`, `dist/CNAME` was missing. Without a `CNAME` in the deployment artifact, GitHub Pages cannot maintain the custom domain mapping.

### Issue C: Duplicate Deployment Workflows
There were two conflicting workflows deploying to Pages:
- `.github/workflows/deploy.yml`
- `.github/workflows/static.yml`

Both workflows used the same concurrency group (`group: 'pages'`), leading to race conditions and aborted deployment runs.

---

## 3. Implemented Fixes

### 1. Created `public/CNAME`
Added `CNAME` to `public/` so Vite copies it automatically into `dist/` during every build:
```text
www.palolol.top
```

### 2. Consolidated Deployment Workflows
- Removed the redundant `.github/workflows/static.yml`.
- Standardized `.github/workflows/deploy.yml` with support for manual trigger (`workflow_dispatch`):
  ```yaml
  name: Deploy Vue App to GitHub Pages

  on:
    push:
      branches: [ main ]
    workflow_dispatch:

  permissions:
    contents: read
    pages: write
    id-token: write

  concurrency:
    group: 'pages'
    cancel-in-progress: true

  jobs:
    deploy:
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      runs-on: ubuntu-latest
      steps:
        - name: Checkout
          uses: actions/checkout@v4

        - name: Setup Node
          uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: 'npm'

        - name: Install dependencies
          run: npm ci

        - name: Build
          run: npm run build

        - name: Setup Pages
          uses: actions/upload-pages-artifact@v3
          with:
            path: './dist'

        - name: Deploy to GitHub Pages
          id: deployment
          uses: actions/deploy-pages@v4
  ```

### 3. Secured Sensitive Files
Added `.claude/` to `.gitignore` to prevent local API keys and environment settings from being tracked by git.

### 4. Polished Navbar Navigation
- Added a styled **📺 YouTube** external link button in `AppNavbar.vue` (both desktop and mobile drawers) pointing to the official playlist.
- Cleaned up incomplete anchor tags and restored `navLinks.js` to internal section IDs (`home`, `portfolio`, `projects`, `skills`, `experience`, `contact`).

---

## 4. Final Required GitHub Setting

To prevent GitHub's automatic branch deployer from overwriting the compiled Vite application:

1. Open repository settings: [github.com/Palolol/Palolol/settings/pages](https://github.com/Palolol/Palolol/settings/pages).
2. Under **Build and deployment** > **Source**, switch the selection from **Deploy from a branch** to **GitHub Actions**:
   ```
   ┌──────────────────────────────────────────────┐
   │ Build and deployment                         │
   │ Source                                       │
   │ [ GitHub Actions ▼ ]                         │
   └──────────────────────────────────────────────┘
   ```
3. Navigate to the **[Actions](https://github.com/Palolol/Palolol/actions/workflows/deploy.yml)** tab.
4. Select **Deploy Vue App to GitHub Pages** and click **Run workflow**.

---

## 5. Verification Checklist

You can verify the deployment health using the following commands:

- **Check deployed script tags (should reference `/assets/index-*.js`, not `/src/main.js`):**
  ```powershell
  curl.exe -s https://www.palolol.top | Select-String "assets/index"
  ```
- **Check HTTP status code:**
  ```powershell
  curl.exe -I https://www.palolol.top
  ```
- **Verify DNS resolution:**
  ```powershell
  Resolve-DnsName www.palolol.top
  ```
