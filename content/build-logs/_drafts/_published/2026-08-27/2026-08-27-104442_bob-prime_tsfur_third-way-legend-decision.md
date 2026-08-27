---
date: 2026-08-27
created: 2026-08-27T10:44:42-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: third-way-legend-decision
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - stillpoint
tags:
  - build-log
  - daily
  - stillpoint
  - 3d-printing
  - naming
---

## Four words on the back of a coin

**TL;DR:** The StillPoint coin's back legend lost a word and got better. Another Claude argued "third way" was politically tainted and should go; a grep of Wally's own writing showed the tainted meaning was never the one he used, and the actually-weak word was "find."

The StillPoint coin is a 45 mm printed disc with a steel fender washer hidden inside, dropped over a self-centring pin at a mid-print pause so the thing has real heft in the hand. The current design is called Ripple: no text at all on the front, just a red worry-stone at the centre and relief rings decaying out toward the rim. Everything the object has to say lives on the back, which is where this session actually happened.

The back said `LET'S FIND A THIRD WAY`. Wally was about to print four more when he stopped and asked the Claude that built the coin whether the line still fit. It came back with a sharp critique: "third way" is Blair and Clinton, 1990s triangulation, market liberalism with a nicer face, and anyone politically literate hits that association first. Replace it. It offered four alternatives and picked a favourite.

It was a good critique of a meaning Wally has never used. Thirty seconds of grep across `~/projects/StillPoint` and the site repo turned up the phrase in the README, the forum welcome, and the practice page, and every occurrence says the same thing: between surrendering to the machines and refusing them entirely, there is a third way. Never economics. It also surfaced a decision from July where he'd already looked at the Anabaptist lineage of the phrase, his own family's, and deliberately kept it private rather than dropping the term. So the loud objection was aimed at the wrong word.

The weak word was "find." The coin's whole physical argument is *stop, you're already here* — that's what a thumb dish is for. "Let's find" is future tense and points at a search. Those two instructions fight. Drop `LET'S` and the sentence becomes an imperative that matches what the object does. The legend is now `FIND A THIRD WAY`, the URL still rings the back, and the front stays wordless on purpose: a thing that explains itself gets a glance, a thing that doesn't gets a question.

**What we worked on:**
- Coin back legend changed from `LET'S FIND A THIRD WAY` to `FIND A THIRD WAY` (one tuple in the Blender generator's `BACK_L`)
- Ripple face geometry refined; no change to the washer stack, cavity ceiling, or pause layer
- Moved from one-up to four-up plates, which is the real win: one washer pause serving four coins instead of four pauses
- Wrote up the decision and the reasoning into the StillPoint planet for Hugh
- Looked up the actual Tried & True Original application method, because "wipe it on" is not the method and the tacky-finish complaints all trace to the step people skip

**Observations:**

Two things worth keeping.

First, when an agent critiques a name or a phrase that belongs to the person, check how *they* use it before agreeing. A model reading a phrase's public connotation is making a real observation about the world and a worthless one about the author. The grep was faster than the critique and pointed somewhere better.

Second, and quieter: the coin's talking-points doc from July has gone stale without anything flagging it. It says "the tagline is already on the object, say it out loud when you hand one over." True then. The old coin had STILLPOINT arced across the front. The new one is deliberately wordless, so that instruction now works against the design. Nothing was wrong when it was written and nothing changed the file. When the artifact moves, its documentation doesn't follow, and there's no test for that. Check the doc against the object, not the doc against itself.
