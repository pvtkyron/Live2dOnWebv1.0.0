# Blogfa Runtime Contract

## Purpose

The Blogfa integration lets a native Blogfa page opt into the GitHub-controlled Project Rev storefront without making the native page depend on that enhancement for basic availability.

The key rule is simple: **an unhealthy enhancement must not destroy a healthy Blogfa page**.

## Main files

- `blogfa-final-template.html` — native Blogfa template surface.
- `blogfa-custom-html-snippet.html` — stable custom HTML/JavaScript entry point.
- `assets/blogfa-bootstrap.js` — storefront bootstrap logic.
- `assets/blogfa-supervisor.js` — health supervision and fallback ownership.
- `assets/blogfa-live2d-addon.js` — optional mascot layer.
- `assets/blogfa-runtime-manifest.json` — runtime policy/threshold configuration.
- `assets/blogfa-widget*.js` — isolated widget revisions retained for compatibility/history.

## Runtime placeholders

Blogfa tokens such as these are resolved by Blogfa at runtime and are **not local repository paths**:

```text
<-BlogUrl->
<-BlogTitle->
<-PostLink->
<-PostTitle->
```

Static validators and refactoring tools must ignore unresolved `<-...->` placeholders when checking filesystem targets.

## Boot order

The intended dependency order is:

```text
native Blogfa page
  ↓
stable custom snippet
  ↓
storefront bootstrap/supervisor
  ↓
health check
  ├─ healthy → expose Project Rev layer
  └─ unhealthy → leave native Blogfa visible
  ↓
optional Live2D addon
```

The Live2D mascot is never allowed to become a hard dependency of the storefront.

## Failure isolation

A production-safe Blogfa change should preserve all of these properties:

- network failure leaves native content visible;
- malformed remote content does not replace the page;
- Live2D failure degrades only the mascot layer;
- cached/last-known-good data may be used only when its validation still passes;
- safe/native bypass remains available;
- watchdog recovery never creates a reload loop.

## Change checklist

When editing Blogfa-facing files:

1. preserve Blogfa template tags and placeholders exactly;
2. avoid global CSS that can leak into the native page;
3. keep mount/commit behavior transactional where possible;
4. verify every external fetch has a failure path;
5. verify the cleanup path removes observers/timers/listeners owned by the enhancement;
6. test the native page with JavaScript blocked or the remote source unavailable;
7. test the storefront with Live2D intentionally unavailable.

## Debugging

Use the runtime health helpers exposed by the integration when present, including `REV_SYSTEM_HEALTH()` and `REV_LIVE2D_HEALTH()`.

When debugging a blank or partial page, determine which boundary failed before changing anything:

1. Blogfa rendered the native template;
2. bootstrap source loaded;
3. storefront assets passed preflight;
4. storefront mounted;
5. supervisor accepted health;
6. Live2D initialized.

Fix the earliest failing boundary rather than adding retries everywhere.

## Security boundary

Never embed GitHub tokens, private repository credentials, session cookies or secret API keys in the Blogfa template or client-side bootstrap. Everything delivered to the browser must be treated as public.
