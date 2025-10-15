---
title: "Building the Publishing Loop: Git-First Content Pipeline"
date: "2025-10-15"
projects: ["publishing-loop"]
tags: ["Build Log", "AI-Assisted Development", "Next.js", "Architecture"]
description: "How we built a zero-friction publishing system with project hubs, timeline aggregation, and privacy gates—turning commits into transparent public updates."
status: "published"
reviewed: true
sensitivity: "public"
---

## The Problem

**Documentation was the bottleneck.** I was doing the engineering work—commits, features, fixes—but translating that into public updates required dedicated writing time I didn't have.

The goal: **turn everyday Git commits into transparent build logs** with minimal overhead. The work is already done; the system should just make it visible.

---

## The Vision

A **Git-first publishing loop** where:
- Daily commits across multiple projects become **daily overview posts**
- Notable commits marked with `!milestone` become **build log entries**
- Everything is **private by default** with explicit publishing gates
- Claude Code knows about the system from **any project directory**

**Single source of truth:** the wallykroeker.com repo. Other projects are read-only inputs for commit history.

---

## The Challenge

Another agent had drafted a spec, but when I reviewed it against the actual codebase, **7 critical misalignments** emerged:

1. **Frontmatter format mismatch** - One post used inline bold metadata instead of YAML
2. **Missing `/guides` route** - Spec referenced it, but it didn't exist
3. **Type system didn't support new fields** - `PostMeta` only had 4 fields
4. **No filtering logic** - Drafts would be immediately visible
5. **Unclear content structure** - Where do build logs go vs tutorials?
6. **Date parsing issues** - "Invalid Date" appearing on the blog
7. **No agent awareness** - Claude Code wouldn't know about system from other projects

These weren't small issues—they would have broken the site.

---

## Architecture Decisions

### Three Content Types

**1. Blog Posts** (`content/posts/*.md` → `/blog`)
- Time-based: daily overviews, announcements
- Can reference projects via `projects: ["slug"]` array
- Shows up in project timelines when referenced

**2. Standalone Guides** (`content/guides/*.md` → future `/guides/[slug]`)
- Tutorials, how-tos, deployment guides
- Not tied to projects (e.g., "Setting up Cloudflare Tunnel")

**3. Project Hubs** (`content/projects/<slug>/` → `/projects/<slug>`)
- `index.md` - Overview, status, links
- `build-log.md` - Living milestone log (H2 sections)
- **Timeline** aggregates posts + milestones automatically

### Timeline Aggregation

Project hubs show a **unified timeline** of:
- All blog posts where `projects` array includes the slug
- All H2 sections from the project's `build-log.md`
- Sorted by date descending
- Filtered by three-gate visibility rules

Implementation in `lib/projectUpdates.ts` - ~50 lines.

### Three-Gate Visibility System

Content only appears publicly when **ALL** are true:
```typescript
status === "published" &&
reviewed === true &&
sensitivity === "public"
```

**Why three gates?**
- `status`: Draft vs ready to publish
- `reviewed`: Manual quality check gate
- `sensitivity`: Public vs internal/client work

**Backward compatibility:** Existing content without these fields defaults to published/public.

---

## Implementation Journey

### Phase 1: Fix the Foundation (30 min)

**Problem:** Blog showed "Invalid Date" on one post.

**Root cause:** `building-wallykroeker-com.md` used inline bold metadata:
```markdown
**Date:** 2025-10-14
**Tags:** Build Log, AI
```

`gray-matter` returned empty frontmatter `{}`, so `meta.date` was `undefined`.

**Solution:** Convert to YAML frontmatter:
```yaml
---
title: "Building WallyKroeker.com"
date: "2025-10-14"
tags: ["Build Log", "AI"]
status: "published"
reviewed: true
sensitivity: "public"
---
```

Then extend `PostMeta` type from 4 fields to 12, adding:
- Publishing gates: `status`, `reviewed`, `sensitivity`
- Project references: `projects[]`, `project`
- Hub metadata: `type`, `stage`, `links{}`

Created `isPublic()` helper with safe defaults:
```typescript
export function isPublic(meta: PostMeta): boolean {
  const status = meta.status ?? 'published'
  const reviewed = meta.reviewed ?? true
  const sensitivity = meta.sensitivity ?? 'public'
  return status === 'published' && reviewed && sensitivity === 'public'
}
```

### Phase 2: Timeline Infrastructure (45 min)

**Goal:** Parse build log milestones and merge with blog posts.

**H2 Section Parser:**
Added `getGuideByPath()` to `lib/markdown.ts`:
- Uses `unist-util-visit` to walk markdown AST
- Extracts each H2 heading + its content nodes
- Renders each section to HTML separately
- Returns array of `{ heading, html }` objects

**Timeline Aggregator:**
Created `lib/projectUpdates.ts`:
```typescript
export async function getUpdatesByProject(slug: string) {
  // Get blog posts referencing this project
  const posts = await getAllPosts()
  const postItems = posts
    .filter(p => p.frontmatter.projects?.includes(slug) && isPublic(p.frontmatter))
    .map(p => ({ kind: 'post', date, title, slug, summary }))

  // Get build log milestones (H2 sections)
  const guide = await getGuideByPath(`projects/${slug}/build-log.md`)
  const milestoneItems = guide.h2Sections.map(sec => ({
    kind: 'milestone',
    date: parseDateFromHeading(sec.heading),
    title: sec.heading,
    htmlSnippet: sec.html
  }))

  // Merge and sort by date
  return [...postItems, ...milestoneItems].sort((a, b) => b.date - a.date)
}
```

Date parsing extracts `YYYY-MM-DD` from milestone headings like "2025-10-15 — Planning complete".

### Phase 3: Project Hub Route (30 min)

Created `app/projects/[slug]/page.tsx`:
- Reads `content/projects/<slug>/index.md` for overview
- Checks visibility gates before rendering
- Calls `getUpdatesByProject()` for timeline
- Renders with dark-themed timeline UI:
  - Vertical line with dots for each item
  - Blog posts show as links with summaries
  - Milestones render full HTML content
  - Date stamps in `YYYY-MM-DD` format

**Styling:** Tailwind with zinc palette, matches existing dark theme.

### Phase 4: Content & Testing (20 min)

Created sample project hub:
```
content/projects/publishing-loop/
  index.md       # Overview: what it is, why it matters
  build-log.md   # First milestone documenting this implementation
```

Created daily overview post:
```
content/posts/2025-10-15-overview.md
```
With `projects: ["publishing-loop"]` to link it to the timeline.

**Filtering test:**
Created draft post with:
```yaml
status: "draft"
reviewed: false
sensitivity: "internal"
```

Verified with `curl`:
- Blog listing: `grep -c "Test Draft"` → `0` ✅
- Project timeline: `grep -c "Test Draft"` → `0` ✅

**Success:** Drafts stay hidden until all three gates are flipped.

### Phase 5: Global Documentation (15 min)

**Problem:** Claude Code agents only read project-local `CLAUDE.md`. When working in other repos, they wouldn't know about the publishing system.

**Solution:** Two-level documentation:

**`~/.claude/CLAUDE.md` (global):**
- Content paths for all projects
- Commit conventions
- When to suggest documentation
- Points to project CLAUDE.md for schema details

**`wallykroeker.com/CLAUDE.md` (project):**
- Complete frontmatter schemas for all content types
- Visibility rules
- Timeline aggregation logic
- n8n integration notes

Now any Claude Code session, in any project directory, knows how to document work.

---

## Technical Highlights

### H2 Section Parsing

The tricky part: extracting each milestone (H2) with its content, without mixing sections.

Used `unist-util-visit` to walk the AST:
```typescript
let currentSection = null
visit(tree, (node) => {
  if (node.type === 'heading' && node.depth === 2) {
    if (currentSection) h2Sections.push(currentSection) // save previous
    currentSection = { heading: extractText(node), nodes: [] }
  } else if (currentSection) {
    currentSection.nodes.push(node) // collect content
  }
})
```

Then render each section independently:
```typescript
for (const sec of h2Sections) {
  const sectionTree = { type: 'root', children: sec.nodes }
  const html = await unified()
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeStringify)
    .process(sectionTree)
  sec.html = String(html)
}
```

Result: each milestone is self-contained with proper heading anchors.

### Backward Compatibility

Existing posts didn't have the new fields. Solution:
```typescript
const status = meta.status ?? 'published'
const reviewed = meta.reviewed ?? true
const sensitivity = meta.sensitivity ?? 'public'
```

Nullish coalescing ensures old content stays visible.

### TypeScript Safety

Extended `PostMeta` with **all optional** fields:
```typescript
export type PostMeta = {
  title: string
  date: string
  tags?: string[]
  description?: string
  status?: 'draft' | 'published'
  reviewed?: boolean
  sensitivity?: 'public' | 'internal' | 'client'
  projects?: string[]
  project?: string
  type?: 'project' | 'project-log' | 'post'
  stage?: string
  links?: { repo?: string; docs?: string; demo?: string }
}
```

TypeScript enforces schema at compile time; runtime filtering handles visibility.

---

## File Structure (What Changed)

```
lib/
  markdown.ts          # +50 lines (H2 parsing, getAllPosts, isPublic)
  projectUpdates.ts    # +55 lines (NEW - timeline aggregation)

app/
  projects/[slug]/
    page.tsx           # +160 lines (NEW - project hub route)
  blog/
    page.tsx           # +1 line (filter with isPublic)

content/
  projects/
    publishing-loop/
      index.md         # +15 lines (NEW - project overview)
      build-log.md     # +30 lines (NEW - first milestone)
  posts/
    2025-10-15-overview.md            # +50 lines (NEW - daily overview)
    building-wallykroeker-com.md      # frontmatter converted to YAML

~/.claude/CLAUDE.md    # +40 lines (global agent awareness)
CLAUDE.md              # +110 lines (schemas and rules)
```

**Total:** ~500 lines of new code + docs. **Time:** ~2 hours.

---

## What It Looks Like

### Blog Listing (`/blog`)
- Shows all published posts with valid dates ✅
- "Invalid Date" bug is gone ✅
- Drafts are hidden ✅

### Project Hub (`/projects/publishing-loop`)
- **Header:** Title, status pill ("active"), stage pill ("Implementation")
- **Overview:** Short description with links (repo, docs)
- **Timeline:** Vertical line with:
  - **2025-10-15** - Daily overview post (linked)
  - **2025-10-15** - "Planning complete" milestone (full content)

Timeline updates automatically as:
- New blog posts reference the project
- New milestones are appended to `build-log.md`

---

## Testing the System

Visit these URLs:
- **Blog:** http://localhost:3000/blog
- **This post:** http://localhost:3000/blog/publishing-loop-implementation
- **Project hub:** http://localhost:3000/projects/publishing-loop

The project hub timeline should now show **three items**:
1. This post (blog reference)
2. Daily overview post (blog reference)
3. Planning milestone (from build-log.md)

All from a single `projects: ["publishing-loop"]` field in this post's frontmatter.

---

## n8n Integration (Next Step)

The infrastructure is ready for automation. The n8n workflow should:

1. **Scan repos** for commits (configured list of local project paths)
2. **Parse commit messages:**
   ```
   feat(project/adhd-tasker): n8n flow #build-log !milestone
   ```
3. **Generate daily overview:**
   - Aggregate all commits from midnight to 23:00
   - Merge with EOD summary text
   - Write to `content/posts/YYYY-MM-DD-overview.md`
   - Add `projects: [...]` based on commit `project/<slug>` tags
4. **Append milestones:**
   - When `!milestone` detected + `project/<slug>` present
   - Append H2 section to `content/projects/<slug>/build-log.md`
5. **Always draft:**
   - Set `status: "draft"`, `reviewed: false`
   - User manually flips gates after review

**No automatic publishing.** The three-gate system ensures nothing goes live without explicit approval.

---

## Commit Convention (For n8n)

```
type(project/<slug>): subject #tags !milestone

Types: feat, fix, chore, docs, refactor, perf, test
Tags:  #build-log #how-to #postmortem #release #architecture #philosophy #ai
Flags: !milestone (triggers build-log append)
```

Examples:
```bash
feat(project/publishing-loop): add timeline aggregation #build-log #ai
docs(project/wk-site): CTA block and link targets #release !milestone
chore(project/adhd-tasker): normalize commit parsing #architecture
```

n8n extracts:
- `project/<slug>` → which project to reference/update
- `#tags` → tags array for post
- `!milestone` → append to build-log vs just mention in overview

---

## Key Takeaways

1. **Git is the source of truth.** Commits become content, not separate documentation.
2. **Three-gate visibility** gives fine-grained control without separate repos.
3. **Timeline aggregation** creates a single canonical view of each project.
4. **Type safety + runtime filtering** = compile-time errors + graceful degradation.
5. **Global agent awareness** means Claude Code knows the system from any project.
6. **Backward compatibility matters** - old content still works without migration.
7. **H2 sections as milestones** = zero-overhead structure (just markdown headings).

---

## What's Next

**Immediate:**
- Test this post appears in the timeline ✅
- Commit with milestone marker: `!milestone`
- Push to production and verify live

**Soon:**
- Configure n8n to scan repos and generate daily overviews
- Create `.publishing-config.json` with project repo paths
- Add secrets/PII scanner before publish (future)
- Cross-post to Cognitive Loop (future)

**Later:**
- Screenshot/asset capture and placement
- Vikunja integration for atomic project cards
- 15-minute nudge reminders for EOD summary

---

## Reflection

This system isn't just about automating content—it's about **making the work visible**.

Every commit, every milestone, every decision already exists in Git. The publishing loop just translates that into a format humans can read and share.

**The bottleneck was never the work. It was the documentation.**

Now the documentation happens automatically. The work *is* the content.

---

**Work with me:** Need help building AI-powered automation systems or Git-first publishing pipelines? Let's talk.
Connect on [LinkedIn](https://www.linkedin.com/in/wallykroeker/)
