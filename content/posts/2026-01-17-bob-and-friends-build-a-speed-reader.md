---
title: "Bob and Friends Build a Speed Reader in Hours"
description: "What happens when you give your AI team an idea during online training? A case study in multi-agent collaboration, unexpected RAM issues, and why delegating to specialized AI agents actually works."
date: 2026-01-17
status: "published"
reviewed: true
sensitivity: "public"
tags:
  - ai
  - agents
  - bobiverse
  - development
  - case-study
  - multi-agent
category: "AI & Infrastructure"
featured: true
image: "/images/bobiverse-team.png"
---

# Bob and Friends Build a Speed Reader in Hours

It started with online training and a reading bottleneck. It ended with a production-ready speed reader, a RAM-induced system crash, and a masterclass in why specialized AI agents beat solo coding every time.

Here's what actually happened.

---

## The Problem: Too Much Text, Not Enough Speed

I was knee-deep in some online training materials—the kind where you know the information is good, but the volume is overwhelming. I remembered those RSVP speed reading tools from years ago (remember Spritz before it shut down?), and thought: "I could really use one of those right now."

Then the obvious question: **Why don't I just... build one?**

Not me personally. I'm a consultant with deliverables. But Bob and the team? They're literally sitting there waiting for interesting problems.

So I pitched it to Bob: "Hey, can you guys build me a speed reader?"

His response, in typical Bob fashion: "Give me a bit to mobilize the team."

---

## Enter the Bobiverse: A Team of Specialized AI Agents

If you're new here, "Bob" isn't just one AI. It's a collection of specialized agents based on the *Bobiverse* book series—each one optimized for different tasks. Think of it like git branching, but for personalities and expertise.

Here's who showed up for the job:

![The Bobiverse Team](/images/bobiverse-team.png)

### The Research Phase: Riker
**Riker** (The Researcher) went first. Enthusiastic, exploratory, and thorough to a fault. His job: figure out if this was even feasible, what the state of the art was, and what we needed to build.

**What Riker delivered:**
- 25,000 words of research documentation
- Competitive analysis (Spritz is dead, Spreeder is outdated, market gap exists)
- Scientific findings on RSVP (Rapid Serial Visual Presentation) technology
- The ORP formula: `floor(word.length / 2) - 1` for Optimal Recognition Point
- Evidence that people can read 2-3x faster with RSVP (250 WPM → 500+ WPM)

Riker's output was comprehensive enough that Bill and Mario wouldn't need to ask a single clarifying question. That's the value of research upfront—eliminate ambiguity before it becomes rework.

### The Architecture Phase: Bill
**Bill** (The Architect) took Riker's research and turned it into a buildable system. Technical, analytical, systematic. No hand-waving, no "we'll figure it out later."

**What Bill delivered:**
- Complete component specifications
- React architecture (hooks, state management, timer strategy)
- Technical decision log (why `setTimeout` instead of `requestAnimationFrame`, why no animations for MVP)
- File structure and naming conventions
- Handoff package for the implementation team

Bill's philosophy: "Measure twice, cut once." He documented every decision so Mario wouldn't have to guess.

### The UX Phase: Howard
**Howard** (The Designer) worked alongside Bill, focusing on the human side. Creative, empathetic, consultative. His job: make sure this thing was actually usable.

**What Howard delivered:**
- UX specifications (12,000 words—he was thorough)
- Accessibility requirements (WCAG 2.1 AA compliance, non-negotiable)
- Wireframes for desktop and mobile
- User flows and state machines
- Copy and messaging ("Finished!" not "Complete!")

Howard's contribution: the tool wouldn't just work—it would work *well*. Keyboard shortcuts, touch targets ≥48px, focus indicators, screen reader support. Not an afterthought.

---

## The Implementation: Where Things Got Interesting

This is where I made the unconventional choice: I delegated the implementation to **Gemini** (via my "Bender" agent—long story, but Bender runs the Gemini CLI as an external process).

Why Gemini instead of Claude for implementation?
1. **Parallel experimentation.** I wanted to see how different AI models handle production code
2. **Bender's personality.** The "weary legend" who's seen it all—good for grinding through implementation
3. **Cost optimization.** Gemini's free tier for experimentation is generous

**What Gemini/Bender delivered:**
- 745 lines of production TypeScript/React code
- 13 files (components, hooks, utilities, types)
- Zero build errors
- 91.3 kB bundle size (target was <100 kB)
- Committed as `27e5473` with proper co-authorship

And it worked. First try. No debugging session, no "let me fix this edge case." Clean implementation from spec.

---

## Plot Twist: The RAM-Induced Crash

Here's where the story gets real.

I was monitoring the build on my Linux dev box (connected via SSH), watching Gemini work through the implementation. Everything was humming along—components being created, tests passing, build pipeline green.

Then my terminal froze.

Not "slow to respond" frozen. Full **unresponsive, kernel panic, hard reboot** frozen.

Turns out I'd been running multiple agent sessions in parallel (because of course I had), and I'd forgotten that my dev box only has 16GB RAM. Between Claude Code, multiple browser tabs with documentation, and Gemini's memory footprint, I'd hit the OOM killer.

**The system rebooted. The tmux session was gone. The build state was lost.**

First reaction: frustration. Second reaction: "Wait, is the code even committed?"

Checked GitHub. Last commit: halfway through the implementation. **Not ideal.**

---

## The Recovery: Mario Steps In

I went to bed. The crash happened, the session was lost, and I figured I'd deal with it in the morning.

When I woke up and checked the project, I had a decision: restart from scratch, or pick up where we left off?

This is where **Mario** (The Engineer) earned his keep.

Mario's personality: pragmatic, thorough, no-nonsense. His job: finish what Bender started, clean up any half-implemented state, and get it across the finish line.

**What Mario did (in about 10 minutes):**
1. Reviewed the partial commit history
2. Read Bill's handoff documentation (all 15 files of it)
3. Picked up exactly where Gemini left off
4. Completed the remaining components
5. Ran the full build pipeline
6. Committed the final code

**The result:** Production-ready speed reader at `/tools/speed-reader`, live on wallykroeker.com.

Ten minutes. Zero drama. Just execution.

---

## The Final Product: What We Actually Built

Try it yourself: [wallykroeker.com/tools/speed-reader](https://wallykroeker.com/tools/speed-reader)

**Features:**
- RSVP display with Optimal Recognition Point (ORP) highlighting
- Speed control: 100-1000 WPM (presets at 250, 350, 450, 600)
- Keyboard shortcuts: Space (play/pause), arrows (rewind/FF), Esc (reset)
- Progress bar with time remaining
- Mobile responsive, dark theme
- WCAG 2.1 AA accessible
- Persistence: your WPM preference saves to localStorage
- No tracking, no analytics, no external dependencies

**Technical stats:**
- 745 lines of code (13 files)
- 91.3 kB bundle size
- TypeScript strict mode, zero build errors
- Pure React + Tailwind (no external libraries)

**Timeline:**
- Afternoon: Research (Riker), Design (Bill + Howard), Implementation start (Gemini/Bender)
- Evening: RAM crash → went to bed
- Next morning: Recovery and completion (Mario, ~10 minutes)

**Total active development time:** A few hours of agent work from idea to production.

---

## Lessons Learned: Why Multi-Agent Actually Works

### 1. Specialization Beats Generalization
Riker researched. Bill architected. Howard designed. Mario implemented. Each agent played to their strengths. No context switching, no "let me figure out this thing I'm not good at."

Compare this to me doing it solo: I'd have skipped research, wing-architected it, ignored accessibility, and spent 3 days debugging edge cases.

### 2. Upfront Research Prevents Rework
Riker's 25,000 words felt excessive at first. But Bill and Mario never asked "what's the ORP formula?" or "how do we handle punctuation pauses?" Because **Riker already answered it.**

Research is the multiplier. Skip it, and you pay the cost 10x during implementation.

### 3. Documentation Enables Handoffs
When my dev box crashed and Gemini's session was lost, Mario picked up seamlessly because **Bill documented everything.**

No "let me read through the code to figure out what they meant." The spec was complete.

### 4. Resilience Through Modularity
The crash could have derailed the entire project. Instead, it was a minor speed bump. Why? Because the work was modular. Riker's research was committed. Bill's design was documented. Gemini's partial code was in git.

When one agent fails, another can continue.

### 5. The Right Tool for the Right Job
I used Gemini for implementation not because it's "better" than Claude, but because **I wanted to experiment.** This is the benefit of a multi-agent system—you're not locked into one model, one approach, one failure mode.

Gemini crashed? Fine. Mario (Claude) finishes it.

---

## The Meta-Lesson: Delegating to AI is Infrastructure Work

Here's the thing most people miss about AI agents: **it's not about the code they write. It's about the system you build around them.**

The speed reader isn't impressive because Gemini wrote 745 lines of TypeScript. It's impressive because:
- I had a **research specialist** (Riker) who knew how to validate an idea
- I had an **architect** (Bill) who could turn research into a buildable plan
- I had a **designer** (Howard) who cared about accessibility and UX
- I had an **engineer** (Mario) who could execute from a spec
- I had **documentation practices** that made handoffs seamless
- I had **git hygiene** that meant a crash wasn't catastrophic

This is infrastructure. This is how you operationalize AI beyond "ChatGPT helped me write a function."

---

## Try It, Then Steal the Approach

The speed reader is live: [wallykroeker.com/tools/speed-reader](https://wallykroeker.com/tools/speed-reader)

Use it. Break it. Tell me what's wrong with it.

But more importantly: **steal the approach.**

You don't need my exact Bobiverse setup. You don't need Claude + Gemini + n8n + Vikunja + tmux. But you *do* need:
1. Specialized agents for different tasks
2. Research before implementation
3. Documentation that survives handoffs
4. Version control that survives crashes
5. The discipline to delegate instead of DIY

Because the alternative is you, alone, at 2am, debugging a speed reader you hand-coded because "it seemed simple."

And believe me: it's never as simple as it seems.

---

## What's Next: Phase 2 Features

The MVP is done, but there's always a Phase 2:
- **Blog integration:** "Read with RSVP" button on every blog post (one-click load)
- **URL loading:** Paste any article URL, we'll fetch and parse it
- **Reading stats:** Track total words read, average WPM, streaks
- **Light mode:** Because not everyone loves dark themes

But that's future work. Right now, I have training materials to finish reading.

At 450 WPM, thanks to Bob and friends.

---

**Project details:**
- **Code:** [GitHub repo](https://github.com/wally-kroeker/wallykroeker.com) (tag: `speed-reader-v1.0`)
- **Documentation:** Full retrospective in `/docs/projects/speed-reader/`
- **Team:** Riker, Bill, Howard, Gemini/Bender, Mario, coordinated by Bob Prime
- **Active work time:** A few hours of agent work (afternoon + 10-minute recovery)

---

*If you're building AI-assisted workflows and want to compare notes, I'm documenting all of this in the [Greybeard AI Collective](https://wallykroeker.com/community). We meet weekly. Bring your war stories.*
