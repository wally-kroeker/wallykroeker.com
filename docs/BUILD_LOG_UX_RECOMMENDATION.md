# Build Log Site Architecture Recommendation

**Status:** Design Recommendation
**Author:** Howard (The Designer)
**Date:** January 19, 2026
**For:** Wally Kroeker + Bob

---

## User Need

You want a space for daily work journals written from Bob's AI perspective - informal, frequent updates showing the real collaboration between you and Bob. This is fundamentally different from polished blog posts which are occasional, curated, and structured for broader audiences.

The key question: How do we make this discoverable and engaging without cluttering the existing site structure?

---

## Solution Overview

**Create a dedicated `/build-log` section** - separate from the Tech Blog, with its own navigation entry, timeline-focused presentation, and optional dedicated RSS feed.

### Why Separate From Blog?

1. **Different content cadence** - Daily vs occasional
2. **Different voice** - Lab notebook vs polished article
3. **Different reader expectations** - "What happened today" vs "deep dive on topic X"
4. **Archive patterns** - Calendar/timeline vs tags/categories
5. **Discovery patterns** - Chronological scrolling vs topic search

Mixing them would confuse readers about what to expect when clicking "Blog."

---

## Proposed Site Structure

### URL Scheme

```
/build-log/                    # Index page - timeline view
/build-log/2026-01-19         # Individual day entry
/build-log/archive            # Calendar/month view (Phase 2)
/build-log/rss.xml            # Dedicated RSS feed
```

**Why `/build-log/` instead of `/logs/`?**
- More descriptive - tells users what they'll find
- Matches terminology in BOB_BLOG_AUTHORSHIP.md
- `/logs/` could be confused with server/system logs
- Aligns with "building in public" positioning already on the site

### Content Directory

```
content/
  posts/           # Existing - polished blog posts
  build-log/       # NEW - daily entries
    2026-01-19.md
    2026-01-20.md
    ...
```

### Navigation Changes

**Current Header:**
```
Projects | Cognitive Loop | Tech Blog | Community | Work With Me
```

**Recommended Header:**
```
Projects | Build Log | Tech Blog | Cognitive Loop | Community | Work With Me
```

**Why this order?**
- Build Log placed next to Projects (they're related - building in public)
- Tech Blog follows (polished writing about technical topics)
- Cognitive Loop (personal/reflective writing) groups with Community
- Creates a natural flow: What I'm building -> How I'm building -> What I'm thinking -> Join the conversation

**Alternative:** If navigation feels crowded, consider a dropdown:
```
Projects | Writing [dropdown: Build Log, Tech Blog, Cognitive Loop] | Community | Work With Me
```

---

## User Experience Flow

### Primary Discovery Paths

**Path 1: Navigation Click**
1. User sees "Build Log" in nav
2. Lands on `/build-log/` timeline page
3. Scrolls through recent entries
4. Clicks into specific day for detail

**Path 2: From Projects Page**
1. User views Bob/PAI project page
2. Sees "Daily Build Log" link in project details
3. Gets context: "See what we're building day-to-day"

**Path 3: Homepage Card**
Add a card to the "Where I'm Building" section:

```
[Build Log Icon]
Bob's Build Log
Daily journal from my AI collaborator. What we're building,
what we're learning, honest observations from the other side.
```

**Path 4: RSS Subscription**
1. User subscribes to `/build-log/rss.xml`
2. Gets daily updates in their reader
3. Can choose to follow just build log, just blog, or both

---

## Timeline/Archive View

### Build Log Index Page (`/build-log/`)

**Layout Recommendation:**

```
[Header]

BOB'S BUILD LOG

A daily work journal from my AI perspective. What Wally and I
build together, what I observe, what I learn. No curation,
just the real work.

[Subscribe to RSS]

---

JANUARY 2026

  [Jan 19] Working on build log site architecture with Howard.
           UX recommendations, navigation changes...

  [Jan 18] Tetris game deployment. Added high score system...

  [Jan 17] Speed Reader development. Multi-agent coordination...

---

DECEMBER 2025

  [Dec 26] Year of the Agent post editing...

```

**Key UX Elements:**
- Month-grouped entries (most recent first)
- Preview text (first 1-2 sentences)
- Clean date formatting
- Quick visual scan ability
- RSS subscribe prominent
- "What is this?" context at top

### Calendar Archive View (Phase 2)

For `/build-log/archive`:
- Visual calendar grid
- Dots on days with entries
- Click to navigate
- Useful for "what were we doing last Tuesday?"

---

## RSS Feed Strategy

**Recommendation: Separate Feeds**

| Feed | URL | Content |
|------|-----|---------|
| Build Log | `/build-log/rss.xml` | Daily entries only |
| Tech Blog | `/blog/rss.xml` | Polished posts only |
| Everything | `/rss.xml` | Combined feed |

**Why separate feeds?**
- Build Log is daily - some readers want this
- Some readers only want occasional polished posts
- Combined option for completists
- Respects reader preferences

---

## Hugo/Next.js Implementation

### New Files Needed

```
app/
  build-log/
    page.tsx              # Timeline index
    [date]/
      page.tsx            # Individual entry page
    rss.xml/
      route.ts            # RSS feed generation
```

### lib/markdown.ts Updates

Add new content type handling:

```typescript
// Add to existing types
type BuildLogMeta = {
  title: string        // "Build Log - January 19, 2026"
  date: string         // "2026-01-19"
  author: string       // "Bob"
  type: "build-log"
  sessions?: string[]  // ["Morning", "Afternoon"]
}

// Add directory
const buildLogDir = path.join(process.cwd(), 'content', 'build-log')

// Add functions
export async function getAllBuildLogs() {...}
export async function getBuildLogByDate(date: string) {...}
```

### Front Matter Schema

```yaml
---
title: "Build Log - January 19, 2026"
date: 2026-01-19
author: "Bob"
type: "build-log"
status: "published"
sessions:
  - morning
  - afternoon
tags:
  - ux-design
  - site-architecture
---
```

---

## Integration With Existing Blog

### Cross-Referencing

Build logs can link to related blog posts:
```markdown
## Afternoon Session
Finished the speed reader. Full write-up: [Bob and Friends Build a Speed Reader](/blog/2026-01-17-bob-and-friends-build-a-speed-reader)
```

Blog posts can reference build logs:
```markdown
*Want to see the day-by-day progress? Check the [build logs from that week](/build-log/2026-01-15).*
```

### Visual Differentiation

| Aspect | Tech Blog | Build Log |
|--------|-----------|-----------|
| Card style | Full card with description | Compact date + preview |
| Layout | Article format | Timeline/journal format |
| Author display | "Wally Kroeker" | "Bob" with distinct styling |
| Tone indicator | Professional | Informal/notebook feel |

---

## Accessibility Considerations

1. **Clear labeling** - "Build Log" is descriptive (vs "Logs")
2. **Date formatting** - Use both visual format and accessible date-time elements
3. **Skip navigation** - Allow keyboard users to jump to content
4. **RSS alternative** - For users who prefer feed readers to web browsing
5. **Color contrast** - Maintain WCAG compliance in timeline styling

---

## Phased Implementation

### Phase 1: Foundation (Recommended Starting Point)

- [ ] Create `/content/build-log/` directory
- [ ] Add Build Log to navigation header
- [ ] Create basic timeline index page
- [ ] Create individual entry page template
- [ ] Update lib/markdown.ts with build log support
- [ ] Test with 2-3 sample entries

### Phase 2: Discovery & Polish

- [ ] Add Build Log card to homepage "Where I'm Building"
- [ ] Add RSS feed for build log
- [ ] Create cross-linking from Bob/PAI project page
- [ ] Implement month grouping on index

### Phase 3: Archive & Features

- [ ] Calendar archive view
- [ ] Tag filtering on build log index
- [ ] "Related entries" suggestions
- [ ] Weekly summary auto-generation

---

## Example Entry Layout

```
/build-log/2026-01-19

[Back to Build Log]

BUILD LOG - JANUARY 19, 2026
Written by Bob

---

## Morning Session (9:30 AM)

Wally wanted to design a blog system where I write from my perspective...

[Content continues]

---

## Afternoon Session (2:00 PM)

[Content continues]

---

*This is Bob's daily work journal. Client work is redacted for
privacy. Personal projects and PAI development fully detailed.*

[Previous Day: Jan 18] [Next Day: Jan 20]
```

---

## Summary

| Recommendation | Rationale |
|----------------|-----------|
| Separate section `/build-log/` | Different content type deserves own space |
| Add to main nav | Primary discovery mechanism |
| Timeline-focused layout | Matches daily journal mental model |
| Separate RSS feed | Respect reader preferences |
| Cross-link with blog | Connect related content naturally |
| Phase implementation | Start simple, add features based on use |

---

## Next Steps

1. **Wally reviews this recommendation** - Any concerns about navigation changes?
2. **Confirm URL structure** - `/build-log/` vs alternatives?
3. **Assign implementation** - Mario for code, Bob for first entries?
4. **Create design mockups** - If visual guidance needed before coding

---

*Document prepared by Howard (The Designer). Questions about user experience, accessibility, or information architecture welcome.*
