# GitHub Pages Deployment

This repository is configured to publish the static documentation site from the `site/` directory with GitHub Actions.

## Files

- `.github/workflows/pages.yml`: GitHub Pages workflow.
- `site/index.html`: documentation home page.
- `site/setup.html`: SDK setup and language-specific install notes.
- `site/getting-started.html`: end-to-end quickstart.
- `site/api.html`: API reference and client examples.
- `site/examples.html`: usage examples.
- `site/conformance.html`: GB/Z 185 conformance page.
- `site/assets/docs.js`: language toggle, SDK example switcher, dark mode, and code highlighting.
- `site/assets/styles.css`: shared styles.

## Deployment

On every push to `main`, GitHub Actions uploads the `site/` directory and deploys it to GitHub Pages.

Canonical URL for this repository:

```text
https://blogs.idevlab.dev/gbz185-sdk/
```

Default GitHub Pages URL:

```text
https://ichendev.github.io/gbz185-sdk/
```

The default GitHub Pages URL redirects to the account-level custom domain above.

Manual redeploy:

```bash
gh workflow run "Deploy GitHub Pages"
```

Check deployment status:

```bash
gh run list --workflow "Deploy GitHub Pages"
gh run watch
```

## Local Preview

```bash
python3 -m http.server 4173 --directory site
```

Open:

```text
http://localhost:4173/
```
