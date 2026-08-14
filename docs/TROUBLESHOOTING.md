# Troubleshooting

## Start by locating the failing layer

Project Rev has three major runtime boundaries:

1. static HTML/CSS/storefront JavaScript;
2. Live2D enhancement;
3. Blogfa bootstrap/supervisor integration.

Debug the earliest failing boundary instead of adding retries to every layer.

## Page loads but looks unstyled

Check the route depth and relative stylesheet path. Root pages use `./assets/...`; nested `products/` and `posts/` pages must resolve their assets from the correct relative location.

Also verify `assets/store.css` is reachable and the browser did not block it because of an incorrect MIME type or URL.

## Mobile menu does not open

Check that:

- the page contains `.topbar`;
- the navigation element exists inside it;
- the toggle has `data-menu-toggle`;
- `assets/store.js` loaded without a syntax error;
- no page-specific script replaced the navigation after initialization.

The toggle should expose `aria-expanded` and `aria-controls` when the shared UI runtime initializes.

## Product filters do nothing

The shop filter expects `.filterbar` buttons and `.product-card` entries containing an `.eyebrow` category label. If categories are renamed, keep button text and card category text compatible.

## Language preference is not remembered

The language-copy preference uses local storage when available. Browsers or privacy modes may block storage; the site should still work, but the selection will reset on reload.

## Reveal/counter effects are missing

Check `prefers-reduced-motion`. Reduced-motion users intentionally receive the final visible state without animated reveals/counters. Also confirm `IntersectionObserver` availability on older browsers.

## Live2D does not appear

Work outward from the bundle:

1. confirm `dist/live2d_bundle.js` loads;
2. check the browser console for model/texture 404s;
3. verify model JSON paths match repository casing exactly;
4. verify canvas elements exist on the route;
5. confirm `waifu-tips.js` and `assets/waifu-route.js` did not fail first;
6. verify the rest of the storefront remains usable even when Live2D is broken.

## Live2D appears but a model is broken

Compare the model definition with its files under `model/`:

- binary model file;
- textures;
- expressions;
- motions;
- physics/pose data;
- sounds when referenced.

Case-sensitive path mistakes can work locally on Windows and fail after deployment.

## Blogfa shows a blank/partial overlay

Check the integration in this order:

1. native Blogfa content rendered;
2. stable snippet loaded;
3. bootstrap/supervisor loaded;
4. remote storefront assets passed preflight;
5. enhancement mounted;
6. health verification passed;
7. optional Live2D initialized.

If an enhancement stage fails, native Blogfa should remain available. Use the safe/native bypass and repair the earliest failed stage.

## Static validator reports Blogfa URLs as missing files

Blogfa placeholders such as `<-BlogUrl->` and `<-PostLink->` are runtime tokens, not local files. Validators must skip unresolved `<-...->` values while continuing to validate real local `href` and `src` targets.

## Sitemap or canonical mismatch

For a renamed public route, update all three surfaces together:

- the page's canonical URL;
- `sitemap.xml`;
- crawlable links that point to the route.

Keep `robots.txt` pointing to the canonical sitemap and keep `404.html` as `noindex`.

## A change works locally but fails on GitHub

Look for:

- case-sensitive path differences;
- files that were ignored and never committed;
- generated bundle not rebuilt;
- absolute local filesystem paths;
- cached CDN content;
- Blogfa placeholders altered by formatting/refactoring.

## Before opening a regression PR

Record the failing URL, browser, viewport, console error, network failure and the smallest reproduction. Keep unrelated cleanup out of the same fix so rollback remains simple.
