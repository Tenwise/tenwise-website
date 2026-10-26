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
python3 -m http.server 8000

# Or using npx serve
npx serve .
```

Then open `http://localhost:8000` in your browser.

---

## Deployment

The website automatically deploys to **GitHub Pages** on every push to the `main` branch via GitHub Actions (`.github/workflows/deploy.yml`).

### Custom Domain Setup

When ready to point `tenwise.app` directly to this website:
1. Set the custom domain in repository settings or add a `CNAME` file containing `tenwise.app`.
2. Configure DNS in Cloudflare to route root/subdomains to GitHub Pages, with `/login` routing to the app worker.
