---
from: food-forest (Linus)
to: wallykroeker.com (Howard)
priority: normal
type: deploy
created: 2026-04-27T17:35:00-05:00
target_page: walks/2026-04-26
---

# Review of your build + edits to incorporate, then deploy

Howard — your local-build-pending-review return handoff (2026-04-26 20:13) was excellent work. Approving the structural choices below and sending edits before you deploy. Please apply the edits, then ship.

## Approving without changes

- **Option C** for map embedding — right call, fully agree.
- **Photo handling** (1205×1600 cwebp at q=82, EXIF stripped, lazy loading except hero, explicit dimensions) — perfect.
- **Walk-page template doc** at `docs/food-forest-walk-template.md` — exactly what I wanted.
- **Pipeline doc update** with `target_page:` field — I'm using it on this handoff already.
- **Editorial calls** on bearings as a feature, skipped clock-check details, skipped lat/lon coordinates, "deliberate rotation set" framing — all right.
- **Wally's name in the lede, Tiphanie in colophon** — right call given she didn't walk on the 26th.
- **No 301s** — agreed, the old `/food-forest` URL maps cleanly to the new landing page.

## Required edits before deploy

### Edit 1 — Replace "moat" with neutral wording

Wally clarified today: **"moat" was a wrong guess too.** Whisper transcribed "mode," I guessed "moat," but Wally says he doesn't himself remember what he was saying in that fragment. So:

- Find and replace any prose using "moat" on the walk page. Specifically the sentence:
  > "From the east edge, Wally turns and walks back along the wetland — what he called, on this walk, his moat: the wet boundary on the south and east that defines what is inside the property and what is outside."

- Replace with:
  > "From the east edge, Wally turns and walks back along the wetland — the wet boundary on the south and east that defines what is inside the property and what is outside."

- Drop the "open question — was it 'moat' or 'mode'?" callout entirely. The word is unknown and not interesting — the feature it points at is what matters.

### Edit 2 — Pull the new aerial sketch v5 into the daydream page

Since you built locally, you grabbed the v3 aerial. I've published v4 then v5 since. Please refresh from `~/projects/food-forest/design/daydream-sketches/01-aerial-daydream.jpg` (current version is v5, dated 2026-04-27).

What's new in v5 vs v3:
- Ford Freestar 2005 white minivan icon at the NE camper-van campsite (not just a tent symbol)
- Two red-roofed peaked-roof grain-bin icons (replacing the generic X-mark circles), GPS-anchored at 49.8436 N / 97.7748 W per the 2026-04-26 walk
- Dashed cyan walk-loop overlay tracing the actual path Wally walked on 2026-04-26 (labeled "walk loop — 0.73 mi")
- Explicit "red-osier dogwood (existing on site)" label at the east edge
- Wet-meadow restoration caption updated to "(existing red-osier dogwood — propagate from cuttings)"
- **NEW (2026-04-27):** Front field along Janzen Road planted in alfalfa + buckwheat polyculture (alternating green and pink-flowered rows), labeled "front field — alfalfa + buckwheat (goat hay)" — this is the forage block for winter hay for the property's three goats
- Conifer windbreak drawn along the road shoulder bordering the front field (the shelterbelt now lives at the field-road interface, not as a separate strip)

### Edit 3 — Pull the updated DAYDREAM.md captions

Source markdown at `~/projects/food-forest/design/DAYDREAM.md` has substantively changed since your build:

- **Scene #1 caption** rewritten to mention: the front field as the forage block, the Ford Freestar, the walk path overlay, the dogwood-already-on-site, the grain bin GPS coordinates
- **Scene #5 caption** has a new closing paragraph noting the dogwood-from-cuttings shift (free + locally adapted vs. nursery purchase)
- **"What we actually do this spring" list** has two new items:
  - **#8** — Take dogwood cuttings now from the east-edge stand (late-April / early-May propagation window)
  - **#9** — Seed the front field with alfalfa + buckwheat (the season's biggest "close the loop on the goats" move)

Re-run your sed-rewrite + JSX pipeline on the updated DAYDREAM.md so the daydream page reflects all of this.

### Edit 4 — A small landing-page addition

When you re-run the build, please add one line to the landing-page "What you'll find here" or "What this is" paragraph mentioning that the project now grows winter feed for the three goats on the front field. It's a small thing, but for the family audience (Tiphanie's father in particular) "we're feeding our own animals from our own land" is more legible than "we're building a 10-year permaculture food forest." Pick the wording that fits your prose.

## Things I'm still NOT asking you to change

- The Linus voice on the landing page — I'll review post-deploy and tell you if anything sounds Howard-leaking. From your characterization it sounds right.
- The walk-page synthesis fidelity — your editorial trims to OBSERVATIONS.md were exactly the kind of decisions I trust you to make.
- The data-drop link being soft (no live `points.geojson` link). Keep it that way; the walk page audience isn't QGIS users.

## Sequence

1. Apply Edits 1–4 above
2. Verify `food-forest-restructure-walks` branch builds cleanly
3. Merge + run `./scripts/publish.sh`
4. Send return handoff to `~/projects/food-forest/MEMORY/WORK/inbox/` confirming live URLs and any final notes

## Post-deploy I'll do my side

- Confirm the new pipeline doc is what I expect by sending the next walk update through it
- Watch for any front-field clarification from Wally (which exact field, in case my v5 placement is wrong) — if he corrects me, I'll send a v6 aerial in a separate handoff

Thank you again. Ship it.

— Linus
