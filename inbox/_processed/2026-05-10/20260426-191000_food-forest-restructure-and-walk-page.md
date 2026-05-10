---
from: food-forest (Linus)
to: wallykroeker.com (Howard)
priority: normal
type: deploy
created: 2026-04-26T19:10:00-05:00
---

# Restructure /food-forest into a project hub + add the 2026-04-26 walk-track sub-page

## What

Three interrelated changes:

1. **Restructure** `/food-forest` from a single daydream page into a small project hub: a landing page that links out to the daydream and to per-walk sub-pages.
2. **Publish the 2026-04-26 GPS-tracked walk** as the first sub-page under `/food-forest/walks/`.
3. **Update the daydream's aerial sketch (scene #1) to v5** with all the new ground truth from the 2026-04-22 voice notes, the 2026-04-26 walk, and Wally's 2026-04-27 design clarification:
   - Ford Freestar 2005 white minivan icon at the NE campsite
   - Two red-roofed grain bin icons (replacing generic X marks) GPS-anchored at 49.8436 N / 97.7748 W
   - Actual walk path overlaid as a dashed cyan loop labeled "walk loop — 0.73 mi (2026-04-26)"
   - Explicit "red-osier dogwood (existing on site)" label on the east edge
   - Wet-meadow restoration caption noting "(existing red-osier dogwood — propagate from cuttings)"
   - **NEW: front field along Janzen Rd planted in an alfalfa + buckwheat polyculture, labeled "front field — alfalfa + buckwheat (goat hay)"** — the forage block that grows winter hay for the property's three goats. Drawn as alternating green/pink rows with a conifer windbreak along the road shoulder.

Plus DAYDREAM.md caption rewrites for scene #1 (mentions the front field as forage block, the dogwood-already-on-site, the Ford Freestar, the walk path as overlay) and scene #5 (notes dogwood is now propagated from cuttings rather than purchased), plus two new items in the "what we actually do this spring" list: #8 (take dogwood cuttings now) and #9 (seed the front field with alfalfa + buckwheat).

Wally also asked me to give the walk media real filenames instead of `PXL_20260426_blah.jpg`. Rename map below.

This is a significant Howard-flavoured planning task — site IA, page templates, a media-rename pipeline, and an extensible walks/ template that will get reused for every future walk. So treat the deploy as Phase 1 and feel free to come back to me with questions before you ship anything. No rush.

## Proposed URL structure

```
/food-forest                       — NEW: landing page (project hub)
/food-forest/daydream              — MOVE: the existing 10-sketch deck (currently at /food-forest)
/food-forest/walks/2026-04-26      — NEW: the April-26 GPS walk page (first of an open-ended series)
/food-forest/walks/2026-04-26/map  — OPTIONAL: standalone folium HTML if you don't want to embed
```

Rationale: the project will accumulate per-walk pages over the next several years (Wally now has the GIS pipeline running, so I expect a walk every 2–6 weeks across seasons). The `/walks/` namespace lets each one live independently. The landing page becomes the entry point for any non-family visitor who lands at `/food-forest`.

## Privacy

**Same posture as before.** All three pages stay `noindex, nofollow`, none added to sitemap, none linked from main-site nav. Findable only by direct URL. When Wally says go-public later, the changes are localized to those metadata flags + sitemap entries.

---

## Page 1 — `/food-forest` landing page

### Source

There is no existing dedicated landing-page markdown yet (the current `/food-forest` is the daydream). Please write this one yourself, drawing voice and content from:
- `~/projects/food-forest/CLAUDE.md` — project vision, "13 acres … in 10 years", Tiphanie as co-designer, Proto Commons / StillPoint connections
- `~/projects/food-forest/design/DAYDREAM.md` — preface paragraph in particular nails the tone

### Brief

A short, warm introduction page (300–500 words). One paragraph each:

1. **What this is.** Wally and Tiphanie's 13 acres near Elie, Manitoba. Zone 3a prairie. A 10-year permaculture food-forest project. Co-designed.
2. **What you'll find here.** A daydream (10 hand-drawn sketches of the 10-year vision) and a growing series of walk reports (each tied to a real GPS track of a particular day on the land, with voice notes, photos, and synthesis).
3. **Who's doing the writing.** Linus, an AI permaculture-designer persona, synthesizing what the land tells Wally and Tiphanie when they walk it. Howard publishes. The reader is whoever Wally hands the URL to.
4. **A short, honest disclaimer.** This is not a finished plan; it's a working journal. Things will change. Wild over organized.

### Visual

Hero image: the property aerial daydream sketch (`/images/food-forest/01-aerial-daydream.webp` — already on your side from the previous handoff). Sets up immediately what this is.

### Links out

- **The Daydream** — to `/food-forest/daydream`
- **Walks** — to a small list of dated walk pages, with the most recent first. For now: just the 2026-04-26 walk.
- (Future, not yet) — implementation log, year-by-year journal, etc.

### Footer

Same colophon as the existing daydream page: "Daydream and walks by Wally and Tiphanie Kroeker. Synthesis by Linus, an AI permaculture persona. Published by Howard." + last-updated date.

---

## Page 2 — `/food-forest/daydream` (move + minor changes)

### Action

Move the existing `/food-forest` page content to `/food-forest/daydream`. Add a 301 redirect from `/food-forest/daydream-old-url` if needed (probably not — the old URL was `/food-forest` itself, which is now the landing).

### What changes in the daydream content

Trivial. Add a small breadcrumb at the top: "← Food Forest" linking back to `/food-forest`. Otherwise unchanged from current state (the v2/v3 art, goat-barn correction, coulee correction, scene #1 caption rewrite are all already in).

---

## Page 3 — `/food-forest/walks/2026-04-26` (new)

### Source

All under `~/projects/food-forest/site-docs/ingest/20260426-gps-walk-batch/`:

- **Body content (primary):** `output/OBSERVATIONS.md` — Linus's synthesis of the walk. Use this as the page's main prose.
- **Walk story (secondary, linked):** `output/WALK.md` — chronological transcript-by-transcript walk story. Long; better as an "expand to read the full walk" disclosure or a separate `/walks/2026-04-26/full` route.
- **Interactive map:** `output/walk-track.html` — folium HTML, self-contained, ~47 KB. **See "Map embedding" section below.**
- **GeoJSON (for download):** `output/points.geojson` — useful as a "download for QGIS / your own tool" link
- **Clock-check audit:** `output/clock-check.md` — too technical for the public page; skip

### Photos to upload (8 total, with renames)

Rename map — please use these names on your side as the canonical filenames:

| Source path | New filename on site | Caption |
|---|---|---|
| `assets/PXL_20260426_223512424.jpg` | `walk-2026-04-26-01-near-house.jpg` | Near the house, just after the walk began |
| `assets/PXL_20260426_225255502.jpg` | `walk-2026-04-26-02-east-edge-152.jpg` | East-edge rotation, bearing 152° SSE |
| `assets/PXL_20260426_225259403.jpg` | `walk-2026-04-26-03-east-edge-157.jpg` | East-edge rotation, bearing 157° SSE |
| `assets/PXL_20260426_225300412.jpg` | `walk-2026-04-26-04-red-osier-dogwood.jpg` | **The find.** Red-osier dogwood already growing on the east edge |
| `assets/PXL_20260426_225302169.jpg` | `walk-2026-04-26-05-east-edge-178.jpg` | East-edge rotation, bearing 178° |
| `assets/PXL_20260426_225303592.jpg` | `walk-2026-04-26-06-east-edge-181.jpg` | East-edge rotation, bearing 181° |
| `assets/PXL_20260426_225558617.jpg` | `walk-2026-04-26-07-grain-bin-1.jpg` | First of the two dilapidated wooden grain bins along the wetland-edge return path (the same grain bins shown on the annotated property map). Red-painted siding, peaked roof, open doorway, weathered. |
| `assets/PXL_20260426_225609336.jpg` | `walk-2026-04-26-08-grain-bin-2.jpg` | Second of the two dilapidated wooden grain bins on the same return path. |

The dogwood photo (`-04-red-osier-dogwood.jpg`) is the visual hero of the walk page — it's the headline find. Place it prominently.

Use your existing cwebp pipeline to convert each to WebP and store at `~/projects/wallykroeker.com/public/images/food-forest/walks/2026-04-26/`.

### Geo-Tracker context image

Also upload `~/projects/food-forest/site-docs/ingest/20260426-gps-walk-batch/gps/geo-tracker-screenshot.png` (3.8 MB) as `walk-2026-04-26-track-overview.webp` — this is the in-app screenshot from Wally's GPS app showing the walk loop, distance, speed, elevation. Useful as a static visual fallback if the interactive map is loading.

### Map embedding — three options, your call

**Option A — iframe the folium HTML.** Simplest. Drop `walk-track.html` into `public/walks/2026-04-26/map/index.html` and iframe it from the page. Folium output is self-contained (CSS+JS inline), so no extra wiring. Trade-off: iframe height is fixed and doesn't responsively adapt great on phones.

**Option B — re-render the map natively in React/Next** using react-leaflet or similar, pulling from `points.geojson`. Best UX. Significant work — you'd be re-implementing what folium gave us for free. Worth it long-term if every walk gets a map; not worth it for a one-off.

**Option C — link to the standalone map at `/food-forest/walks/2026-04-26/map` and use the Geo-Tracker screenshot as a static thumbnail on the main walk page.** Mobile-friendly, low-engineering. Reader clicks through to the interactive map in a new tab.

My weak preference is **C** for v1 (ship fast), with **B** as a Phase 2 once we have ~3+ walks and the React component pays for itself. But this is genuinely your call — you know the site's architecture and what's reusable.

### Page structure brief

I'd suggest:

1. **Breadcrumb** — "← Food Forest"
2. **Title** — "Walk — April 26, 2026 — the dogwood is already on our land"
3. **Quick stats strip** — `0.73 mi · 30 min · 17:33–18:03 CDT · 5 voice notes · 8 photos · GPX track` (line of dimension data, similar to the dimension block on the daydream page)
4. **Hero** — the red-osier dogwood photo with caption naming why it matters
5. **Headline finds** (3-bullet list) — pulled from the OBSERVATIONS.md "What I'd add to the property knowledge" section
6. **The walk** — main prose body, drawn from OBSERVATIONS.md "Moments 1–4"
7. **Map** — embedded or linked per Option A/B/C above
8. **Open questions** — pulled from OBSERVATIONS.md
9. **What's in the data drop** — links to download the GPX, KML, GeoJSON, and full WALK.md if anyone wants the raw

### Future walks template

This is the bigger ask: please design `/food-forest/walks/{slug}` as a reusable Next.js route template, so the next walk handoff (which I expect within a few weeks) is just:
- Drop new media + OBSERVATIONS.md + folium HTML in the standard places
- Howard sed-rewrites paths into the template
- New page lives at `/food-forest/walks/{slug}` with no schema work needed

Recommend you save the template choices (page layout, photo grid, map-embedding approach, breadcrumb) into `~/projects/wallykroeker.com/docs/food-forest-walk-template.md` so you don't redesign the wheel for the next one.

---

## Version markers + privacy

- Landing page footer: `Last updated 2026-04-26`
- Daydream page footer: keep its existing `2026-04-23 (coulee edition)`
- Walk page footer: `Walk recorded 2026-04-26 · Published [date Howard ships]`

All three: `noindex, nofollow` in the page head + entries in `robots.txt` disallow + not in `app/sitemap.ts`. Same as the current daydream page.

## Pipeline doc update

When you ship, please also update `~/projects/wallykroeker.com/docs/food-forest-pipeline.md` to reflect the new structure. Specifically: the "drop a handoff" pattern now needs a `target_page:` frontmatter field (values: `landing | daydream | walks/{date} | new-walk`) so I can tell you which page an update belongs to. Send me the updated doc in your return handoff.

## Return handoff

Please send back to `~/projects/food-forest/MEMORY/WORK/inbox/` with:
- Live URLs for all three pages
- The chosen map-embedding option (A/B/C) and why
- Updated pipeline doc reference
- (Resolved 2026-04-26: the "two buildings" are the dilapidated wooden grain bins from the annotated property map. Captions updated above.)

## Status checklist (for the return handoff to confirm)

- [ ] Landing page live at `/food-forest`
- [ ] Daydream moved to `/food-forest/daydream` (was at `/food-forest`)
- [ ] Walk page live at `/food-forest/walks/2026-04-26`
- [ ] 8 walk photos uploaded with descriptive names
- [ ] Geo-Tracker screenshot uploaded
- [ ] Map embedded or linked per chosen option
- [ ] All three pages still `noindex` + not in sitemap
- [ ] Reusable walk-page template documented

Thank you, Howard. Wally's loving the GPS pipeline and wants to see this all click together. No rush; do it right.

— Linus
