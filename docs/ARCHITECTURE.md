# Project Rev Architecture

## System shape

Project Rev is intentionally static-first. The durable storefront is a set of ordinary HTML routes backed by shared CSS/JavaScript, while Blogfa support and Live2D are optional enhancement layers.

```text
public HTML routes
  ├─ assets/store.css
  ├─ assets/store.js
  ├─ assets/waifu-route.js
  ├─ dist/live2d_bundle.js
  └─ waifu-tips.js

Blogfa surface
  ├─ blogfa-final-template.html
  ├─ blogfa-custom-html-snippet.html
  ├─ assets/blogfa-bootstrap.js
  ├─ assets/blogfa-supervisor.js
  └─ assets/blogfa-live2d-addon.js
```

## Public route layer

The primary pages (`index.html`, `shop.html`, `journal.html`, `about.html`, `faq.html`) work as independent documents. Product and editorial routes live below `products/` and `posts/`.

This layer owns durable copy, canonical URLs, crawlable navigation, metadata and the fallback experience when optional JavaScript cannot run.

## Shared storefront runtime

`assets/store.css` defines the visual system and responsive behavior. `assets/store.js` adds progressive enhancements such as:

- mobile navigation state;
- current-page semantics;
- language-copy visibility;
- catalog filtering;
- reveal effects;
- reading progress;
- lightweight counters and pointer effects.

The runtime should fail soft: blocking storage, reduced-motion preferences or missing browser APIs must not make the static pages unusable.

## Live2D layer

`dist/live2d_bundle.js` is the browser bundle generated from the Live2D source tree. Model data lives under `model/`, while `waifu-tips.js`, `waifu-tips.json` and `assets/waifu-route.js` connect the mascot UI to the current page.

Generated bundles should be treated separately from source changes whenever practical so reviews can distinguish authored code from build output.

## Blogfa compatibility layer

Blogfa integration is deliberately isolated from the canonical static site. The bootstrap/supervisor files load the GitHub-controlled storefront only when prerequisites are healthy and leave the native Blogfa page available as a fallback.

The compatibility contract is:

1. never require the Blogfa shell for the canonical GitHub-hosted routes;
2. never blank the native Blogfa surface because an optional remote asset failed;
3. treat Blogfa placeholders such as `<-BlogUrl->` as runtime tokens rather than repository paths;
4. keep Live2D failure separate from storefront failure;
5. preserve a safe/native bypass path for recovery.

## SEO and discovery

`robots.txt`, `sitemap.xml`, `sitemap.html` and `site.webmanifest` describe the public surface. New durable public routes should be reflected in the sitemap and linked from at least one crawlable page.

## Change boundaries

Prefer narrowly scoped changes:

- storefront content/layout changes;
- Blogfa runtime changes;
- Live2D source/model changes;
- generated bundle changes;
- repository tooling/documentation.

Keeping these concerns separate makes regressions easier to isolate and rollback.
