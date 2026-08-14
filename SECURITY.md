# Security Policy

## Supported surface

Security reports should focus on the Project Rev storefront/runtime maintained in this repository: the public HTML routes, `assets/` runtime scripts, Blogfa integration layers, and the packaged Live2D browser bundle.

Third-party Live2D SDK/model files under `src/SDKv2`, `src/SDKv4`, and `model/` may have their own upstream ownership and licensing. Reports that only affect an upstream dependency should be reported upstream as well.

## Reporting a vulnerability

Please do not publish exploit details, private tokens, credentials, or sensitive user data in a public issue or pull request.

For a suspected vulnerability, contact the Project Rev maintainer privately first and include:

- affected file or route;
- reproduction steps;
- expected versus actual behavior;
- browser/runtime version;
- impact assessment;
- a minimal proof of concept when safe to share.

The public contact lane linked by the site is acceptable for initial contact. Sensitive material should only be shared after a private channel has been established.

## Scope notes

The repository is static-first and must remain usable when optional remote integrations fail. Security fixes should preserve that failure-isolation model and avoid introducing new secret-bearing client-side configuration.

Never commit API tokens, private keys, session cookies, payment credentials, or production-only secrets to this repository.
