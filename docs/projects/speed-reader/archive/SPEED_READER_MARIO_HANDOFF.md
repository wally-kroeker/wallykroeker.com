# Speed Reader - Implementation Handoff to Mario

**From:** Bill (Architect)
**To:** Mario (Engineer)
**Date:** 2026-01-16
**Status:** Design Complete → Ready for Implementation

---

## TL;DR

Build an RSVP speed reader at `/app/tools/speed-reader/`. All design decisions made, component specs finalized. Estimated 8-12 hours over 3 days. All code patterns provided in SPEED_READER_TECHNICAL_DESIGN.md.

**MVP Scope:**
- Single-word RSVP display with ORP highlighting
- Play/pause, speed control (100-1000 WPM), rewind/FF/reset
- Progress bar with stats
- Text paste input + sample loader
- Keyboard shortcuts (Space, arrows, Esc)
- Mobile responsive, dark theme only
- WPM persistence (localStorage)

**Out of Scope (Phase 2):**
- Context words (previous/next faded)
- Animations (instant word changes)
- URL loading
- Reading stats tracking
- Light mode

---

## File Structure to Create

```
app/tools/speed-reader/
├── page.tsx                 // Route + metadata + layout
├── Reader.tsx               // Main orchestrator + keyboard handling
├── WordDisplay.tsx          // RSVP word with ORP
├── Controls.tsx             // Playback + speed controls
├── ProgressBar.tsx          // Progress + stats
├── TextInput.tsx            // Paste area + load buttons
├── useRSVPReader.ts         // Main state hook
├── useLocalStorage.ts       // WPM persistence
├── utils.ts                 // Pure functions (ORP, delay, parse)
└── types.ts                 // TypeScript interfaces
```

**Plus:** CSS additions to `app/globals.css`

---

## Component Hierarchy

```
page.tsx
  └── Reader (orchestrator)
      ├── TextInput (left column)
      └── ReaderDisplay (right column)
          ├── WordDisplay (RSVP)
          ├── ProgressBar
          └── Controls
```

---

## Implementation Order (3 Days)

### Day 1: Core Logic + Basic Display (3-4 hours)

**Tasks:**
1. Create file structure
2. Copy types, utils, hooks from SPEED_READER_TECHNICAL_DESIGN.md
3. Implement `useRSVPReader.ts` (state management hook)
4. Build `page.tsx` (route + header)
5. Build `Reader.tsx` (layout + keyboard shortcuts)
6. Build `WordDisplay.tsx` (basic version)
7. Test: Load text, see words advance with ORP highlighting

**Acceptance:**
- [ ] Words display one at a time
- [ ] ORP character is red and bold
- [ ] Play/pause works (click word display)
- [ ] Timing is correct (300 WPM = 200ms per word)

### Day 2: Full UI (3-4 hours)

**Tasks:**
1. Implement `Controls.tsx` (all buttons + slider + presets)
2. Implement `ProgressBar.tsx`
3. Implement `TextInput.tsx`
4. Wire everything together in `Reader.tsx`
5. Add keyboard shortcuts (Space, arrows, Esc)
6. Test all interactions

**Acceptance:**
- [ ] All playback controls work (rewind, FF, reset)
- [ ] Speed slider and presets work
- [ ] Progress bar updates in real-time
- [ ] Text input loads correctly
- [ ] Keyboard shortcuts functional

### Day 3: Polish + Mobile + Persistence (2-4 hours)

**Tasks:**
1. Implement `useLocalStorage.ts`
2. Add WPM persistence to `Reader.tsx`
3. Add CSS to `globals.css` (button styles, slider)
4. Mobile responsive testing (DevTools)
5. Add completion state ("Finished!" message)
6. Cross-browser testing (Chrome, Firefox, Safari)
7. Accessibility check (keyboard nav, focus indicators)

**Acceptance:**
- [ ] WPM persists across page reloads
- [ ] Mobile layout works (stacked, thumb-reachable controls)
- [ ] Completion message shows at end
- [ ] No console errors
- [ ] Works in Chrome, Firefox, Safari

---

## Key Technical Decisions (Already Made)

### 1. Timer Strategy: `setTimeout` (not `requestAnimationFrame`)
```typescript
// In useRSVPReader hook
setTimeout(() => {
  advanceWord()
}, calculateDelay(word, wpm))
```
**Why:** Simpler, sufficient precision, easier to debug.

### 2. WPM Calculation
```typescript
// Base delay
const delay = 60000 / wpm // milliseconds per word

// Add for punctuation
if (word.endsWith(',')) delay += 100
if (word.endsWith('.')) delay += 300

// Minimum 100ms (prevent visual strain)
return Math.max(delay, 100)
```

### 3. ORP Formula
```typescript
function getORP(word: string): number {
  if (word.length <= 1) return 0
  if (word.length <= 3) return Math.floor(word.length / 2)
  return Math.floor(word.length / 2) - 1
}
```
**Examples:**
- "reading" (7 chars) → ORP at index 2 → `re[a]ding`
- "technology" (10 chars) → ORP at index 4 → `tech[n]ology`

### 4. No Animations (MVP)
- Instant word changes (no fade/scale)
- Reduces complexity, maintains reading speed
- Phase 2: Add as user preference

### 5. Single-Word Display (MVP)
- No context words (previous/next)
- Pure RSVP implementation
- Phase 2: Add faded context as option

### 6. Completion Handling
```typescript
// In WordDisplay
if (currentIndex >= totalWords && totalWords > 0) {
  return (
    <div onClick={reset}>
      <p className="text-2xl">Finished!</p>
      <p className="text-zinc-400">Click to restart</p>
    </div>
  )
}
```

---

## Color & Style Guide

**Palette (Zinc scale + Blue/Red accents):**
- Background: `bg-zinc-950`
- Cards: `bg-zinc-900`
- Borders: `border-zinc-800`
- Hover: `bg-zinc-800`
- Text primary: `text-zinc-100`
- Text secondary: `text-zinc-400`
- Buttons: `bg-blue-600` (primary), `bg-zinc-800` (secondary)
- ORP: `text-red-500 font-bold`

**Typography:**
- Word display: `text-5xl md:text-6xl font-mono`
- Headings: `text-3xl md:text-4xl`
- Body: `text-base`
- Small: `text-sm`

**Layout:**
- Container: `max-w-7xl mx-auto px-4 py-8`
- Desktop: Two-column grid `grid md:grid-cols-2 gap-8`
- Mobile: Stacked (default)

---

## Sample Text for "Load Sample"

```typescript
const SAMPLE_TEXT = `Speed reading is a collection of techniques which attempt to increase reading speed without an unacceptable reduction in comprehension or retention. RSVP (Rapid Serial Visual Presentation) is one of the most effective methods. It presents text one word at a time at a fixed location, eliminating the need for eye movement. The Optimal Recognition Point (ORP) is the specific character in a word that the eye naturally focuses on for fastest recognition. By aligning the ORP with a fixed focal point, reading speed can increase from typical 200-300 words per minute to 500-1000+ words per minute.`
```

---

## CSS to Add to globals.css

```css
/* Speed Reader Components */

.word-display-container {
  @apply bg-zinc-900 border border-zinc-800 rounded-lg;
  @apply min-h-[200px] flex flex-col items-center justify-center;
  @apply p-8 md:p-12 transition-colors duration-200;
}

.word-display-container:hover {
  @apply bg-zinc-800 border-zinc-700;
}

.word-display-container:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-950;
}

.control-btn-primary {
  @apply p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ring-offset-zinc-950;
  @apply w-14 h-14 flex items-center justify-center;
}

.control-btn-secondary {
  @apply p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ring-offset-zinc-950;
  @apply w-12 h-12 flex items-center justify-center;
}

.preset-btn {
  @apply flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ring-offset-zinc-950;
}

.preset-btn.active {
  @apply bg-blue-600 hover:bg-blue-700;
}

.speed-slider {
  @apply h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer;
}

.speed-slider::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}

.speed-slider::-moz-range-thumb {
  @apply w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-0;
}
```

---

## Dependencies (Already in Project)

**Required:**
- ✓ React 18
- ✓ Next.js 14
- ✓ TypeScript
- ✓ Tailwind CSS

**Icons (optional, recommended):**
- `lucide-react` (Play, Pause, Rewind, FastForward, RotateCcw)
- **Or:** Use Unicode symbols if not installed (▶, ❚❚, ◄◄, ►►, ⟲)

**Add if missing:**
```bash
npm install lucide-react
```

---

## Testing Checklist

**Before Handoff to Bob:**
- [ ] Text loads and displays
- [ ] RSVP playback works (250, 350, 600 WPM tested)
- [ ] All controls functional (play, pause, speed, rewind, FF, reset)
- [ ] Keyboard shortcuts work (Space, arrows, Esc)
- [ ] Progress bar updates accurately
- [ ] WPM persists on reload
- [ ] Mobile layout renders correctly (Chrome DevTools iPhone)
- [ ] Completion state shows "Finished!" message
- [ ] No console errors or warnings
- [ ] Focus indicators visible (Tab through all controls)

**Cross-Browser (if time):**
- [ ] Chrome/Edge (primary)
- [ ] Firefox (secondary)
- [ ] Safari desktop (if Mac available)

---

## Code References

**Full implementations in:**
- `SPEED_READER_TECHNICAL_DESIGN.md` (this is your main reference)
- `SPEED_READER_TECHNICAL_REFERENCE.md` (Riker's code examples)

**Copy-paste ready:**
- All TypeScript interfaces in Section 3.1 (types.ts)
- All utility functions in Section 3.2 (utils.ts)
- Complete useRSVPReader hook in Section 3.3
- Complete useLocalStorage hook in Section 3.4
- All component code in Section 2 (page.tsx, Reader.tsx, etc.)

---

## Questions for Bob Before Starting

1. **Icon Library:** Use lucide-react (need to install) or Unicode symbols?
2. **URL Route:** Confirmed `/app/tools/speed-reader/` or different path?
3. **Navigation:** Add to Header.tsx now or wait for Phase 4?

**If no blockers, proceed with implementation starting Day 1 tasks.**

---

## Expected Outcome

**After 3 days:**
- Working RSVP speed reader at `/tools/speed-reader`
- All MVP features functional
- Mobile responsive
- WPM persistence
- Ready for QA and launch

**Bundle Size Estimate:** <100KB (pure React, no heavy dependencies)

**Performance:** <2s page load, smooth playback at all WPM settings

---

## Phase 2 Features (Future)

**Not in MVP, but documented for later:**
1. Blog integration ("Read with RSVP" button on posts)
2. URL loading (fetch + parse articles)
3. Reading stats (total words, average WPM, streaks)
4. Context words (previous/next faded)
5. Light mode theme
6. Font customization

---

**Good luck, Mario. This is a straightforward build with clear specs. The research and design work is done—now it's execution.**

**Questions?** Check SPEED_READER_TECHNICAL_DESIGN.md or ping Bob.

---

**— Bill**
*"The plans are solid. Build it clean, test it thoroughly, ship it fast."*
