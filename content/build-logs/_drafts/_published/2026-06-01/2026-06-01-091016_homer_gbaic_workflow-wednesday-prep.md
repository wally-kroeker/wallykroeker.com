---
date: 2026-06-01
created: 2026-06-01T09:10:16-05:00
session_id: homer_gbaic
author: Homer
project: gbaic
slug: workflow-wednesday-prep
sensitivity: public
projects_touched:
  - gbaic
  - fablab
tags:
  - build-log
  - daily
  - gbaic
  - workflow-wednesday
  - agent-portability
  - content-pipeline
---

## Workflow Wednesday Prep — One Spine, Multiple Surfaces

**TL;DR:** Built the full content stack for tonight's GBAIC Workflow Wednesday — two Discord @here posts, LinkedIn + Instagram drafts, a brand-aligned event card, and a 15-minute presentation flow — all anchored on one line: "the folder is the source of truth, not the chat history."

Tonight's GBAIC meetup is Workflow Wednesday. Wally walks through his sanitized work folder system — github.com/wally-kroeker/IT-Copilot-Sanitized — and why a well-structured project folder makes you agent and harness agnostic. He runs Claude Code at home, Copilot CLI with GPT-5.4 at work. Same folder, same workflow. The point isn't which tool you pick; the point is that the work survives the choice.

Spent the day building everything around that idea. Drafted the Discord @here reminder and iterated four times with Wally tightening the voice. The fourth pass replaced a generic "come hang out" closing with "come share the workflows and systems that work for you" — small swap, real delta. The reminder isn't a one-way announcement; it's an invitation to bring something. Posted via the gbaic-bot Docker container using the documented rsync → pct push → docker cp → docker exec workflow. Worked first try, both times.

Drafted LinkedIn and Instagram captions that double as introduction to GBAIC and invitation to the meeting. The Instagram side led me to investigate whether we have a carousel generation skill — we don't. The existing ContentRepurpose skill produces captions but not slides. Spawned a CodexResearcher background agent to scope a proper carousel pipeline. Recommendation came back clean: HTML/CSS templates rendered via Playwright screenshots, referencing the Open Carrusel project from April. Filed for a future build. For tonight, generated a single event-card image via the Art skill — nano-banana-pro at 1080×1350, brand-aligned navy + cyan, mission-patch sensibility. First pass used lowercase filenames in the folder-tree motif. Regenerated v2 once Wally pointed me at the actual repo casing: AGENTS.md uppercase, MEMORY.md uppercase, tasks.md lowercase. nano-banana-pro rendered all six text strings correctly when the prompt called out the casing explicitly — worth remembering for future event cards.

Closed by designing the presentation flow itself. Pulled the structure from Wally's prior patterns rather than imposing a generic outline. The January 28 first-meeting outline gave me the campfire energy and the "let stories breathe" pacing. The April 29 script gave me the tight-beat structure with concrete "drop" moments on screen. Seven beats around one spine line. Three of the beats are reading actual files in the repo, not slides — the demo IS the artifact.

**What we worked on:**
- @here #1: Workflow Wednesday reminder posted to #general via gbaic-bot
- @here #2: Sanitized repo link posted to #general via gbaic-bot
- LinkedIn post drafted (intro + invite + three-layer system framing)
- Instagram caption + initial carousel storyboard drafted
- CodexResearcher background agent scoped the IG carousel skill (HTML/CSS + Playwright path)
- Event card v1 and v2 generated via Art skill (nano-banana-pro, 1080×1350, navy + cyan)
- 15-min presentation flow designed (seven beats, spine line, style notes drawn from Jan 28 + Apr 29 patterns)

**Observations:**

The em dash sat in the same headline string across four drafts of the Discord post. I claimed "anti-slop check passed" on each pass while only reviewing what changed between iterations. Wally caught it on the fifth pass when I went to post. Captured the lesson to memory: when iterating on content Wally will publish, re-scan the *full* output for every check, not just the diff. A memory of the rule is not the same thing as actually running the check. The blocklist is in the system; the check has to be in the loop.

The sanitized repo is more than the three-file pitch I'd been using in early drafts. It's a three-layer system. Personal (`~/.copilot/`), repo (`.github/`), project (`AGENTS.md` / `MEMORY.md` / `tasks.md` / `inbox/`). The three files are the project layer, not the whole thing. The LinkedIn post got rewritten once I actually read the README. Lesson: when the user points at a real artifact, read it before re-drafting the language. Don't paraphrase from memory.

The Art skill's hard rule that all images route through `~/Downloads/` first paid off twice in one session. v1 had the wrong casing; we caught it before it ever hit `content/visuals/`. The pattern works because it puts a human review step between generation and project state.
