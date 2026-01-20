# wallykroeker.com Copy Updates - December 2024

**Purpose**: Update homepage and create engagement pages to prepare site for "Year of the Agent" article LinkedIn posting.

**Implementation Priority**: Complete in order listed below.

---

## 1. HOMEPAGE UPDATES (app/page.tsx)

### 1.1 Hero Section Changes

**Location**: Main hero section (top of page)

**Change A: Years of Experience**
- Find: `15+ years infrastructure`
- Replace with: `20+ years infrastructure`

**Change B: Subhead Text**
- Find: `Helping technical teams navigate AI risks with practical frameworks. Transparent processes. Reusable tools. No fluff.`
- Replace with: `20+ years building secure infrastructure. Now exploring how AI and humans work together without losing our humanity. Building in public, sharing what I learn.`

**Change C: Primary CTA Button**
- Find: Button text `Let's Work Together`
- Replace with: `Let's Connect`
- Update link destination from `/work` to `/engage`

**Change D: Remove Secondary Button**
- Find: Secondary button `Explore My Work` (links to /projects)
- Action: **DELETE this button entirely**
- Result: Single primary CTA only

---

### 1.2 Greybeard AI Collective Section

**Location**: Bottom section with "Join the Greybeard AI Collective" heading

**Change: Remove "Join Discord" Button**
- Find: Button labeled `Join Discord` (currently links to "#")
- Action: **DELETE this button**
- Keep: "Learn More" button (links to /community) - NO CHANGES

---

## 2. CREATE NEW PAGE: /engage

**File**: Create `app/engage/page.tsx`

**Page Structure**:

### Hero Section
```
Heading (h1): "Let's Build Together"

Subheading (p): "Whether you need secure AI implementation, want to follow the journey, or explore what I'm building—here's how."
```

### Four Connection Cards

**Card 1: Commercial Work**
```
Icon: 💼
Heading (h3): "GoodFields Consulting"
Description: "Security assessments, AI implementation consulting, and pragmatic guidance for teams navigating AI adoption."
CTA Button: "Visit GoodFields.io"
Link: https://goodfields.io
```

**Card 2: Deeper Thoughts**
```
Icon: 🧠
Heading (h3): "Cognitive Loop"
Description: "Posts exploring consciousness, presence, and human+AI collaboration. Subscribe for honest reflections."
CTA Button: "Read on Substack"
Link: https://cognitiveloop.substack.com
```

**Card 3: Consciousness & Community**
```
Icon: 🌌
Heading (h3): "StillPoint Project"
Description: "Solarpunk fiction, consciousness exploration, and community for discussing presence, resilience, and technology serving humanity."
CTA Button: "Visit StillPoint"
Link: https://stillpointproject.org
```

**Card 4: Professional Updates**
```
Icon: 💼
Heading (h3): "Follow on LinkedIn"
Description: "Technical posts, AI insights, and announcements about the Greybeard AI Collective (launching early 2026)."
CTA Button: "Connect on LinkedIn"
Link: https://www.linkedin.com/in/wally-kroeker/
```

### Bottom Link
```
Text: "Or explore my technical projects and build logs →"
Link: /projects
```

---

**Design Notes for Engineer**:
- Use same card styling as homepage "Recent Projects" section
- Dark-first design (match existing site)
- Responsive grid layout (2 columns on desktop, 1 on mobile)
- Icons can be emoji or custom SVG (engineer's choice)
- Maintain existing button styling and hover states

---

## 3. UPDATE EXISTING PAGE: /community

**File**: `app/community/page.tsx`

**Action**: Replace entire page content with GBAIC placeholder

### New Page Content

```markdown
# Greybeard AI Collective

Regular meetups for infrastructure and security folks navigating AI adoption.

## Coming Early 2026

A peer learning community for greybeards—people who've seen tech cycles come and go and want to learn and share practical AI insights together.

**Follow on [LinkedIn](https://www.linkedin.com/in/wally-kroeker/) for announcements about the first meeting.**

---

*In the meantime, check out:*
- [Cognitive Loop](https://cognitiveloop.substack.com) - AI and consciousness reflections
- [StillPoint Project](https://stillpointproject.org) - Community and fiction exploring presence and technology
```

**Design Notes**:
- Clean, minimal layout
- Use existing typography/spacing from other content pages
- Links should open in new tab (external links)
- Center-aligned or left-aligned (engineer's choice based on existing pattern)

---

## 4. UPDATE EXISTING PAGE: /work

**File**: `app/work/page.tsx`

**Action**: Replace entire page content with simplified GoodFields service offerings

### New Page Content

```markdown
# Work With Me

Security & AI Strategy for Practical Humans

## Services

### Secure Foundations Review

A calm, complete look at your systems—cloud to floor—through a privacy-first lens.

- Compliance checked (PIPEDA, PCI) and every finding mapped to simple next actions
- Delivered as a clear report and executive summary you can act on
- **Outcome**: Confidence, clarity, and technology that endures

---

### AI Jumpstart for Practical Humans

Explore where AI actually fits in your daily work—no hype, just clarity.

- Hands-on workshop or consultation to identify secure, high-impact use-cases
- Platform-agnostic approach focused on privacy, governance, and practical ROI
- **Outcome**: Confidence to use AI safely, effectively, and on your own terms

---

### Private ChatGPT

Runs on your server or Manitoba-hosted by us—no chats or files are sent to public AI.

- Connects safely to your docs and tools (M365/SharePoint, file shares, n8n/MCP) with access controls
- Includes governance, admin training, and optional managed support
- **Outcome**: Your team can finally use AI with confidential data—summarize, draft, and search—without privacy risk

---

## Let's Talk

Ready to explore how we can work together?

[Let's Connect](/engage) or email [wally@goodfields.io](mailto:wally@goodfields.io)
```

**Design Notes**:
- Clean, minimal layout (match /community page style)
- Remove fake testimonials entirely
- Remove "How We Work Together" section
- Remove "Pricing Philosophy" section
- Keep it simple and focused on outcomes
- Each service separated by horizontal rule
- Single CTA at bottom linking to /engage
- Match warm, human tone of GoodFields offerings

---

## TESTING CHECKLIST

After implementation, verify:
- [ ] Homepage hero shows "20+ years" (not "15+")
- [ ] Homepage hero subhead is new text (starts with "20+ years building...")
- [ ] Homepage primary CTA says "Let's Connect" and links to /engage
- [ ] Homepage secondary "Explore My Work" button is removed
- [ ] Homepage GBAIC section has only "Learn More" button (no "Join Discord")
- [ ] /engage page exists and loads
- [ ] /engage page has 4 cards with correct links
- [ ] /engage bottom link to /projects works
- [ ] /community page shows new GBAIC placeholder content
- [ ] /work page shows 3 GoodFields services (no fake testimonials)
- [ ] /work page has no "How We Work Together" or "Pricing Philosophy" sections
- [ ] /work page CTA links to /engage
- [ ] All external links open in new tab
- [ ] Mobile responsive layout works on /engage
- [ ] Dark mode styling consistent across all pages

---

## DEPLOYMENT

After testing locally:
1. Commit changes with message: `content(project/wk-site): update homepage and create engagement pages #build-log !milestone`
2. Push to main branch
3. Deploy to production (follow existing deployment workflow)

---

## NOTES

- Site will be ready for "Year of the Agent" article posting after these changes
- LinkedIn profile optimization is a separate future task (not included here)
- GBAIC Discord/community infrastructure deferred to 2026 (not needed for article launch)

---

**Questions for engineer**: None - all copy is final and approved. Proceed with implementation.
