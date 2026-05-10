---
from: food-forest (Linus)
to: wallykroeker.com (Howard)
priority: normal
type: deploy
created: 2026-04-22T01:00:00-05:00
---

# Launch `wallykroeker.com/food-forest` — subpage + ongoing publishing pipeline

## What

Wally wants a **public-but-unlinked** subpage at `wallykroeker.com/food-forest`. Two deliverables:

1. **The page itself** — publish the "ten-picture daydream" of Wally and Tiphanie's 13-acre food-forest project in a form Wally can send to Tiphanie and, critically, her skeptical father. Warm, inviting, not a sales pitch.
2. **The pipeline** — once published, document the return path so Linus (that's me, on the food-forest project) can drop updates (new photo-walks, expanded designs, revisions) via a single handoff back into this inbox, and Howard re-publishes. The food-forest project is Year 0; this page will get updated across ~10 years. The pipeline is the real gift — the first page is just its forcing function.

URL is Wally's explicit ask: `wallykroeker.com/food-forest` — **top-level**, not under `/projects/`. If Howard feels strongly it should also have a `/projects/food-forest` alias (so it lives in the projects index for discoverability *later* when we go public), that's fine — but the canonical URL is the flat one.

## Context

On 2026-04-19 Wally walked his and Tiphanie's 13 acres near Elie, Manitoba (Zone 3a prairie, bluff woodland + open prairie, ~100-day growing season). We built a media ingest pipeline, processed 200 photos + 3 transcribed voice-notes, clustered into 9 standing-point rotation-sets, produced Linus-style per-cluster observations, and synthesized a full permaculture design report. The full artifact tree is at:

```
/home/bob/projects/food-forest/
├── CLAUDE.md                         # project vision
├── design/
│   ├── DAYDREAM.md                   # ← PRIMARY SOURCE for this page
│   └── daydream-sketches/            # ← ASSETS for this page (10 images)
├── site-docs/ingest/20260419-batch/
│   ├── REPORT.md                     # full Linus permaculture synthesis (4479 words)
│   ├── sidecars/cluster-*.observation.md  # 9 per-cluster deep dives
│   └── assets/                       # 200 raw photos from the walk
└── MEMORY/WORK/                      # PRDs (ignore)
```

**The ten sketches** (watercolour-and-pencil permaculture-journal aesthetic, hand-drawn, generated with Gemini 3 Pro / nano-banana-pro):

1. `01-aerial-daydream.jpg` — treasure-map year-10 plan view (portrait, 3:4)
2. `02-sheltered-dome.jpg` — geodesic dome in sheltered bluff clearing, April
3. `03-keyhole-bed.jpg` — Year-1 walk-in keyhole bed on the concrete pad, July
4. `04-bluff-bench.jpg` — saskatoon/haskap bench with deer at treeline, August
5. `05-ejector-restoration.jpg` — septic ejector field restored to wet meadow
6. `06-jerusalem-artichoke.jpg` — Year-1 test strip with "spring 2026" sign
7. `07-west-shelterbelt.jpg` — reinforced windbreak at driveway, ten years grown
8. `08-gathering-space.jpg` — summer evening, two domes, string lights, neighbours arriving
9. `09-flood-corridor.jpg` — wet-meadow Zone 5 with cottonwood + mushroom-inoculated nurse logs
10. `10-walking-together.jpg` — Wally and Tiphanie walking in October, food forest grown in

**A label caveat on sketch #8** (the gathering space): Gemini rendered the handwritten annotation labels as garbled fake-English. Visual is great but some words don't read. Options: (a) run with it as "hand-drawn notation" aesthetic, (b) regenerate with a "no labels" prompt — I have the prompt file ready, happy to do this on request, or Howard can do it via the Art skill directly.

### Audience

- **Primary:** Wally + Tiphanie, to daydream together. Tiphanie is an active **co-designer**, not a bystander. She must feel seen on this page, not rendered as The Wife.
- **Secondary:** Tiphanie's father, who supposedly scoffed when she tried to describe the food-forest idea verbally. The page should disarm his skepticism with warmth, specificity, and honest realism — NOT defend against it. Think "permaculture field journal," not "pitch deck."

### Privacy constraint

**Public URL, but unlinked from the rest of the site for now.** No nav entry, not in the sitemap for now (Wally's call — he may change this), no Open Graph promotion. Findable by anyone who has the URL. Reasons: (1) family-sharing phase, (2) the plan will evolve a lot in the first six weeks and Wally doesn't want a half-baked version indexed.

Howard: `robots: noindex, nofollow` in the page `<head>` is the right compromise — it stays reachable but search engines won't pick it up. Revisit when Wally says the word.

## Page design — Linus's wishes, Howard's call

Howard's expertise trumps Linus's wishes on any design conflict. Ideas rather than specs:

- **The art is the thing.** The ten sketches should be **large**, well-spaced, and centre-stage. Text is the commentary beneath each picture, not the other way around.
- **Reading flow matches DAYDREAM.md** — preface → 10 scenes with caption per scene → "what we actually do this spring" → credits. Linear, no tabs, no carousel.
- **Aesthetic affinity** — watercolour-field-journal. If Howard can find a way to make the page itself *feel* like a hand-bound sketch notebook (faint paper texture, warm cream background, serif body font, room to breathe), that matches the source material's vibe. But do NOT overdo it to the point where it reads as twee or LARP-y — Wally's voice is authentic-practitioner, not artisan-performer.
- **Hero** — scene #1 (the treasure-map aerial) is obviously the hero. It sets expectations that this is illustrated and imagined, not a rendered CAD plan.
- **Print friendliness** — Tiphanie's dad may well want to see this on paper. A `@media print` stylesheet that makes the page print cleanly (images scale, captions stay with pictures, no nav chrome) is a generous touch.
- **Mobile** — Wally may show this on a phone standing in a field. Readable at phone width, images scale, captions wrap gracefully.
- **No CTA, no newsletter signup, no "contact Wally" module on this page.** Closing image is the closing image. The page ends on scene #10 and the "what we actually do this spring" note.
- **Credit Tiphanie in the byline / credits block** — not as a footnote. "A daydream by Wally and Tiphanie Kroeker" or similar language. Linus can be credited as "designer: Linus (an AI permaculture persona)" or whatever feels right to Howard's judgment.
- **Update date visible** — "daydream as of 2026-04-22, updated when the land has more to say." Signals honestly that this is version one, not version final.

### Nice-to-have (not required for v1)

- A tiny "changelog" strip at the bottom listing past updates ("2026-04-22: first daydream — ten sketches + walk report"). Useful once the pipeline runs for a year.
- A `/food-forest.pdf` generated from the page — single-page export friendly to print on a home printer. Wally explicitly wants something to hand to Tiphanie's dad.
- A small "behind the sketches" expand/collapse per image with the actual Gemini prompt that generated it — low-priority, but fun-for-skeptics (lets curious people see the methodology).

## Voice note

The DAYDREAM.md text is already written in Linus's voice — observational, patient, specific, non-dogmatic. Howard: please **preserve that voice** through any layout/copy adjustments. If the page needs new connective copy (e.g., a "read the full Linus report" sidebar), write it in Linus's voice, not Howard's editorial voice. Linus is the permaculture-designer persona for this project; Howard is the site designer. Both of you exist.

If Howard wants any bridging copy that is clearly Howard's editorial voice, a one-line curatorial note at the top is fine ("a field-journal page on a long-term permaculture experiment — handed to me by Linus, published by Howard" — or whatever feels honest).

## The pipeline — the second deliverable

Going forward, Linus will regenerate DAYDREAM (and eventually add companion pages — June photo walk, summer observation notes, winter reflections, etc.) over years. Howard needs to design **the drop pattern** and document it back to me.

My proposal — Howard please adapt:

- Linus drops a handoff at `~/projects/wallykroeker.com/inbox/YYYYMMDD-HHMMSS_food-forest-update-{description}.md` with the new source markdown and asset paths
- Howard ingests, places assets in `public/images/food-forest/`, writes the new content into `content/food-forest/` (or wherever Howard prefers), rebuilds, redeploys
- Howard sends a return handoff to `~/projects/food-forest/MEMORY/WORK/inbox/` (create the dir) confirming: URL live, version number, any design notes I should know about
- For the very first publish (this handoff), the return handoff should include the specific "this is the pipeline" doc so I know how to drop the next update cleanly

## Status

- [x] Source content written and warm (`design/DAYDREAM.md`)
- [x] Ten hand-drawn sketches generated and saved (`design/daydream-sketches/*.jpg`)
- [x] REPORT.md with full permaculture synthesis available for depth-reference or a companion "full report" subpage if Howard wants to build one
- [ ] Page live at `wallykroeker.com/food-forest` (this handoff)
- [ ] Pipeline doc returned to food-forest project (this handoff)
- [ ] Sketch #8 label cleanup (optional — Howard's call whether to regenerate or ship)

## Return handoff location

Please drop the return handoff at:
```
~/projects/food-forest/MEMORY/WORK/inbox/{YYYYMMDD}-{HHMMSS}_page-live-and-pipeline.md
```

Create the `inbox/` dir if it doesn't exist. Include the live URL and the pipeline doc.

Thank you, Howard. This one matters to Wally — Tiphanie's dad needs to see something tangible, and spring is already here.

— Linus, The Cultivator
  (on behalf of the food-forest project)
