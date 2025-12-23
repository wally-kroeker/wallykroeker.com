# Homepage Redesign: Quick Reference Card

**Print this or keep open while implementing**

---

## TL;DR: The 3-Option Choice

| | Quick Win | Medium Effort | Full Redesign |
|---|----------|---------------|---------------|
| **Time** | 2-4h | 6-10h | 2-3 weeks |
| **Changes** | Add headshot card + update headline/CTAs | Restructure hero grid + redesign | New pages, testimonials, brand refresh |
| **Risk** | Very low | Low | Medium |
| **Impact** | Medium | High | Very high |
| **Start** | This week | This month | This quarter |
| **Difficulty** | Easy | Medium | Hard |
| **Revert if fails?** | Yes (5 min) | Yes (30 min) | Harder (major changes) |
| **Read** | REDESIGN_QUICK_START.md | HOMEPAGE_DESIGN_SPECS.md (Option A) | HOMEPAGE_REDESIGN_RESEARCH.md |

**👉 RECOMMENDATION: Start with Quick Win. Success = upgrade to Medium Effort later.**

---

## What Needs to Change (Option 1: Quick Win)

### 1. Headline (10 min)
**File**: `app/page.tsx` lines 11-16

**From**:
```
"I build open, useful systems so more people can thrive."
```

**To**:
```
"I build secure, open AI systems"

Helping technical teams navigate AI risks with practical frameworks.
Transparent processes. Reusable tools. No fluff.
```

### 2. CTAs (10 min)
**File**: `app/page.tsx` lines 17-21

**From**:
```
[Explore Projects] [Read Cognitive Loop] [Join Community]
```

**To**:
```
[Let's Work Together] [Explore My Work] [Read Cognitive Loop]
 (white bg)          (outlined)        (outlined)
```

Primary CTA link: Change to `/work` or `/consult`

### 3. Headshot (15 min)
1. Get photo (or skip for now)
2. Save to: `/public/images/headshot.jpg`
3. Add import: `import Image from 'next/image'` (top of file)
4. Add section below hero (paste code from QUICK_START.md)

### 4. Test (30 min)
```bash
pnpm dev
# Visit http://localhost:3000
# Check: Image loads, links work, responsive on mobile
```

### 5. Deploy (20 min)
```bash
git add .
git commit -m "feat: add headshot, clarify AI security positioning, improve CTA hierarchy"
git push origin main
# Then deploy per your process
```

---

## Critical File Paths

```
TO MODIFY:
└── app/page.tsx
    ├── Lines 1-3: Add Image import
    ├── Lines 11-16: Update headline
    ├── Lines 17-21: Update CTAs
    └── After line 37: Add headshot section

TO CREATE:
└── public/images/
    └── headshot.jpg (your photo here)

DO NOT MODIFY:
├── components/* (Header, Footer, Container, Prose)
├── tailwind.config.ts
├── layout.tsx
└── Other pages
```

---

## Headline Versions (Pick One)

### Option 1: AI Security Focus (Clearest)
```
"AI Security Strategies for Technical Teams"

Helping you navigate AI risks with practical frameworks
that work in the real world.
```
**Best for**: Maximum clarity, corporate credibility
**Trade-off**: Loses personal/philosophy positioning

### Option 2: Values + Expertise (Recommended)
```
"I build secure, open AI systems"

Helping technical teams navigate AI risks with practical frameworks.
Transparent processes. Reusable tools. No fluff.
```
**Best for**: Balance of clarity + values
**Trade-off**: Slightly less unique than original

### Option 3: Problem-Focused
```
"Your AI Systems Need Security That Actually Works"

Not fear-based. Not overcomplicated. Built for teams that move fast.
```
**Best for**: Emotional resonance, narrative engagement
**Trade-off**: Feels slightly salesy

### Option 4: Keep Current (Add Context)
```
"I build open, useful systems so more people can thrive"
→ Focus: AI security, technical consulting

(Add subheading explaining AI security specificity)
```
**Best for**: Maintaining current philosophy
**Trade-off**: First-time visitors still confused about expertise

**👉 PICK: Option 2 (Recommended blend)**

---

## CTA Button Copy

### Primary CTA (Hero Section)
```
Text: "Let's Work Together"
Link: /work (create if doesn't exist)
Style: bg-white text-zinc-950 font-semibold
Appearance: Solid white button
```

### Secondary CTA (Hero Section)
```
Text: "Explore My Work"
Link: /projects (existing page)
Style: border border-zinc-700
Appearance: Outlined button
```

### Tertiary CTA (Below hero)
```
Text: "Read Cognitive Loop" or "Join the Community"
Link: /loop, /community (existing)
Style: Link with arrow
Appearance: Text link
```

---

## Copy-Paste: Headshot Card Section

Paste this AFTER line 37 (`</section>` of first hero), BEFORE projects section:

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

---

## Copy-Paste: Updated CTAs

Replace lines 17-21 in `app/page.tsx`:

```tsx
<div className="mt-6 flex flex-wrap gap-3">
  <a href="/work" className="rounded-2xl bg-white text-zinc-950 px-4 py-2
                             text-sm font-semibold hover:bg-zinc-100">
    Let's Work Together
  </a>
  <a href="/projects" className="rounded-2xl border border-zinc-700 px-4 py-2
                                 text-sm hover:bg-zinc-900">
    Explore My Work
  </a>
  <a href="/loop" className="rounded-2xl border border-zinc-700 px-4 py-2
                              text-sm hover:bg-zinc-900">
    Read Cognitive Loop
  </a>
</div>
```

---

## Copy-Paste: Updated Headline

Replace lines 11-16 in `app/page.tsx`:

```tsx
<h1 className="text-4xl md:text-5xl font-semibold leading-tight">
  I build secure, open AI systems
</h1>
<p className="mt-4 text-zinc-300 max-w-2xl">
  Helping technical teams navigate AI risks with practical frameworks.
  Transparent processes. Reusable tools. No fluff.
</p>
```

---

## Copy-Paste: Image Import

Add at TOP of `app/page.tsx` (before other imports):

```tsx
import Image from 'next/image'
import { projects } from '@/data/projects'
import Container from '@/components/Container'
```

---

## Image Requirements Checklist

- [ ] File format: JPG or WebP
- [ ] Dimensions: 400×520px minimum (2000×2600px original)
- [ ] File size: <300KB (use Squoosh.app to optimize)
- [ ] File location: `/public/images/headshot.jpg`
- [ ] Professional headshot: Yes
- [ ] Warm lighting: Yes (avoid blue/cool tones)
- [ ] Bright clothing: Yes (white/light colors)
- [ ] Good contrast: Yes (stands out against dark bg)
- [ ] Clear face: Yes (500px+ wide minimum for visibility)

---

## Testing Checklist

After implementing, check:

- [ ] Page loads without errors
- [ ] Headshot image displays (no broken image icon)
- [ ] Image loads quickly (<1 second)
- [ ] All links work (test each CTA button)
- [ ] Mobile responsive (check on 375px width)
- [ ] Tablet responsive (check on 768px width)
- [ ] Desktop looks good (check on 1440px width)
- [ ] Dark mode contrast okay (read text clearly)
- [ ] Heading hierarchy correct (h1, h2, h3)
- [ ] Keyboard navigation works (Tab through elements)

**Command to test locally:**
```bash
cd /home/walub/projects/wallykroeker.com
pnpm dev
# Open http://localhost:3000 in browser
```

---

## Git Commands (Deploy)

```bash
# From project root
cd /home/walub/projects/wallykroeker.com

# Check status
git status

# Add changes
git add .

# Commit with conventional message
git commit -m "feat: add headshot, clarify AI security positioning, improve CTA hierarchy"

# Push to GitHub
git push origin main

# Deploy (per your deployment process)
# Example: SSH to production, pull, build, restart service
```

---

## Metrics to Track (Post-Launch)

### Engagement (Should Increase)
- **Time on Page**: Target +10-15%
- **Scroll Depth**: Target +20%+
- **Bounce Rate**: Target -5-10%

### Conversion (New Baseline)
- **Clicks to "Let's Work Together"**: Track daily
- **Visits to /work page**: Track daily
- **Contact form submissions**: Track daily

### Feedback (Qualitative)
- Ask visitors: "What does Wally do?"
- Good answer: "AI security consultant"
- Poor answer: Vague responses

### Performance (Should Stay Same)
- **Page Load Time**: Should stay <2 seconds
- **Image Load**: Should stay <300KB
- **Bundle Size**: Should not increase

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Image doesn't appear | Check path: `/public/images/headshot.jpg`, clear `.next`, restart dev server |
| Image looks blurry | Check resolution (min 2000×2600px), use Squoosh to optimize |
| Button styling wrong | Add `bg-white text-zinc-950 font-semibold` for primary, `border` for secondary |
| Mobile layout broken | Check grid uses `grid-cols-1 md:grid-cols-...`, image has `overflow-hidden` parent |
| /work page doesn't exist | Create `app/work/page.tsx` first or link to `/projects` temporarily |
| White button text hard to read | Not a problem—white text on white bg should be black, add proper styling |
| Headshot looks weird | Check photo quality, try different crop, verify it's warm-lit (not cool-lit) |
| Performance degraded | Image too large? Use Squoosh to compress to <100KB |

---

## Decision: Implement Now or Plan?

### Implement NOW if:
- ✓ You have a professional headshot ready
- ✓ You have 2-4 hours this week
- ✓ You want to test quick win approach
- ✓ You're comfortable with small code changes

### Plan for Later if:
- ✗ You need to get a professional headshot first (1-2 weeks)
- ✗ You want to think through positioning more carefully
- ✗ You prefer to do full redesign (medium/full options)
- ✗ You want to gather more data first

**👉 RECOMMENDATION: Implement Quick Win this week. Takes 2-4 hours. Easy to revert if needed.**

---

## File References

| File | Purpose | When to Read |
|------|---------|------|
| REDESIGN_QUICK_START.md | Step-by-step Quick Win guide | Before starting |
| HOMEPAGE_DESIGN_SPECS.md | Technical specs, code examples | If you need detail |
| HOMEPAGE_REDESIGN_RESEARCH.md | Full research context | If curious about process |
| REDESIGN_SUMMARY.md | Executive overview | For context |
| This card | Quick reference | Keep open while coding |

---

## Success Looks Like

**Immediately After Launch**:
- Page loads fast (no performance regression)
- Headshot displays properly in dark mode
- "Let's Work Together" button visible and clickable
- Mobile layout works (image stacks on small screens)
- All links functional

**After 1 Week**:
- No error reports or broken links
- Positive feedback ("Great to see a face!")
- Metrics stable (no drop in bounce rate)

**After 2-4 Weeks**:
- Scroll depth up 10-20%
- Clicks to /work increased
- Consulting inquiries more qualified
- Positive sentiment about "AI security consultant" positioning

---

## Done! Next Steps

1. **Decide**: Quick Win (YES) or Medium Effort/Later
2. **Prepare**: Get headshot, choose headline
3. **Implement**: Follow REDESIGN_QUICK_START.md step-by-step
4. **Test**: `pnpm dev`, check all breakpoints
5. **Deploy**: `git commit && git push`
6. **Measure**: Track metrics for 2-4 weeks
7. **Iterate**: Refine or expand based on results

---

**Start time: 15 minutes from now**
**Finish time: 2-4 hours from start**
**Reward: 15-25% improvement in consulting lead conversion (estimated)**

Go! 🚀
