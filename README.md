<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/brand/tenwise-wordmark-dark.svg">
    <img src="docs/brand/tenwise-wordmark-light.svg" alt="Tenwise" width="480">
  </picture>
</p>

# Tenwise Website

Official marketing and product website for **Tenwise** (`tenwise.app`), deployed on GitHub Pages.

---

## Overview

Tenwise is a reading workspace for people who read a lot and want to keep what matters, and an engagement layer for publishers.

- **For Power Consumers (Free)**: Dense rows scanner, docked calm reader, automatic full-text extraction, in-context notes (`n`), automatic APA 7 citations, 100% on-device AI (Chrome Gemini Nano & local Ollama), and direct export to NotebookLM and Studio print newsletters.
- **For Publishers (Enterprise)**: The engagement layer that transforms passive skim-reading into retained subscribers with branded reader hubs, curated dossiers, and editorial AI grounded in house ethics.

---

## Local Development & Testing

This is a zero-build static site. You can preview it using any local web server:

```bash
# Using Python
python3 -m http.server 8000 --directory public

# Or using npx serve
npx serve public
```

Then open `http://localhost:8000` in your browser.

---

## Deployment

Every push to `main` publishes the site to Cloudflare as the `tenwise-website` Worker (`wrangler.jsonc`, `.github/workflows/deploy.yml`). **tenwise.app** belongs to the Tenwise platform's Worker, which shows this website to anyone who isn't signed in, serves the sign-in at `/login`, and shows signed-in people their library. `www.tenwise.app` redirects to `tenwise.app`.

Links into the app: **Sign In** is `/login`; signing out happens in the app (`/logout`) and lands back here.

## Checks and previews

Every pull request (`.github/workflows/ci.yml`):

- **HTML is valid**: `npx html-validate@11.17.0 "public/**/*.html"`, with the rules in `.htmlvalidate.json`. Style rules are off; `<div>` inside `<button>` is a warning for now.
- **Internal links resolve**: `node scripts/check-links.mjs` checks every `href`, `src` and CSS `url()` in `public/`, and every `#anchor`.
- **A preview**: the PR's version of the site, uploaded but not live, at its own `workers.dev` address, linked in a comment on the PR and updated with each push. PRs from forks get the checks only, and until the repository has its Cloudflare secrets every PR does (the preview job skips with a warning).

The deploy runs the same checks first, and fails, rather than skipping, if the Cloudflare secrets are missing.

## Secrets

Add two **repository** secrets (Settings → Secrets and variables → Actions), used by both the deploy and the previews:

- `CLOUDFLARE_API_TOKEN`: a token with **Workers Scripts: Edit** on the account.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account id.

The site lives in `public/`, and only that folder is published. To deploy by hand: `npx wrangler@4.151.3 deploy` (after `npx wrangler login`).
