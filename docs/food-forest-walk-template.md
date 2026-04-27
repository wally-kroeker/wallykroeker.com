# Food Forest walk-page template

Reference for the reusable per-walk page pattern under `/food-forest/walks/{date}`. First instance: `/food-forest/walks/2026-04-26`.

## URL convention

```
/food-forest/walks/{YYYY-MM-DD}                     — the walk page
/food-forest/walks/{YYYY-MM-DD}/walk-track.html     — the interactive folium map (single static file, opens in new tab)
```

Date slug `YYYY-MM-DD` matches the OBSERVATIONS.md filename convention on the food-forest project side and sorts naturally.

## Files per walk

```
app/food-forest/walks/{YYYY-MM-DD}/page.tsx                                     — the route component
public/food-forest/walks/{YYYY-MM-DD}/walk-track.html                            — folium map, self-contained
public/images/food-forest/walks/{YYYY-MM-DD}/walk-{YYYY-MM-DD}-{NN}-{slug}.webp  — photos
public/images/food-forest/walks/{YYYY-MM-DD}/walk-{YYYY-MM-DD}-track-overview.webp — Geo-Tracker screenshot
```

Photo filenames are stable, sortable, descriptive. The number prefix preserves walk order; the slug names the subject (e.g. `04-red-osier-dogwood`).

## Page structure

The walk page is **pure JSX**, not markdown→HTML. The structured pieces (stats strip, hero, photo grid, map block) don't fit a single markdown blob cleanly.

Section order:

1. **Breadcrumb** — `← Food Forest`
2. **Title + lede + stats strip** — `0.73 mi · 30 min · HH:MM–HH:MM CDT · N voice notes · N photos · GPX track`
3. **Hero figure** — the visual headline of the walk, with caption naming why it matters
4. **Headline finds** (3-bullet `<ul>`) — pulled from OBSERVATIONS.md "What I'd add to the property knowledge"
5. **The walk** — Moments 1–N as `<h3>` subsections with prose + photos
6. **The walk on a map** — Geo-Tracker screenshot wrapped in a link to `walk-track.html` (target=_blank)
7. **Open questions** — pulled from OBSERVATIONS.md
8. **What's in the data drop** — short note offering raw GPX/KML/GeoJSON on request
9. **Footer** — credit line + `Walk recorded YYYY-MM-DD · Published YYYY-MM-DD`

## CSS classes (already in `globals.css`)

All scoped under `.food-forest-page`:

| Class | Use |
|---|---|
| `.ff-article` | Centered article column |
| `.ff-breadcrumb` | Top breadcrumb link |
| `.ff-lede` | Italic single-sentence lede under H1 |
| `.ff-stats` | Tabular-numerals stats strip |
| `.ff-hero` | Hero `<figure>` (full-width image + caption) |
| `.ff-grid` | 2-column photo grid (collapses to 1 on ≤640px). Use for any grouping of 2+ photos. |
| `.ff-body` | Main prose region |
| `.ff-footer` | Colophon + last-updated |
| `.ff-updated` | Italic version line inside footer |

No new file. Walk-specific tweaks belong inside the `.food-forest-page` scope so they don't leak.

## Privacy posture

Every walk page must:

- Set `robots: { index: false, follow: false }` in the route metadata
- NOT be added to `app/sitemap.ts`
- Be covered by the `/food-forest/` disallow rule already in `app/robots.ts`

`/food-forest/` is path-prefix in `robots.txt`, so all sub-paths (including `/walks/{date}`) are disallowed without further changes.

## Map embedding decision (2026-04-26 walk)

Chose **Option C** from Linus's three options: serve the folium HTML as a single static file at `walk-track.html`, link to it from the walk page in a new tab, with the Geo-Tracker screenshot as the static thumbnail.

**Reasons:**

- Ships v1 fast. No iframe wrangling, no react-leaflet rebuild.
- Folium HTML is self-contained (~46 KB); CDN-loaded leaflet/jquery/bootstrap from jsdelivr/code.jquery.com — no extra wiring.
- Mobile-friendly: full-page interactive map in a new tab beats a fixed-height iframe on a phone.
- The Geo-Tracker screenshot doubles as a static fallback if the interactive map ever 404s.
- Defers Phase-2 react-leaflet investment until walks accumulate. Reconsider when N ≥ 3.

**Why not Option A (iframe):** folium output ships its own `<html>` wrapper; iframe height is brittle on mobile.
**Why not Option B (re-render natively):** premature engineering for N=1; would re-implement what folium already gave us.

## Adding the next walk

1. Drop OBSERVATIONS.md, photos, folium HTML, GPS screenshot in their canonical paths under `~/projects/food-forest/site-docs/ingest/{YYYYMMDD}-gps-walk-batch/`.
2. Linus writes a handoff to `~/projects/wallykroeker.com/inbox/` with `target_page: walks/{date}` (see `docs/food-forest-pipeline.md`).
3. Howard:
   - Creates `app/food-forest/walks/{date}/page.tsx` by copying the 2026-04-26 file and rewriting prose, captions, and the IMG path constant.
   - Runs the cwebp loop to convert photos (`-q 82 -m 6 -resize 0 1600 -metadata none` for portrait photos; `-q 80 -m 6 -resize 1600 0` for screenshots).
   - Copies `output/walk-track.html` → `public/food-forest/walks/{date}/walk-track.html`.
   - Adds a `<li>` to the landing page's walks list pointing at the new route.
   - Builds locally, screenshots, returns handoff to Linus.
4. Daydream and earlier walks remain untouched.

## Image quality settings (verified 2026-04-26)

- **Photos:** `cwebp -q 82 -m 6 -resize 0 1600 -metadata none` — 8 portraits totalled ~4.3 MB from ~40 MB source. Red-osier dogwood detail (the visual hero) preserved cleanly.
- **GPS app screenshot:** `cwebp -q 80 -m 6 -resize 1600 0 -metadata none` — UI screenshots compress harder than photos and don't need photo-quality.
- **EXIF metadata stripped** (`-metadata none`) — removes GPS coordinates from WebP output. (Source EXIF GPS is still in the project repo, just not in public images.)

## Why JSX over markdown for walks (decision, 2026-04-26)

The daydream page renders markdown→HTML because the daydream content is essentially long-form prose with embedded images — markdown is the natural fit. Walks are different: structured data (stats strip, photo grid layouts, map-block compositing) wants component composition. Trying to express that in markdown produces noisy raw-HTML blocks. JSX in `app/food-forest/walks/{date}/page.tsx` is shorter and easier to copy-modify for the next walk than markdown-with-extensions would be.
