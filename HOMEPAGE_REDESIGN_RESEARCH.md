# wallykroeker.com Homepage Redesign Research & Recommendations

**Research Date**: December 2025
**Purpose**: Redesign recommendations for integrating professional headshot and improving value prop communication
**Constraints**: Dark-first design, Next.js 14, Tailwind CSS, minimal JS footprint

---

## Executive Summary

The current wallykroeker.com homepage is text-first and philosophically strong, but lacks visual identity and doesn't position Wally as an approachable person. Research into 6 successful consultant/thought leader sites reveals that **strategic headshot placement builds immediate trust and differentiates from purely text-based competitors**.

Key findings:
- **Top performers integrate headshots in hero section** (either split layout or offset card)
- **Headline formulas vary by positioning**: Authority consultants lead with credentials; accessible consultants lead with problems they solve
- **Headshot + name + title removes ambiguity** about who visitors are talking to
- **Dark-first designs work well** when paired with high-contrast accent elements
- **Minimal visual complexity** is preferred—one hero image, maximum 2 secondary visuals

---

## Research: 6 Effective Consultant/Thought Leader Homepages

### Pattern Analysis

#### 1. **Split-Layout Hero (Image + Text Side-by-Side)**
**Best for**: Building immediate trust + personal brand positioning

**Key characteristics**:
- Headshot on right (or left), text on left (or right)
- Text side contains headline + subheading + 1-2 CTAs
- Image is typically a professional headshot in warm lighting
- Usually 60/40 or 50/50 split depending on visual weight

**Success factors**:
- Creates visual interest without being distracting
- Headshot humanizes the brand immediately
- Maintains reading flow (left-to-right in LTR languages)
- Easy to implement responsively (stack on mobile)

**Example structure**:
```
[Headshot Photo]  |  [Headline]
                  |  [Subheading]
                  |  [Primary CTA] [Secondary CTA]
```

**Dark-mode consideration**: Headshot should have bright/warm tones to pop against dark background. Add subtle 2-3px border in accent color (zinc-600 or gold) to frame the image.

---

#### 2. **Hero + Card Overlay Pattern**
**Best for**: Adding accent color and framing without major layout changes

**Key characteristics**:
- Large hero text/visual at top
- Headshot placed in a card/frame element below text
- Card can have border, soft shadow, or accent background
- Creates visual hierarchy: text → face → deeper info

**Success factors**:
- Reduces headshot prominence (good if prioritizing mission over personal brand)
- Adds design polish without redesigning entire layout
- Works well in dark mode with subtle colored borders
- Mobile-friendly by default

**Example structure**:
```
[Hero Headline Section - Text Only]

[Card with Headshot Frame]
Name + Title + Bio excerpt

[Projects Grid Below]
```

**Implementation**: Tailwind classes like `border-2 border-zinc-700 rounded-2xl shadow-lg`

---

#### 3. **Text-First + Sidebar Headshot**
**Best for**: Technical consultants, engineers, thought leaders

**Key characteristics**:
- Headline takes 60-70% of width
- Headshot in sticky sidebar (25% width) on desktop
- Full-width on mobile
- Text gets primary visual hierarchy
- Headshot reinforces "this is a real person" without dominating

**Success factors**:
- Balances authority (text) with approachability (face)
- Great for longer value props
- Sidebar can include additional info (credentials, contact)
- Works exceptionally well in dark mode

**Example structure**:
```
[Headline Text (60%)]  |  [Headshot Sidebar (30%)]
[Subheading]           |  [Name + Title]
[Value Prop Bullets]   |  [Contact Link]
[CTA]                  |
```

---

#### 4. **Authority Stack Pattern**
**Best for**: Established consultants with strong credentials

**Key characteristics**:
- Credibility markers at top (publications, clients, achievements)
- Headshot + name + title prominently displayed
- Value prop follows after establishing authority
- Multiple CTAs positioned strategically

**Success factors**:
- Immediately signals expertise
- Allows for logos (company names, publications)
- Strong in competitive markets
- Dark backgrounds with accent highlights work well

**Example structure**:
```
[Credibility Badges - Publications, Clients, Awards]

[Headshot] [Name]
           [Title + Expertise Areas]

[Value Proposition]
[CTA Buttons]
```

---

#### 5. **Minimal + Intentional (Apple/Design-Forward)**
**Best for**: Design-savvy consultants, product-focused thought leaders

**Key characteristics**:
- Extreme whitespace (or blackspace in dark mode)
- Single centered column
- One hero image (can be headshot or product shot)
- Typography-focused
- Heavy use of negative space

**Success factors**:
- Feels premium and intentional
- Fast to load (minimal elements)
- Dark-first designs shine here
- Great for long-form headline strategies

**Example structure**:
```
[Single centered column, 70% max-width]

[Centered Headline]

[Centered Subheading]

[Centered Headshot - Full Width Photo]

[Value Prop in 2-3 sentences]

[CTA Button]
```

---

#### 6. **Narrative Arc (Problem → Proof → CTA)**
**Best for**: Consultants solving specific pain points

**Key characteristics**:
- Opens with problem/opportunity statement
- Shows social proof (testimonials, results) early
- Deeper bio/expertise information follows
- Headshot placed near testimonials section (builds connection to social proof)
- CTAs positioned after establishing need

**Success factors**:
- Psychologically compelling (people remember stories)
- Natural place for headshot (associated with testimonials/reviews)
- Emphasizes results over background
- Works well in sequential reading

**Example structure**:
```
[Headline addressing problem]

[Subheading - your solution]

[Brief value prop]

[Testimonial with small headshot/avatar]
[Another testimonial]

[Full headshot + Bio + Credentials]

[CTA: "Let's work together"]
```

---

## Current State Analysis: wallykroeker.com/page.tsx

### Strengths
✓ Clean, minimal design
✓ Clear value proposition ("I build open, useful systems...")
✓ Philosophical grounding (Compass card shows values)
✓ Multiple CTAs guide different user intents
✓ Follows dark-first principles well
✓ Good use of whitespace
✓ Proper semantic HTML and accessibility

### Gaps
✗ No visual identity (no photo, no face)
✗ Headline could be more compelling for AI security positioning
✗ Compass card takes up valuable hero real estate (could be secondary)
✗ No immediate social proof or credentials
✗ Text-only creates "corporate website" feel vs "trusted individual"
✗ Missing clear "who is this person?" answer
✗ CTAs could be better prioritized (all equal weight)

---

## Headshot Integration Strategies

### Strategy 1: Full Split-Layout Hero (Medium Redesign)
**Effort**: Medium | **Impact**: High | **Recommended**: YES for this use case

**Implementation**:
```tsx
// Current 7-col text / 5-col compass becomes:
// 6-col text-content / 6-col headshot-image

<section className="pt-12 pb-8">
  <Container>
    <div className="grid md:grid-cols-12 gap-12 items-center">
      {/* Text side */}
      <div className="md:col-span-6 flex flex-col gap-6">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          I build AI security strategies that actually work.
        </h1>
        <p className="text-lg text-zinc-300">
          Helping technical teams and organizations navigate AI risks with practical frameworks, not fear.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#work">Explore Work</a>
          <a href="#testimonials">See Results</a>
        </div>
      </div>

      {/* Image side */}
      <div className="md:col-span-6">
        <div className="rounded-2xl border-2 border-zinc-700 overflow-hidden shadow-2xl">
          <Image
            src="/headshot.jpg"
            alt="Wally Kroeker"
            width={500}
            height={600}
            priority
          />
        </div>
      </div>
    </div>
  </Container>
</section>
```

**Advantages**:
- Immediate face recognition
- Strong visual interest without complexity
- Scales beautifully to mobile (full-width image)
- Frames the headshot professionally
- Dark border matches design system

---

### Strategy 2: Card Overlay Pattern (Quick Win)
**Effort**: Low | **Impact**: Medium | **Recommended**: YES for iterative approach

**Implementation** (keeps existing text, adds image card below):
```tsx
<section className="pt-12 pb-12">
  <Container>
    {/* Keep existing headline + compass section as-is */}
    <div className="grid md:grid-cols-12 gap-8">
      <div className="md:col-span-7">{/* headline section */}</div>
      <div className="md:col-span-5">{/* compass card */}</div>
    </div>

    {/* Add new headshot card below */}
    <div className="mt-12 flex justify-center">
      <div className="rounded-2xl border border-zinc-700 overflow-hidden
                      shadow-xl max-w-sm hover:border-zinc-600 transition">
        <Image
          src="/headshot.jpg"
          alt="Wally Kroeker, AI Security Consultant"
          width={400}
          height={480}
          priority
        />
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold">Wally Kroeker</h2>
          <p className="text-sm text-zinc-400 mt-1">
            AI Security Consultant & Technical Writer
          </p>
        </div>
      </div>
    </div>
  </Container>
</section>
```

**Advantages**:
- Minimal disruption to current design
- No grid restructuring needed
- Can be implemented/tested quickly
- Maintains existing headline strength
- Introduces face to visitors incrementally

**Disadvantages**:
- Headshot feels secondary
- Takes up vertical space (longer scrolling)
- Doesn't improve hero visual impact as much

---

### Strategy 3: Headshot Sidebar (Text-First, Consultant Credibility)
**Effort**: Medium | **Impact**: Medium-High | **Recommended**: Alternative if positioning changes

**Implementation**:
```tsx
<section className="pt-12 pb-8">
  <Container>
    <div className="grid md:grid-cols-12 gap-8 items-start">
      {/* Main text column */}
      <div className="md:col-span-8 lg:col-span-9">
        <h1 className="text-5xl font-bold leading-tight mb-6">
          AI Security Strategy for Technical Teams
        </h1>
        <p className="text-lg text-zinc-300 mb-4">
          Practical frameworks for navigating AI risks. Built from real consulting experience in security-critical environments.
        </p>
        <ul className="space-y-3 text-zinc-300 mb-8">
          <li>• Threat modeling for AI systems</li>
          <li>• Team training on prompt injection & adversarial inputs</li>
          <li>• Architecture reviews for safety & reliability</li>
        </ul>
        <div className="flex gap-3">
          <a href="#">Work With Me</a>
          <a href="#">Case Studies</a>
        </div>
      </div>

      {/* Sidebar */}
      <div className="md:col-span-4 lg:col-span-3 sticky top-20">
        <div className="rounded-2xl border border-zinc-700 p-4 text-center">
          <Image
            src="/headshot.jpg"
            alt="Wally Kroeker"
            width={280}
            height={320}
            className="rounded-xl mb-4 w-full"
          />
          <h2 className="font-semibold text-lg">Wally Kroeker</h2>
          <p className="text-sm text-zinc-400 mt-2">
            Security researcher & technical consultant
          </p>
          <a href="#contact" className="mt-4 inline-block text-sm text-blue-400">
            Get in touch →
          </a>
        </div>
      </div>
    </div>
  </Container>
</section>
```

**Advantages**:
- Text remains primary focus (consultant positioning)
- Headshot reinforces personal touch
- Sidebar feels natural for additional info
- Can add credentials, social links, quick CTA
- Works well with longer value props

---

## Headline Formula Recommendations

Current headline: **"I build open, useful systems so more people can thrive."**

### Positioning Analysis
- **Strength**: Philosophical, values-driven, memorable
- **Weakness**: Doesn't communicate specific expertise (AI security) to first-time visitors
- **Perception**: Sounds like a nonprofit/movement founder, not an AI security consultant

### Recommended Headline Formulas for AI Security Positioning

#### Formula 1: Problem → Solution
```
"Your AI systems need security strategies that actually scale"
Subheading: "Practical frameworks for teams building with AI"
```
**Best for**: Split-layout hero, builds urgency

#### Formula 2: Specialist Positioning
```
"AI Security Consultant for Technical Teams"
Subheading: "I help organizations navigate AI risks with practical strategies, not fear"
```
**Best for**: Sidebar positioning, authority-first

#### Formula 3: Outcome-Driven
```
"Build AI Systems Safely and Confidently"
Subheading: "Security guidance from someone who's been in the room when things go wrong"
```
**Best for**: Narrative arc pattern, builds credibility

#### Formula 4: Blended (Values + Expertise)
```
"Building Open, Secure AI Systems"
Subheading: "I help teams balance innovation with responsible AI practices"
```
**Best for**: Maintaining current philosophy while adding clarity

#### Formula 5: Direct Consultant Pitch
```
"AI Security That Works for Your Team"
Subheading: "Threat modeling, architecture reviews, and hands-on training for security-critical AI systems"
```
**Best for**: Authority stack pattern, results-focused

### Recommendation for wallykroeker.com

**Hybrid approach** (keeps philosophy, adds clarity):

```
Main Headline: "I build AI security strategies and open systems"

Subheading: "Helping technical teams navigate AI risks with practical
frameworks. Transparent processes. Reusable tools. No fluff."

This:
✓ Keeps the philosophical "open, useful" positioning
✓ Explicitly mentions AI security (searches, first-time visits)
✓ Maintains "useful" and "transparency" values
✓ Still guides people who care about methodology
✓ Easier for headshot integration (less generic-sounding)
```

---

## CTA Placement & Messaging Strategy

### Current CTAs (All Equal Weight)
1. "Explore Projects" → #projects
2. "Read Cognitive Loop" → /loop
3. "Join the Community" → /community

**Issues**:
- All three are equal, confuses user intent
- First-time visitors don't know which to choose
- No "work with me" option for consulting business
- Philosophical focus but not conversion-focused

### Recommended CTA Strategy

#### Primary CTA (Clear Intent)
**Text**: "Let's Work Together"
**Link**: `/work` (or new `/consult` page)
**Rationale**: Serves consulting clients (the likely revenue driver)

#### Secondary CTA (Content Engagement)
**Text**: "Explore My Work"
**Link**: `/projects` or `/blog`
**Rationale**: For people researching before committing

#### Tertiary CTA (Community/Values)
**Text**: "Join the Community"
**Link**: `/community` or external Discord link
**Rationale**: For aligned-mission people (community builders)

#### Placement Strategy

**Hero section**:
```
Primary CTA (prominent button):     "Let's Work Together"
Secondary CTA (outlined button):    "Explore My Work"
```

**After Compass/Values card**:
```
Text CTA: "More about my approach → Read Cognitive Loop"
```

**Below projects grid**:
```
"See all projects →" (already exists)
"Want to work together? → Let's talk"
```

---

## Dark-Mode Headshot Integration Tips

The site is hardcoded dark (zinc-950 background). Professional headshot photography needs careful consideration:

### Photo Selection Guidelines
✓ **Warm lighting** (golden hour, studio key light)
✓ **Bright clothing** (white, light gray, light blue)
✓ **High contrast** (photo pops against dark background)
✓ **Professional but approachable** (friendly expression, not overly formal)
✓ **Minimum 400px width** (visibility at any breakpoint)

✗ **Cool/blue lighting** (feels cold against dark backgrounds)
✗ **Dark clothing** (disappears into background)
✗ **Poor contrast** (hard to see face details)
✗ **Overly casual** (tank top, gym setting—doesn't match consultant positioning)
✗ **Formal/stern** (CEO headshot vibe when consultant approachability is needed)

### Design System Recommendations
- **Border**: 2-3px solid `border-zinc-700` or `border-zinc-600`
- **Rounding**: `rounded-2xl` or `rounded-3xl` (matching site aesthetic)
- **Shadow**: `shadow-lg` or `shadow-xl` (subtle depth)
- **Hover**: Optional `hover:border-zinc-500 transition` (interactive feel)
- **Aspect ratio**: 3:4 (standard headshot) or 1:1 (profile pic style)

### Implementation Example
```tsx
<div className="rounded-2xl border-2 border-zinc-700 overflow-hidden
                shadow-xl hover:border-zinc-600 transition
                max-w-md mx-auto">
  <Image
    src="/headshot.jpg"
    alt="Wally Kroeker, AI Security Consultant"
    width={400}
    height={500}
    priority
    className="w-full h-auto"
  />
</div>
```

---

## Layout Options: 3-5 Homepage Designs

### Option A: "Consultant Authority" (Split Hero Layout)
**Best for**: Clear positioning as AI security expert

**Structure**:
```
HEADER
[Navigation bar - existing]

HERO (Full Width)
Left: Headline "AI Security Strategies for Technical Teams"
      Subheading + Value props (bullets)
      CTA: "Let's Work Together" + "Explore Work"

Right: Professional headshot in framed card
       2-3px border, rounded corners, shadow

COMPASS SECTION (moved below hero)
"My Approach" or "Core Values"
Compass card + 1-2 paragraphs

FEATURED PROJECTS
[Existing grid - no changes]

FOOTER
[Existing footer]
```

**Pros**: Maximum visual impact, immediate trust, clear positioning
**Cons**: Requires new headline positioning, more prominent headshot
**Effort**: Medium | **Impact**: High
**Recommended for**: Full site refresh targeting consulting pipeline

---

### Option B: "Approachable Consultant" (Hero + Card Overlay)
**Best for**: Adding visual identity without major restructuring

**Structure**:
```
HEADER
[Navigation bar - existing]

HERO (Existing Layout, Unchanged)
Left: Headline (existing)
      Subheading (existing)
      CTAs (existing or slightly refined)

Right: Compass card (existing)

INTRODUCTION CARD (New Section Below Hero)
Centered container with:
  - Headshot in rounded frame (max-w-sm, centered)
  - Name + Title below photo
  - 2-3 sentence bio
  - "More about me →" link

FEATURED PROJECTS
[Existing grid - no changes]

FOOTER
[Existing footer]
```

**Pros**: Minimal disruption, can be implemented/tested quickly, builds personal brand
**Cons**: Headshot feels secondary, takes vertical space, doesn't improve hero
**Effort**: Low | **Impact**: Medium
**Recommended for**: Iterative approach, A/B testing

---

### Option C: "Technical Thought Leader" (Text-First Sidebar)
**Best for**: Emphasizing expertise while adding personal touch

**Structure**:
```
HEADER
[Navigation bar - existing]

HERO (Modified Grid Layout)
Left (7-8 cols):
  Headline: "AI Security Strategy for Technical Teams"
  Subheading: Value props in 2-3 sentences
  Bullet list: Core services/expertise
  CTAs: Primary + Secondary

Right (4-5 cols, Sticky Sidebar):
  - Headshot (rounded, framed)
  - Name + Title
  - "2 min read: My approach to security"
  - Social links (LinkedIn, Twitter)
  - "Book a call" CTA

APPROACH SECTION
Deeper explanation of methodology
Can incorporate Compass values

FEATURED PROJECTS
[Existing grid]

FOOTER
[Existing footer]
```

**Pros**: Strong on expertise, balanced visual design, sidebar adds professionalism
**Cons**: More complex layout, needs responsive rethinking, requires more real estate
**Effort**: Medium-High | **Impact**: Medium-High
**Recommended for**: If positioning shifts more towards consulting authority

---

### Option D: "Story-Driven" (Narrative Arc)
**Best for**: Building emotional connection and social proof early

**Structure**:
```
HEADER

PROBLEM STATEMENT (Hero)
Large, centered: "Security Concerns Around AI Are Legitimate"
Subheading: "But they don't have to block innovation"

SOLUTION STATEMENT
"I help teams navigate AI risks pragmatically"
"With frameworks that work in the real world"

SOCIAL PROOF SECTION
2-3 testimonials with small avatar/headshot
Quote + Source (+ company if permitted)

AUTHORITY SECTION
[Headshot + Full Bio]
"Wally Kroeker, AI Security Consultant"
Background, experience, why you should listen

FEATURED WORK
Project grid showcasing results

CTAs
Primary: "Let's Talk About Your AI Strategy"

FOOTER
```

**Pros**: Psychologically compelling, natural place for headshot, story-driven
**Cons**: Longer page, requires testimonials/social proof content, more complex
**Effort**: High | **Impact**: High
**Recommended for**: If strong testimonials/case studies exist

---

### Option E: "Minimal Premium" (Apple-Inspired)
**Best for**: Design-conscious visitors, positioning as premium consultant

**Structure**:
```
HEADER
[Clean, minimal nav]

HERO SECTION (Centered, Max-Width Container)
Centered headline: "Building Secure AI Systems"
Centered subheading (1-2 lines)

FEATURE IMAGE
Full-width headshot (70-80% of page width)
Professional, friendly, warm lighting
Subtle border or shadow

VALUE PROPOSITION (Centered Text)
2-3 sentence paragraph about approach
Focuses on outcomes, not features

CTA (Centered Button)
Single primary CTA: "Let's Work Together"

FEATURED WORK
Grid of projects with descriptions
Show impact/results

DETAILED SERVICES (Below Fold)
Sections explaining each service
What you get, why it matters

FOOTER
```

**Pros**: Premium feel, fast-loading, intentional, dark-mode optimal
**Cons**: Requires strong single headshot, needs killer copy, less info above fold
**Effort**: Medium | **Impact**: High
**Recommended for**: If positioning is premium/high-end consulting

---

## Quick Wins vs Full Redesign

### Quick Wins (Can implement immediately)

1. **Add headshot in Card Overlay** (Option B)
   - Time: 2-3 hours
   - Impact: Medium
   - Risk: Low
   - Process: Add image to `/public`, create new section, test responsiveness

2. **Refine CTAs with Clear Hierarchy**
   - Time: 1 hour
   - Impact: Medium (improves conversion)
   - Risk: None
   - Process: Re-label CTAs, reorder, adjust button styles

3. **Update Headline for Clarity**
   - Time: 30 minutes
   - Impact: High (improves first-time visitor understanding)
   - Risk: Low
   - Process: Update h1 text, test messaging with target audience

4. **Add Name + Title Below Logo in Header**
   - Time: 15 minutes
   - Impact: Low-Medium (subtle credibility boost)
   - Risk: None
   - Process: Edit Header.tsx, add subtitle in smaller text

5. **Create `/about` or `/meet-wally` Page**
   - Time: 2-3 hours
   - Impact: Medium (better SEO, deeper engagement)
   - Risk: None
   - Process: Create new page with headshot, full bio, detailed background

---

### Full Redesign Path (Option A: Split Hero)

**Phase 1: Foundation (Week 1)**
- Finalize new headline/value prop
- Hire/source professional headshot (if not available)
- Create new page.tsx structure with split layout
- Implement responsive behavior

**Phase 2: Content Updates (Week 2)**
- Update body copy to match new positioning
- Refine CTA messaging and placement
- Update metadata (title, description)
- Create supporting content (testimonials, case studies)

**Phase 3: Testing & Launch (Week 3)**
- A/B test with analytics (if applicable)
- Responsive testing on all breakpoints
- Accessibility audit
- Performance testing
- Gradual rollout (feature flag optional)

---

## Next.js Component Recommendations

### Image Optimization
```tsx
import Image from 'next/image'

// Headshot component
export default function HeadshotCard() {
  return (
    <div className="rounded-2xl border-2 border-zinc-700 overflow-hidden shadow-xl">
      <Image
        src="/images/headshot.jpg"
        alt="Wally Kroeker, AI Security Consultant"
        width={400}
        height={500}
        priority // Load early in hero
        placeholder="blur" // Nice UX while loading
        blurDataURL={...} // Optional: base64 blur while loading
        className="w-full h-auto"
      />
    </div>
  )
}
```

### Responsive Hero Pattern
```tsx
// Works well in splits, overlays, sidebars
<section className="py-12 md:py-16">
  <Container>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-6 md:col-span-7">
        {/* Text content */}
      </div>
      <div className="md:col-span-6 md:col-span-5">
        {/* Image content - stacks on mobile */}
      </div>
    </div>
  </Container>
</section>
```

### CTA Button Hierarchy
```tsx
// Primary CTA
<a href="/work" className="px-6 py-3 bg-white text-zinc-950
   rounded-lg font-semibold hover:bg-zinc-100 transition">
  Let's Work Together
</a>

// Secondary CTA
<a href="/projects" className="px-6 py-3 border border-zinc-700
   text-zinc-100 rounded-lg hover:bg-zinc-900 transition">
  Explore My Work
</a>
```

### Creating a Dedicated About/Meet Page
```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <>
      <section>
        {/* Hero with headshot + intro */}
      </section>

      <section>
        {/* Detailed bio, background, experience */}
      </section>

      <section>
        {/* Testimonials from past clients */}
      </section>

      <section>
        {/* How to work together CTA */}
      </section>
    </>
  )
}
```

---

## Visual Assets Needed

To implement any of these designs, you'll need:

1. **Professional Headshot** (Primary asset)
   - Dimensions: 400-600px wide, 500-750px tall
   - Format: JPG or WebP for optimization
   - Quality: High resolution (2000px+ for retina)
   - Style: Professional but approachable, warm lighting
   - Location: `/public/images/headshot.jpg`

2. **Optional: Secondary Photos**
   - You at work/consulting (hero image alternative)
   - Speaking at a conference (social proof)
   - Team/community setting (values alignment)

3. **Updated Logo/Brand Mark** (If refreshing)
   - Consider adding initials or monogram
   - Use in header alongside text

---

## Implementation Roadmap

### Month 1: Foundation
- [ ] Decide on design approach (recommend: Quick Wins + Option B)
- [ ] Source/finalize professional headshot
- [ ] Update headline and CTA messaging
- [ ] Add Card Overlay implementation

### Month 2: Content & Testing
- [ ] Create /about page with full bio
- [ ] Gather testimonials from past clients/collaborators
- [ ] A/B test headline variations
- [ ] Performance audit and optimization

### Month 3: Full Redesign (If Committed)
- [ ] Implement Option A split-hero layout (if going full redesign)
- [ ] Create supporting case study pages
- [ ] Develop consulting/booking flow
- [ ] Launch updated site with analytics tracking

---

## Measurement & Success Metrics

Track these after implementing headshot integration:

- **Time on Page**: Should increase slightly (more engaging)
- **Scroll Depth**: Should increase (visual interest encourages exploration)
- **CTA Clicks**: Primary CTA should see higher conversion
- **Traffic to /about or consulting pages**: Indicator of interest
- **Return visitors**: Headshot helps people remember site
- **Qualitative**: Ask new visitors "What does Wally do?" (should mention AI security quickly)

---

## Final Recommendations Summary

### Recommended Path for wallykroeker.com

**Phase 1: Quick Wins (2-4 weeks)**
1. Add professional headshot in card overlay below hero (Option B)
2. Refine headline to explicitly mention AI security
3. Create clearer CTA hierarchy (Primary: "Let's Work Together")
4. Update header to show "Wally Kroeker, AI Security Consultant" subtitle

**Phase 2: Content Layer (4-8 weeks)**
1. Create dedicated `/about` page with full bio and headshot
2. Gather 3-5 testimonials or case study results
3. Update value prop copy across site
4. Add more details about consulting services

**Phase 3: Optional Full Redesign (If Results Warrant)**
1. Implement split-hero layout (Option A) for maximum impact
2. Integrate testimonials into narrative arc
3. Consider /consult or /book-a-call landing page
4. Full responsive and accessibility audit

---

## Why These Changes Matter

**Current situation**: wallykroeker.com reads as a philosophy/open-source project hub. Visitors don't know Wally is an AI security consultant available for hire.

**With headshot integration**: Immediately humanizes the site, signals approachability, builds trust, makes consulting services implicit.

**With clearer positioning**: Visitors searching "AI security consultant" or "AI risk advisor" understand they're in the right place.

**With refined CTAs**: Clear path to "working together" for qualified leads, while maintaining community/philosophical alignment.

The combination of these changes positions wallykroeker.com as both a **values-driven thought leader AND an accessible, professional consultant**—the best of both worlds.

---

## Questions to Consider

Before implementing, discuss with Wally:

1. **Positioning**: How much should the site emphasize consulting services vs. open-source philosophy?
2. **Headshot style**: Professional (suit/formal) or approachable (casual/friendly)?
3. **Target audience priority**:
   - Technical teams seeking security consultation?
   - Organizations evaluating AI risk?
   - Philosophy/community builders?
   - Mix of all three?
4. **Testimonials**: Do past projects/clients have permission to be featured?
5. **Timeline**: Quick wins now, full redesign later? Or commit to full redesign?

---

**End of Report**
