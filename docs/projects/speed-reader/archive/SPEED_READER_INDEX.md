# Speed Reader - Documentation Index

**Welcome, Mario.** This is your central navigation hub for the Speed Reader implementation.

---

## Quick Start (Start Here)

**You have 10 documents. Here's how to use them:**

### 1. Get Oriented (5 minutes)
Start with these to understand what you're building:

- **SPEED_READER_MARIO_README.md** ← **Read this first**
  - Your implementation plan (3-day roadmap)
  - File structure, testing checklist, critical notes
  - Everything you need to get started

- **SPEED_READER_QUICK_REFERENCE.md**
  - One-page summary of critical decisions
  - Component specs, keyboard shortcuts, accessibility
  - Keep this open in a tab while implementing

---

### 2. Detailed Specifications (Reference as Needed)

**UX & Design:**

- **SPEED_READER_UX_SPECIFICATION.md** (Howard's full spec)
  - Complete UX decisions with rationale (answers to all open questions)
  - Accessibility requirements (WCAG 2.1 AA)
  - Copy/messaging, state machine, user flows
  - **Use this when:** You need to know WHY a decision was made

- **SPEED_READER_UX_WIREFRAMES.md** (Riker's wireframes)
  - Visual layouts (desktop + mobile)
  - Component breakdowns, responsive breakpoints
  - **Use this when:** You need to see the layout visually

**Technical Implementation:**

- **SPEED_READER_TECHNICAL_REFERENCE.md** (Riker's code examples)
  - Complete TypeScript implementations
  - Utility functions (getORP, formatWord, calculateDelay)
  - React hooks and component patterns
  - **Use this when:** You need code examples to copy/adapt

- **SPEED_READER_COMPONENT_HIERARCHY.md** (Howard's architecture)
  - Component tree structure
  - Data flow diagrams
  - State management, ARIA attributes
  - **Use this when:** You need to understand how components fit together

---

### 3. Implementation Tracking

- **SPEED_READER_IMPLEMENTATION_CHECKLIST.md**
  - Day-by-day task checklist
  - Mark items as `[x]` when complete
  - **Use this to:** Track progress and ensure nothing is missed

---

### 4. Background Context (Optional)

- **SPEED_READER_RESEARCH.md** (Riker's research)
  - Why RSVP works (science + UX)
  - Competitive analysis
  - **Use this when:** You're curious about the research behind decisions

- **SPEED_READER_IMPLEMENTATION_ROADMAP.md**
  - Original 3-day plan
  - **Use this when:** You want to see the original project planning

- **SPEED_READER_EXECUTIVE_SUMMARY.md**
  - High-level overview for stakeholders
  - **Use this when:** You need context on the project goals

---

## Suggested Reading Order

### Day 1 Morning (Before Coding)
1. **SPEED_READER_MARIO_README.md** (10 min)
2. **SPEED_READER_QUICK_REFERENCE.md** (5 min)
3. Skim **SPEED_READER_COMPONENT_HIERARCHY.md** (5 min)
4. Open **SPEED_READER_IMPLEMENTATION_CHECKLIST.md** (keep this open all week)

**Total Time:** 20 minutes of reading, then start coding.

### During Implementation (Day 1-3)
Keep these open in browser tabs:
- **SPEED_READER_QUICK_REFERENCE.md** (glance at specs)
- **SPEED_READER_IMPLEMENTATION_CHECKLIST.md** (track progress)
- **SPEED_READER_TECHNICAL_REFERENCE.md** (copy/paste code examples)

When you need detailed answers:
- **SPEED_READER_UX_SPECIFICATION.md** (UX decisions)
- **SPEED_READER_COMPONENT_HIERARCHY.md** (architecture)

### Day 3 (Final Testing)
- **SPEED_READER_IMPLEMENTATION_CHECKLIST.md** (verify every box is checked)
- **SPEED_READER_UX_SPECIFICATION.md** → Section 4 (Accessibility Requirements)

---

## Document Summary Table

| Document | Length | Purpose | When to Read |
|----------|--------|---------|--------------|
| **SPEED_READER_MARIO_README.md** | 7 pages | Your implementation guide | **Start here** |
| **SPEED_READER_QUICK_REFERENCE.md** | 1 page | Critical specs summary | **Keep open during coding** |
| **SPEED_READER_IMPLEMENTATION_CHECKLIST.md** | 5 pages | Task tracking | **Check daily** |
| **SPEED_READER_UX_SPECIFICATION.md** | 46 pages | Complete UX decisions | When you need UX details |
| **SPEED_READER_COMPONENT_HIERARCHY.md** | 8 pages | Architecture & data flow | When building components |
| **SPEED_READER_TECHNICAL_REFERENCE.md** | 26 pages | Code examples | When implementing functions |
| **SPEED_READER_UX_WIREFRAMES.md** | 20 pages | Visual layouts | When building UI |
| **SPEED_READER_RESEARCH.md** | 23 pages | Research & rationale | Optional background |
| **SPEED_READER_IMPLEMENTATION_ROADMAP.md** | 13 pages | Project planning | Optional context |
| **SPEED_READER_EXECUTIVE_SUMMARY.md** | 12 pages | Stakeholder overview | Optional context |

---

## Key Decisions at a Glance

**UX Decisions (from Howard):**
- ✓ Single-word display only (no context words)
- ✓ Completion message + restart button
- ✓ Instant transitions (no animations)
- ✓ Live WPM display while dragging slider
- ✓ Dark theme only (MVP)
- ✓ Respect `prefers-reduced-motion`

**Technical Decisions (from Riker):**
- ✓ ORP formula: `floor(length/2) - 1` for words >3 chars
- ✓ Base delay: `60000 / wpm` ms per word
- ✓ Punctuation pauses: +100ms (commas), +300ms (periods)
- ✓ No external dependencies (pure React + Tailwind)
- ✓ LocalStorage for WPM persistence

**Accessibility (from Howard):**
- ✓ WCAG 2.1 AA compliance (mandatory)
- ✓ All controls keyboard-accessible
- ✓ Touch targets ≥48×48px on mobile
- ✓ ARIA labels on all icon-only buttons
- ✓ Screen reader announcements for state changes

---

## File Structure Overview

```
/app/tools/speed-reader/
├── page.tsx                    (main container)
├── components/
│   ├── WordDisplay.tsx         (word + ORP highlighting)
│   ├── Controls.tsx            (playback + speed)
│   ├── ProgressBar.tsx         (progress + stats)
│   ├── TextInput.tsx           (textarea + load buttons)
│   └── CompletionScreen.tsx    (end screen)
├── hooks/
│   └── useRSVPReader.ts        (core reading logic)
└── utils/
    ├── orp.ts                  (getORP, formatWord)
    ├── timing.ts               (calculateDelay)
    └── text.ts                 (parseText, formatTime)
```

---

## Critical Implementation Notes

### Non-Negotiables
1. **ORP formula must be exact** (don't "improve" it without research)
2. **No animations on word change** (instant transitions only)
3. **WCAG 2.1 AA compliance** (not optional)
4. **Keyboard shortcuts disabled when textarea focused**
5. **Auto-pause on tab blur**

### You Can Adjust
- Exact spacing values (within reasonable bounds)
- Color shades (as long as contrast ratios pass)
- Button icon sizes (20-24px range is fine)
- Animation timing for non-word elements (progress bar, etc.)

---

## Testing Checklist (Before Handoff)

**Functionality:**
- [ ] Words display with correct ORP
- [ ] All controls work (play, pause, rewind, FF, reset)
- [ ] Keyboard shortcuts work
- [ ] Speed adjustment is instant
- [ ] Completion screen shows correct stats

**Accessibility:**
- [ ] VoiceOver/NVDA pass
- [ ] Keyboard-only navigation works
- [ ] Contrast ratios pass (use WebAIM checker)
- [ ] Touch targets ≥48×48px (mobile)

**Responsive:**
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Single column <640px, two columns ≥640px
- [ ] 200% browser zoom works

**Edge Cases:**
- [ ] Empty textarea handled
- [ ] Tab blur auto-pauses
- [ ] Rewind/FF boundaries respected
- [ ] Load new text while playing works

---

## Questions During Implementation?

**Order of escalation:**
1. Check **SPEED_READER_QUICK_REFERENCE.md**
2. Search **SPEED_READER_UX_SPECIFICATION.md** or **SPEED_READER_TECHNICAL_REFERENCE.md**
3. Review **SPEED_READER_COMPONENT_HIERARCHY.md** for architecture questions
4. Ask Bob or Howard in Slack

---

## Success Criteria

**A user should be able to:**
1. Paste text
2. Click "Load Text"
3. Press Space
4. **Read 2-3× faster than normal with full comprehension**

Everything else (controls, stats, accessibility) supports that core experience.

---

## Timeline

- **Day 1:** Core logic + basic UI (word display, play/pause)
- **Day 2:** Full UI + controls + keyboard shortcuts
- **Day 3:** Polish + responsive + accessibility audit

**Total:** 3 days to production-ready MVP.

---

**You've got everything you need. Now go build it.**

Good luck, Mario. We're rooting for you.

— Howard (The Designer)

---

**End of Index**
