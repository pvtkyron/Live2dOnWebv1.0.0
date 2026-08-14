# Project Rev / Live2D on Web

Public storefront and Blogfa-compatible web runtime for Project Rev, with an integrated Live2D presentation layer.

## Repository layout

- `index.html`, `shop.html`, `journal.html`, `about.html`, `faq.html` — primary static routes.
- `products/` — storefront product pages.
- `posts/` — editorial and guide pages.
- `assets/` — storefront styling, runtime scripts and Blogfa integration layers.
- `model/` — Live2D model assets.
- `src/SDKv2` and `src/SDKv4` — Live2D runtime source.
- `dist/` — generated browser bundle and compressed variants.
- `blogfa-*.html` — Blogfa integration templates/snippets.

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

## Deployment model

The repository keeps the canonical static site and Live2D assets together. Blogfa integration is isolated through the dedicated bootstrap/supervisor files so the native Blogfa surface can remain available if a remote storefront layer fails.

SEO-facing files such as `robots.txt`, `sitemap.xml` and `site.webmanifest` are maintained in the repository alongside the public routes.

## Change discipline

Runtime, storefront and Blogfa integration changes should be kept reviewable and scoped. Avoid mixing generated Live2D bundle updates with unrelated content or layout changes when possible.
