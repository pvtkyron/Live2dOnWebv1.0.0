# Contributing

Keep changes small, testable and easy to review.

## Setup

```bash
npm install
npm start
```

For a production bundle:

```bash
npm run build:prod
```

## Pull requests

- Create a focused branch from `master`.
- Keep unrelated visual, runtime, content and generated-bundle changes separate.
- Describe what changed, why it changed and how it was checked.
- Preserve the native Blogfa fallback behavior when editing Blogfa integration code.
- When changing a public route, verify navigation and related sitemap/canonical metadata as appropriate.
- When changing Live2D runtime source, note whether `dist/` was regenerated.
- Avoid committing local caches, editor state or temporary build output.

## Before merging

At minimum, check the affected static pages in a browser. For JavaScript changes, verify that the edited files parse successfully and exercise the affected route or integration path.

Changes that touch the Blogfa bootstrap/supervisor should also confirm that failure of the remote storefront layer does not hide or break the native Blogfa surface.
