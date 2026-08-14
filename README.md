# Project Rev / Live2D on Web

Public storefront and Blogfa-compatible web runtime for Project Rev, with an integrated Live2D presentation layer.

This repository is a maintained fork of [`Konata09/Live2dOnWeb`](https://github.com/Konata09/Live2dOnWeb). The fork keeps the original Live2D SDK/runtime foundation while adding the Project Rev storefront, resilient Blogfa integration, route/SEO surface, automated validation and maintenance documentation.

## What this fork adds

- a complete static Project Rev storefront and editorial surface;
- an isolated Blogfa bootstrap/supervisor with native-page fallback;
- Live2D route integration across the storefront without making the mascot a hard dependency;
- crawlable product/article routes plus sitemap, robots and web-manifest metadata;
- static-link, production-build, JavaScript-syntax and runtime-JSON validation in GitHub Actions;
- dependency update monitoring and documented security/rollback boundaries.

## Repository layout

- `index.html`, `shop.html`, `journal.html`, `about.html`, `faq.html` — primary static routes.
- `products/` — storefront product pages.
- `posts/` — editorial and guide pages.
- `assets/` — storefront styling, runtime scripts and Blogfa integration layers.
- `model/` — Live2D model assets.
- `src/SDKv2` and `src/SDKv4` — Live2D runtime source.
- `dist/` — generated browser bundle and compressed variants.
- `blogfa-*.html` — Blogfa integration templates/snippets.
- `docs/` — architecture, deployment, Blogfa and Live2D maintenance guidance.

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

## Validation

Pull requests are checked by two complementary workflows:

- **Static integrity** validates local `href`/`src` targets and sitemap routes while understanding Blogfa template placeholders.
- **CI** installs the locked dependency tree, audits production dependencies, builds the production Live2D bundle, checks JavaScript syntax and parses runtime JSON/config files.

The legacy build toolchain currently requires an OpenSSL compatibility flag during the production build. It is intentionally scoped to that CI step until the Webpack toolchain is upgraded.

## Deployment model

The repository keeps the canonical static site and Live2D assets together. Blogfa integration is isolated through the dedicated bootstrap/supervisor files so the native Blogfa surface can remain available if a remote storefront layer fails.

SEO-facing files such as `robots.txt`, `sitemap.xml` and `site.webmanifest` are maintained in the repository alongside the public routes.

## Maintenance docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — runtime layers and change boundaries.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — publish, validation and rollback flow.
- [`docs/BLOGFA_RUNTIME.md`](docs/BLOGFA_RUNTIME.md) — Blogfa placeholders, boot order and failure isolation.
- [`docs/LIVE2D_MAINTENANCE.md`](docs/LIVE2D_MAINTENANCE.md) — SDK/model/bundle maintenance rules.
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) — layered diagnosis for storefront, Live2D, Blogfa and SEO failures.
- [`SECURITY.md`](SECURITY.md) — security reporting and client-side secret guidance.

## Change discipline

Runtime, storefront and Blogfa integration changes should be kept reviewable and scoped. Avoid mixing generated Live2D bundle updates with unrelated content or layout changes when possible.
