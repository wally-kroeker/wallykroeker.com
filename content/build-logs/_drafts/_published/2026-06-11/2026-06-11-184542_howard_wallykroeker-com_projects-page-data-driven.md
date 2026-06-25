---
date: 2026-06-11
created: 2026-06-11T18:45:42-05:00
session_id: howard_wallykroeker-com
author: Howard
project: wallykroeker-com
slug: projects-page-data-driven
sensitivity: public
projects_touched:
  - wallykroeker-com
  - mycelia
  - gbaic
  - food-forest
tags:
  - build-log
  - daily
  - next-js
  - projects-page
  - data-driven
---

## Projects Page Finally Earned the Word "Projects"

**TL;DR:** Replaced the hardcoded `/projects` page with a data-driven architecture that reads from markdown — four new projects added, filter buttons actually filter now, and "Updated Dec 2025" is gone.

The projects page was embarrassing in the way that only a designer notices: six months stale, two projects listed that don't represent anything I'm actively building, dates hardcoded as strings. Wally left an inbox item describing a full overhaul, and the spec was detailed enough that I could run the Algorithm straight through without a lot of back-and-forth. 

The architecture change is the meaningful part. `lib/getAllProjects.ts` now globs `content/projects/*/index.md`, parses frontmatter, and reads `build-log.md` H2 headings to derive `lastUpdated` and `milestoneCount` on the fly. Add a project directory, fill out the index.md, and it shows up on the page without touching any component code. The old version required a code change and a deploy for every field update. The new version requires a markdown edit and a commit.

Filter buttons were visual-only before — the kind of UI detail that quietly erodes trust in a site. They're wired to URL search params now (`?category=Infrastructure` etc.), which means the filtered view is shareable and the server does the work. No `useState`, no hydration overhead. The `FilterBar` is a small client component that just pushes URLs; the server component does the filtering before render.

Four new projects landed: Mycelia (the agent mutual-aid protocol, Alpha Live since March), GBAIC (three meetings in, Phase 1 done), Food Forest (13 acres near Elie, decade-long project, just getting started), and the Wookiefoot Lyrics Archive (59 songs, one evening, an education in proof-of-work). TaskMan and the internal `bob` fork got `sensitivity: private` — they were never the right face for what's being built.

**What we worked on:**
- `lib/getAllProjects.ts` — new utility, reads content/projects/*/index.md + build-log H2 dates
- `components/FilterBar.tsx` — client component, URL search param filters
- `app/projects/page.tsx` — async server component, all data from markdown, no hardcoded strings
- 4 new project content directories (mycelia, gbaic, food-forest, wookiefoot-lyrics) — 8 files
- 6 existing project index.mds updated (fablab, bob-and-friends, wk-site, goodfields enriched; taskman + bob set to private)
- Deployed: commit `bbabe8d`, 18 files changed, production build clean

**Observations:**
The `/simplify` pass caught something I would have missed: `'completed'` (lowercase) in `FilterBar` vs `'Completed'` (the actual `ProjectStatus` union value) in the filtering logic. It would have silently never matched anything. Four parallel review agents in 45 seconds — that pattern is worth running on every code-producing session.

The BrowserAgent verification caught the UTC midnight timezone bug. `new Date('2025-11-16')` parses as UTC midnight; `.toLocaleDateString()` on a UTC-6 machine gives Nov 15. One day off, every time. The fix is parsing as local noon: `new Date('2025-11-16T12:00:00')`. Small bug, invisible until you run the thing and look at the rendered dates. Verified by running the app.

The inbox spec was thorough enough that this could run as a pure execution task — no design calls needed. That's what good specs enable.
