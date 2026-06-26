# GitHub Pages Deployment

This repository is configured to publish the static documentation site from the `site/` directory with GitHub Actions.

## Files

- `.github/workflows/pages.yml`: GitHub Pages workflow.
- `site/index.html`: documentation home page.
- `site/api.html`: API overview.
- `site/conformance.html`: GB/Z 185 conformance page.
- `site/assets/styles.css`: shared styles.

## Deployment

On every push to `main`, GitHub Actions uploads the `site/` directory and deploys it to GitHub Pages.

Expected URL:

```text
https://ichendev.github.io/gbz185-sdk/
```

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
