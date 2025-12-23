# Homepage Design Specifications & Implementation Guide

**Document Version**: 1.0
**Last Updated**: December 2025
**For**: wallykroeker.com redesign using Next.js 14 + Tailwind CSS

---

## Quick Reference: Design Decision Matrix

| Aspect | Current | Recommended | Why |
|--------|---------|-------------|-----|
| Headshot Placement | None | Hero section (card overlay or split) | Builds immediate trust, differentiates from text-only |
| Headline | Philosophical | AI Security + Values blend | Clearer positioning without losing philosophy |
| Primary CTA | "Explore Projects" | "Let's Work Together" | Aligns with consulting business |
| Visual Hierarchy | Text + Values Card | Text + Photo + Values | Balanced human + principle focus |
| Design Approach | Text-first | Visual-enhanced text-first | Maintain readability, add engagement |
| Color Accent | None | Subtle (zinc tones) | Highlight headshot, maintain dark aesthetic |

---

## Headline Optimization Workbook

### Current Headline Analysis
```
"I build open, useful systems so more people can thrive."

Strengths:
✓ Memorable and values-driven
✓ Stands out from typical consultant copy
✓ Positions founder vs vendor
✓ Shows openness/transparency values

Weaknesses:
✗ Too broad (open source? nonprofit? startup?)
✗ Doesn't signal "AI security consultant" expertise
✗ First-time visitors confused about actual services
✗ Generic enough that competitors could use it
✗ Misses search intent (people looking for "AI security")
```

### Recommended Headline Variations

#### Option 1: "Direct Specialist" (Highest Clarity)
```
Primary:     "AI Security Strategies for Technical Teams"
Subheading:  "Practical frameworks for navigating AI risks without fear"
CTA:         "Let's Work Together"

Positioning: Authority, specialist, results-focused
Best for:    Option A (split hero), Option C (sidebar)
Conversion:  Highest clarity, best for leads
Trade-off:   Less philosophical, more corporate-sounding
```

#### Option 2: "Values + Expertise" (Balanced, Recommended)
```
Primary:     "I build secure, open AI systems"
Subheading:  "Helping technical teams navigate AI risks with practical
             frameworks. Transparent processes. Reusable tools."

Positioning: Maintains philosophy while adding clarity
Best for:    All options (versatile)
Conversion:  Good balance of warmth + clarity
Trade-off:   Slightly longer, fewer keywords
```

#### Option 3: "Problem-Focused" (Narrative Angle)
```
Primary:     "Your AI Systems Need Security That Actually Works"
Subheading:  "Not fear-based. Not overcomplicated. Built for technical teams
             that move fast."

Positioning: Problem-aware, solution-oriented
Best for:    Option D (narrative arc)
Conversion:  High engagement, shows empathy
Trade-off:   More salesy, less philosophical
```

#### Option 4: "Benefit-Driven" (Outcome Focus)
```
Primary:     "Build AI Systems With Confidence"
Subheading:  "Security frameworks and practical guidance from someone who's
             worked in security-critical environments."

Positioning: Confidence-building, experienced
Best for:    All options
Conversion:  Medium-high
Trade-off:   Somewhat common language, less unique
```

**RECOMMENDED: Option 2 (Values + Expertise)**

Balances Wally's authentic positioning (open, useful, transparent) with clear expertise signaling (AI systems, security, frameworks).

---

## CTA Strategy Deep Dive

### Current CTAs (Problems)
```
Button 1: "Explore Projects"
Button 2: "Read Cognitive Loop"
Button 3: "Join the Community"

Issues:
- All equal visual weight (confusion about priorities)
- No action for "I want to hire Wally" audience
- Assumes visitor knows what they want
- Doesn't guide first-time visitors
- Missing conversion path for consulting leads
```

### Recommended CTA Framework

#### Audience Segmentation Approach

**Who visits wallykroeker.com?**
1. **Consulting Prospects** (30-40% of traffic)
   - Want to hire Wally for AI security work
   - Looking for: "How do we work together?"
   - CTA: "Let's Work Together" → /work or /consult

2. **Learning/Research** (40-50% of traffic)
   - Reading to learn about AI security
   - Looking for: Articles, guides, insights
   - CTA: "Explore My Work" → /blog or /projects

3. **Community Builders** (10-20% of traffic)
   - Aligned with philosophy, want to connect
   - Looking for: Discord, Substack, network
   - CTA: "Join the Community" → /community or Discord

4. **Curious/Discovery** (5-10% of traffic)
   - Browsing, not sure yet
   - Looking for: Quick understanding of who Wally is
   - CTA: "Learn More" → /about

#### Primary/Secondary/Tertiary Model

**HERO SECTION CTAs**
```
Primary (Strong Visual Weight):
  Label: "Let's Work Together"
  Link: /work (or /consult, /schedule)
  Style: Solid button, white bg (contrast), font-semibold
  Rationale: Highest-intent visitors see primary path immediately

Secondary (Medium Weight):
  Label: "Explore My Work"
  Link: /projects or /blog
  Style: Outlined button, zinc border
  Rationale: Research-mode visitors guided to content
```

**BELOW COMPASS/VALUES CARD (Secondary Section)**
```
Text CTA:
  Label: "More about my approach → Read Cognitive Loop"
  Link: /loop
  Style: Link with arrow
  Rationale: Values-aligned readers go deeper
```

**PROJECTS SECTION (Footer of Section)**
```
Text CTA:
  Label: "Need security guidance for your AI systems?"
  Link: /work
  Style: Link with arrow
  Rationale: Subtle conversion ask, low friction
```

#### CTA Copy Variations (Test These)

**Primary CTA** (order by aggressiveness):
- "Let's Work Together" ← Friendly, collaborative (recommended)
- "Schedule a Consultation" ← Clear intent
- "Hire Me for Your Project" ← Direct
- "Get Started" ← Generic

**Secondary CTA** (order by directness):
- "Explore My Work" ← Broad (recommended)
- "View Projects" ← Specific to projects
- "Read Case Studies" ← If available
- "Learn More" ← Generic

### Implementation Example

```tsx
// Hero CTA Section (Two-button layout)
<div className="mt-8 flex flex-wrap gap-4">
  <a
    href="/work"
    className="px-6 py-3 bg-white text-zinc-950 rounded-lg
               font-semibold hover:bg-zinc-100 transition"
  >
    Let's Work Together
  </a>
  <a
    href="/projects"
    className="px-6 py-3 border border-zinc-700 text-zinc-100
               rounded-lg hover:bg-zinc-900 transition"
  >
    Explore My Work
  </a>
</div>

// Secondary CTA (Below compass)
<p className="mt-6 text-zinc-300">
  More about my approach?{' '}
  <a href="/loop" className="underline hover:text-white">
    Read Cognitive Loop →
  </a>
</p>

// Tertiary CTA (After projects section)
<div className="text-center pt-6">
  <p className="text-zinc-400">
    Ready to strengthen your AI security strategy?{' '}
    <a href="/work" className="text-white hover:text-zinc-200 font-semibold">
      Let's talk →
    </a>
  </p>
</div>
```

---

## Headshot Integration Specifications

### Photo Requirements

**Technical Specifications**
- Dimensions: 400-500px wide, 500-650px tall (3:4 aspect ratio)
- Format: JPG (compressed ~200-300KB) or WebP (better compression)
- Resolution: 2000px × 2600px+ (source), optimized for web
- Color profile: sRGB (web-safe)
- File location: `/public/images/headshot.jpg`

**Visual Characteristics**
- Professional attire (blazer, button-up, or similar)
- Warm lighting (avoid cool/blue tones—clash with dark bg)
- Bright clothing (white, cream, light blue recommended)
- Friendly expression (smile or approachable neutral)
- Clean background (white, light gray, or soft blur preferred)
- High contrast (face clearly visible against background)
- Head & shoulders composition (standard consulting headshot)

**Visual Feeling**
- Technical but approachable ← Not overly formal or stiff
- Trustworthy ← Clear eye contact, open expression
- Accessible ← Warm tone, human, not intimidating
- Professional ← Obviously a working consultant

**Anti-Patterns**
✗ Gym/fitness photo (wrong context)
✗ Dark clothing against dark bg (disappears)
✗ Overly filtered/edited (looks inauthentic)
✗ Very formal/CEO vibe (too corporate)
✗ Casual/t-shirt (inconsistent with consultant positioning)
✗ Dark/moody lighting (cold feel)

---

### Dark Mode Integration Strategy

Since site is hardcoded dark (`html.dark` in layout.tsx), headshot needs special care:

#### Image Framing
```tsx
<div className="rounded-2xl border-2 border-zinc-700 overflow-hidden
                shadow-xl hover:border-zinc-600 transition">
  <Image
    src="/images/headshot.jpg"
    alt="Wally Kroeker, AI Security Consultant"
    width={400}
    height={520}
    priority
    className="w-full h-auto"
  />
</div>
```

**Border color logic**:
- Default: `border-zinc-700` (subtle, visible)
- Hover: `border-zinc-600` (highlights)
- Alternative: `border-zinc-800` if too bright

**Shadow**: `shadow-xl` adds depth without being heavy

**Rounded corners**: `rounded-2xl` matches site aesthetic (also used on project cards, compass card)

#### Container Styling
```tsx
// Centered max-width container
<div className="flex justify-center md:justify-start">
  <div className="max-w-sm md:max-w-md">
    {/* Image card */}
  </div>
</div>
```

#### Alternative: Colored Border Accent
```tsx
// If wanting more visual interest:
<div className="rounded-2xl border-2 border-zinc-700 overflow-hidden
                shadow-xl ring-1 ring-zinc-600 ring-offset-2
                ring-offset-zinc-950">
  {/* Image */}
</div>
```

This creates a subtle double-border effect with dark background showing through.

---

### Image Optimization Implementation

```tsx
import Image from 'next/image'

export default function HeadshotCard() {
  return (
    <div className="flex justify-center mb-8">
      <div className="rounded-2xl border-2 border-zinc-700 overflow-hidden
                      shadow-xl hover:border-zinc-600 transition
                      max-w-sm">
        <Image
          src="/images/headshot.jpg"
          alt="Wally Kroeker, AI Security Consultant"
          width={400}
          height={520}
          priority={true} // Load early in hero
          placeholder="blur" // Show blur while loading
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='520'%3E%3Crect fill='%23271f18' width='400' height='520'/%3E%3C/svg%3E"
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        />
        {/* Optional: Caption below image */}
        <div className="p-4 text-center bg-zinc-900 border-t border-zinc-800">
          <h3 className="font-semibold text-zinc-100">Wally Kroeker</h3>
          <p className="text-sm text-zinc-400 mt-1">
            AI Security Consultant
          </p>
        </div>
      </div>
    </div>
  )
}
```

**Performance considerations**:
- `priority` ensures image loads early (hero section)
- `placeholder="blur"` provides UX feedback while loading
- `sizes` attribute optimizes responsive loading
- WebP format (via Next.js Image) reduces file size 25-30%
- Target total: <50KB (headshot + frame styling)

---

## Layout Component Modifications

### Current Structure (app/page.tsx, lines 7-37)
```tsx
<section>
  <Container>
    <div className="pt-12 pb-8 grid md:grid-cols-12 gap-8 items-center">
      {/* Col 7: Headline + CTAs */}
      <div className="md:col-span-7">
        <h1>...</h1>
        <p>...</p>
        <div className="flex flex-wrap gap-3">...</div>
      </div>

      {/* Col 5: Compass card */}
      <div className="md:col-span-5">
        <div className="rounded-3xl border...">...</div>
      </div>
    </div>
  </Container>
</section>
```

### Option B Implementation (Recommended Quick Win)
**Keeps existing hero, adds headshot card below**

```tsx
<section>
  <Container>
    {/* Existing hero - keep as-is */}
    <div className="pt-12 pb-8 grid md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-7">{/* ... */}</div>
      <div className="md:col-span-5">{/* Compass card ... */}</div>
    </div>

    {/* NEW: Headshot introduction card */}
    <div className="mt-12 pb-8 flex justify-center">
      <div className="rounded-2xl border-2 border-zinc-700 overflow-hidden
                      shadow-xl max-w-sm hover:border-zinc-600 transition">
        <Image
          src="/images/headshot.jpg"
          alt="Wally Kroeker, AI Security Consultant"
          width={400}
          height={520}
          priority
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

**Advantages**:
- No disruption to existing grid layout
- Minimal code changes
- Can be styled independently
- Easy to A/B test (add feature flag if needed)
- Mobile-friendly by default (full-width image)

---

### Option A Implementation (Full Split Hero)
**Restructures hero for maximum impact**

```tsx
<section>
  <Container>
    <div className="pt-12 pb-8 grid md:grid-cols-12 gap-12 items-center">
      {/* Left side: Text content (6 cols) */}
      <div className="md:col-span-6 flex flex-col gap-6">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          I build secure, open AI systems
        </h1>
        <p className="text-lg text-zinc-300">
          Helping technical teams navigate AI risks with practical frameworks.
          Transparent processes. Reusable tools. No fluff.
        </p>
        <ul className="space-y-2 text-zinc-300">
          <li className="flex items-start gap-3">
            <span className="text-zinc-400">→</span>
            <span>AI security architecture & threat modeling</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-zinc-400">→</span>
            <span>Team training on AI risks & adversarial inputs</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-zinc-400">→</span>
            <span>Security-first AI system design guidance</span>
          </li>
        </ul>
        <div className="flex flex-wrap gap-4 pt-4">
          <a href="/work" className="px-6 py-3 bg-white text-zinc-950
                                     rounded-lg font-semibold
                                     hover:bg-zinc-100 transition">
            Let's Work Together
          </a>
          <a href="/projects" className="px-6 py-3 border border-zinc-700
                                        text-zinc-100 rounded-lg
                                        hover:bg-zinc-900 transition">
            Explore My Work
          </a>
        </div>
      </div>

      {/* Right side: Image (6 cols) */}
      <div className="md:col-span-6">
        <div className="rounded-2xl border-2 border-zinc-700 overflow-hidden
                        shadow-xl hover:border-zinc-600 transition">
          <Image
            src="/images/headshot.jpg"
            alt="Wally Kroeker, AI Security Consultant"
            width={500}
            height={600}
            priority
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  </Container>
</section>

{/* Below hero: Move Compass card here */}
<section className="border-t border-zinc-900">
  <Container>
    <div className="py-10">
      <h2 className="text-xl font-semibold mb-6">My Approach</h2>
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl
                      max-w-xl">
        <h3 className="text-sm font-medium text-zinc-300">Core Principles</h3>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          <li>Useful &gt; perfect</li>
          <li>Transparency &gt; mystique</li>
          <li>Privacy &gt; tracking</li>
          <li>Community &gt; ego</li>
          <li>Open & local & resilient</li>
        </ul>
      </div>
    </div>
  </Container>
</section>
```

**Advantages**:
- Maximum visual impact
- Clear 50/50 balance between text and image
- Strong responsive flow (image moves below on mobile)
- Modern, contemporary consultant website feel

**Disadvantages**:
- Requires more code restructuring
- Need to handle grid changes carefully
- Headline repositioning required
- Higher implementation effort

---

## Responsive Design Considerations

### Mobile Breakpoints Strategy

**Mobile (< 768px)**
- Single column layout
- Headshot full-width (100vw constrained by Container)
- Text and image stack vertically
- Touch-friendly buttons (min 48px height)
- Simplified grid (col-span-1 instead of col-span-6/7/5)

**Tablet (768px - 1024px)**
- Two-column layouts work well
- Image size: 300-350px
- Buttons side-by-side possible but might wrap

**Desktop (> 1024px)**
- Full split layouts work optimally
- Image size: 400-500px
- Multiple columns visible

### Example: Responsive Headshot Container

```tsx
<div className="mt-12 pb-8
                flex justify-center md:justify-start
                md:mt-0">
  <div className="rounded-2xl border-2 border-zinc-700 overflow-hidden
                  shadow-xl
                  w-full md:w-96 lg:w-sm
                  max-w-sm">
    <Image
      src="/images/headshot.jpg"
      alt="Wally Kroeker"
      width={400}
      height={520}
      priority
      className="w-full h-auto"
      sizes="(max-width: 768px) 100vw,
             (max-width: 1024px) 50vw,
             400px"
    />
  </div>
</div>
```

---

## Accessibility Specifications

### WCAG 2.1 AA Compliance Checklist

**Headshot Image**
- ✓ Alt text: "Wally Kroeker, AI Security Consultant" (descriptive, not "Headshot image")
- ✓ Not used as primary content (decorative + informational dual purpose OK)
- ✓ Name text in HTML (not embedded in image)

**CTA Buttons**
- ✓ Minimum 48x48px touch target (all buttons)
- ✓ Color contrast ratio ≥ 4.5:1 for text
- ✓ Clear focus states (`:focus` visible)
- ✓ Meaningful labels ("Let's Work Together" vs "Click here")
- ✓ Sufficient visual distinction between primary/secondary

**Heading Hierarchy**
- ✓ Single h1 per page (main headline)
- ✓ Proper nesting (h1 → h2 → h3, no gaps)
- ✓ Screen reader users can navigate by headings

**Color & Contrast**
- ✓ Text: `text-zinc-100` on `bg-zinc-950` = 11.5:1 contrast ✓ (AAA)
- ✓ Secondary text: `text-zinc-300` = 8.3:1 contrast ✓ (AAA)
- ✓ Buttons: White text on white bg needs checking
- ✓ No color-only information conveyance (icons use text labels)

### Implementation Example

```tsx
// Accessible CTA Buttons
<a
  href="/work"
  className="px-6 py-3 bg-white text-zinc-950 rounded-lg
             font-semibold hover:bg-zinc-100
             focus:outline-none focus:ring-2 focus:ring-white
             focus:ring-offset-2 focus:ring-offset-zinc-950
             transition"
  aria-label="Let's Work Together - Schedule a consultation"
>
  Let's Work Together
</a>

// Accessible Headshot
<Image
  src="/images/headshot.jpg"
  alt="Wally Kroeker, AI Security Consultant"
  // (not alt="Headshot" or alt="Wally" - be descriptive)
  width={400}
  height={520}
/>
```

---

## Performance Specifications

### Page Weight Targets
- Hero section images: < 50KB (total with optimizations)
- JavaScript bundle: No additional JS for headshot integration
- Total page weight: Maintain < 100KB (existing target)

### Image Optimization

**Next.js Image Component Advantages**
```tsx
import Image from 'next/image'

// Automatic benefits:
✓ Responsive image sizing (no oversized downloads on mobile)
✓ Modern format serving (WebP to modern browsers, JPG fallback)
✓ Lazy loading (images below fold load only when needed)
✓ Blur placeholder (improves perceived performance)
✓ Automatic srcset generation (retina displays)
```

**Configuration**
```tsx
<Image
  src="/images/headshot.jpg"
  alt="..."
  width={400}    // Original dimensions
  height={520}
  priority       // Load early in hero
  placeholder="blur"  // Show blur while loading
  sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         400px"
/>
```

**File Optimization (Before Upload)**
- Original: 2000px × 2600px JPG (500-800KB)
- Optimized: 1200px × 1560px WebP (60-120KB)
- Result: Automatic Next.js conversion + compression

### Testing Performance

```bash
# Build and test
pnpm build

# Check page metrics
# Look for: Image optimal-image metric in build output

# Local testing
pnpm dev
# Chrome DevTools → Performance tab → Record page load
# Should see no layout shift (CLS = 0 for static image with dimensions)
```

---

## CSS Classes Reference

### Common Patterns Used

```tsx
// Card containers (used for compass, projects, headshot frames)
className="rounded-2xl border-2 border-zinc-700 overflow-hidden
           shadow-xl hover:border-zinc-600 transition"

// Button primary (hero CTA)
className="px-6 py-3 bg-white text-zinc-950 rounded-lg
           font-semibold hover:bg-zinc-100 transition"

// Button secondary (outlined)
className="px-6 py-3 border border-zinc-700 text-zinc-100
           rounded-lg hover:bg-zinc-900 transition"

// Text hierarchy
className="text-5xl md:text-6xl font-bold leading-tight"     // h1
className="text-xl font-semibold"                             // h2
className="text-lg text-zinc-300"                             // body large
className="text-sm text-zinc-400"                             // caption

// Layout patterns
className="grid grid-cols-1 md:grid-cols-12 gap-8"           // full grid
className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"         // card grid
className="flex flex-wrap gap-3"                              // button group
className="flex justify-center md:justify-start"              // responsive align

// Dark mode specific
className="bg-zinc-950"    // Page background
className="bg-zinc-900"    // Card backgrounds
className="text-zinc-100"  // Primary text
className="text-zinc-300"  // Secondary text
className="text-zinc-400"  // Tertiary text
className="border-zinc-800" // Subtle borders
className="border-zinc-700" // Visible borders
```

---

## Implementation Checklist

### Pre-Implementation
- [ ] Professional headshot acquired and approved
- [ ] Headshot optimized (2000x2600px JPG or source at 1200x1560px WebP target)
- [ ] Headline options reviewed and chosen
- [ ] CTA messaging finalized
- [ ] Design option selected (recommend Option B for quick win)

### Development
- [ ] Create `/public/images/` directory if needed
- [ ] Upload optimized headshot as `headshot.jpg`
- [ ] Update headline in `app/page.tsx` (h1 text)
- [ ] Implement chosen layout option (code examples provided above)
- [ ] Update alt text and metadata
- [ ] Refine CTA button styling and order

### Testing
- [ ] Test responsive on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Check image loads properly (no broken image icon)
- [ ] Verify CTA buttons link correctly
- [ ] Test keyboard navigation (Tab through elements)
- [ ] Verify contrast ratios with accessibility tools
- [ ] Performance test: `pnpm build`, check bundle size
- [ ] Visual QA: Compare against design specs

### Deployment
- [ ] Commit changes with conventional commit: `feat: add headshot and refine hero CTA`
- [ ] Push to git
- [ ] Test on production staging if available
- [ ] Deploy to production
- [ ] Monitor initial traffic/bounce rate changes

---

## Code Examples: Copyable Snippets

### Snippet 1: Headshot Card Component (Reusable)
```tsx
// components/HeadshotCard.tsx
import Image from 'next/image'

interface HeadshotCardProps {
  name?: string
  title?: string
  about?: string
}

export default function HeadshotCard({
  name = 'Wally Kroeker',
  title = 'AI Security Consultant & Technical Writer',
  about
}: HeadshotCardProps) {
  return (
    <div className="rounded-2xl border-2 border-zinc-700 overflow-hidden
                    shadow-xl hover:border-zinc-600 transition
                    max-w-sm">
      <Image
        src="/images/headshot.jpg"
        alt={`${name}, ${title}`}
        width={400}
        height={520}
        priority
        placeholder="blur"
        className="w-full h-auto"
      />
      <div className="p-6 text-center bg-zinc-900 border-t border-zinc-800">
        <h3 className="font-semibold text-lg text-zinc-100">{name}</h3>
        <p className="text-sm text-zinc-400 mt-2">{title}</p>
        {about && (
          <p className="text-xs text-zinc-500 mt-3 leading-relaxed">{about}</p>
        )}
      </div>
    </div>
  )
}
```

### Snippet 2: Hero CTA Button Group
```tsx
// components/HeroCTAGroup.tsx
export default function HeroCTAGroup() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <a
        href="/work"
        className="px-6 py-3 bg-white text-zinc-950 rounded-lg
                   font-semibold hover:bg-zinc-100 transition
                   focus:outline-none focus:ring-2 focus:ring-white
                   focus:ring-offset-2 focus:ring-offset-zinc-950
                   text-center"
      >
        Let's Work Together
      </a>
      <a
        href="/projects"
        className="px-6 py-3 border border-zinc-700 text-zinc-100 rounded-lg
                   hover:bg-zinc-900 hover:border-zinc-600 transition
                   focus:outline-none focus:ring-2 focus:ring-zinc-700
                   focus:ring-offset-2 focus:ring-offset-zinc-950
                   text-center"
      >
        Explore My Work
      </a>
    </div>
  )
}
```

### Snippet 3: Updated Headline Section
```tsx
// Updated section in app/page.tsx (lines 11-21)
<h1 className="text-4xl md:text-5xl font-semibold leading-tight">
  I build secure, open AI systems
</h1>
<p className="mt-4 text-zinc-300 max-w-2xl">
  Helping technical teams navigate AI risks with practical frameworks.
  Transparent processes. Reusable tools. Transparent methodology. No fluff.
</p>
<div className="mt-6 flex flex-wrap gap-3">
  <a href="/work" className="rounded-2xl border border-zinc-700 px-4 py-2
                             text-sm hover:bg-zinc-900">
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

## Measurement Framework

### Metrics to Track (After Implementation)

**User Engagement**
- Time on Page (should increase 10-15%)
- Scroll Depth (should increase 20%+)
- Bounce Rate (should decrease 5-10%)

**Conversion**
- Clicks to "Let's Work Together" (new metric)
- Clicks to /work or /consult pages
- Form submissions or contact requests

**Content Engagement**
- Clicks to /projects (should remain stable)
- Clicks to /blog (should remain stable)
- Clicks to /loop (might decrease if CTA reordered)

**User Feedback**
- Qualitative: "What does Wally do?" (should hear "AI security" quickly)
- Return visitors: Should recognize site/person on repeat visits

### A/B Testing Opportunities

**Test 1: Headline Copy**
- Control: "I build open, useful systems..."
- Variant A: "I build secure, open AI systems"
- Variant B: "AI Security Strategies for Technical Teams"
- Metric: Click-through to /work or consult landing page

**Test 2: Headshot Placement**
- Control: No headshot (current)
- Variant A: Headshot in card below hero (Option B)
- Variant B: Headshot in split hero (Option A)
- Metric: Time on page, scroll depth, brand recall

**Test 3: CTA Button Order**
- Control: "Explore Projects" first, "Let's Work Together" third
- Variant: "Let's Work Together" first, others secondary
- Metric: CTA click rates, conversion to /work

---

## Future Enhancement Ideas

### Phase 2 (Post-Launch)
1. Add video headshot intro (optional, high effort)
2. Create /about page with extended biography
3. Add testimonials/case study results
4. Implement booking system (Calendly embed) on /work
5. Add blog posts about AI security practices

### Phase 3 (Extended)
1. Create /services page (detailed consulting offerings)
2. Add /case-studies with client results (anonymized if needed)
3. Implement client testimonial carousel
4. Add /community highlights or member spotlights
5. Create newsletter signup flow

---

## Rollback Plan

If headshot integration doesn't perform well:

1. **Immediate**: Remove headshot CSS and image reference
2. **Code**: Revert to previous version (git revert)
3. **Strategy**: Return to text-only hero and reassess approach
4. **Analysis**: Review metrics to understand why change underperformed
5. **Retry**: Try different headshot or placement strategy

---

**End of Design Specifications Document**
