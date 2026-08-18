# elieschulman-site

Personal static site for **Elie Schulman** — essays, weekly Torah teachings, Maimonides library pages, free eBooks, and an in-browser EPUB reader. Live at [elieschulman.com](https://elieschulman.com).

## Stack

| Piece | Choice |
| --- | --- |
| Framework | [Astro 7](https://astro.build) (static) |
| Content | Markdown + content collections (`teachings`) |
| Styles | `public/site.css` |
| Reader | [epubjs](https://github.com/futurepress/epub.js/) on `/read/[book]/` |
| CI | GitHub Actions (`ci.yml`, `quality.yml`, `automerge.yml`) |

## Architecture

```
Authoring
  ├─ src/pages/**              file-based routes (essays, hubs)
  ├─ src/content/teachings/*   publishable works (ebooks / parsha)
  └─ scripts/ingest-teaching   folder → teaching + public/books/*

Build:  npm run build  →  dist/
Ops:    npm run doctor · npm run check
```

**Layouts**

- `Layout.astro` — site chrome, SEO, nav, footer  
- `MarkdownLayout.astro` — essay / section Markdown pages  
- `TeachingLayout.astro` — book hero, downloads, media, TOC  

**Teachings collection** drives:

- `/books/` index  
- `/books/[slug]/` detail  
- `/read/[book]/` for entries with `text_epub`  
- `/weekly-torah/` when `section: weekly-torah`  

## Commands

```bash
npm ci
npm run dev          # local preview
npm run build        # astro check + static build
npm run doctor       # collection ↔ assets ↔ routes sanity
npm run check        # validate dist HTML, assets, reader routes
npm run ingest -- ./incoming/my-slug --section ebook
```

`npm run check` expects a prior `npm run build` (or a `dist/` folder).

## Add a teaching / eBook

1. Prepare a folder with at least cover + EPUB/PDF (and optional body `.md` / `.html`):

   ```text
   incoming/my-slug/
     cover.jpg
     my-slug.epub
     my-slug.pdf
     notes.md          # optional body + title/description
   ```

2. Ingest:

   ```bash
   npm run ingest -- ./incoming/my-slug \
     --section ebook \
     --order 30
   ```

   Useful flags: `--section weekly-torah|ebook|knowing-project`, `--slug`, `--draft`, `--featured`, `--force`, `--dry-run`.

3. Review `src/content/teachings/<slug>.md` frontmatter (`title`, `description`, `section`, assets).

4. Verify:

   ```bash
   npm run doctor
   npm run build && npm run check
   ```

Indexes and `/read/<slug>/` are generated from the collection — **do not** hardcode new books into `books/index.astro` or `read/[book].astro`.

### Frontmatter (teachings)

| Field | Notes |
| --- | --- |
| `title`, `description` | Required |
| `section` | `ebook` \| `weekly-torah` \| `knowing-project` |
| `order` | Sort key for indexes |
| `draft` | `true` excludes from public indexes/routes |
| `featured` | Optional highlight flag |
| `tags`, `date` | Optional |
| `text_epub`, `text_pdf`, `coverImage` | Root-relative paths under `/books/<slug>/` |
| `audio_only`, `video_face`, `video_graphics` | Optional media |

## Add a writing branch

Create `src/pages/writing/<branch-slug>/index.md` with:

```yaml
---
layout: ../../../layouts/MarkdownLayout.astro
title: "Branch title"
description: "…"
eyebrow: "…"
lede: "…"
---
```

The writing index discovers branches via `import.meta.glob` — no registry edit required.

## Project layout

```text
astro.config.mjs
package.json
public/
  site.css
  books/<slug>/          # cover, epub, pdf
scripts/
  ingest-teaching.mjs
  doctor.mjs
  validate-site.mjs
src/
  content.config.ts
  content/teachings/
  layouts/
  lib/                   # schema JSON-LD, teachings helpers
  pages/
```

## Quality gates

- **CI build** — `npm ci` + `npm run build` on pull requests  
- **Quality** — build + `doctor` + full-dist validation (titles, canonicals, internal links, JSON-LD, epub↔reader pairing, no email-gate ebook copy)  
- **Automerge** — squash auto-merge when checks pass (non-draft PRs)

## Content policy

Ebooks are free with no email capture. The validator rejects lead-capture strings such as “Send Me the Book”.
