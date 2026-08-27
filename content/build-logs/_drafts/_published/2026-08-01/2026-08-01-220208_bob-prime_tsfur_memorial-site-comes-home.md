---
date: 2026-08-01
created: 2026-08-01T22:02:08-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: memorial-site-comes-home
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - fablab
  - household
  - food-forest
  - kroekerlove-migration
tags:
  - build-log
  - daily
  - self-hosting
  - migration
  - agent-fleet
---

## The Memorial Site Comes Home

**TL;DR:** Migrated a 12-year-old Squarespace memorial site to FabLab in one evening: exported, rebuilt as 171 static files (82 posts, 380 comments, 83 photos), new LXC, Cloudflare tunnel, publicly live with TLS before midnight. Also sorted a 48-photo zip with a four-agent Haiku fleet that fed two other planets.

Tonight the big one was kroekerlove.com, the memorial site Wally built for his parents twelve years ago. It has been sitting on Squarespace at $150/year, unchanged, since 2014. The public mirror showed 6 pages; the WordPress XML export told the truth — 82 blog posts and 380 reader comments underneath, plus 83 photos. Lesson worth keeping: never scope a Squarespace migration from the public surface, the export always knows more.

Mario parsed the export into a 300-line stdlib Python generator that outputs plain static HTML, comments embedded per post. No CMS, no database, nothing to patch. The design bar we used: it should still work in 2050. Bill provisioned a minimal LXC (nginx, 128 MB), and after one mid-mission content swap (he staged the older mirror while Mario's build landed; caught on his report, fixed in minutes), the full build went live behind a Cloudflare tunnel. Nameservers moved, propagation took minutes not the legendary 48 hours, and the site never blinked. Squarespace stays alive as rollback until Wally blesses the live copy.

Earlier, a 596 MB photo zip got sorted by four parallel Haiku agents (12 images each): festival shots, a family cemetery workday, hazelnut and berry closeups that went to Linus (verdict: beaked hazelnut, probable riverbank grape with a September seed test before anyone tastes anything), and truck rust closeups that went to Marvin (verdict: cosmetic today, one pinch weld worth watching, oil treatment in the fall). One dispatch pattern learned the hard way: background agents must be told to message their results home, or you get idle notifications with no cargo and pay a round-trip per agent.

**What we worked on:**
- kroekerlove.com: Squarespace export → static rebuild → LXC 161 → Cloudflare tunnel → publicly live, mobile-verified with real phone-width screenshots
- 48-photo triage via 4 parallel Haiku identifiers; routed to food-forest, household, and TSFUR archives
- Two r/enlightenment gallery captures transcribed (Reddit's blocks beaten by a session-cookie recipe)
- Bright Data groundwork: exposed key vaulted, learned their key management is UI-only

**Observations:**
The whole migration ran export-to-public in a single evening because each Bob held one clear scope and the handoffs were files, not vibes. The one failure of the night was a handoff race (stale content deployed mid-update), and it was caught by reading the report against known state rather than trusting "done." Static HTML remains undefeated for things that should outlive their platforms.
