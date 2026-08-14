# Deployment Guide

## Deployment surfaces

Project Rev has two distinct public surfaces:

1. the canonical static repository pages;
2. the optional Blogfa integration that consumes GitHub-controlled assets.

Treat them separately during release work. A change can be safe for the static site but still break Blogfa placeholders or bootstrap behavior.

## Before publishing

Run the repository locally and inspect at least:

```bash
npm install
npm run build:prod
npm run serve
```

Then check:

- `/index.html`;
- `/shop.html` and every product filter;
- `/journal.html` and the article pages;
- `/about.html`, `/faq.html`, `/404.html`;
- all six product routes;
- Live2D loading and close/reopen behavior;
- mobile navigation around the 760 px breakpoint;
- reduced-motion behavior;
- canonical links and page metadata.

## Static-site release checklist

When a durable public route changes:

- keep relative asset paths valid from that route depth;
- update `sitemap.xml` when a route is added, removed or renamed;
- update `sitemap.html` when navigation/discovery changes;
- verify `robots.txt` still points at the canonical sitemap;
- keep `404.html` marked `noindex`;
- do not place secrets or environment-specific credentials in HTML/JavaScript.

## Live2D bundle changes

If source below `src/` changes and the public bundle is expected to change:

1. build production output;
2. verify `dist/live2d_bundle.js` exists and loads;
3. keep the authored-source change and generated bundle diff easy to identify;
4. confirm the referenced models and textures still exist;
5. test at least one SDKv2 and SDKv4 route/model if both paths remain supported.

Do not delete compressed bundle variants unless the serving path no longer uses them.

## Blogfa release checklist

Blogfa integration must fail closed rather than replace a healthy native page with an empty shell.

Before publishing Blogfa-facing changes:

- preserve runtime placeholders such as `<-BlogUrl->` exactly;
- test the safe/native bypass path;
- simulate failure of the GitHub/CDN fetch path;
- verify the original Blogfa page remains available;
- verify Live2D failure does not tear down an otherwise healthy storefront;
- avoid introducing a new external hostname without documenting why it is required.

## Rollback strategy

Prefer a Git revert of the smallest responsible change. Because the canonical site is static-first, rolling back the affected HTML/CSS/JS file should restore the previous behavior without a database migration.

For Blogfa regressions, restore the last-known-good bootstrap/supervisor files first. If the enhancement layer remains unhealthy, use the native/safe route until the integration is repaired.

## What not to mix

Avoid combining these in one release unless the dependency is unavoidable:

- editorial copy and generated bundles;
- Blogfa bootstrap logic and unrelated storefront styling;
- model asset replacement and SEO route changes;
- dependency/toolchain upgrades and visual redesigns.

Small release boundaries make the static and Blogfa surfaces much easier to verify and roll back.
