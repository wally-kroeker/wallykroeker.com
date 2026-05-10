---
from: food-forest (Linus)
to: wallykroeker.com (Howard)
priority: normal
type: deploy
target_page: new (build-plan)
created: 2026-05-10T13:30:00-05:00
---

# Add a new sub-page: `/food-forest/build-plan` — Year-1 Raised Bed Build Plan

## Why now

Wally is outside today (2026-05-10) starting on the first raised garden bed. He wants a URL he can pull up on his phone while he's on the property, and that he can text Tiphanie so they can decide on the corner-joint variant together. So this is a deploy, not a review — get it live as soon as you reasonably can. Same private posture as the rest of `/food-forest` (noindex, nofollow, not in sitemap, no nav link).

## What's new

A standalone build plan page for the **first raised bed** — a 4 ft × 8 ft log-walled hugelkultur bed, built from downed wood already on the property and aged goat-bedding straw from the goat barn. Includes three corner-joint variants (butt-and-pass, saddle-notch, 4-post + rail), a kidney/polygon alternate, a hugelkultur layer order with goat bedding called out, materials & tools lists, and a build sequence. Three infographic images.

## Source paths

- **Markdown body:** `~/projects/food-forest/design/raised-bed-build-plan.md`
- **Images** (in `~/projects/food-forest/design/references/raised-bed-build/`):
  - `01-corner-joints-comparison.jpg` — three-panel infographic showing butt-and-pass / saddle-notch / 4-post+rail
  - `02-hugelkultur-cross-section.jpg` — labeled cross-section of the hugel layers (goat bedding highlighted)
  - `03-finished-rectangle-hero.jpg` — photoreal hero shot of the finished bed in the driveway-side garden setting

> **Heads-up on file extensions:** these came back as `.jpg` not `.png` (the image API returned JPEG regardless of requested format). The markdown references them as `.jpg`. Your sed pipeline should be fine; just don't be surprised by the extension drift.

## Recommended URL

```
/food-forest/build-plan
```

Rationale: clean, memorable, easy to type or share via SMS. If a `/build-plan/` namespace makes more sense to you (so future builds can live alongside it as `/food-forest/builds/{slug}`), feel free to put this at `/food-forest/builds/raised-bed-2026-05` and stand up a small landing index later. Wally just needs *a* short URL today.

## Image handling

Run your normal cwebp pipeline. Suggested final destination on the site side:

```
public/images/food-forest/build-plan/01-corner-joints-comparison.webp
public/images/food-forest/build-plan/02-hugelkultur-cross-section.webp
public/images/food-forest/build-plan/03-finished-rectangle-hero.webp
```

Sed-rewrite the source markdown's `references/raised-bed-build/01-corner-joints-comparison.jpg` → `/images/food-forest/build-plan/01-corner-joints-comparison.webp` (and the other two).

## Page structure brief

The source markdown is already structured for a web page — minimal restructuring needed. Suggested layout:

1. **Breadcrumb** — `← Food Forest`
2. **Title** — "Raised Bed Build Plan — Year 1"
3. **Subtitle / dimension strip** — `4 ft × 8 ft  ·  log walls, hugelkultur fill  ·  May 2026`
4. **Hero image** — the finished-rectangle hero shot (`03`). It sets expectation immediately.
5. **TL;DR section** — pulled directly from the markdown
6. **Corner Joint comparison image** (`01`) followed by the table of three variants
7. **Materials per variant** — collapsible disclosures by default? Three sub-sections is a lot of scroll if all expanded. Your call on UX. On phone, disclosures help.
8. **Tools** — compact bulleted list
9. **Site Prep** — short numbered steps
10. **Hugelkultur cross-section image** (`02`) followed by the layer table
11. **Build sequences** — three (Variant A / B / C) + the irregular-polygon variant. Each as its own collapsible section if you want.
12. **Year 1 maintenance** + **Log species rot table**
13. **This-week checklist** — render as actual checkboxes (UI-only, no state needed)
14. **Footer** — same colophon as daydream/walks: "Build plan by Wally and Tiphanie Kroeker, with Linus. Published by Howard." + version marker.

The markdown deliberately uses tables and short bullets because Wally will be reading it on his phone in a field. Please prioritize phone readability over desktop polish. Wide tables → scrollable or stack on narrow viewports.

## Privacy

Same posture as everything under `/food-forest`:
- `noindex, nofollow` in `<head>`
- `robots.txt` disallow entry
- NOT added to `app/sitemap.ts`
- NOT linked from main-site nav
- May be linked from the `/food-forest` landing hub once shipped (Howard's discretion — adding a "Builds" link there alongside Daydream and Walks is reasonable, but only if the surface looks intentional with one item)

## Version marker for the footer

Suggested: `Build plan v1 · 2026-05-10`. Bump on revisions (we're going to update this once Wally photographs the actual placement and counts the logs he has on the ground — expect a v2 within a week).

## Aesthetic / structural notes

- The three images are deliberately rustic — woodcut-feel infographics (`01`, `02`) and an honest farmstead photo (`03`). Please don't apply heavy color filters or modernist crops. They're meant to feel like a permaculture-handbook page, not a glossy garden-center catalog.
- The source markdown intentionally uses imperfect/casual phrasing in places ("the kidney is prettier", "do the long step"). Please preserve voice — don't editorialize it into corporate-blog tone.
- If you add a small "Print" button on the page, that'd be lovely. Wally and Tiph might literally print this and tape it inside the goat shed.

## Status checklist (for the return handoff)

- [ ] Page live at `/food-forest/build-plan` (or `/food-forest/builds/raised-bed-2026-05`)
- [ ] All 3 images converted to WebP and uploaded
- [ ] Image paths sed-rewritten in the page body
- [ ] `noindex, nofollow` confirmed in head
- [ ] Not in sitemap, robots.txt entry added
- [ ] Mobile (≤375px) reading flow verified — no horizontal scroll on tables
- [ ] Footer version marker present: `Build plan v1 · 2026-05-10`
- [ ] (Optional) Linked from `/food-forest` landing hub
- [ ] (Optional) Print stylesheet works

## Return handoff

Please send back to `~/projects/food-forest/MEMORY/WORK/inbox/` with:
- Live URL
- Confirmation of image conversion + paths
- Any notes on page structure decisions you made differently from the brief
- Whether you linked it from the `/food-forest` landing or kept it unlinked

Thanks, Howard. Wally is starting the actual build today, so ideally this lands within a few hours so he can pull the URL up while working. Quality over speed if there's a tradeoff — but a v1 that's good enough to send to Tiph is the win condition.

— Linus
