<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/brand/tenwise-wordmark-dark.svg">
    <img src="docs/brand/tenwise-wordmark-light.svg" alt="Tenwise" width="480">
  </picture>
</p>

# Tenwise Website

The website for **Tenwise** at `tenwise.app`, deployed to Cloudflare. A product of CodeStrata, Inc.

---

## Overview

Tenwise is a calm reading workspace for people who read a lot, and a research and engagement layer for enterprise teams: follow what matters, save with notes and citations, and turn reading into briefings.

The site is static files in `public/`: the home page, the user guide at `/docs/` and a 404 page. The guide documents the Tenwise app and marks what the free, open-source [Tenwise Engine](https://github.com/Tenwise/tenwise-engine) doesn't have.

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

- **HTML is valid**: `npx html-validate@11.17.0 "public/**/*.html"`, with the rules in `.htmlvalidate.json`. Style rules are off.
- **Internal links resolve**: `node scripts/check-links.mjs` checks every `href`, `src` and CSS `url()` in `public/`, and every `#anchor`.
- **A preview**: the PR's version of the site, uploaded but not live, at its own `workers.dev` address, linked in a comment on the PR and updated with each push. PRs from forks get the checks only, and until the repository has its Cloudflare secrets every PR does (the preview job skips with a warning).

The deploy runs the same checks first, and fails, rather than skipping, if the Cloudflare secrets are missing.

## Secrets

In **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN`: a token with **Workers Scripts: Edit** on the account, as a secret of the **production** environment (the deploy). For PR previews, add it to the **preview** environment too.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account id, as a repository secret.

The site lives in `public/`, and only that folder is published. To deploy by hand: `npx wrangler@4.151.3 deploy` (after `npx wrangler login`).
