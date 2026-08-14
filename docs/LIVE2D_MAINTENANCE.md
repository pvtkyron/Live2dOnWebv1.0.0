# Live2D Maintenance Guide

## Repository layout

The repository contains multiple generations of Live2D runtime code and model assets:

- `src/SDKv2/` — legacy SDKv2 runtime path;
- `src/SDKv4/` — SDKv4 runtime/framework path;
- `model/` — model definitions, textures, motions and sounds;
- `dist/live2d_bundle.js` — browser bundle consumed by public pages;
- `dist/live2d_bundle.js.gz` and `.br` — compressed bundle variants;
- `waifu-tips.js` / `waifu-tips.json` — mascot behavior/content layer;
- `assets/waifu.css` — mascot presentation;
- `assets/waifu-route.js` — route-level mascot bootstrap glue.

## Before changing a model

Identify the model generation first. SDKv2 and SDKv4 model formats are not interchangeable. Keep each model's JSON definition, binary model file, textures, motions, physics and sounds together.

When replacing or optimizing a texture:

- keep dimensions supported by the model definition;
- preserve transparency;
- verify every referenced texture path;
- test the original format before removing an alternate format;
- avoid lossy conversion when it creates visible seams around transparent edges.

## Source versus generated output

Treat `src/` as authored runtime source and `dist/` as generated browser output. A source change that affects production should be accompanied by a rebuilt bundle, but unrelated content changes should not regenerate the bundle.

This separation keeps diffs reviewable and avoids accidental bundle churn.

## Production validation

After a Live2D-affecting change:

1. run the production build;
2. load the canonical homepage and at least one nested route;
3. verify the mascot canvas initializes without console errors;
4. switch or trigger at least one motion/expression where supported;
5. verify close/reopen controls;
6. verify the site still works if the mascot fails to initialize;
7. check a narrow mobile viewport for overflow and touch interference.

## Performance rules

Model assets can dominate page weight. Prefer optimizations that reduce transfer/decode cost without changing model identity:

- retain appropriately compressed image alternatives where the runtime supports them;
- do not preload every model, motion or sound globally;
- avoid repeatedly constructing the runtime on route-level UI changes;
- release timers/listeners/observers when an optional integration is torn down;
- keep decorative pointer/motion effects disabled for reduced-motion users.

## Compatibility rules

When modernizing code, do not silently remove SDKv2 support merely because SDKv4 also exists. First confirm no public model or route still depends on the older runtime.

Likewise, do not upgrade the bundled Cubism framework independently of its core/runtime compatibility assumptions without testing representative models.

## Failure boundary

The mascot is an enhancement. Its failure must never prevent storefront navigation, product content, journal content or Blogfa fallback from working.

If a Live2D change causes a blank page, global exception loop or permanent overlay, treat that as a release-blocking regression even if the mascot itself works.

## Licensing

Preserve upstream license, changelog and redistributable notices under the SDK trees. New model assets should only be added when their redistribution rights are known and compatible with the repository's intended public use.
