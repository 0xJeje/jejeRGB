# JEJE.RBG — Multimedia Design Portfolio

Brutalist / glitch portfolio for **Nica Dragoș (JEJE.RBG)** — branding, web development, video & social, graphic design. Based in **Valea Jiului, Hunedoara, România**.

Built with [Astro](https://astro.build) for static output, near-zero client JS, and best-in-class SEO/performance. Deploys to **GitHub Pages** on the custom apex domain **jeje.ro**.

## Tech stack

- **Astro 5** — static site generation, scripts bundled per-component.
- **Vanilla TS/JS** for interactions (canvas geometry, custom cursor, sliders, overlay, text scramble) — no UI framework / hydration.
- **@astrojs/sitemap** — auto-generated `sitemap-index.xml`.
- Self-hosted fonts (Space Grotesk + JetBrains Mono).

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to ./dist
npm run preview    # preview the production build
```

## Features

- Three independent controls: **RO/EN language**, **light/dark theme**, **low-power mode (⚡)** for slower devices.
- Theme is applied before first paint (no flash) and persisted in `localStorage`.
- Full SEO/GEO/AEO scaffolding: meta + Open Graph + Twitter, canonical, geo tags, JSON-LD (`ProfessionalService`, `Person`, `WebSite`, `FAQPage`), sitemap, robots.

## Deployment (GitHub Pages + custom domain)

### 1. Push to GitHub

Create a repository and push this project to the `main` branch.

```bash
git add .
git commit -m "Initial Astro portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Enable Pages with GitHub Actions

Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The included workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys on every push to `main`.

### 3. Connect the custom domain `jeje.ro`

`public/CNAME` already contains `jeje.ro`, and `astro.config.mjs` sets `site: 'https://jeje.ro'` (no `base`, because it's an apex domain).

**At your DNS provider, add these records for the apex domain (`jeje.ro`):**

| Type | Host / Name | Value             |
| ---- | ----------- | ----------------- |
| A    | `@`         | `185.199.108.153` |
| A    | `@`         | `185.199.109.153` |
| A    | `@`         | `185.199.110.153` |
| A    | `@`         | `185.199.111.153` |

Optional IPv6 (`AAAA`, host `@`): `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

**Optional `www` subdomain** → add a `CNAME` record: Host `www` → Value `<your-username>.github.io`.

### 4. Finalize in GitHub

Repository → **Settings → Pages → Custom domain** → enter `jeje.ro` → **Save**. Once DNS propagates, tick **Enforce HTTPS**.

> DNS propagation can take from a few minutes up to 24 hours.

## Project structure

```
public/            CNAME, robots.txt, favicon, og-image, noise.svg, fonts/
src/
  layouts/Base.astro       # <head>: SEO meta, JSON-LD, no-flash theme script
  pages/index.astro        # page composition
  components/               # Nav, Hero, Proof, Services, Branding, ... , Contact
  data/projects.js         # project/overlay data
  scripts/                 # geometry, animations, cursor, sliders, overlay, theme, ui
  styles/global.css        # design system + theme tokens
```

## Editing content

- Project case studies / overlay content: [`src/data/projects.js`](src/data/projects.js).
- Contact details are base64-obfuscated in [`src/components/Contact.astro`](src/components/Contact.astro) to deter scrapers.
