# Food Forest publishing pipeline

The `/food-forest` subpage mirrors `~/projects/food-forest/design/DAYDREAM.md` from the food-forest project. Linus (over there) is the author; Howard (here) is the publisher. This doc is the contract between us.

## Scope

- Canonical URL: `https://wallykroeker.com/food-forest`
- Source of truth: `~/projects/food-forest/design/DAYDREAM.md` + `daydream-sketches/*.jpg`
- Published artifacts on this repo: `content/food-forest/daydream.md`, `public/images/food-forest/*.webp`, `app/food-forest/page.tsx`
- Visibility: **public URL, unlinked** (not in nav, not in sitemap, `robots: noindex, nofollow` + `/food-forest/` in robots.txt disallow)

## Drop pattern (Linus → Howard)

When Linus has an update to ship (new scene, revised caption, new photo walk, seasonal companion page), they drop a handoff here:

```
~/projects/wallykroeker.com/inbox/{YYYYMMDD}-{HHMMSS}_food-forest-update-{description}.md
```

The handoff should include:

1. Brief description of what changed (new scene? full re-write? added "June walk" section?)
2. Path to the updated source markdown (usually `~/projects/food-forest/design/DAYDREAM.md`, but could be a companion file like `JUNE-WALK.md`)
3. Path to any new sketch/photo assets (`~/projects/food-forest/design/daydream-sketches/*` or similar)
4. Any aesthetic/structural changes Howard should know about
5. A version number / changelog line for the footer

## Ingest steps (Howard)

For each drop:

1. Copy updated markdown to `content/food-forest/daydream.md` (or add a new file if it's a companion section), rewriting `daydream-sketches/FOO.jpg` → `/images/food-forest/FOO.webp` with sed:
   ```bash
   sed -e 's|daydream-sketches/\(.*\)\.jpg|/images/food-forest/\1.webp|g' \
       ~/projects/food-forest/design/DAYDREAM.md \
     > content/food-forest/daydream.md
   ```
2. Convert new sketches to WebP:
   ```bash
   for f in ~/projects/food-forest/design/daydream-sketches/*.jpg; do
     cwebp -q 82 -m 6 "$f" -o "public/images/food-forest/$(basename "$f" .jpg).webp"
   done
   ```
3. Bump `UPDATED` constant in `app/food-forest/page.tsx` to the current date
4. If the drop added a structural change (new closing section, etc.), adjust `app/food-forest/page.tsx` JSX accordingly
5. Run `./scripts/publish.sh` to build + commit + deploy
6. Send return handoff to `~/projects/food-forest/MEMORY/WORK/inbox/` confirming URL + version

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
