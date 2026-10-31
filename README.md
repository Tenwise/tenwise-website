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

Tenwise is a reading and research workspace: follow your sources, keep what matters with notes and highlights, and turn it into a recurring brief where every claim is linked to the passage that supports it.

The site is static files in `public/`: the home page, `/pricing/`, `/terms/`, `/privacy/`, `/refunds/`, the user guide at `/docs/` (with `/docs/services/`, the services that see your data) and a 404 page. Every page loads only `assets/css/styles.css` and `assets/js/main.js`, and the fonts in `assets/fonts/` (IBM Plex Sans and Newsreader, OFL, the same as the app): nothing from another host.

### Shared parts and prices: `site/`

The header, the footer and the plans and prices are kept once, in `site/header.html`, `site/footer.html` and `site/plans.json`. Pages mark where they go (`<!-- site:header -->…<!-- /site:header -->`, `site:footer`, `site:plans ref="…"`), and a script writes them in:

```bash
node scripts/site.mjs           # after changing anything in site/
node scripts/site.mjs --check   # exit 1 if a page is out of step
```

To change a price or a plan, edit `site/plans.json` and run the script. While `"published"` is `false`, every price shows as "Price to be announced". Stripe holds the amount actually charged (the platform's `STRIPE_PRICE_*`), so change both together. The guide documents the Tenwise app and marks what the free, open-source [Tenwise Engine](https://github.com/Tenwise/tenwise-engine) doesn't have.

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

## Branches and releases

The website works like the platform: **`main` is production (tenwise.app), `sandbox` is for review (sandbox.tenwise.app)**.

- Every change branches from `sandbox`, and its pull request targets `sandbox`.
- Once merged, deploy the sandbox site and look at it on sandbox.tenwise.app, signed out.
- A release is one pull request, `sandbox` → `main`, released together with the platform. Nothing goes into `main` from any other branch, hotfixes included: a hotfix merges into `sandbox` first, is checked there, then is promoted.
- Before a release merges, the platform's release check must pass for it: `node infrastructure/cloudflare/release-check.mjs <pr> --repo website` (in Tenwise/tenwise-platform). It refuses a pull request that doesn't come from `sandbox`, whose commit the sandbox site doesn't run, or while the independent audit isn't done. So every deploy records its commit (`--message`, below).

## Deployment

| Branch | Worker | Shown at |
|---|---|---|
| `main` | `tenwise-website` | tenwise.app |
| `sandbox` | `tenwise-website-sandbox` (`env.sandbox` in `wrangler.jsonc`) | sandbox.tenwise.app, through the platform's sandbox Worker; not indexed |

While GitHub Actions minutes are used up, deploy from a clean checkout of the branch, after the checks below:

```bash
npx wrangler@4.151.3 deploy --env sandbox --message "commit $(git rev-parse HEAD)"   # from sandbox
npx wrangler@4.151.3 deploy --message "commit $(git rev-parse HEAD)"                 # from main, on release day only
```

Otherwise every push to `main` publishes the site to Cloudflare as the `tenwise-website` Worker, and every push to `sandbox` as `tenwise-website-sandbox` (`wrangler.jsonc`, `.github/workflows/deploy.yml`). **tenwise.app** belongs to the Tenwise platform's Worker, which shows this website to anyone who isn't signed in, serves the sign-in at `/login`, and shows signed-in people their library. `www.tenwise.app` redirects to `tenwise.app`.

Links into the app are root-relative, so they reach the app on whichever host shows the site (sandbox.tenwise.app or tenwise.app) with no setting: **Sign In** and sign-up are `/login` (sign-up links add `?ref=site-…` so the platform counts where sign-ups came from, EDN-1); **Manage billing** is `/billing`; email preferences are `/email/preferences`; signing out happens in the app (`/logout`) and lands back here.

## Checks and previews

Every pull request (`.github/workflows/ci.yml`):

- **HTML is valid**: `npx html-validate@11.17.0 "public/**/*.html"`, with the rules in `.htmlvalidate.json`. Style rules are off.
- **Shared parts are in step**: `node scripts/site.mjs --check`.
- **Internal links resolve**: `node scripts/check-links.mjs` checks every `href`, `src` and CSS `url()` in `public/`, and every `#anchor`.
- **A preview**: the PR's version of the site, uploaded but not live, at its own `workers.dev` address, linked in a comment on the PR and updated with each push. PRs from forks get the checks only, and until the repository has its Cloudflare secrets every PR does (the preview job skips with a warning).

The deploy runs the same checks first, and fails, rather than skipping, if the Cloudflare secrets are missing.

## Secrets

In **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN`: a token with **Workers Scripts: Edit** on the account, as a secret of the **production** environment (the deploy) and of the **sandbox** environment (the sandbox deploy). For PR previews, add it to the **preview** environment too.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account id, as a repository secret.

The site lives in `public/`, and only that folder is published. To deploy by hand: `npx wrangler@4.151.3 deploy` (after `npx wrangler login`).
