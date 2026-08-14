# Project Rev / Live2D on Web

[![CI](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/ci.yml/badge.svg)](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/ci.yml)
[![Static integrity](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/static-integrity.yml/badge.svg)](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/static-integrity.yml)

Project Rev is a static-first storefront and editorial site with an optional Live2D presentation layer and a resilient Blogfa compatibility path.

This repository is a maintained fork of [`Konata09/Live2dOnWeb`](https://github.com/Konata09/Live2dOnWeb). It keeps the upstream Live2D SDK/runtime foundation while adding the Project Rev storefront, Blogfa isolation layer, public routes/SEO surface, automated validation and maintenance documentation.

The repository is designed around one rule: durable content and navigation should keep working even when optional enhancement layers fail.

## What lives here

- **Static storefront** — ordinary crawlable HTML routes for the homepage, catalog, products, journal, guides, FAQ and About pages.
- **Progressive UI** — shared responsive styling and lightweight JavaScript for navigation, filtering, language copy, reading progress and motion effects.
- **Live2D** — SDKv2/SDKv4 runtime source, model assets and the generated browser bundle.
- **Blogfa compatibility** — an isolated bootstrap/supervisor layer that can expose the GitHub-controlled storefront without making the native Blogfa page depend on it.
- **Discovery metadata** — canonical URLs, `robots.txt`, XML/HTML sitemaps and a web manifest.

## Repository layout

- `index.html`, `shop.html`, `journal.html`, `about.html`, `faq.html` — primary static routes.
- `products/` — storefront product pages.
- `posts/` — editorial and guide pages.
- `assets/` — storefront styling, UI runtime and Blogfa integration layers.
- `model/` — Live2D models, textures, motions and audio assets.
- `src/SDKv2/` and `src/SDKv4/` — Live2D runtime source.
- `dist/` — generated browser bundle and compressed variants.
- `blogfa-*.html` — Blogfa integration templates/snippets.
- `docs/` — architecture, deployment, runtime and troubleshooting guides.

## Project documentation

- [Architecture](docs/ARCHITECTURE.md) — runtime boundaries, route ownership and failure isolation.
- [Deployment & rollback](docs/DEPLOYMENT.md) — production checks, release boundaries and recovery.
- [Blogfa runtime contract](docs/BLOGFA_RUNTIME.md) — placeholders, boot order, health checks and fallback behavior.
- [Live2D maintenance](docs/LIVE2D_MAINTENANCE.md) — SDK/model/bundle compatibility and performance rules.
- [Troubleshooting](docs/TROUBLESHOOTING.md) — layered diagnosis for storefront, Live2D and Blogfa failures.
- [Security policy](SECURITY.md) — reporting guidance and client-side secret boundaries.
- [Contributing](CONTRIBUTING.md) — local setup and review discipline.

## Local development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
```

Create a development build:

```bash
npm run build
```

Create a production build:

```bash
npm run build:prod
```

Serve the static repository locally on port 5001:

```bash
npm run serve
```

## Quality gates

Pull requests are checked by two complementary workflows:

- **Static integrity** validates local `href`/`src` targets and sitemap routes while treating unresolved Blogfa `<-...->` placeholders as runtime tokens rather than filesystem paths.
- **CI** installs the locked dependency tree, audits production dependencies, builds the production Live2D bundle, verifies the generated artifact, checks JavaScript syntax and parses runtime JSON/config files.

The legacy Webpack toolchain still needs the OpenSSL legacy provider for the production-build step on current Node. That compatibility flag is intentionally scoped to that step until the build toolchain itself is upgraded.

## Runtime principles

1. **Static first.** Core content, navigation and product/editorial routes should remain useful without JavaScript.
2. **Enhance progressively.** Storefront UI and Live2D add behavior without becoming hard dependencies of the documents underneath.
3. **Fail soft.** A blocked browser API, missing mascot asset or unhealthy Blogfa enhancement must not blank otherwise healthy content.
4. **Keep boundaries reviewable.** Avoid mixing generated Live2D bundle churn with unrelated editorial, SEO or Blogfa changes.
5. **Treat browser-delivered data as public.** Never commit or embed private tokens, credentials, cookies or production secrets.

## Deployment model

The repository keeps the canonical static site and Live2D assets together. Blogfa integration is isolated through dedicated bootstrap/supervisor files so the native Blogfa surface remains available when the enhancement cannot safely initialize.

SEO-facing files such as `robots.txt`, `sitemap.xml` and `site.webmanifest` live alongside the public routes and should move with route changes.

## Change discipline

Keep pull requests narrow enough to review and roll back independently. In particular, separate storefront changes, Blogfa integration changes, Live2D source/model work, generated bundle updates, and repository tooling whenever practical.
