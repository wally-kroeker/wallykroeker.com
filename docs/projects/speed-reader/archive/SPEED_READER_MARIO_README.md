# Speed Reader - Implementation Package for Mario

**Status:** Design complete. Ready for implementation.
**Estimated Time:** 3 days
**Priority:** High (portfolio feature)

---

## What You're Building

An RSVP (Rapid Serial Visual Presentation) speed reader that displays one word at a time with ORP (Optimal Recognition Point) highlighting. Users can read 2-3× faster than normal with full comprehension.

**Core Experience:**
1. User pastes text
2. Presses Space
3. Reads at 300-600 WPM (adjustable)

---

## Documentation Map

### Start Here
1. **SPEED_READER_QUICK_REFERENCE.md** ← **Read this first**
   - One-page summary of critical decisions
   - Component specs, keyboard shortcuts, accessibility checklist
   - Everything you need for 80% of the work

### Deep Dive (When Needed)
2. **SPEED_READER_UX_SPECIFICATION.md** (Howard's full spec)
   - Complete UX decisions with rationale
   - Accessibility requirements (WCAG 2.1 AA)
   - State machine, user flows, edge cases
   - Copy/messaging, mobile interactions

3. **SPEED_READER_UX_WIREFRAMES.md** (Riker's research)
   - Visual layouts (desktop + mobile)
   - Design philosophy and component breakdowns
   - Responsive breakpoints

4. **SPEED_READER_TECHNICAL_REFERENCE.md** (Riker's code examples)
   - Complete TypeScript implementations
   - Utility functions (getORP, formatWord, calculateDelay)
   - React hooks and component patterns

### Context (Optional)
5. **SPEED_READER_RESEARCH.md** (Riker's analysis)
   - Why RSVP works (science + UX)
   - Competitive analysis
   - Why we chose this approach

6. **SPEED_READER_IMPLEMENTATION_ROADMAP.md**
   - Original 3-day plan (still valid)
   - Day-by-day breakdown

---

## Your Implementation Plan

### Day 1: Core Logic + Basic UI
**Goal:** Get words displaying with correct ORP highlighting and timing.

**Tasks:**
1. Create file structure: `/app/tools/speed-reader/`
2. Implement utilities:
   - `utils/orp.ts` → `getORP()`, `formatWord()`
   - `utils/timing.ts` → `calculateDelay()`
   - `utils/text.ts` → `parseText()`
3. Create custom hook: `hooks/useRSVPReader.ts`
4. Build minimal UI:
   - `components/WordDisplay.tsx` (word with ORP highlighting)
   - `page.tsx` (basic layout with play/pause)

**Success Criteria:**
- Words display one at a time
- ORP character is red and bold
- Timing matches expected WPM (350 WPM ≈ 171ms per word)
- Play/Pause works

---

### Day 2: Full UI + Controls + Keyboard
**Goal:** All features working, fully interactive.

**Tasks:**
1. Build remaining components:
   - `components/Controls.tsx` (buttons + slider + presets)
   - `components/ProgressBar.tsx` (progress + stats)
   - `components/TextInput.tsx` (textarea + load buttons)
   - `components/CompletionScreen.tsx` (end screen)
2. Wire up all controls:
   - Speed adjustment (slider + presets)
   - Rewind / Fast Forward (±10 words)
   - Reset to beginning
3. Implement keyboard shortcuts (Space, ←/→, Esc, +/-)
4. Add progress tracking (word count, time remaining)

**Success Criteria:**
- All controls functional
- Keyboard shortcuts work (test with Tab navigation)
- Progress bar updates in real-time
- Speed adjustment takes effect immediately

---

### Day 3: Polish + Responsive + Accessibility
**Goal:** Production-ready. Passes all accessibility tests.

**Tasks:**
1. Mobile optimization:
   - Test on iOS Safari and Android Chrome
   - Verify touch targets ≥48×48px
   - Test responsive layouts (single column <640px, two columns ≥640px)
2. Accessibility audit:
   - Add all ARIA labels (`aria-label`, `aria-pressed`, `role="progressbar"`)
   - Test with VoiceOver (macOS) or NVDA (Windows)
   - Verify focus indicators (2px blue ring on all interactive elements)
   - Check contrast ratios (use WebAIM checker)
3. Persistence:
   - Save WPM to localStorage
   - Load saved WPM on mount
4. Edge cases:
   - Auto-pause on tab blur (`document.visibilitychange`)
   - Clamp rewind/FF at boundaries
   - Handle empty textarea (disable Load button)
5. Final testing:
   - Keyboard-only navigation (no mouse)
   - 200% browser zoom (text must remain functional)
   - Sample text loading
   - Completion screen flow

**Success Criteria:**
- Works on mobile (real device testing)
- Passes WCAG 2.1 AA (VoiceOver/NVDA, contrast, keyboard)
- No bugs in edge cases
- WPM preference persists across sessions

---

## Critical Implementation Notes

### ORP Formula (Non-Negotiable)
```typescript
function getORP(word: string): number {
  if (word.length <= 1) return 0;
  if (word.length <= 3) return Math.floor(word.length / 2);
  return Math.floor(word.length / 2) - 1; // KEY: Subtract 1 for words >3 chars
}
```
**Do not change this.** It's based on research. If it seems wrong, it's not.

---

### Instant Transitions (No Animations)
The word display must update **instantly** (no fade, no scale, no slide). Animations slow reading speed and defeat the purpose of RSVP.

**Exception:** Progress bar can have a 100ms linear transition (it's background UI, not primary content).

---

### Keyboard Shortcuts Must Not Interfere with Textarea
```typescript
function handleKeyDown(e: KeyboardEvent) {
  // CRITICAL: Don't intercept keys when typing
  if (e.target instanceof HTMLTextAreaElement) return;

  // Now handle shortcuts...
}
```

---

### Auto-Pause on Tab Blur
```typescript
useEffect(() => {
  function handleVisibilityChange() {
    if (document.hidden && isPlaying) {
      pause(); // Stop reading when user switches tabs
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, [isPlaying]);
```

---

### Mobile Font Size Must Be ≥16px (Textarea)
```typescript
<textarea
  className="text-base" // 16px—prevents iOS auto-zoom on focus
  ...
/>
```

---

## Testing Checklist

Before marking this done, verify:

### Functionality
- [ ] Words display with correct ORP (red, bold)
- [ ] Play/Pause works (Space, button, tap on word display)
- [ ] Speed adjustment updates delay immediately (no restart needed)
- [ ] Rewind/FF jump exactly 10 words (or to boundary)
- [ ] Reset returns to word 0 and pauses
- [ ] Completion screen shows correct stats (words, time, avg WPM)
- [ ] "Read Again" restarts from beginning
- [ ] "Load New Text" clears reader and returns to empty state
- [ ] Sample text loads correctly

### Keyboard
- [ ] Space: Play/Pause
- [ ] ← / →: Rewind / Fast Forward
- [ ] Esc: Reset
- [ ] +/- : Adjust speed
- [ ] Tab: Navigate through all controls in logical order
- [ ] Focus indicators visible on all elements
- [ ] Shortcuts disabled when textarea has focus

### Mobile
- [ ] Tap word display to play/pause
- [ ] All buttons ≥48×48px (measure with browser dev tools)
- [ ] Single-column layout on phones (<640px)
- [ ] Two-column layout on tablets (≥640px)
- [ ] No horizontal scroll at any breakpoint
- [ ] Preset buttons: 2×2 grid on very small screens (<400px)

### Accessibility
- [ ] VoiceOver/NVDA announce all controls correctly
- [ ] Play/Pause button announces "Play reading" or "Pause reading"
- [ ] Progress bar announces percentage complete
- [ ] Slider announces WPM value ("350 words per minute")
- [ ] State changes announced via `aria-live="polite"`
- [ ] All icon-only buttons have `aria-label`
- [ ] Contrast ratios pass (white on gray-900 = 15:1, red-500 = 4.6:1)
- [ ] 200% browser zoom: All text readable, no overflow

### Edge Cases
- [ ] Empty textarea: Load button disabled
- [ ] Tab loses focus: Auto-pauses playback
- [ ] Rewind at word 0: Stays at 0 (doesn't go negative)
- [ ] FF at last word: Stays at last word
- [ ] Load new text while playing: Pauses and resets
- [ ] Single-word text: Works correctly (edge case but should handle)
- [ ] Very long word (>20 chars): ORP calculates correctly, no overflow

---

## File Structure

```
/app/tools/speed-reader/
├── page.tsx (main container)
├── components/
│   ├── WordDisplay.tsx
│   ├── Controls.tsx
│   ├── ProgressBar.tsx
│   ├── TextInput.tsx
│   └── CompletionScreen.tsx
├── hooks/
│   └── useRSVPReader.ts
└── utils/
    ├── orp.ts (getORP, formatWord)
    ├── timing.ts (calculateDelay)
    └── text.ts (parseText, formatTimeRemaining)
```

---

## Sample Text (for "Load Sample" button)

```typescript
const SAMPLE_TEXT = `Reading faster doesn't mean skimming. With RSVP technology, you can maintain comprehension while dramatically increasing your reading speed. The key is the Optimal Recognition Point—that red letter you see? It's positioned exactly where your eye naturally focuses. By eliminating the need to move your eyes across the page, you can read 2-3 times faster than normal. Try adjusting the speed until you find your sweet spot. Most people are comfortable between 300-400 words per minute.`;
```

---

## Questions During Implementation?

1. **Read SPEED_READER_QUICK_REFERENCE.md** (one-page summary)
2. **Check SPEED_READER_UX_SPECIFICATION.md** (Howard's full decisions)
3. **Review SPEED_READER_TECHNICAL_REFERENCE.md** (Riker's code examples)
4. **Still unclear?** → Ask in Slack (tag @Howard or @Bob)

---

## Success Metrics

**User can:**
- Load text and start reading within 10 seconds (first-time use)
- Adjust speed mid-reading without losing place
- Pause instantly (Space or tap)
- Navigate entirely with keyboard (no mouse required)
- Use on mobile with same experience as desktop

**Technical:**
- Zero accessibility errors (axe DevTools)
- WCAG 2.1 AA compliant (VoiceOver/NVDA pass)
- Works on iOS Safari, Android Chrome, desktop browsers
- No layout shifts or hydration errors

---

## When You're Done

1. Self-test with the checklist above
2. Deploy to preview environment
3. Share preview link with Bob/Howard for UX review
4. Address feedback
5. Deploy to production

---

**You've got this, Mario. The research is done, the design is final, the specs are clear. Now build the thing.**

---

**End of README**
