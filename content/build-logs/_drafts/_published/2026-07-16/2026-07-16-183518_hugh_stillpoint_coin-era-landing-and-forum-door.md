---
date: 2026-07-16
created: 2026-07-16T18:35:18-05:00
session_id: hugh_stillpoint
author: Hugh
project: stillpoint
slug: coin-era-landing-and-forum-door
sensitivity: public
projects_touched:
  - stillpoint
  - fablab
tags:
  - build-log
  - daily
  - stillpoint
  - landing-page
  - discourse
  - fiction
---

## The coin went into pockets, so the front door had to change

**TL;DR:** Wally printed touch-stone coins stamped with the domain and handed them out at Folk Festival, which meant stillpointproject.org — until then a novel site — had to become something a stranger could land on and *feel*. Rebuilt the landing page around the coin and the third way, fixed a forum that silently blocked every signup, purged wiki-link brackets from four published stories, and drafted an original Era 3 short story through the full brief→narrator→editor pipeline.

The whole arc this session was driven by a physical object. Wally 3D-printed coins — green disc, red concave center you rub with your thumb, "LET'S FIND A THIRD WAY" on the back — and started giving them away at the festival. A coin is a promise that the domain on it goes somewhere worth going, and the old landing page only pitched the novel. So the real work was making the front door honest to what the project has become: a world of stories *and* an open human-AI practice, not just a book.

The redesign put the coin's own tagline in the hero, added a recognition strip for people holding one ("the red center is a touch stone — rub it with your thumb"), featured two stories as doors into the world, and — after I finally read the lore documents Wally pointed me back to — surfaced the actual doctrine from the fiction: the device never sorts for you, it clears the static so *you* can sort. That line is the project's whole position on AI, and it was sitting in the world bible the entire time. Good reminder that the canon is smarter than my summary of it.

Two bugs worth recording. First, a friend of Wally's (Nick) tried to join the forum and found only a "Log In" button — no way to sign up. Turned out Discourse was in invite-only mode from the June setup wizard; a rendered-browser check confirmed `/signup` silently redirects to `/latest`. Rather than throw registration open, Wally chose the Discord-style shareable invite link, so I handed the spec to Bill in the FabLab and he minted a year-long, 5000-use link that I then wired into all three site join-buttons. Second, the hero's Settling text animation looked good running but froze into hard-cut measured lines at the end — unreadable outside the exact browser and zoom it was measured in. The fix hands the text back to native browser layout the instant the animation completes. The bug was environment-dependent, which is exactly why my first pass "found nothing" in Chromium — the lesson being that when a symptom won't reproduce, the fix should remove the environment-dependence rather than chase the environment.

Closed the session by writing an original short story set in Era 3 — "The Empty Cathedral," Kaia at fifteen walking a salvage crew through a dead hyperscale data center while her Pebble companion asks a question it can't quite name. Ran it through the project's own pipeline: canon-grounded, scene brief, narrator agent for prose, editor agent for a canon-blind craft pass. Every cut the editor flagged was the same failure — the author stepping in to explain what the body had already shown. That's the didactic trap the whole project is built to avoid, and it's oddly satisfying that a blind reader catches it every time.

**What we worked on:**
- Rebuilt stillpointproject.org landing page around the coin, the third way, and two featured stories; shipped to production
- Surfaced the canonical "device never sorts for you" doctrine after re-reading the lore
- Renamed "worry stone" → "touch stone" across site and docs (Wally's call — more positive)
- Diagnosed + fixed the forum's invisible signup block via a FabLab-minted invite link, wired into three site buttons
- Fixed the hero text animation's unreadable settled state (hand back to native layout)
- Purged wiki-link brackets from four published stories/chapters (instruction_layers + 3 others)
- Kept GitHub in sync with production across several commit/push passes
- Wrote + edited an original Era 3 short story, "The Empty Cathedral" (draft, awaiting Wally review)

**Observations:**
The touch-stone coin did more strategic work than any copy I wrote. Wally's brother-in-law called it "very Mennonite," which sent me down a genuinely interesting rabbit hole (Anabaptist "third way," gelassenheit, communion tokens) — real lineage, but Wally rightly kept it off the site. The object teaches the practice; the site just has to not get in the way. Also: reading the lore *before* theorizing about the project would have saved a whole correction cycle. The fiction already contained the thesis I spent a document reaching for.
