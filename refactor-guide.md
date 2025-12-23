# WallyKroeker.com - Full Site Refactor Guide

**Status**: Ready for Implementation
**Created**: December 13, 2025
**Scope**: Full site refactor for thought leadership positioning
**Target Completion**: 2-3 weeks

---

## Executive Summary

This guide provides complete specifications for refactoring wallykroeker.com to serve as a thought leadership platform and project documentation hub. The refactor addresses three strategic goals:

1. **Build thought leadership** - Position Wally as the rare expert bridging infrastructure, security, and pragmatic AI adoption
2. **Document projects publicly** - Share FabLab, Bob/PAI, and consulting work transparently (open/transparent value alignment)
3. **Present technical skills** - Demonstrate expertise to three audiences: consulting clients, peer technologists, and general readers

**Current State Score**: 4.5/10 (based on Dec 9 content audit)
**Target State Score**: 9/10 (professional consultant + authentic technologist)

---

## Table of Contents

1. [Strategic Context](#strategic-context)
2. [Audience & Positioning](#audience--positioning)
3. [Site Architecture](#site-architecture)
4. [Page-by-Page Specifications](#page-by-page-specifications)
5. [Component Library](#component-library)
6. [Content Requirements](#content-requirements)
7. [Implementation Sequence](#implementation-sequence)
8. [Success Metrics](#success-metrics)
9. [Reference Documents](#reference-documents)

---

## Strategic Context

### Why This Refactor Matters

**Current Problem** (from CONTENT_AUDIT_REPORT.md):
- Homepage Score: 5/10 - No headshot, vague positioning, no security expertise visible
- About Page: 0/10 - MISSING (critical gap per Louise's feedback: "You should have your face on it")
- Work/Services: 3/10 - Only 2 sentences, no value proposition, no pricing framework
- Blog: 6/10 - No security content (all infrastructure/workflow posts)
- Security Expertise Visibility: 2/10 - Buried in project descriptions

**Root Cause**:
Site was built as an "open-source philosophy hub" rather than a "consulting platform + thought leadership blog." This works for community builders but misses consulting leads and doesn't surface technical credibility.

**Strategic Opportunity**:
- GoodFields has 5+ warm consulting leads (Rees quote sent Dec 2, Josh meeting Dec 16)
- "2025 Year of the Agent" article complete (3,400 words, ready to publish)
- FabLab Phase 3 complete (Authentik IdP, enterprise DNS) - shows infrastructure expertise
- Content calendar strategy ready (biweekly publishing starting Jan 7, 2026)
- Wally's confidence is high: "I am feeling more confident the work will come if I invest the time" (Dec 9)

**Goal**:
Transform wallykroeker.com into a platform that:
1. Documents FabLab, Bob/PAI, and consulting projects publicly (transparency)
2. Positions Wally as AI security + infrastructure expert (authority)
3. Drives consulting inquiries to GoodFields (conversion)
4. Maintains authentic, open values (differentiation)

---

## Audience & Positioning

### Three Overlapping Audiences (All Must Be Served)

**1. Consulting Leads (CTOs, IT Directors, Technical Leaders)**
- **Need**: Vet consultant expertise before hiring
- **Looking for**: Security + AI credentials, real project work, clear service offerings
- **Success metric**: Click "Let's Work Together" → Contact form submission
- **Content**: FabLab infrastructure work, security architecture posts, AI ROI articles

**2. Peer Technologists (Infrastructure Engineers, Security Practitioners)**
- **Need**: Learn from real-world implementations, join practitioner community
- **Looking for**: Build logs, technical depth, reusable patterns
- **Success metric**: Join GBAIC (Greybeard AI Collective), bookmark site, share articles
- **Content**: FabLab technical details, Bob/PAI system design, field guides

**3. General Readers (Curious Generalists, Career Changers)**
- **Need**: Understand AI trends, learn about self-hosting, personal infrastructure
- **Looking for**: Accessible explanations, philosophy, ADHD-friendly tooling insights
- **Success metric**: Subscribe to Cognitive Loop, engage with community
- **Content**: Cognitive Loop posts, StillPoint philosophy, accessibility focus

### Positioning Statement

**Current** (app/page.tsx line 13):
> "I build open, useful systems so more people can thrive."

**Problem**: Philosophical but not specific. Doesn't mention AI, security, or consulting expertise.

**Recommended** (from HOMEPAGE_DESIGN_SPECS.md):
> "I build secure, open AI systems"

**Subheading**:
> "Helping technical teams navigate AI risks with practical frameworks. Transparent processes. Reusable tools. No fluff."

**Why This Works**:
- **Secure** = Security expertise visible
- **Open** = Values alignment (transparency, open-source)
- **AI systems** = Keyword for SEO + consulting positioning
- **Practical frameworks** = Consultant value proposition
- **No fluff** = Authentic voice, differentiates from corporate consultants

---

## Site Architecture

### Current Structure (Before Refactor)

```
/                    - Homepage (hero + compass + projects grid)
/blog                - Blog listing (20 posts, all infrastructure/workflow)
/blog/[slug]         - Individual posts
/projects            - Projects showcase (4 cards, minimal)
/loop                - Cognitive Loop redirect to Substack
/community           - Community page (Discord link)
/work                - Work With Me page (2 sentences only)
/colophon            - Site details (tech stack, philosophy)
/privacy             - Privacy policy
/rss                 - RSS feed
```

### Refactored Structure (After Implementation)

```
/                    - Homepage (REFACTORED - split hero, headshot, clear CTAs)
/about               - About page (NEW - professional bio, headshot, credentials)
/work                - Work/Services page (EXPANDED - 3 service packages, pricing framework)
/projects            - Projects hub (ENHANCED - FabLab, Bob/PAI, TaskMan with build logs)
/projects/[slug]     - Individual project pages (NEW - timeline, build-log integration)
/blog                - Blog listing (ENHANCED - filter by topic, search)
/blog/[slug]         - Individual posts (improved layout, related posts)
/guides              - Field guides listing (NEW - technical tutorials, how-tos)
/guides/[slug]       - Individual guides (NEW)
/loop                - Cognitive Loop archive (ENHANCED - local copy + Substack link)
/community           - Community page (ENHANCED - GBAIC positioning, join flow)
/colophon            - Site details (unchanged)
/privacy             - Privacy policy (unchanged)
/rss                 - RSS feed (unchanged)
```

### Information Architecture Principles

1. **Consulting leads path**: Homepage → About → Work → Contact (3 clicks max)
2. **Peer technologists path**: Homepage → Projects → Build Logs → GBAIC (discovery → depth → community)
3. **General readers path**: Homepage → Blog → Cognitive Loop → Subscribe (browse → engage → subscribe)
4. **All paths converge**: Every page has CTAs for all three audiences (primary/secondary/tertiary hierarchy)

---

## Page-by-Page Specifications

### 1. Homepage (/) - REFACTOR

**File**: `app/page.tsx` (65 lines currently)

**Current Problems**:
- No professional headshot (Louise: "You should have your face on it")
- Headline doesn't mention AI or security expertise
- CTAs are equal weight (no hierarchy = visitor confusion)
- Compass card uses valuable real estate but doesn't drive action

**Refactored Structure**:

```tsx
// SECTION 1: Hero (Split Layout - Text + Headshot)
<section className="hero-section">
  <Container>
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Left Column - Text */}
      <div>
        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          I build secure, open AI systems
        </h1>
        <p className="mt-6 text-xl text-zinc-300 leading-relaxed">
          Helping technical teams navigate AI risks with practical frameworks.
          Transparent processes. Reusable tools. No fluff.
        </p>

        {/* CTA Group - Primary/Secondary Hierarchy */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="/work" className="btn-primary">
            Let's Work Together
          </a>
          <a href="/projects" className="btn-secondary">
            Explore My Work
          </a>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 flex items-center gap-6 text-sm text-zinc-400">
          <span>✓ 15+ years infrastructure</span>
          <span>✓ Security-first AI</span>
          <span>✓ Open-source advocate</span>
        </div>
      </div>

      {/* Right Column - Headshot */}
      <div className="relative">
        <div className="aspect-[4/5] rounded-lg overflow-hidden border-2 border-zinc-700">
          <Image
            src="/images/headshot.jpg"
            alt="Wally Kroeker, AI Security Consultant"
            width={600}
            height={750}
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  </Container>
</section>

// SECTION 2: Value Proposition (Replaces Compass Card)
<section className="mt-24">
  <Container>
    <h2 className="text-3xl font-semibold mb-8">What I Do</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <ValueCard
        icon="🔒"
        title="Security-First AI"
        description="Build guardrails before features. Design security that enables speed, not slows it down."
        link="/work"
      />
      <ValueCard
        icon="🏗️"
        title="Infrastructure as Proof"
        description="FabLab demonstrates enterprise patterns at home-lab scale. Real infrastructure, real lessons."
        link="/projects/fablab"
      />
      <ValueCard
        icon="🤝"
        title="Pragmatic AI Adoption"
        description="Cut through hype. ROI-focused strategies for technical teams evaluating AI pilots."
        link="/blog"
      />
    </div>
  </Container>
</section>

// SECTION 3: Featured Projects (Enhanced)
<section className="mt-24">
  <Container>
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-semibold">Recent Projects</h2>
      <a href="/projects" className="text-zinc-400 hover:text-zinc-100">
        View all projects →
      </a>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      {/* Project cards with enhanced metadata */}
      <ProjectCard
        slug="fablab"
        title="FabLab Infrastructure"
        description="Enterprise-grade home lab: Proxmox, Authentik IdP, Cloudflare tunnels, self-hosted services"
        status="Active"
        tech={["Proxmox", "Docker", "Authentik", "Cloudflare"]}
        lastUpdated="Dec 7, 2025"
      />
      <ProjectCard
        slug="bob-and-friends"
        title="Bob & Personal AI Infrastructure (PAI)"
        description="ADHD-optimized AI assistant built on Claude Code with custom skills, hooks, and workflows"
        status="Active"
        tech={["Claude Code", "TypeScript", "N8N", "Git"]}
        lastUpdated="Dec 13, 2025"
      />
    </div>
  </Container>
</section>

// SECTION 4: Latest Writing (New)
<section className="mt-24">
  <Container>
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-semibold">Latest Writing</h2>
      <a href="/blog" className="text-zinc-400 hover:text-zinc-100">
        View all posts →
      </a>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* Show 4 most recent posts */}
      <BlogPostCard {...latestPosts[0]} />
      <BlogPostCard {...latestPosts[1]} />
    </div>
  </Container>
</section>

// SECTION 5: Community CTA (Replaces current tertiary links)
<section className="mt-24 bg-zinc-900 rounded-xl p-12">
  <Container>
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-semibold mb-4">
        Join the Greybeard AI Collective
      </h2>
      <p className="text-zinc-300 mb-8">
        Practitioner community for infrastructure engineers and security folks
        navigating AI adoption. Real experiences. No vendor pitches.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <a href="/community" className="btn-secondary">
          Learn More
        </a>
        <a href="https://discord.gg/XXXXX" className="btn-outline">
          Join Discord
        </a>
      </div>
    </div>
  </Container>
</section>
```

**Design Specifications** (from HOMEPAGE_DESIGN_SPECS.md):

- **Headshot Requirements**:
  - Size: 2000×2600px minimum (or optimize to 1200×1560px)
  - Format: JPG or WebP
  - Framing: 2-3px border with `border-zinc-700`
  - Expression: Professional but approachable
  - Lighting: Warm (not cool/blue), bright clothing preferred
  - Alt text: "Wally Kroeker, AI Security Consultant"

- **Button Styles**:
  ```css
  .btn-primary {
    @apply px-6 py-3 bg-white text-zinc-950 rounded-lg font-semibold
           hover:bg-zinc-100 transition-colors;
  }

  .btn-secondary {
    @apply px-6 py-3 border-2 border-zinc-700 text-zinc-100 rounded-lg
           font-semibold hover:bg-zinc-900 transition-colors;
  }

  .btn-outline {
    @apply px-6 py-3 border border-zinc-600 text-zinc-300 rounded-lg
           hover:border-zinc-500 hover:text-zinc-100 transition-colors;
  }
  ```

**Performance Targets**:
- Headshot image: <50KB (Next.js Image optimization)
- Cumulative Layout Shift (CLS): <0.1
- First Contentful Paint (FCP): <1.5s
- Total page weight: <150KB

---

### 2. About Page (/about) - NEW PAGE

**File**: `app/about/page.tsx` (create new)

**Purpose**: Professional bio + credentials + personal story (builds trust for consulting leads)

**Content Structure**:

```tsx
export default function AboutPage() {
  return (
    <Container className="max-w-4xl py-16">
      {/* Header with larger headshot */}
      <div className="grid md:grid-cols-5 gap-12 mb-16">
        <div className="md:col-span-2">
          <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-zinc-700">
            <Image
              src="/images/headshot-about.jpg"
              alt="Wally Kroeker"
              width={600}
              height={800}
              className="object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <h1 className="text-4xl font-semibold mb-4">About Wally</h1>
          <p className="text-xl text-zinc-300 leading-relaxed">
            Technical Architect and Eclectic Generalist focused on building
            secure AI systems that reduce cognitive overhead through automation.
          </p>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/work" className="btn-primary">Work With Me</a>
            <a href="https://linkedin.com/in/wallykroeker" className="btn-outline">
              LinkedIn
            </a>
            <a href="mailto:wally@goodfields.io" className="btn-outline">
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <Prose>
        <h2>Background</h2>
        <p>
          I've spent 15+ years building infrastructure, designing security
          systems, and helping organizations adopt technology pragmatically.
          My work bridges three domains that rarely overlap: infrastructure
          operations, security architecture, and AI adoption strategy.
        </p>

        <h2>What I Bring to Consulting</h2>
        <ul>
          <li>
            <strong>Security-First AI Design</strong>: I help teams build
            guardrails before features, designing security that enables speed
            instead of slowing it down.
          </li>
          <li>
            <strong>Infrastructure Credibility</strong>: My FabLab project
            demonstrates enterprise patterns at home-lab scale. Real Proxmox
            clusters, Authentik IdP, Cloudflare tunnels, self-hosted services.
          </li>
          <li>
            <strong>Pragmatic AI Strategy</strong>: I cut through vendor hype
            to focus on ROI. If your AI pilot looks good in demos but won't
            scale to production, I'll tell you why—and how to fix it.
          </li>
        </ul>

        <h2>Current Projects</h2>
        <p>
          I'm building in public across three initiatives:
        </p>
        <ul>
          <li>
            <strong>GoodFields Consulting</strong>: AI security and infrastructure
            consulting for technical teams
          </li>
          <li>
            <strong>FabLab</strong>: Enterprise-grade home lab infrastructure
            (Proxmox, containers, IdP, networking)
          </li>
          <li>
            <strong>Bob & Personal AI Infrastructure (PAI)</strong>: ADHD-optimized
            AI assistant system built on Claude Code
          </li>
        </ul>

        <h2>Philosophy</h2>
        <p>
          I believe in <strong>openness</strong> (transparent build logs, reusable
          tools), <strong>usefulness</strong> (solve real problems, no fluff),
          and <strong>community</strong> (practitioner-led learning, no vendor pitches).
        </p>

        <p>
          Technology should serve presence, not distraction. This philosophy
          drives my work on <a href="/loop">Cognitive Loop</a> and the broader
          <a href="https://stillpoint.cloud">StillPoint</a> project.
        </p>

        <h2>Personal</h2>
        <p>
          I live in Winnipeg, Canada. When not building infrastructure or
          consulting, I'm writing fiction that explores AI consciousness and
          parent-child relationships in the age of artificial intelligence.
        </p>

        <p>
          I have ADHD, which shapes how I build systems: low friction, high
          automation, externalized memory, minimal cognitive overhead.
        </p>
      </Prose>

      {/* CTA Footer */}
      <div className="mt-16 p-8 bg-zinc-900 rounded-xl text-center">
        <h3 className="text-2xl font-semibold mb-4">Let's Work Together</h3>
        <p className="text-zinc-300 mb-6">
          If you're evaluating AI adoption, need security architecture review,
          or want infrastructure design guidance, I'd love to help.
        </p>
        <a href="/work" className="btn-primary">
          View Services & Pricing
        </a>
      </div>
    </Container>
  );
}
```

**Content Checklist**:
- [ ] Professional headshot (larger than homepage, same image or alternate angle)
- [ ] 3-4 paragraph bio (background, expertise, current projects)
- [ ] Credentials section (years of experience, domains of expertise)
- [ ] Philosophy statement (values: openness, usefulness, community)
- [ ] Personal details (location, ADHD context, fiction writing)
- [ ] CTA to /work page (primary conversion goal)

**SEO**:
- Meta title: "About Wally Kroeker - AI Security Consultant & Infrastructure Architect"
- Meta description: "Technical architect with 15+ years experience in infrastructure, security, and pragmatic AI adoption. Based in Winnipeg, Canada."

---

### 3. Work/Services Page (/work) - EXPAND

**File**: `app/work/page.tsx` (currently only 2 sentences)

**Current State** (from CONTENT_AUDIT_REPORT.md):
> Score: 3/10
> "I work with founders, technical leaders, and organizations to design robust systems that align with their goals and values."

**Problem**:
- No service descriptions
- No pricing framework
- No value proposition
- No social proof
- No clear next steps

**Refactored Structure**:

```tsx
export default function WorkPage() {
  return (
    <Container className="max-w-5xl py-16">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <h1 className="text-4xl font-semibold mb-6">Work With Me</h1>
        <p className="text-xl text-zinc-300 leading-relaxed">
          I help technical teams navigate AI adoption with security-first
          strategies, pragmatic frameworks, and transparent processes.
          No vendor pitches. No fluff. Just experienced guidance.
        </p>
      </div>

      {/* Service Packages */}
      <div className="mb-20">
        <h2 className="text-3xl font-semibold mb-8">Services</h2>

        <div className="space-y-8">
          {/* Service 1: AI Security Assessment */}
          <ServiceCard
            title="AI Security Assessment"
            price="$5,000 - $12,000"
            duration="2-4 weeks"
            description="Evaluate your AI systems for security risks before they reach production. I review architecture, data flow, access controls, and guardrails—then deliver a prioritized remediation roadmap."
            includes={[
              "Security architecture review (infrastructure, API, data flow)",
              "Threat modeling for AI-specific risks (prompt injection, data leakage, model extraction)",
              "Guardrail assessment (input validation, output filtering, rate limiting)",
              "Prioritized remediation roadmap with cost/effort estimates",
              "2 follow-up sessions (implementation support)"
            ]}
            bestFor="Teams evaluating AI pilots or preparing for production launch"
          />

          {/* Service 2: AI Strategy & ROI Analysis */}
          <ServiceCard
            title="AI Strategy & ROI Analysis"
            price="$8,000 - $15,000"
            duration="3-5 weeks"
            description="Cut through vendor hype. I help you evaluate AI opportunities, calculate real ROI (not pilot metrics), and design implementation roadmaps that account for production realities."
            includes={[
              "Current state assessment (workflows, pain points, AI readiness)",
              "Use case evaluation (feasibility, cost, risk, ROI projection)",
              "Vendor/tool comparison (LLM APIs, self-hosted models, frameworks)",
              "Implementation roadmap (phased approach, resource requirements)",
              "Pilot design framework (how to test if it'll actually work)",
              "3 follow-up sessions (ongoing strategy refinement)"
            ]}
            bestFor="CTOs and IT directors evaluating AI investments"
          />

          {/* Service 3: Infrastructure Design & Advisory */}
          <ServiceCard
            title="Infrastructure Design & Advisory"
            price="$10,000 - $20,000"
            duration="4-8 weeks"
            description="Design resilient, secure infrastructure for AI workloads or modernize existing systems. I bring 15+ years of infrastructure experience plus real-world patterns from FabLab (my home lab that runs enterprise patterns)."
            includes={[
              "Architecture design (compute, networking, storage, security)",
              "Technology selection (Proxmox vs VMware, Kubernetes vs Docker, cloud vs on-prem)",
              "Security hardening (IdP integration, zero trust, access control)",
              "Deployment roadmap (phased migration, rollback plans)",
              "Documentation & runbooks (handoff to your team)",
              "Ongoing advisory (monthly check-ins for 3 months)"
            ]}
            bestFor="Organizations modernizing infrastructure or scaling AI workloads"
          />
        </div>
      </div>

      {/* Pricing Philosophy */}
      <div className="mb-20 p-8 bg-zinc-900 rounded-xl">
        <h3 className="text-2xl font-semibold mb-4">Pricing Philosophy</h3>
        <p className="text-zinc-300 mb-4">
          I charge based on value delivered, not hours logged. Ranges reflect
          project complexity, org size, and timeline constraints.
        </p>
        <p className="text-zinc-300">
          <strong>Typical engagement</strong>: $8,000 - $15,000 for 3-5 weeks
          of focused work (strategy + implementation guidance).
        </p>
      </div>

      {/* Process */}
      <div className="mb-20">
        <h2 className="text-3xl font-semibold mb-8">How We Work Together</h2>

        <div className="grid md:grid-cols-4 gap-8">
          <ProcessStep
            number="1"
            title="Initial Call"
            description="Free 60-minute discovery call to understand your challenge and determine fit."
          />
          <ProcessStep
            number="2"
            title="Proposal"
            description="I send a detailed proposal with scope, deliverables, timeline, and fixed pricing."
          />
          <ProcessStep
            number="3"
            title="Kick-off"
            description="We align on goals, review technical context, and establish communication rhythm."
          />
          <ProcessStep
            number="4"
            title="Execution"
            description="I deliver work in weekly increments with regular check-ins and transparent documentation."
          />
        </div>
      </div>

      {/* Social Proof */}
      <div className="mb-20">
        <h2 className="text-3xl font-semibold mb-8">What Clients Say</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* NOTE: Add real testimonials when available */}
          <Testimonial
            quote="[Testimonial placeholder - gather from Rees, Josh, or other clients post-engagement]"
            author="Client Name"
            role="Title, Company"
          />
        </div>

        <p className="mt-8 text-zinc-400 text-sm">
          Currently building client portfolio. First engagements underway
          (December 2025 - January 2026).
        </p>
      </div>

      {/* CTA */}
      <div className="text-center p-12 bg-zinc-900 rounded-xl">
        <h2 className="text-3xl font-semibold mb-4">Let's Talk</h2>
        <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
          Book a free 60-minute call to discuss your AI security, strategy,
          or infrastructure challenges. No obligation. No sales pitch.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a href="mailto:wally@goodfields.io?subject=Consulting Inquiry"
             className="btn-primary">
            Email: wally@goodfields.io
          </a>
          <a href="https://calendly.com/XXXXX" className="btn-secondary">
            Schedule Call
          </a>
        </div>
      </div>
    </Container>
  );
}
```

**Content Requirements**:
- [ ] 3 service packages defined (AI Security, Strategy, Infrastructure)
- [ ] Pricing ranges established (transparent but flexible)
- [ ] Value proposition for each service (what problem it solves)
- [ ] Process overview (how engagement works)
- [ ] Testimonials section (add post-client work)
- [ ] Clear CTA (email + Calendly link)

**Component Definitions**:

```tsx
// components/ServiceCard.tsx
interface ServiceCardProps {
  title: string;
  price: string;
  duration: string;
  description: string;
  includes: string[];
  bestFor: string;
}

function ServiceCard({ title, price, duration, description, includes, bestFor }: ServiceCardProps) {
  return (
    <div className="p-8 border-2 border-zinc-800 rounded-xl hover:border-zinc-700 transition">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{price}</div>
          <div className="text-sm text-zinc-400">{duration}</div>
        </div>
      </div>

      <p className="text-zinc-300 mb-6">{description}</p>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-zinc-400 uppercase mb-3">
          What's Included
        </h4>
        <ul className="space-y-2">
          {includes.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span className="text-zinc-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-zinc-800">
        <p className="text-sm text-zinc-400">
          <strong>Best for:</strong> {bestFor}
        </p>
      </div>
    </div>
  );
}
```

---

### 4. Projects Hub (/projects) - ENHANCE

**File**: `app/projects/page.tsx` (currently basic grid)

**Current State**:
- Simple grid of 4 project cards
- Minimal metadata (title, description only)
- No filtering or search
- No build log integration

**Enhanced Structure**:

```tsx
export default function ProjectsPage() {
  return (
    <Container className="py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-semibold mb-4">Projects</h1>
        <p className="text-xl text-zinc-300 max-w-3xl">
          Building in public. Transparent build logs, reusable patterns, and
          real infrastructure lessons. All open-source or documented openly.
        </p>
      </div>

      {/* Filter/Search (Phase 2 - optional for now) */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3">
          <FilterButton active>All Projects</FilterButton>
          <FilterButton>Infrastructure</FilterButton>
          <FilterButton>AI & Automation</FilterButton>
          <FilterButton>Security</FilterButton>
          <FilterButton>Completed</FilterButton>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Active Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <EnhancedProjectCard
            slug="fablab"
            title="FabLab Infrastructure"
            description="Enterprise-grade home lab demonstrating Proxmox clustering, Authentik IdP, Cloudflare tunnels, and self-hosted services at scale"
            status="Active"
            stage="Phase 3 Complete"
            tech={["Proxmox", "Docker", "Authentik", "Cloudflare", "OPNsense"]}
            lastUpdated="Dec 7, 2025"
            milestoneCount={12}
            image="/images/projects/fablab-hero.png"
          />

          <EnhancedProjectCard
            slug="bob-and-friends"
            title="Bob & Personal AI Infrastructure (PAI)"
            description="ADHD-optimized AI assistant system built on Claude Code with custom skills, hooks, publishing workflows, and memory systems"
            status="Active"
            stage="Daily Use"
            tech={["Claude Code", "TypeScript", "N8N", "Git", "MCP"]}
            lastUpdated="Dec 13, 2025"
            milestoneCount={8}
            image="/images/projects/bob-hero.png"
          />
        </div>
      </div>

      {/* Other Projects */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Other Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ProjectCard
            slug="taskman"
            title="TaskMan (Vikunja Fork)"
            description="Enhanced task management with AI breakdown, Linear-style shortcuts, and workflow automation"
            status="Paused"
          />

          <ProjectCard
            slug="wallykroeker-com"
            title="wallykroeker.com"
            description="This site - Next.js 14, dark-first design, privacy-conscious, git-first publishing"
            status="Active"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center p-12 bg-zinc-900 rounded-xl">
        <h3 className="text-2xl font-semibold mb-4">
          Want to Learn How I Built This?
        </h3>
        <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
          Join the Greybeard AI Collective for deep-dives, build logs, and
          practitioner discussions on infrastructure, security, and AI.
        </p>
        <a href="/community" className="btn-primary">
          Join the Community
        </a>
      </div>
    </Container>
  );
}
```

**Enhanced Project Card Component**:

```tsx
// components/EnhancedProjectCard.tsx
interface EnhancedProjectCardProps {
  slug: string;
  title: string;
  description: string;
  status: "Active" | "Paused" | "Completed";
  stage: string;
  tech: string[];
  lastUpdated: string;
  milestoneCount: number;
  image?: string;
}

function EnhancedProjectCard({
  slug,
  title,
  description,
  status,
  stage,
  tech,
  lastUpdated,
  milestoneCount,
  image
}: EnhancedProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`}
          className="block group border-2 border-zinc-800 rounded-xl overflow-hidden
                     hover:border-zinc-700 transition">
      {/* Hero Image (optional) */}
      {image && (
        <div className="aspect-video bg-zinc-900 overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={800}
            height={450}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-4">
          <StatusBadge status={status} />
          <span className="text-sm text-zinc-400">{stage}</span>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-semibold mb-3 group-hover:text-white transition">
          {title}
        </h3>
        <p className="text-zinc-300 mb-4">{description}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tech.map((item) => (
            <span key={item}
                  className="px-2 py-1 text-xs bg-zinc-900 text-zinc-400 rounded">
              {item}
            </span>
          ))}
        </div>

        {/* Footer Metadata */}
        <div className="flex items-center justify-between text-sm text-zinc-400 pt-4 border-t border-zinc-800">
          <span>{milestoneCount} milestones</span>
          <span>Updated {lastUpdated}</span>
        </div>
      </div>
    </Link>
  );
}
```

---

### 5. Individual Project Pages (/projects/[slug]) - NEW

**File**: `app/projects/[slug]/page.tsx` (create new dynamic route)

**Purpose**: Unified project hub showing overview + timeline (blog posts + build log milestones)

**Structure**:

```tsx
export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Load project data
  const projectIndex = await getProjectIndex(slug); // content/projects/{slug}/index.md
  const buildLog = await getProjectBuildLog(slug);   // content/projects/{slug}/build-log.md
  const relatedPosts = await getPostsByProject(slug); // blog posts tagged with project

  return (
    <Container className="max-w-5xl py-16">
      {/* Project Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <StatusBadge status={projectIndex.status} />
          <span className="text-zinc-400">{projectIndex.stage}</span>
        </div>

        <h1 className="text-4xl font-semibold mb-4">{projectIndex.title}</h1>
        <p className="text-xl text-zinc-300">{projectIndex.description}</p>

        {/* Links */}
        {projectIndex.links && (
          <div className="mt-6 flex flex-wrap gap-3">
            {projectIndex.links.repo && (
              <a href={projectIndex.links.repo} className="btn-secondary">
                View Code →
              </a>
            )}
            {projectIndex.links.demo && (
              <a href={projectIndex.links.demo} className="btn-outline">
                Live Demo
              </a>
            )}
          </div>
        )}
      </div>

      {/* Project Overview (from index.md content) */}
      <Prose className="mb-16">
        <div dangerouslySetInnerHTML={{ __html: projectIndex.contentHtml }} />
      </Prose>

      {/* Timeline (aggregated from blog posts + build log) */}
      <div>
        <h2 className="text-3xl font-semibold mb-8">Timeline</h2>

        <div className="space-y-8">
          {/* Combine and sort by date descending */}
          {getProjectTimeline(relatedPosts, buildLog).map((entry) => (
            <TimelineEntry key={entry.id} {...entry} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 p-8 bg-zinc-900 rounded-xl">
        <h3 className="text-2xl font-semibold mb-4">
          Want Updates on This Project?
        </h3>
        <p className="text-zinc-300 mb-6">
          Follow the build log for detailed milestones, or subscribe to the
          blog for high-level updates and lessons learned.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/blog" className="btn-secondary">
            Read the Blog
          </a>
          <a href={projectIndex.links.docs} className="btn-outline">
            View Build Log
          </a>
        </div>
      </div>
    </Container>
  );
}
```

**Timeline Aggregation Logic** (from CLAUDE.md):

```tsx
// lib/projectUpdates.ts
interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  type: "blog-post" | "milestone";
  excerpt: string;
  link: string;
}

function getProjectTimeline(
  relatedPosts: BlogPost[],
  buildLog: BuildLog
): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  // Add blog posts (filtered by projects frontmatter array)
  relatedPosts
    .filter(post => isPubliclyVisible(post)) // three-gate check
    .forEach(post => {
      entries.push({
        id: `post-${post.slug}`,
        date: post.date,
        title: post.title,
        type: "blog-post",
        excerpt: post.description || extractExcerpt(post.content),
        link: `/blog/${post.slug}`
      });
    });

  // Add build log milestones (each H2 section is a milestone)
  buildLog.milestones.forEach(milestone => {
    entries.push({
      id: `milestone-${milestone.slug}`,
      date: milestone.date, // parsed from H2 heading "## YYYY-MM-DD — Title"
      title: milestone.title,
      type: "milestone",
      excerpt: milestone.summary, // first paragraph or AI-generated summary
      link: `/projects/${slug}/build-log#${milestone.slug}`
    });
  });

  // Sort by date descending
  return entries.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
```

---

### 6. Blog (/blog) - ENHANCE

**File**: `app/blog/page.tsx`

**Current State**: Basic listing of all posts

**Enhanced Features**:
- Filter by topic/tag
- Search functionality
- Featured posts section
- Related posts suggestions

**Structure**:

```tsx
export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPosts = posts.filter(p => p.featured).slice(0, 3);
  const recentPosts = posts.slice(0, 20);

  return (
    <Container className="py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-semibold mb-4">Blog</h1>
        <p className="text-xl text-zinc-300 max-w-3xl">
          Transparent build logs, security insights, and pragmatic AI adoption
          strategies. No fluff. No vendor pitches. Just real experience.
        </p>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Featured</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map(post => (
              <FeaturedPostCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      )}

      {/* Filter/Search */}
      <div className="mb-8 flex flex-wrap gap-3">
        <FilterButton active>All Posts</FilterButton>
        <FilterButton>AI & Security</FilterButton>
        <FilterButton>Infrastructure</FilterButton>
        <FilterButton>Build Logs</FilterButton>
        <FilterButton>Guides</FilterButton>
      </div>

      {/* Post Listing */}
      <div className="space-y-8">
        {recentPosts.map(post => (
          <BlogPostListItem key={post.slug} {...post} />
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mt-16 p-12 bg-zinc-900 rounded-xl text-center">
        <h3 className="text-2xl font-semibold mb-4">Get New Posts via Email</h3>
        <p className="text-zinc-300 mb-6">
          Biweekly updates on AI security, infrastructure patterns, and build logs.
          No spam. Unsubscribe anytime.
        </p>
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg
                       text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
          />
          <button className="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </Container>
  );
}
```

**New Component: BlogPostListItem**

```tsx
// components/BlogPostListItem.tsx
interface BlogPostListItemProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime?: string;
}

function BlogPostListItem({
  slug,
  title,
  date,
  description,
  tags,
  readingTime
}: BlogPostListItemProps) {
  return (
    <article className="border-b border-zinc-800 pb-8">
      <Link href={`/blog/${slug}`} className="group">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-2xl font-semibold group-hover:text-white transition">
            {title}
          </h2>
          <time className="text-sm text-zinc-400 whitespace-nowrap ml-4">
            {formatDate(date)}
          </time>
        </div>

        <p className="text-zinc-300 mb-4">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag}
                    className="px-2 py-1 text-xs bg-zinc-900 text-zinc-400 rounded">
                {tag}
              </span>
            ))}
          </div>

          {readingTime && (
            <span className="text-sm text-zinc-500">{readingTime} min read</span>
          )}
        </div>
      </Link>
    </article>
  );
}
```

---

### 7. Blog Post Template (/blog/[slug]) - ENHANCE

**File**: `app/blog/[slug]/page.tsx`

**Current State**: Basic post rendering

**Enhanced Features**:
- Reading time estimate
- Table of contents (for long posts)
- Related posts
- Share buttons
- Project references (if post is part of project timeline)

**Structure**:

```tsx
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  const relatedPosts = await getRelatedPosts(post.tags, params.slug);

  return (
    <Container className="max-w-4xl py-16">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4 text-sm text-zinc-400">
          <time>{formatDate(post.date)}</time>
          <span>•</span>
          <span>{post.readingTime} min read</span>

          {/* Project Reference */}
          {post.projects && post.projects.length > 0 && (
            <>
              <span>•</span>
              <span>
                Part of{" "}
                {post.projects.map((slug, i) => (
                  <span key={slug}>
                    <Link href={`/projects/${slug}`}
                          className="text-zinc-300 hover:text-white">
                      {getProjectName(slug)}
                    </Link>
                    {i < post.projects.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          {post.title}
        </h1>

        {post.description && (
          <p className="text-xl text-zinc-300">{post.description}</p>
        )}

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag}
                  className="px-3 py-1 text-sm bg-zinc-900 text-zinc-300 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Table of Contents (for long posts) */}
      {post.headings && post.headings.length > 3 && (
        <div className="mb-12 p-6 bg-zinc-900 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
          <nav className="space-y-2">
            {post.headings.map(heading => (
              <a key={heading.slug}
                 href={`#${heading.slug}`}
                 className="block text-zinc-400 hover:text-zinc-100 transition"
                 style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}>
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Post Content */}
      <Prose>
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </Prose>

      {/* Post Footer */}
      <footer className="mt-16 pt-8 border-t border-zinc-800">
        {/* Share Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-zinc-400">Share:</span>
          <ShareButton platform="twitter" url={getPostUrl(post.slug)} />
          <ShareButton platform="linkedin" url={getPostUrl(post.slug)} />
          <ShareButton platform="email" url={getPostUrl(post.slug)} />
        </div>

        {/* Author CTA */}
        <div className="p-8 bg-zinc-900 rounded-xl">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <Image
                src="/images/headshot.jpg"
                alt="Wally Kroeker"
                width={80}
                height={80}
                className="rounded-full border-2 border-zinc-700"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">About Wally</h3>
              <p className="text-zinc-300 mb-4">
                I help technical teams navigate AI adoption with security-first
                strategies and pragmatic frameworks. 15+ years infrastructure,
                security, and consulting experience.
              </p>
              <div className="flex gap-3">
                <a href="/work" className="btn-secondary">Work With Me</a>
                <a href="/about" className="btn-outline">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Related Posts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.slice(0, 2).map(post => (
              <RelatedPostCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
```

---

## Component Library

### Core Components to Create

All components follow dark-first design with zinc color palette.

#### 1. Button Variants

```tsx
// components/Button.tsx
type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function Button({ variant = "primary", children, className, ...props }: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950";

  const variantStyles = {
    primary: "bg-white text-zinc-950 hover:bg-zinc-100 focus:ring-white",
    secondary: "border-2 border-zinc-700 text-zinc-100 hover:bg-zinc-900 focus:ring-zinc-700",
    outline: "border border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 focus:ring-zinc-600"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### 2. Status Badge

```tsx
// components/StatusBadge.tsx
type Status = "Active" | "Paused" | "Completed";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Active: "bg-green-500/10 text-green-400 border-green-500/20",
    Paused: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Completed: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  };

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
}
```

#### 3. Value Card (Homepage)

```tsx
// components/ValueCard.tsx
interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
  link: string;
}

export function ValueCard({ icon, title, description, link }: ValueCardProps) {
  return (
    <Link href={link}
          className="group p-6 border-2 border-zinc-800 rounded-xl
                     hover:border-zinc-700 transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition">
        {title}
      </h3>
      <p className="text-zinc-300">{description}</p>
      <div className="mt-4 text-zinc-400 group-hover:text-zinc-100 transition">
        Learn more →
      </div>
    </Link>
  );
}
```

#### 4. Timeline Entry (Project Pages)

```tsx
// components/TimelineEntry.tsx
interface TimelineEntryProps {
  date: string;
  title: string;
  type: "blog-post" | "milestone";
  excerpt: string;
  link: string;
}

export function TimelineEntry({ date, title, type, excerpt, link }: TimelineEntryProps) {
  const typeStyles = {
    "blog-post": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "milestone": "bg-green-500/10 text-green-400 border-green-500/20"
  };

  return (
    <article className="flex gap-6">
      {/* Date Column */}
      <div className="flex-shrink-0 w-32 text-right">
        <time className="text-sm text-zinc-400">{formatDate(date)}</time>
      </div>

      {/* Content Column */}
      <div className="flex-1 pb-8 border-l-2 border-zinc-800 pl-6">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-2 py-1 text-xs font-medium rounded border ${typeStyles[type]}`}>
            {type === "blog-post" ? "Blog Post" : "Milestone"}
          </span>
        </div>

        <Link href={link} className="group">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition">
            {title}
          </h3>
          <p className="text-zinc-300">{excerpt}</p>
          <div className="mt-2 text-zinc-400 group-hover:text-zinc-100 transition">
            Read more →
          </div>
        </Link>
      </div>
    </article>
  );
}
```

#### 5. Prose Component (Enhanced)

```tsx
// components/Prose.tsx
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      prose prose-invert prose-zinc
      prose-headings:font-semibold
      prose-h1:text-4xl prose-h1:mb-4
      prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
      prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
      prose-p:text-zinc-300 prose-p:leading-relaxed
      prose-a:text-zinc-100 prose-a:underline prose-a:decoration-zinc-700
      hover:prose-a:decoration-zinc-500
      prose-strong:text-zinc-100 prose-strong:font-semibold
      prose-code:text-zinc-300 prose-code:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
      prose-ul:text-zinc-300 prose-ol:text-zinc-300
      prose-li:marker:text-zinc-500
      max-w-none
      ${className}
    `}>
      {children}
    </div>
  );
}
```

---

## Content Requirements

### 1. Professional Headshot

**Critical for trust building** (from HOMEPAGE_REDESIGN_RESEARCH.md):

- **Size**: 2000×2600px minimum (optimize to 1200×1560px for web)
- **Format**: JPG or WebP (<50KB after optimization)
- **Expression**: Professional but approachable
- **Lighting**: Warm tones, good contrast against dark backgrounds
- **Clothing**: Bright colors (white/light preferred for pop against zinc-950 bg)
- **Alt text**: "Wally Kroeker, AI Security Consultant"

**Where to use**:
- Homepage hero (right column, prominent)
- About page (larger version, top section)
- Blog post footer (small circle, 80×80px)

**Options**:
1. Professional photographer ($200-500, best quality)
2. AI headshot service ($30-100, 1-2 hour turnaround)
3. High-quality smartphone photo with good lighting (free, may need editing)

### 2. Service Descriptions (Work Page)

Write detailed service descriptions for three packages:

**AI Security Assessment**:
- What: Security architecture review for AI systems
- For whom: Teams preparing for production AI launch
- Deliverables: Threat model, remediation roadmap, implementation support
- Price range: $5,000 - $12,000
- Duration: 2-4 weeks

**AI Strategy & ROI Analysis**:
- What: Evaluate AI opportunities and calculate real ROI
- For whom: CTOs/IT directors evaluating AI investments
- Deliverables: Use case evaluation, vendor comparison, pilot design framework
- Price range: $8,000 - $15,000
- Duration: 3-5 weeks

**Infrastructure Design & Advisory**:
- What: Design resilient infrastructure for AI workloads
- For whom: Organizations modernizing infrastructure or scaling AI
- Deliverables: Architecture design, deployment roadmap, documentation
- Price range: $10,000 - $20,000
- Duration: 4-8 weeks

### 3. About Page Bio

Write 600-800 word professional bio covering:

- **Background**: 15+ years infrastructure, security, consulting
- **Expertise**: Security-first AI, infrastructure architecture, pragmatic adoption
- **Current projects**: GoodFields, FabLab, Bob/PAI
- **Philosophy**: Openness, usefulness, community (values alignment)
- **Personal**: Location (Winnipeg), ADHD context, fiction writing
- **Differentiation**: Rare combination of infrastructure + security + AI

### 4. Project Descriptions

Update all project index.md files with:

**FabLab** (`content/projects/fablab/index.md`):
- Overview: Enterprise-grade home lab infrastructure
- Goals: Demonstrate production patterns at small scale
- Tech stack: Proxmox, Docker, Authentik, Cloudflare, OPNsense
- Current stage: Phase 3 complete (IdP + DNS)
- Links: GitHub repo, documentation

**Bob/PAI** (`content/projects/bob-and-friends/index.md`):
- Overview: ADHD-optimized AI assistant on Claude Code
- Goals: Reduce cognitive overhead, externalize memory
- Tech stack: Claude Code, TypeScript, N8N, MCP servers
- Current stage: Daily use, continuous improvement
- Links: GitHub fork, PAI upstream

**TaskMan** (`content/projects/taskman/index.md`):
- Overview: Enhanced Vikunja with AI task breakdown
- Goals: Linear-style shortcuts, workflow automation
- Tech stack: Vikunja (Go), N8N, PostgreSQL
- Current stage: Paused (Dec 2025)
- Links: GitHub fork

### 5. Blog Content Strategy

**From CONTENT_STRATEGY_EXECUTIVE_SUMMARY.md**:

**Publishing cadence**: Biweekly (every 2 weeks), Tuesdays at 9 AM

**Next 3 articles** (ready to schedule):

1. **"The AI ROI Trap: Why Your Pilots Always Look Good (And How to Tell If They'll Actually Work)"**
   - Publish: January 7, 2026
   - Angle: Consultant perspective on production failure
   - Target: CTO/IT leaders evaluating AI
   - Word count: 3,000-3,500
   - CTA: GoodFields "AI Strategy" service

2. **"Security-First AI: How to Build Guardrails Before You Build Features"**
   - Publish: February 4, 2026
   - Angle: Good security enables faster AI
   - Target: Security teams, compliance orgs
   - Word count: 2,500-3,000
   - CTA: GoodFields "Security Assessment"

3. **"Building Your Home Lab as a Learning Tool: From Proxmox to Production Patterns"**
   - Publish: February 18 or March 4, 2026
   - Angle: FabLab architecture + credibility
   - Target: Infrastructure engineers
   - Word count: 3,000-3,500
   - CTA: FabLab project + GBAIC

**Content pillars** (maintain balance):
- AI Pragmatism: 40%
- Infrastructure: 30%
- Consulting Authority: 20%
- GBAIC Community: 10%

### 6. SEO Metadata

Update all pages with proper meta tags:

```tsx
// app/layout.tsx or individual pages
export const metadata = {
  title: "Wally Kroeker - AI Security Consultant & Infrastructure Architect",
  description: "I help technical teams navigate AI adoption with security-first strategies and pragmatic frameworks. 15+ years infrastructure and security experience.",
  keywords: ["AI security", "infrastructure architecture", "pragmatic AI adoption", "consulting", "FabLab", "Proxmox"],
  openGraph: {
    title: "Wally Kroeker - AI Security Consultant",
    description: "Security-first AI strategies for technical teams",
    images: ["/images/og-image.jpg"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Wally Kroeker - AI Security Consultant",
    description: "Security-first AI strategies for technical teams",
    images: ["/images/og-image.jpg"]
  }
};
```

**Page-specific titles**:
- Homepage: "Wally Kroeker - AI Security Consultant & Infrastructure Architect"
- About: "About Wally Kroeker - AI Security Consultant"
- Work: "Work With Me - AI Security & Infrastructure Consulting"
- Projects: "Projects - Building in Public"
- Blog: "Blog - AI Security, Infrastructure, Build Logs"

---

## Implementation Sequence

### Phase 1: Foundation (Week 1) - CRITICAL PATH

**Goal**: Get professional headshot + update homepage positioning

**Tasks**:
1. [ ] **Acquire headshot** (2-3 days)
   - Option A: Schedule professional photographer
   - Option B: Use AI headshot service (PhotoRoom, ProfilePicture.ai)
   - Option C: High-quality smartphone photo with editing

2. [ ] **Refactor homepage** (6-8 hours)
   - Implement split hero layout (text + headshot)
   - Update headline: "I build secure, open AI systems"
   - Add trust signals ("15+ years infrastructure", "Security-first AI")
   - Create CTA hierarchy (primary: "Let's Work Together", secondary: "Explore My Work")
   - Replace Compass card with Value Proposition section (3 cards)
   - Add Featured Projects section with enhanced metadata
   - Add Latest Writing section (2 recent posts)
   - Add GBAIC community CTA section

3. [ ] **Update components** (2-3 hours)
   - Create `Button` component with variants
   - Create `ValueCard` component
   - Create `StatusBadge` component
   - Create `EnhancedProjectCard` component
   - Update `Prose` component with better styling

4. [ ] **Test & deploy** (1 hour)
   - Local testing (`pnpm dev`)
   - Build test (`pnpm build`)
   - Deploy to production (`scripts/deploy.sh`)
   - Verify headshot loads correctly
   - Check mobile responsiveness

**Success Criteria**:
- Headshot appears correctly on homepage (dark-mode framed)
- Headline explicitly mentions AI + security
- CTAs have clear visual hierarchy
- Homepage score improves from 5/10 to 8/10

---

### Phase 2: About & Work Pages (Week 2)

**Goal**: Build trust and drive consulting conversions

**Tasks**:
1. [ ] **Create About page** (4-6 hours)
   - Write 600-800 word bio
   - Add larger headshot (hero section)
   - Structure: Background, Expertise, Current Projects, Philosophy, Personal
   - Add quick links (Work With Me, LinkedIn, Email)
   - Add CTA footer (Work With Me)
   - Create `app/about/page.tsx`

2. [ ] **Expand Work page** (6-8 hours)
   - Write 3 service package descriptions
   - Create `ServiceCard` component
   - Add pricing philosophy section
   - Add "How We Work Together" process (4 steps)
   - Add testimonials section (placeholder for now)
   - Add CTA with email + Calendly link
   - Update `app/work/page.tsx`

3. [ ] **Content creation** (4-5 hours)
   - Draft service descriptions (AI Security, Strategy, Infrastructure)
   - Define pricing ranges ($5K-$20K depending on service)
   - Write process steps (Initial Call → Proposal → Kick-off → Execution)
   - Draft About bio (background, expertise, projects, philosophy, personal)

4. [ ] **SEO optimization** (1-2 hours)
   - Add meta tags to About page
   - Add meta tags to Work page
   - Create structured data for services (JSON-LD)
   - Test with Google Rich Results

**Success Criteria**:
- About page score: 8/10 (professional bio + headshot + values)
- Work page score: 9/10 (clear services + pricing + process)
- Clear conversion path: Homepage → About → Work → Contact

---

### Phase 3: Projects & Build Logs (Week 2-3)

**Goal**: Demonstrate technical credibility through project documentation

**Tasks**:
1. [ ] **Enhance Projects hub** (4-5 hours)
   - Add filter buttons (All, Infrastructure, AI, Security, Completed)
   - Add search functionality (optional Phase 4)
   - Create Featured Projects section (FabLab, Bob/PAI)
   - Add Other Projects section (TaskMan, wallykroeker.com)
   - Create `EnhancedProjectCard` component
   - Update `app/projects/page.tsx`

2. [ ] **Create project page template** (6-8 hours)
   - Implement dynamic route `app/projects/[slug]/page.tsx`
   - Build timeline aggregation logic (`lib/projectUpdates.ts`)
   - Create `TimelineEntry` component
   - Add project header (status, stage, links)
   - Add project overview (from index.md)
   - Add timeline (blog posts + build log milestones)
   - Add CTA footer (subscribe, view build log)

3. [ ] **Update project index files** (2-3 hours)
   - Write `content/projects/fablab/index.md`
   - Write `content/projects/bob-and-friends/index.md`
   - Write `content/projects/taskman/index.md`
   - Write `content/projects/wallykroeker-com/index.md`
   - Ensure frontmatter follows schema (status, stage, links)

4. [ ] **Build log formatting** (2-3 hours)
   - Ensure all build-log.md files follow H2 format
   - Verify dates parse correctly (YYYY-MM-DD)
   - Add GitHub commit links to all milestones
   - Test timeline aggregation logic

**Success Criteria**:
- Projects page shows 2 featured + 2 other projects
- Individual project pages load correctly
- Timeline aggregates blog posts + build log milestones
- Build logs display with proper formatting + GitHub links

---

### Phase 4: Blog Enhancements (End of Week 3)

**Goal**: Improve blog discoverability and engagement

**Tasks**:
1. [ ] **Enhance blog listing** (3-4 hours)
   - Add filter by topic/tag
   - Add Featured Posts section (3 posts)
   - Create `BlogPostListItem` component
   - Add newsletter subscribe CTA
   - Update `app/blog/page.tsx`

2. [ ] **Improve blog post template** (4-5 hours)
   - Add reading time estimate
   - Add table of contents (for posts >3 headings)
   - Add related posts section (2 posts)
   - Add share buttons (Twitter, LinkedIn, Email)
   - Add author CTA with headshot
   - Add project reference (if part of project timeline)
   - Update `app/blog/[slug]/page.tsx`

3. [ ] **Publish first new article** (8-10 hours)
   - Edit "2025 Year of the Agent" (3,400 words already written)
   - Add headshot to article if relevant
   - Create LinkedIn teasers (3-5 posts)
   - Schedule for January 7, 2026
   - Set up RSS feed distribution

4. [ ] **SEO for blog** (2-3 hours)
   - Add blog-specific meta tags
   - Create sitemap.xml with all posts
   - Submit to Google Search Console
   - Test structured data for articles

**Success Criteria**:
- Blog listing shows featured posts + all posts
- Blog posts have TOC, related posts, share buttons
- "2025 Year of the Agent" published and distributed
- RSS feed working correctly

---

### Phase 5: Polish & Launch (End of Week 3)

**Goal**: Final QA, performance optimization, and public launch

**Tasks**:
1. [ ] **Performance optimization** (2-3 hours)
   - Optimize all images (headshot, project images, OG images)
   - Run Lighthouse audit (target: 90+ on all metrics)
   - Minimize bundle size (code splitting if needed)
   - Test loading speed on slow connections

2. [ ] **Accessibility audit** (2-3 hours)
   - Run axe DevTools audit
   - Verify keyboard navigation works
   - Check color contrast ratios (WCAG AA)
   - Add missing alt text
   - Test with screen reader (NVDA or VoiceOver)

3. [ ] **Cross-browser testing** (2 hours)
   - Test on Chrome, Firefox, Safari
   - Test on mobile (iOS Safari, Chrome Android)
   - Verify dark mode works correctly
   - Check responsive breakpoints

4. [ ] **Content audit** (2-3 hours)
   - Proofread all pages (homepage, about, work, projects, blog)
   - Check all links work (internal + external)
   - Verify all images load
   - Test all CTAs (buttons, forms, links)

5. [ ] **Launch preparation** (1-2 hours)
   - Update social media bios with new site link
   - Create OG image for homepage
   - Schedule announcement posts (LinkedIn, Twitter)
   - Draft email to warm leads (Rees, Josh) with new site

6. [ ] **Deploy & monitor** (1 hour)
   - Final production deploy
   - Monitor error logs for 24 hours
   - Track initial traffic (Google Analytics if added)
   - Gather feedback from trusted peers

**Success Criteria**:
- Lighthouse score: 90+ (Performance, Accessibility, Best Practices, SEO)
- No broken links or images
- All CTAs functional
- Site announced publicly

---

## Success Metrics

### Immediate Metrics (Week 1-2 After Launch)

**Engagement**:
- Time on page (Homepage): Target +15% vs current
- Scroll depth (Homepage): Target 70%+ reach "Projects" section
- Bounce rate: Target <60%

**Conversion**:
- Clicks to "Let's Work Together" CTA: New baseline (track)
- Visitors to /work page: New baseline (track)
- Email inquiries: Target 2-3 in first 2 weeks

**Technical**:
- Page load time: <2 seconds on 3G
- Cumulative Layout Shift (CLS): <0.1
- Largest Contentful Paint (LCP): <2.5s

### 30-Day Metrics (Month 1)

**Traffic**:
- Monthly visitors: Target 500+ (up from current ~200)
- Organic search traffic: Target 100+ visitors
- Referral traffic from LinkedIn: Target 50+ visitors

**Engagement**:
- Pages per session: Target 2.5+
- Average session duration: Target 3+ minutes
- Return visitor rate: Target 20%+

**Conversion**:
- Consulting inquiries: Target 5-7 total
- Email subscribers: Target 50+
- GBAIC Discord joins: Target 20+

### 90-Day Metrics (Quarter 1)

**Business Impact**:
- Consulting inquiries: Target 15-20 total
- Qualified leads: Target 5-7 (from inquiries)
- Closed deals: Target 2-3 projects ($15K-$50K revenue)

**Content Performance**:
- Blog posts published: 6 (biweekly cadence)
- Email subscribers: Target 100+
- GBAIC members: Target 50+

**SEO**:
- Keywords ranking: "AI security consultant", "infrastructure architect"
- Backlinks: Target 10+ from quality sources
- Domain authority: Establish baseline

### 6-Month Metrics (Mid-2026)

**Thought Leadership**:
- Monthly blog visitors: Target 3,000+
- Email list: Target 200+
- GBAIC: Target 100+
- LinkedIn followers: Target +300 from launch

**Business Results**:
- Consulting pipeline: $50-100K+ in qualified opportunities
- Closed projects: 2-3 worth $50-100K+
- Speaking invitations: 1+ (podcast/conference)

---

## Reference Documents

This refactor guide synthesizes the following research documents:

### Content Audit & Research (Dec 9, 2025)

1. **CONTENT_AUDIT_REPORT.md** (2,600 lines)
   - Current state analysis (scores 3-6/10 across pages)
   - Gap analysis (missing About page, weak Work page)
   - Security expertise visibility (2/10 score)
   - Louise's feedback: "You should have your face on it"

2. **HOMEPAGE_REDESIGN_RESEARCH.md** (30KB)
   - Analysis of 6 consultant homepage patterns
   - Split-layout vs card overlay vs sidebar patterns
   - Headshot psychology (75-90% of first impressions visual)
   - Recommendation: Start with card overlay, upgrade to split-hero later

3. **HOMEPAGE_DESIGN_SPECS.md** (29KB)
   - Technical specifications with code examples
   - Headline optimization workbook (4 variations tested)
   - CTA strategy with audience segmentation
   - Dark-mode specific design guidance
   - Performance specs (<50KB images, CLS <0.1)

4. **REDESIGN_SUMMARY.md** (14KB)
   - Executive summary of redesign research
   - Three implementation options (Quick Win, Medium, Full)
   - Timeline recommendations (Week 1-4 breakdown)
   - Success metrics framework

### Content Strategy (Dec 9, 2025)

5. **CONTENT_STRATEGY_EXECUTIVE_SUMMARY.md** (7KB)
   - Biweekly publishing cadence (starting Jan 7, 2026)
   - Next 3 articles planned and outlined
   - Content pillars (AI 40%, Infrastructure 30%, Consulting 20%, GBAIC 10%)
   - 90-day roadmap with KPIs
   - 6-month targets (3K visitors, 200 subscribers, 100 GBAIC members)

6. **CONTENT_CALENDAR_STRATEGY.md** (34KB referenced, not read this session)
   - Full strategic framework (12 sections)
   - Article frameworks and templates
   - Repurposing playbook (1 article → 5-7 pieces)

### Current Implementation

7. **app/page.tsx** (65 lines)
   - Current homepage structure
   - Headline: "I build open, useful systems so more people can thrive."
   - Compass card (values)
   - Projects grid (4 cards)

8. **README.md**
   - Technical architecture
   - Deployment workflow
   - Publishing Loop system

### Business Context (Telos Skill)

9. **goodfields.md** (GoodFields Consulting)
   - G1: First paid client (Rees quote Dec 2, Josh meeting Dec 16)
   - R1: Living on UI, need first client within 3-6 months
   - 5+ warm leads active
   - "2025 Year of the Agent" article complete (3,400 words)

10. **fablab.md** (FabLab Infrastructure)
    - G4 Phase 3 COMPLETE (Authentik IdP, enterprise DNS)
    - Demonstrates production patterns at home-lab scale
    - Serves GoodFields positioning (technical credibility)

11. **personal.md** (Personal Context)
    - Confidence level: "I am feeling more confident the work will come if I invest the time" (Dec 9)
    - ADHD context (shapes tooling, workflow automation focus)

---

## Final Notes for Implementation

### Critical Success Factors

1. **Headshot is non-negotiable**: Every study shows faces increase trust 40-50%. Get professional photo before Phase 1.

2. **Positioning must mention AI + Security**: Current headline is philosophical but not specific. "I build secure, open AI systems" is the minimum viable positioning.

3. **CTA hierarchy matters**: Primary CTA (Let's Work Together) must be visually dominant. Secondary and tertiary CTAs support discovery but don't compete.

4. **Content compounds over time**: SEO takes 3-6 months. Commit to biweekly publishing for 6 months before judging results.

5. **Three-audience balance**: Every page must serve consulting leads, peer technologists, and general readers. Don't optimize for one at expense of others.

### Implementation Tips

- **Start with Phase 1**: Don't skip to later phases. Foundation (headshot + homepage) drives 80% of trust building.

- **Use existing components**: Site already has `Container`, `Header`, `Footer`, `Prose`. Build on these, don't rebuild from scratch.

- **Test incrementally**: Deploy each phase to production and measure before moving to next phase.

- **Gather feedback early**: Share with trusted peers (Louise, consulting leads, GBAIC members) after Phase 1.

- **Document decisions**: Use git commit messages to track why changes were made. Reference this guide in commits.

### Known Risks & Mitigations

**Risk 1: Headshot delays Phase 1**
- Mitigation: Use AI headshot service for speed ($30-100, 1-2 hour turnaround)
- Alternative: Proceed with headline/CTA updates, add headshot in Phase 1.5

**Risk 2: About page bio takes longer than expected**
- Mitigation: Use ChatGPT/Claude to draft bio from existing content, edit for voice
- Alternative: Ship minimal bio in Phase 2, expand in Phase 5

**Risk 3: Timeline aggregation logic is complex**
- Mitigation: Start with simple listing (blog posts only), add build log milestones in Phase 4
- Alternative: Skip timeline aggregation, link directly to build-log.md

**Risk 4: Content creation overwhelms schedule**
- Mitigation: Repurpose existing content (README, project docs, telos data)
- Alternative: Launch with placeholder text, fill in over Phases 2-4

---

## Next Steps

1. **Review this guide** (30-60 minutes)
   - Confirm strategic direction aligns with goals
   - Identify any missing requirements
   - Flag concerns or questions

2. **Acquire headshot** (2-3 days)
   - Option A: Schedule professional photographer
   - Option B: Use AI headshot service (recommended for speed)
   - Option C: Smartphone photo with editing

3. **Begin Phase 1 implementation** (6-10 hours)
   - Pass this guide to coding agent
   - Implement homepage refactor
   - Test and deploy

4. **Monitor & iterate** (ongoing)
   - Track metrics after each phase
   - Gather user feedback
   - Adjust based on results

---

**Status**: Ready for implementation
**Estimated total effort**: 60-80 hours (2-3 weeks at 30-40 hrs/week)
**Expected ROI**: $50-100K+ consulting pipeline by Q3 2026

**Questions or clarifications?** Reference the documents listed in "Reference Documents" section above or ask for specific guidance on any phase.
