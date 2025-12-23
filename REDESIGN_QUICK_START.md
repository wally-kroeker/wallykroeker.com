# Homepage Redesign: Quick Start Guide

**TL;DR**: Add professional headshot to hero section, clarify headline about AI security, improve CTA hierarchy. This guide helps you decide and implement quickly.

---

## 5-Minute Decision Guide

### What's the Problem?
Current wallykroeker.com homepage:
- ❌ No face/identity (text-only, feels corporate)
- ❌ Headline doesn't signal "AI security consultant" expertise
- ❌ All CTAs equal weight (confuses visitor intent)
- ❌ Missing "who is this person?" answer above fold
- ✓ But: Clean design, clear values, actually well-written

### Why Care?
- Professional headshots build immediate trust (psychology studies show 90%+ of first impressions are visual)
- Clearer positioning = more qualified consulting leads
- Better CTA hierarchy = better conversion (people know what to do next)
- Humanizes the brand (Wally isn't a faceless corporation)

### What Should I Do?
**Pick one:**

**Option 1: Quick Win (3-4 hours)** ← RECOMMENDED
Add headshot below existing hero using card design (Option B)
- No disruption to current layout
- Easy to test/measure impact
- Can upgrade to split-hero later if successful
- File: `HOMEPAGE_DESIGN_SPECS.md` → "Option B Implementation"

**Option 2: Medium Effort (8-10 hours)**
Redesign hero with split layout (headshot on right, text on left)
- Maximum visual impact
- Modern, contemporary look
- Requires layout restructuring
- File: `HOMEPAGE_DESIGN_SPECS.md` → "Option A Implementation"

**Option 3: Comprehensive (2-3 weeks)**
Full brand refresh with multiple pages
- New /about page with full bio
- Consulting services page
- Testimonials/case studies section
- Professional brand update
- File: `HOMEPAGE_REDESIGN_RESEARCH.md` → "Implementation Roadmap"

---

## Pre-Flight Checklist

Before starting implementation:

- [ ] **Headshot secured** - Do you have a professional photo?
  - If no: [Schedule headshot session with photographer](https://www.google.com/search?q=professional+headshot+photographer+near+me)
  - Timeline: 1-2 weeks
  - Cost: $150-500 depending on area
  - If yes: Continue below

- [ ] **Photo optimized** - Is it compressed and ready for web?
  - Required: 2000×2600px or larger (original)
  - Target: 1200×1560px WebP or 1200×1560px JPG
  - Using: Use [Squoosh](https://squoosh.app/) (free, in-browser)
  - If optimized: Continue below

- [ ] **Headline decided** - Which headline resonates?
  - Option A: "AI Security Strategies for Technical Teams"
  - Option B: "I build secure, open AI systems" (recommended blend)
  - Option C: "Your AI Systems Need Security That Actually Works"
  - File: `HOMEPAGE_DESIGN_SPECS.md` → "Headline Optimization Workbook"

- [ ] **CTA messaging chosen** - What's your primary ask?
  - Option A: "Let's Work Together" (recommended for consulting)
  - Option B: "Schedule a Consultation"
  - Option C: "Hire Me for Your Project"
  - File: `HOMEPAGE_DESIGN_SPECS.md` → "CTA Strategy Deep Dive"

---

## Implementation Path: Option 1 (Quick Win)

**Time: 2-4 hours | Difficulty: Low | Risk: Very Low**

### Step 1: Prepare Your Headshot (15 minutes)

1. Get your professional headshot file
2. Open [Squoosh.app](https://squoosh.app/) in browser
3. Upload your image
4. Target settings:
   - Width: 1200px
   - Format: WebP or JPG
   - Quality: 80-85 (good quality/size balance)
5. Download optimized version
6. Create `/home/walub/projects/wallykroeker.com/public/images/` directory
7. Save as `headshot.jpg`

### Step 2: Update Homepage Headline (10 minutes)

File: `/home/walub/projects/wallykroeker.com/app/page.tsx`

Current (lines 11-13):
```tsx
<h1 className="text-4xl md:text-5xl font-semibold leading-tight">
  I build open, useful systems so more people can thrive.
</h1>
```

Change to:
```tsx
<h1 className="text-4xl md:text-5xl font-semibold leading-tight">
  I build secure, open AI systems
</h1>
```

Current subheading (lines 14-16):
```tsx
<p className="mt-4 text-zinc-300 max-w-2xl">
  Proof‑of‑work over promises. Transparent build logs, field guides, and minimal tools you can reuse today. No trackers. No fluff.
</p>
```

Change to:
```tsx
<p className="mt-4 text-zinc-300 max-w-2xl">
  Helping technical teams navigate AI risks with practical frameworks.
  Transparent processes. Reusable tools. No fluff.
</p>
```

### Step 3: Improve CTAs (10 minutes)

Current (lines 17-21):
```tsx
<div className="mt-6 flex flex-wrap gap-3">
  <a href="#projects" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Explore Projects</a>
  <a href="/loop" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Read Cognitive Loop</a>
  <a href="/community" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Join the Community</a>
</div>
```

Change to:
```tsx
<div className="mt-6 flex flex-wrap gap-3">
  <a href="/work" className="rounded-2xl bg-white text-zinc-950 px-4 py-2 text-sm font-semibold hover:bg-zinc-100">
    Let's Work Together
  </a>
  <a href="/projects" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">
    Explore My Work
  </a>
  <a href="/loop" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">
    Read Cognitive Loop
  </a>
</div>
```

**Key changes:**
- First CTA now "Let's Work Together" → /work (primary, with solid white background)
- Second CTA "Explore My Work" → /projects (secondary, outlined)
- Third CTA preserved as "Read Cognitive Loop" (for values-aligned readers)

### Step 4: Add Headshot Card Below Hero (30 minutes)

Add this code after the closing `</section>` of the first hero section (after line 37), before the `<section id="projects">` section:

```tsx
{/* Introduction section with headshot */}
<section className="border-t border-zinc-900">
  <Container>
    <div className="py-12 flex justify-center">
      <div className="rounded-2xl border-2 border-zinc-700 overflow-hidden
                      shadow-xl hover:border-zinc-600 transition
                      max-w-sm">
        <Image
          src="/images/headshot.jpg"
          alt="Wally Kroeker, AI Security Consultant"
          width={400}
          height={520}
          priority={false}
          className="w-full h-auto"
        />
        <div className="p-6 text-center bg-zinc-900 border-t border-zinc-800">
          <h2 className="font-semibold text-lg text-zinc-100">
            Wally Kroeker
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            AI Security Consultant & Technical Writer
          </p>
          <a
            href="/about"
            className="mt-4 inline-block text-sm text-zinc-300
                       hover:text-white underline"
          >
            More about me →
          </a>
        </div>
      </div>
    </div>
  </Container>
</section>
```

**Important: Add Image import at top of file**

Current imports (lines 1-2):
```tsx
import { projects } from '@/data/projects'
import Container from '@/components/Container'
```

Change to:
```tsx
import Image from 'next/image'
import { projects } from '@/data/projects'
import Container from '@/components/Container'
```

### Step 5: Test Locally (30 minutes)

```bash
cd /home/walub/projects/wallykroeker.com

# Start development server
pnpm dev

# Visit http://localhost:3000 and check:
✓ Image loads properly
✓ No broken image errors
✓ Responsive on mobile (check with DevTools)
✓ Links work
✓ Styling looks correct
```

### Step 6: Commit and Deploy (20 minutes)

```bash
cd /home/walub/projects/wallykroeker.com

# Check what changed
git status

# Add changes
git add .

# Commit
git commit -m "feat: add headshot, clarify AI security positioning, improve CTA hierarchy"

# Push
git push origin main

# Deploy (follow your deployment process)
```

---

## Implementation Path: Option 2 (Split Hero)

**Time: 6-10 hours | Difficulty: Medium | Risk: Low**

See `HOMEPAGE_DESIGN_SPECS.md` → "Option A Implementation" for complete code example.

### High-Level Steps:
1. Restructure hero grid from 7/5 split to 6/6 split
2. Move text content to left (6 cols)
3. Add headshot to right (6 cols)
4. Move Compass card to separate section below
5. Update headline with values + security focus
6. Test responsive behavior (images stack on mobile)

---

## Common Issues & Solutions

### Problem: "Image doesn't show up"
**Solution:**
- Check file path: `/public/images/headshot.jpg` ✓
- Check filename spelling (case-sensitive on Linux)
- Clear .next build: `rm -rf .next && pnpm dev`
- Check Image component has proper width/height props

### Problem: "White space around image"
**Solution:**
- Remove padding from image container
- Use `overflow-hidden` in border div (you already have this)
- Check image has correct aspect ratio

### Problem: "Button styling looks wrong"
**Solution:**
- For primary button: Add `bg-white text-zinc-950 font-semibold`
- For secondary button: Use `border border-zinc-700 hover:bg-zinc-900`
- Test contrast: White text on white button should be black text

### Problem: "Mobile layout broken"
**Solution:**
- Check grid uses `grid-cols-1 md:grid-cols-...` pattern
- Ensure `overflow-hidden` on image containers
- Test with real device or Chrome DevTools mobile mode

### Problem: "/work or /consult page doesn't exist"
**Solution:**
- If page doesn't exist, create it first: `app/work/page.tsx`
- Or link to existing page: `/projects` or `/about`
- Or create placeholder: minimal page with CTA to email/contact form

---

## Measuring Success

After implementing, track these metrics for 2-4 weeks:

```
Metric                          Target          How to Measure
───────────────────────────────────────────────────────────────
Time on Page                    +10-15%         Analytics/GA
Scroll Depth                    +20%+           Analytics/GA
CTA Click Rate (Let's Work)     New baseline    Analytics/GA
Click-through to /work          New baseline    Analytics/GA
Bounce Rate                     -5-10%          Analytics/GA

Qualitative:
Ask new visitors: "What does Wally do?"
Should hear "AI security consultant" quickly
```

---

## Content Decisions Before Launch

These optional but recommended:

### 1. Create /work Page
Simple page with:
- Who should work with you (your ideal client)
- What you offer (services/focus areas)
- How to get started (contact form or Calendly)
- Case study or testimonial (optional)

### 2. Create /about Page
Extended biography with:
- Professional headshot (can be same as hero)
- Background and experience
- Why you care about AI security
- Skills and expertise areas
- How to connect (social links)

### 3. Testimonials/Case Studies
Add 2-3 results from past projects:
- Client quote about impact
- Specific outcome (e.g., "Fixed 15 security issues")
- Anonymous or named (client permitting)

---

## Alternative: If No Headshot Yet

If you don't have a professional headshot:

### Option A: Placeholder Approach
```tsx
{/* Use placeholder while waiting for photo */}
<div className="rounded-2xl border-2 border-zinc-700 overflow-hidden
                shadow-xl bg-gradient-to-br from-zinc-800 to-zinc-900
                max-w-sm h-96 flex items-center justify-center">
  <p className="text-zinc-400">Headshot coming soon...</p>
</div>
```

### Option B: Minimal Approach
Skip headshot for now, improve headline and CTAs only.
Can add headshot later when available.

### Option C: Get Headshot Fast
- Virtual headshot (Headshot AI, BeFocused, etc.): 1-2 hours, $30-100
- Professional photographer: 1-2 weeks, $200-500
- Company headshot: Check if your company has professional photos available

---

## Next Steps Checklist

- [ ] Read `HOMEPAGE_REDESIGN_RESEARCH.md` (40 min) to understand context
- [ ] Read `HOMEPAGE_DESIGN_SPECS.md` (30 min) for detailed specifications
- [ ] Make decision: Quick Win (Option 1) vs Medium Effort (Option 2)
- [ ] Gather/optimize headshot image
- [ ] Choose headline wording
- [ ] Choose CTA messaging
- [ ] Implement chosen option (2-10 hours depending on path)
- [ ] Test locally and on production
- [ ] Gather feedback from trusted colleague
- [ ] Launch and measure results

---

## Questions to Answer Before Starting

1. **Headshot available?**
   - Yes: Proceed with optimization
   - No: Get one (AI service = fast, professional = better quality)

2. **AI security positioning important?**
   - Yes: Update headline to mention security explicitly
   - No: Keep existing headline, just add headshot

3. **Converting consulting clients?**
   - Yes: Make "Let's Work Together" primary CTA
   - No: Keep "Explore Projects" as primary, add consult CTA secondary

4. **Website goal**
   - Portfolio/thought leadership: Keep text-first, add headshot
   - Consulting/services: Emphasize CTAs and credibility, add headshot
   - Community building: Keep values prominent, add human face (headshot)

5. **Timeline available?**
   - This week: Do Quick Win (Option 1)
   - This month: Do Medium Effort (Option 2)
   - This quarter: Do Comprehensive rebuild (Option 3)

---

## Files Reference

| File | Purpose | Read Time |
|------|---------|-----------|
| `HOMEPAGE_REDESIGN_RESEARCH.md` | Full research & context | 40 min |
| `HOMEPAGE_DESIGN_SPECS.md` | Detailed implementation specs | 60 min |
| `REDESIGN_QUICK_START.md` | This file—quick decisions & shortcuts | 15 min |

---

## Support Resources

- **Tailwind CSS Classes**: `HOMEPAGE_DESIGN_SPECS.md` → "CSS Classes Reference"
- **Responsive Design**: `HOMEPAGE_DESIGN_SPECS.md` → "Responsive Design Considerations"
- **Accessibility**: `HOMEPAGE_DESIGN_SPECS.md` → "Accessibility Specifications"
- **Copy/Paste Code**: `HOMEPAGE_DESIGN_SPECS.md` → "Code Examples: Copyable Snippets"

---

**Start with Option 1 (Quick Win). It's fast, low-risk, and you can upgrade to Option 2 later if results are good.**

Good luck! 🚀
