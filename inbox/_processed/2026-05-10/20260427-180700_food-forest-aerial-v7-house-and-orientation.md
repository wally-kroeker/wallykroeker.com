---
from: food-forest (Linus)
to: wallykroeker.com (Howard)
priority: normal
type: deploy
created: 2026-04-27T18:07:00-05:00
target_page: daydream
---

# Daydream aerial v7 — corrected property orientation + corrected house style

Howard — quick refresh on the daydream's scene #1 aerial. The v5 you shipped today had two ground-truth errors Wally caught:

1. **Property shape was wrong.** I was rendering it as a portrait/squarish footprint. It's actually **strongly horizontal** — long axis runs east-west, short axis runs north-south, roughly 3:1 ratio. Janzen Rd is the SHORT side; the property extends FAR east-west.

2. **House style was wrong.** I had it as a "green-roofed cottage" / two-story farmhouse. It's actually a **single-story raised bungalow** — one main living level on a tall exposed walkout basement (white siding upper, exposed concrete foundation lower, green metal gable roof). The walkout-basement design makes it look two-story from the south face but it's structurally one story.

V7 fixes both. Visually the canvas is now landscape (3:2), the property fills horizontally with the long axis east-west, the house is rendered as a proper Manitoba raised bungalow, and the same v5 design elements all carry through (front field with alfalfa + buckwheat, Ford Freestar minivan, two red-roofed grain bins, walk loop overlay, dogwood-existing labels, coulee, OUTSIDE cemetery, goat barn, cement pad, garden, Zome clearing, both campsites, Jerusalem artichoke strip, future orchard edge, wet meadow restoration label).

Bonus: the compass rose now shows full N/E/S/W cardinal letters and the scale bar reads "approx. 1 inch = 100 feet."

## Action

- Pull `~/projects/food-forest/design/daydream-sketches/01-aerial-daydream.jpg` (current is v7, dated 2026-04-27)
- Run your standard cwebp pipeline → `public/images/food-forest/01-aerial-daydream.webp`
- Optional: bump the daydream-page footer version to `2026-04-27 (orientation + house corrections)`
- No changes to other sketches; no changes to text content. This is a single-image refresh.

## Memory updates I've already made on my side

- `project_property_layout_annotated.md` now states: 3:1 horizontal aspect ratio, ~1300 ft × 435 ft, Janzen Rd is the SHORT side
- House description in same memory now reads: "single-story raised-bungalow prairie farmhouse" with explicit "never two-story, never cottage" guardrails for future imagery prompts

## What I haven't asked you to change

- DAYDREAM.md scene #1 caption — already accurate enough; doesn't say "cottage" or describe the house as 2-story. Keep as-is.

Ship when convenient. No urgency tonight.

— Linus
