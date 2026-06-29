---
date: 2026-06-29
created: 2026-06-29T16:22:26-05:00
session_id: howard_wallykroeker-com_cl-reconciliation-and-loop-hardening
author: howard
project: wallykroeker-com
slug: cl-reconciliation-and-loop-hardening
sensitivity: public
projects_touched: [wallykroeker-com, TSFUR/cognitive-loop, bobaverse]
tags: [cognitive-loop, bobaverse, loop-hardening, reconciliation, substack, predicate-bug]
---

# CL Reconciliation + Loop Hardening

Long session on the Cognitive Loop publishing stack — auditing, fixing, and hardening.

## What got done

**Tetris mobile (earlier):** Tiph wanted to play Tetris on her phone. Added full touch controls (DAS, pointer events, `touch-action: none`), a compact stats bar, and a scoped style tag to hide the site nav on mobile so the board fits. Deployed. Separate canvas ref for the mobile next-piece preview since React refs can't be shared between two DOM elements — that was the trickiest part.

**CL draft reconciliation:** Audited all 16 drafts in `cognitive-loop/drafts/` against Substack `list-posts` and the site's `/loop` route (which pulls 100% from Substack RSS — no local source). Found two false drafts: The Stick (published Apr 20) and The Third Road (published May 31, emailed to subscribers). Also confirmed `every-soul-ram-dass-coming-back-to-center.md` was the source file for the published "The Mold, the Music, and the Moment of Return" (2025-07-30) — file title was the OpenAI conversation name, body h1 was the Substack title. Updated frontmatter on all three: `status: published` + `published_url` + `published_date`.

Cleaned up two Substack draft duplicates: deleted [161482602] (older "Micro-Manufacturing the Future" dupe, kept [194035881]) and [167456161] (older "Peeling Back the Night Sky" dupe, kept [194035884]).

**Loop hardening — phase 2:** Added the "write the retraction when you write the fact" rule to `loop.md` Routine B. On publish: (a) update source draft frontmatter `status: published` + `published_url` + `published_date`, (b) close the surface gate — atomically, same step as the ack. Documented as a named rule.

Added `verify:` predicates to CL publish gates on surface.md. Standard pattern: `curl -sfL <url> -o /dev/null && echo DONE`.

**Predicate bug fix:** Caught a correctness bug before the aggregator went live. `curl -sf` without `-L` treats a 302 redirect as exit 0 — meaning an unpublished Substack draft (302 → 404) would false-pass and auto-close a gate. Confirmed: Pebble without `-L` = exit 0 (false pass); with `-sfL` = exit 22 (correct). Third Road with `-sfL` = exit 0 (genuinely published). Fixed both surface.md predicates. Documented the standard in `loop.md` step 5 and `memory-pipeline-review.md` (fleet-wide rule, named "predicate-authoring rule").

**Pebble draft polished:** Source draft `the-pebble-in-the-circle.md` had two banned phrases ("Here's where it gets interesting." and "Here's what I keep coming back to."). Applied the polished version from the CL publish queue — renamed the closing section from "The Circle Has a Fire" → "Loop Back Reflection," removed both banned openers, added proper frontmatter and CL masthead. Body prose is all Wally's. Substack draft [194035634] still has the old version — it'll get overwritten when Wally triggers the publish flow.

**tasks.md created:** First standing task file for the planet. Reversible items Howard can do vs. items needing Wally input.

## State of the queue

- The Stick — PUBLISHED (Substack Apr 20)
- The Third Road — PUBLISHED (Substack May 31)
- The Pebble in the Circle — source draft polished, Substack draft exists [194035634], ready when Wally says go

## What's next

Pebble is the one. Everything is staged.
