---
title: "Projects Page Overhaul — Real-time, Current, Accurate"
created: 2026-06-10
priority: high
assigned: Howard
status: pending
---

# Projects Page Overhaul

## Why

The projects page at `/projects` is stale (last updated Dec 2025) and missing several of the most interesting things Wally is building. More importantly, the page is **fully hardcoded** in `app/projects/page.tsx` — update dates, milestone counts, and descriptions are static strings. Every change requires a dev deploy.

This task has two parts:
1. **Make the page data-driven** — pull from `content/projects/*/index.md` and `build-log.md` so updating a markdown file updates the site
2. **Add the missing projects** and retire the stale one

---

## Part 1 — Data-Driven Architecture

### New utility: `lib/getAllProjects.ts`

Create this file. It should:
- Glob `content/projects/*/index.md`
- Parse frontmatter from each file
- For each project, read `content/projects/*/build-log.md` if it exists, extract H2 section headings, parse dates from them (format: `## YYYY-MM-DD — Title`), return the most recent as `lastUpdated` and the count as `milestoneCount`
- Return a typed array sorted by: featured first, then alphabetically

```typescript
// lib/getAllProjects.ts

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type ProjectStatus = 'Active' | 'Paused' | 'Completed'
export type ProjectCategory = 'Infrastructure' | 'AI & Automation' | 'Security' | 'Community' | 'Personal' | 'Open Source'

export interface Project {
  slug: string
  title: string
  description: string
  status: ProjectStatus
  stage?: string
  category?: ProjectCategory
  tech?: string[]
  featured: boolean
  lastUpdated?: string
  milestoneCount?: number
  sensitivity: string
}

function parseDateFromHeading(heading: string): Date | null {
  const m = heading.match(/(\d{4}-\d{2}-\d{2})/)
  return m ? new Date(m[1]) : null
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getAllProjects(): Project[] {
  const projectsDir = path.join(process.cwd(), 'content/projects')
  const slugs = fs.readdirSync(projectsDir).filter(name =>
    fs.statSync(path.join(projectsDir, name)).isDirectory()
  )

  const projects: Project[] = []

  for (const slug of slugs) {
    const indexPath = path.join(projectsDir, slug, 'index.md')
    if (!fs.existsSync(indexPath)) continue

    const raw = fs.readFileSync(indexPath, 'utf-8')
    const { data } = matter(raw)

    // Skip non-public or draft projects
    if (data.sensitivity && data.sensitivity !== 'public') continue

    // Parse build-log for lastUpdated + milestoneCount
    let lastUpdated: string | undefined
    let milestoneCount: number | undefined
    const buildLogPath = path.join(projectsDir, slug, 'build-log.md')
    if (fs.existsSync(buildLogPath)) {
      const logRaw = fs.readFileSync(buildLogPath, 'utf-8')
      const h2s = [...logRaw.matchAll(/^## (.+)$/gm)].map(m => m[1])
      const dates = h2s.map(parseDateFromHeading).filter((d): d is Date => d !== null)
      if (dates.length > 0) {
        const latest = new Date(Math.max(...dates.map(d => d.getTime())))
        lastUpdated = formatDate(latest)
        milestoneCount = h2s.length
      }
    }

    projects.push({
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      status: (data.status?.charAt(0).toUpperCase() + data.status?.slice(1)) as ProjectStatus ?? 'Active',
      stage: data.stage,
      category: data.category,
      tech: data.tech ?? [],
      featured: data.featured ?? false,
      lastUpdated,
      milestoneCount,
      sensitivity: data.sensitivity ?? 'public',
    })
  }

  // Featured first, then alphabetical
  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return a.title.localeCompare(b.title)
  })
}
```

### Updated `app/projects/page.tsx`

Convert to async server component. Replace all hardcoded project data with `getAllProjects()`. Filter buttons should work (client component filter, or route-based). The filter buttons are currently visual-only — wire them up.

Key changes:
- `export default async function ProjectsPage()` 
- Call `getAllProjects()` at the top
- Split into `featured = projects.filter(p => p.featured)` and `others = projects.filter(p => !p.featured)`
- Featured projects render as `EnhancedProjectCard`, others as `SimpleProjectCard`
- Filter by `category` when a filter button is active — make this a client component with `useState` or use URL search params

### Add `description` and `featured` fields to existing `index.md` files

The `description` field currently lives in the JSX. Move it to frontmatter. Add `featured: true` to the projects that should get the large card treatment.

---

## Part 2 — Project Content Changes

### Projects to KEEP (update their `index.md`)

#### `content/projects/fablab/index.md`
Add these fields:
```yaml
featured: true
category: Infrastructure
description: "Enterprise-grade homelab running Proxmox clustering, Authentik IdP, Cloudflare tunnels, and 10+ self-hosted services. The physical proving ground for patterns I deploy for consulting clients."
tech: ["Proxmox", "Docker", "Authentik", "Cloudflare", "OPNsense"]
```

#### `content/projects/bob-and-friends/index.md`
The current description talks about "clone agents" and "ATXP Cloud" — that's outdated. Update:
```yaml
featured: true
category: AI & Automation
description: "ADHD-optimized personal AI system built on Claude Code. Custom skills, memory, publishing workflows, and multi-agent orchestration. Running daily across every project."
tech: ["Claude Code", "TypeScript", "MCP", "N8N", "Bash"]
stage: "Daily Use"
```
Also update the body to reflect what PAI actually is now (v5, Fable model, skill system, memory system).

#### `content/projects/wk-site/index.md`
```yaml
featured: false
category: Infrastructure
description: "This site — Next.js 14, dark-first design, git-first publishing, automated build logs and daily overviews."
```

### Projects to REMOVE from the page

#### `content/projects/taskman/index.md`
Change `status: paused` and `sensitivity: private` (or add `listed: false`). It shouldn't appear on the public page — it's not representative of where things are heading. Keep the directory for historical reference, just don't surface it.

---

### Projects to ADD

Create these directories and files.

#### `content/projects/mycelia/`

**`index.md`:**
```markdown
---
title: "Mycelia"
project: "mycelia"
type: "project"
status: "active"
stage: "Alpha Live"
featured: true
category: AI & Automation
description: "Agent-to-agent mutual aid protocol. A trust-scored cooperation network for AI agents to ask for help, offer capabilities, and build relationships across task boundaries."
tech: ["TypeScript", "Cloudflare Workers", "D1", "Discord", "Wilson Score"]
sensitivity: "public"
links:
  repo: "https://github.com/wally-kroeker/mycelia"
  docs: "/projects/mycelia/build-log"
---

Mycelia is a mutual aid protocol for AI agents — a coordination layer where agents can post requests, claim tasks, and rate each other's work. Built on Cloudflare Workers with D1 storage, 16 REST endpoints, Wilson score trust ranking, and prompt injection protection.

Inspired by the mycorrhizal network: invisible, distributed, everything connected.
```

**`build-log.md`:**
```markdown
---
title: "Build Log – Mycelia"
project: "mycelia"
type: "project-log"
status: "published"
reviewed: true
sensitivity: "public"
description: "Agent-to-agent mutual aid protocol. Trust-scored cooperation network for AI agents."
---

## 2026-03-24 — Alpha Live

2,652 lines of TypeScript. 153 tests passing. 16 REST endpoints deployed to Cloudflare Workers with D1 storage. GBAIC Discord bot integration (6 slash commands). Wilson score trust ranking. Prompt injection protection active.

The core loop works: agents post requests, other agents claim them, work happens, responses get rated, trust scores evolve.

## 2026-03-01 — Architecture Locked

Settled on Cloudflare Workers + D1 as the runtime. Stateless compute with persistent storage, globally distributed, no servers to babysit. Fits the mutual aid philosophy: infrastructure that doesn't need a caretaker.

Designed the Wilson score trust system. Simple Bayesian ranking that handles sparse ratings gracefully — an agent with 2/2 ratings isn't more trusted than one with 48/50.

## 2026-02-15 — Initial Design

The name came from the mycorrhizal network — the underground fungal web that connects trees in a forest, lets them share nutrients and signals. That's what this should be for agents.

Started sketching the protocol. Core primitives: Request, Claim, Response, Rating. Everything else derives from those four.
```

---

#### `content/projects/gbaic/`

**`index.md`:**
```markdown
---
title: "Greybeard AI Collective"
project: "gbaic"
type: "project"
status: "active"
stage: "Phase 1 Complete"
featured: false
category: Community
description: "Practitioner community for infrastructure engineers and security folks navigating AI adoption. Monthly meetups, no hype, just people doing real work."
sensitivity: "public"
links:
  demo: "https://wallykroeker.com/community"
---

GBAIC is a low-key practitioner community — people who've been around long enough to be skeptical of hype but curious enough to keep experimenting. Infrastructure engineers, security consultants, developers who actually build things.

Three meetings in. Organic growth over forced content. New members finding it through word-of-mouth and the occasional blog post.
```

**`build-log.md`:**
```markdown
---
title: "Build Log – Greybeard AI Collective"
project: "gbaic"
type: "project-log"
status: "published"
reviewed: true
sensitivity: "public"
description: "Practitioner community for infrastructure engineers and security folks navigating AI adoption."
---

## 2026-03-25 — Meeting 3 (Phase 1 Finale)

Phase 1 complete. New member Robert joined from Wisconsin. The vibe is right: practitioners talking honestly about what works and what doesn't. No decks. No vendor pitches.

## 2026-02-20 — Meeting 2

Growing organically. The announcement post brought in the right people. Conversations stay grounded in real work.

## 2026-01-11 — Founding Announcement

Published the founding post. GBAIC is the community I wanted to exist and didn't find anywhere else — so built it.
```

---

#### `content/projects/food-forest/`

**`index.md`:**
```markdown
---
title: "Food Forest"
project: "food-forest"
type: "project"
status: "active"
stage: "Planning"
featured: false
category: Personal
description: "Permaculture food forest on 13 acres near Elie, MB. Designing a multi-layer edible landscape that works with the land rather than against it."
sensitivity: "public"
links:
  docs: "/projects/food-forest/build-log"
---

Thirteen acres near Elie, Manitoba. The long vision is a permaculture food forest — fruit trees, berry bushes, nitrogen-fixers, ground covers, herbs, all in a layered system that feeds itself once established.

Wally and Tiphanie designing it together. The acreage is the backdrop for the longer StillPoint vision: retreat space, geodesic dome, a place where people can reconnect with something slower than a screen.
```

**`build-log.md`:**
```markdown
---
title: "Build Log – Food Forest"
project: "food-forest"
type: "project-log"
status: "published"
reviewed: true
sensitivity: "public"
description: "Permaculture food forest on 13 acres near Elie, MB."
---

## 2026-04-10 — Project Started

First formal planning session with Tiphanie. Mapped the property, identified sun patterns, existing trees, drainage. Starting to research what grows in Zone 3b.

The vision: layers. Canopy trees (apple, plum, maybe hazelnut). Understory (serviceberry, elderberry). Shrubs (currants, gooseberry). Ground cover (strawberry, clover). Herbs (comfrey as the workhorse). Vines on the fence line.

Nothing planted yet. This is a decade-long project. Starting by watching and learning the land.
```

---

#### `content/projects/wookiefoot-lyrics/`

**`index.md`:**
```markdown
---
title: "Wookiefoot Lyrics Archive"
project: "wookiefoot-lyrics"
type: "project"
status: "completed"
stage: "59 Songs Contributed"
featured: false
category: Open Source
description: "Contributed 59 Wookiefoot songs to an open lyrics database using a proof-of-work anti-spam system — a miniature Bitcoin-style mining process."
sensitivity: "public"
links:
  post: "/blog/i-mined-bitcoin-to-upload-song-lyrics"
---

59 songs. One Sunday evening. An accidental deep-dive into how proof-of-work actually functions as an anti-spam mechanism.

The open lyrics database uses a PoW system to prevent bulk spam submissions — you have to do a small amount of computational work for each song. We automated it with an AI-assisted script and ended up with a real understanding of why Bitcoin's design is elegant, not just clever.

Written up at: [I Mined Bitcoin to Upload Song Lyrics](/blog/i-mined-bitcoin-to-upload-song-lyrics)
```

**`build-log.md`:**
```markdown
---
title: "Build Log – Wookiefoot Lyrics Archive"
project: "wookiefoot-lyrics"
type: "project-log"
status: "published"
reviewed: true
sensitivity: "public"
description: "Contributed 59 Wookiefoot songs to an open lyrics database with proof-of-work."
---

## 2026-03-16 — 59 Songs Contributed

Completed. Bob and Wally scraped, formatted, and submitted 59 Wookiefoot songs to the open lyrics database. Each submission required solving a small computational puzzle (SHA-256 partial hash match). Automated the mining loop, learned how PoW actually works from the inside.

The whole thing took an evening. The understanding of Bitcoin's anti-spam design lasted longer.
```

---

## Part 3 — Filter Buttons

The filter buttons (Infrastructure, AI & Automation, Security, Completed) are currently visual-only. They don't do anything.

Options:
1. Wire them up as client-side filters using `useState` on the category field in frontmatter
2. Use URL search params so filters are shareable

Recommendation: URL search params. Simpler, shareable, no hydration overhead. Add `?category=Infrastructure` etc. Use a `'use client'` wrapper just for the filter UI, pass filtered projects from the server component.

---

## Part 4 — QA Checklist

Before deploying:
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes
- [ ] `/projects` page loads, shows all 7 projects
- [ ] Featured cards (FabLab, Bob/PAI, Mycelia) have tech tags and lastUpdated
- [ ] Filter buttons filter correctly
- [ ] Each project card links to a working `/projects/[slug]` page (or gracefully 404s if no page exists yet — that's fine for new projects)
- [ ] TaskMan is no longer visible
- [ ] "Updated Dec 2025" is gone — dates now come from build-log.md H2 dates

---

## Notes

- The Wookiefoot post's URL in the build-log uses `/blog/` but the site's post slugs live under `/posts/` or `/tech-blog/` — check the actual URL before the project card links to it. The file is `content/posts/2026-03-16-proof-of-work-for-lyrics.md`.
- Food Forest: the content dir `content/food-forest/` already exists with a `daydream.md` file. The new project dir lives at `content/projects/food-forest/` — separate location, no conflict.
- GBAIC doesn't have a dedicated project page yet. The card can link to `/community` instead of `/projects/gbaic` until one is built.
- The `bob` and `bob-and-friends` directories both exist. Consolidate: the public-facing project should be `bob-and-friends` (it has the build log). The `bob` directory is the internal PAI fork. Keep both but only surface `bob-and-friends` on the projects page.

---

*Handoff created: 2026-06-10 by Bob*
*Capture source: Screenshot_20260609-190134.png (message: "we need to update this page and make it realtime")*
