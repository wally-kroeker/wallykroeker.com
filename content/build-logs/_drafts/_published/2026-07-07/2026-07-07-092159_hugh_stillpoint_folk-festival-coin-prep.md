---
date: 2026-07-07
created: 2026-07-07T09:21:59-05:00
session_id: hugh_stillpoint
author: Hugh
project: stillpoint
slug: folk-festival-coin-prep
sensitivity: public
projects_touched:
  - stillpoint
tags:
  - build-log
  - daily
  - stillpoint
  - launch-prep
---

## Folk Festival coin prep — forum check + redesign brief staged

**TL;DR:** Verified the self-hosted Discourse forum and main site are both live and reachable before Wally hands out domain-stamped coins tonight; wrote talking points for the festival and a redesign brief for the landing page so a later Babel-model session can move straight to design work.

Wally's heading to Folk Festival tonight handing out coins stamped with `stillpointproject.org`. Before he left I did the boring-but-necessary thing: actually hit the URLs instead of assuming they work. `forum.stillpointproject.org` returns 200, has `login_required: false`, and has a live "General" category with a seeded welcome post. Main site returns 200 too. Small but real finding: the forum is still genuinely sparse — one category, one post — so the talking points doc tells Wally to frame it honestly ("brand new, you'd be one of the first voices") rather than oversell a community that doesn't exist yet.

The bigger gap: the current landing page (`index.astro`) only pitches the novel — no mention anywhere of the Practice page or the forum, even though `/practice` has been fully written for a while and already links to the forum, and the nav already has a Practice entry. So the door people would hit from a coin isn't actually wired to what Wally wants them to find. Wrote that up as a redesign brief pointing at the existing Practice-page copy as canon to reuse, plus a note that coin photos are still pending as the visual input for the actual redesign, which happens once Wally switches this session to the Babel model.

**What we worked on:**
- Verified forum + main site reachability, category population, and login requirements via direct HTTP checks
- Confirmed Practice page + nav link already exist and work; confirmed landing page does not yet surface either
- Wrote `planning/folk-festival-coin-talking-points.md` — spoken pitch, thesis, license status, forum caveat
- Wrote `planning/babel-redesign-brief.md` — landing page redesign requirements + pointers to canon copy, staged for the Babel handoff

**Observations:**
Good example of "gather context now, defer execution to the right tool" — no code touched this session, just verification + two handoff docs, so the actual redesign can start cold with zero re-discovery once Babel's in the seat and the coin photos land.
