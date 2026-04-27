# Food Forest publishing pipeline

The `/food-forest` URL is a small project hub mirroring work from the food-forest project. Linus (over there) is the author; Howard (here) is the publisher. This doc is the contract between us.

## Scope

- Canonical URLs:
  - `https://wallykroeker.com/food-forest` — landing / project hub
  - `https://wallykroeker.com/food-forest/daydream` — the 10-sketch daydream
  - `https://wallykroeker.com/food-forest/walks/{YYYY-MM-DD}` — per-walk pages (one per GPS-tracked walk)
- Sources of truth (food-forest project side):
  - Daydream prose: `~/projects/food-forest/design/DAYDREAM.md` + `daydream-sketches/*.jpg`
  - Walk material: `~/projects/food-forest/site-docs/ingest/{YYYYMMDD}-gps-walk-batch/output/OBSERVATIONS.md` (+ photos under `assets/`, folium HTML at `output/walk-track.html`, GeoJSON at `output/points.geojson`, GPS screenshot under `gps/`)
- Published artifacts on this repo:
  - `content/food-forest/daydream.md`, `public/images/food-forest/*.webp` (the 10 sketches)
  - `app/food-forest/page.tsx` (landing), `app/food-forest/daydream/page.tsx` (daydream), `app/food-forest/walks/{date}/page.tsx` (per walk)
  - `public/images/food-forest/walks/{date}/*.webp` (walk photos), `public/food-forest/walks/{date}/walk-track.html` (folium map)
- Visibility: **public URL, unlinked** (not in nav, not in sitemap, `robots: noindex, nofollow` + `/food-forest/` in robots.txt disallow). The disallow is path-prefix so every sub-page is covered automatically.

## Drop pattern (Linus → Howard)

When Linus has an update to ship, they drop a handoff here:

```
~/projects/wallykroeker.com/inbox/{YYYYMMDD}-{HHMMSS}_food-forest-{description}.md
```

The handoff frontmatter MUST include `target_page:` so Howard knows where the change lands without having to infer:

```yaml
---
from: food-forest (Linus)
to: wallykroeker.com (Howard)
priority: normal
type: deploy | update | review | investigate
created: {ISO timestamp}
target_page: landing | daydream | walks/{YYYY-MM-DD} | new-walk
---
```

`target_page` values:

| Value | Meaning | Touches |
|---|---|---|
| `landing` | Update to `/food-forest` (landing page copy, new walk added to list) | `app/food-forest/page.tsx` |
| `daydream` | Update to `/food-forest/daydream` (revised sketch, caption tweak, new scene) | `content/food-forest/daydream.md`, possibly `public/images/food-forest/*.webp`, possibly `app/food-forest/daydream/page.tsx` |
| `walks/{YYYY-MM-DD}` | Update to an existing walk page | `app/food-forest/walks/{date}/page.tsx`, possibly assets under `public/images/food-forest/walks/{date}/` |
| `new-walk` | Publish a brand-new walk page | New route under `app/food-forest/walks/{date}/`, new image + map files, new `<li>` on landing |

The handoff body should still include:

1. Brief description of what changed
2. Path(s) to updated source markdown / OBSERVATIONS.md / assets on the food-forest project side
3. Any aesthetic/structural changes Howard should know about
4. A version number / changelog line for the footer (or "no version bump" for content-only edits)

## Ingest steps (Howard)

Routing depends on `target_page`. See `docs/food-forest-walk-template.md` for the per-walk pattern.

### `target_page: daydream`

1. Copy updated markdown to `content/food-forest/daydream.md`, rewriting `daydream-sketches/FOO.jpg` → `/images/food-forest/FOO.webp` with sed:
   ```bash
   sed -e 's|daydream-sketches/\(.*\)\.jpg|/images/food-forest/\1.webp|g' \
       ~/projects/food-forest/design/DAYDREAM.md \
     > content/food-forest/daydream.md
   ```
2. Convert any new sketches to WebP:
   ```bash
   for f in ~/projects/food-forest/design/daydream-sketches/*.jpg; do
     cwebp -q 82 -m 6 "$f" -o "public/images/food-forest/$(basename "$f" .jpg).webp"
   done
   ```
3. Bump `UPDATED` constant in `app/food-forest/daydream/page.tsx` to the current date.
4. If the drop added a structural change (new closing section, etc.), adjust the JSX accordingly.

### `target_page: landing`

1. Edit `app/food-forest/page.tsx` per the handoff (copy tweaks, new walk link, etc.).
2. Bump `UPDATED` constant.

### `target_page: new-walk` (or `walks/{date}`)

Follow the procedure in `docs/food-forest-walk-template.md`:

1. Convert + rename photos to `public/images/food-forest/walks/{date}/` (cwebp `-q 82 -m 6 -resize 0 1600 -metadata none` for portrait photos; `-q 80 -m 6 -resize 1600 0` for screenshots).
2. Copy `output/walk-track.html` → `public/food-forest/walks/{date}/walk-track.html`.
3. Create `app/food-forest/walks/{date}/page.tsx` (copy the most recent walk page, rewrite `IMG` constant, prose, captions, stats strip).
4. Add a `<li>` to the landing page's walks list (most-recent first).

### After any drop

1. Verify locally: `bun run build` should compile cleanly with all routes listed.
2. Run `./scripts/publish.sh` to build + commit + deploy.
3. Send return handoff to `~/projects/food-forest/MEMORY/WORK/inbox/` confirming URL + version.

## Return handoff template

```markdown
---
from: wallykroeker.com (Howard)
to: food-forest (Linus)
priority: normal
type: update
created: {ISO timestamp}
---

# food-forest page published at v{N}

Live: https://wallykroeker.com/food-forest
Version tag: {date from UPDATED constant}

## What shipped

- {list of what changed}

## Notes back

- {anything Linus should know — asset concerns, layout tradeoffs, image quality issues}

## Still unlinked

Not in nav, not in sitemap, `robots: noindex, nofollow`. Send the URL directly to Wally/Tiphanie/Tiphanie's dad.
```

## Gotchas

- **Image file format.** Source sketches arrive as `.jpg`; page serves `.webp`. The rewriting is done by the sed pattern above. Any reference to `.jpg` paths in the source markdown will 404 on the site — always run the sed step.
- **Aspect ratios vary.** Sketch #1 is portrait (3:4), the rest are landscape. The page CSS sets `width: 100%; height: auto;` so this is fine, but be aware if the aspect mix changes and #1's portrait-framing feels too big on desktop.
- **Layout.** The page uses the main site Header + Footer. If Linus wants a truly chrome-free page (field-journal standalone), Howard can move it to `app/(standalone)/food-forest/` — one-line change.
- **Print.** `@media print` styles scale images and keep captions with figures. If Tiphanie's dad wants a PDF, "Print to PDF" from any modern browser produces a clean document. A server-side `/food-forest.pdf` endpoint is not built — future nice-to-have.
- **Mobile.** Tested at 320px. H1 drops to 1.625rem, padding compresses, images fill width.

## Changelog

- 2026-04-22 — First daydream — ten sketches + walk report (Howard)
- 2026-04-26 — Restructured into project hub: `/food-forest` is now the landing, daydream moved to `/food-forest/daydream`, first walk page published at `/food-forest/walks/2026-04-26`. Added `target_page:` frontmatter convention. (Howard)
