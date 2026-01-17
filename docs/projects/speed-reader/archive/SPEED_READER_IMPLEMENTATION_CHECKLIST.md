# Speed Reader - Implementation Checklist

**For:** Mario
**Purpose:** Track progress through implementation
**Instructions:** Mark items as complete with `[x]` as you finish them

---

## Pre-Implementation

- [ ] Read SPEED_READER_QUICK_REFERENCE.md (5 min)
- [ ] Skim SPEED_READER_UX_SPECIFICATION.md (15 min)
- [ ] Review SPEED_READER_COMPONENT_HIERARCHY.md (10 min)
- [ ] Understand the task assignment and MVP scope

---

## Day 1: Core Logic + Basic UI

### File Structure Setup
- [ ] Create `/app/tools/speed-reader/` directory
- [ ] Create subdirectories:
  - [ ] `components/`
  - [ ] `hooks/`
  - [ ] `utils/`

### Utility Functions
- [ ] `utils/orp.ts`
  - [ ] `getORP(word: string): number`
  - [ ] `formatWord(word: string): { before, orp, after }`
  - [ ] Unit tests for ORP calculation
    - [ ] Single-char words (e.g., "I") → ORP = 0
    - [ ] Short words (e.g., "the") → ORP = 1
    - [ ] Medium words (e.g., "reading") → ORP = 2
    - [ ] Long words (e.g., "comprehension") → ORP = 5

- [ ] `utils/timing.ts`
  - [ ] `calculateDelay(word: string, wpm: number): number`
  - [ ] Test delay calculation
    - [ ] Base delay: 60000 / wpm
    - [ ] Long words: +50ms per char >8
    - [ ] Commas: +100ms
    - [ ] Periods: +300ms
    - [ ] Minimum: 100ms

- [ ] `utils/text.ts`
  - [ ] `parseText(text: string): string[]`
  - [ ] `formatTimeRemaining(seconds: number): string`
  - [ ] Test text parsing (whitespace, empty strings, etc.)

### Custom Hook
- [ ] `hooks/useRSVPReader.ts`
  - [ ] State management (words, currentIndex, isPlaying, wpm, isComplete, elapsedTime)
  - [ ] Play/Pause/Toggle functions
  - [ ] Rewind/FastForward/Reset functions
  - [ ] LoadText function
  - [ ] Main reading loop (useEffect with timer)
  - [ ] Auto-pause on tab blur
  - [ ] LocalStorage integration (save/load WPM)

### Basic UI
- [ ] `components/WordDisplay.tsx`
  - [ ] Empty state ("Paste text to begin")
  - [ ] Active state (word with ORP highlighting)
  - [ ] Paused message (shows after 2s)
  - [ ] Click/tap to toggle play/pause
  - [ ] Proper ARIA attributes
  - [ ] Focus indicator

- [ ] `page.tsx` (minimal MVP)
  - [ ] Import WordDisplay
  - [ ] Basic play/pause button
  - [ ] Textarea for text input
  - [ ] "Load Text" button
  - [ ] Wire up useRSVPReader hook

### Testing (Day 1)
- [ ] Words display one at a time
- [ ] ORP character is red and bold
- [ ] Timing matches expected WPM (350 WPM ≈ 171ms/word)
- [ ] Play/Pause works via button
- [ ] No console errors

---

## Day 2: Full UI + Controls + Keyboard

### Components
- [ ] `components/Controls.tsx`
  - [ ] Playback buttons (Play/Pause, Rewind, FF, Reset)
  - [ ] Speed slider (100-1000 WPM, step 50)
  - [ ] Speed label (live WPM display)
  - [ ] Preset buttons (250, 350, 450, 600)
  - [ ] Keyboard hints text
  - [ ] All ARIA labels
  - [ ] Disabled states (rewind at 0, FF at end)

- [ ] `components/ProgressBar.tsx`
  - [ ] Progress track (gray-700)
  - [ ] Progress fill (blue-500, width based on percentComplete)
  - [ ] Word count stats (234 / 1,247 words)
  - [ ] Time remaining (2m 15s remaining)
  - [ ] Proper progressbar ARIA attributes

- [ ] `components/TextInput.tsx`
  - [ ] Textarea (300px desktop, 200px mobile)
  - [ ] Word count display
  - [ ] "Load Text" button (disabled when empty)
  - [ ] "Load Sample" button
  - [ ] Sample text constant
  - [ ] Proper form semantics

- [ ] `components/CompletionScreen.tsx`
  - [ ] Checkmark (green-500, large)
  - [ ] "You're done!" title
  - [ ] Stats (words read, time, avg WPM)
  - [ ] "Read Again" button
  - [ ] "Load New Text" button
  - [ ] ARIA announcement for completion

### Controls Wiring
- [ ] Speed slider updates WPM instantly
- [ ] Preset buttons set WPM correctly
- [ ] Rewind jumps back 10 words (or to 0)
- [ ] Fast Forward jumps ahead 10 words (or to end)
- [ ] Reset returns to word 0 and pauses
- [ ] Play/Pause icon changes based on state

### Keyboard Shortcuts
- [ ] Global keydown listener
- [ ] Space: Play/Pause
- [ ] ArrowLeft: Rewind
- [ ] ArrowRight: Fast Forward
- [ ] Escape: Reset
- [ ] Plus/Equals: Speed +50
- [ ] Minus/Underscore: Speed -50
- [ ] Shortcuts disabled when textarea focused
- [ ] All shortcuts have `e.preventDefault()`

### Progress Tracking
- [ ] Word count updates every word
- [ ] Time remaining calculates correctly
- [ ] Progress bar fills smoothly (100ms transition)
- [ ] Percentage is accurate (currentIndex / totalWords * 100)

### Testing (Day 2)
- [ ] All controls functional
- [ ] Keyboard shortcuts work
- [ ] Tab navigation through all controls
- [ ] Progress bar updates in real-time
- [ ] Speed adjustment takes effect immediately (no restart)
- [ ] Completion screen appears at end
- [ ] "Read Again" restarts correctly

---

## Day 3: Polish + Responsive + Accessibility

### Mobile Optimization
- [ ] Test on iOS Safari
  - [ ] Textarea font size ≥16px (prevent auto-zoom)
  - [ ] Touch targets ≥48×48px
  - [ ] Tap on word display toggles play/pause
  - [ ] No horizontal scroll
  - [ ] Single-column layout <640px

- [ ] Test on Android Chrome
  - [ ] All controls accessible
  - [ ] Slider works correctly
  - [ ] No layout issues

- [ ] Responsive layout
  - [ ] Mobile (<640px): Single column, 48px font, 56px buttons
  - [ ] Tablet (640-1024px): Two columns, 60px font, 48px buttons
  - [ ] Desktop (≥1024px): Two columns, max-w-7xl, centered
  - [ ] Preset buttons: 2×2 grid on <400px

### Accessibility Audit
- [ ] ARIA labels on all icon-only buttons
  - [ ] Play/Pause: "Play reading" / "Pause reading"
  - [ ] Rewind: "Rewind 10 words"
  - [ ] Fast Forward: "Fast forward 10 words"
  - [ ] Reset: "Reset to beginning"

- [ ] Progress bar attributes
  - [ ] `role="progressbar"`
  - [ ] `aria-valuenow={currentIndex}`
  - [ ] `aria-valuemin={0}`
  - [ ] `aria-valuemax={totalWords}`
  - [ ] `aria-label="Reading progress: X% complete"`

- [ ] Speed slider
  - [ ] `aria-label="Reading speed in words per minute"`
  - [ ] `aria-valuetext="{wpm} words per minute"`

- [ ] Live regions
  - [ ] `aria-live="polite"` for state changes
  - [ ] Announce play/pause/complete
  - [ ] `.sr-only` class (visually hidden but screen-reader accessible)

- [ ] Focus indicators
  - [ ] 2px blue-500 ring on all interactive elements
  - [ ] `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
  - [ ] `focus:ring-offset-gray-900` (matches dark background)
  - [ ] Focus visible on Tab, not on click (`:focus-visible`)

- [ ] Contrast ratios (use WebAIM checker)
  - [ ] White text on gray-900: ≥15:1 ✓
  - [ ] Red-500 ORP on gray-800: ≥4.6:1 ✓
  - [ ] Gray-400 text on gray-900: ≥7.2:1 ✓
  - [ ] Blue-600 buttons on gray-900: ≥4.8:1 ✓

- [ ] Screen reader testing
  - [ ] VoiceOver (macOS) or NVDA (Windows)
  - [ ] All controls announced correctly
  - [ ] State changes announced
  - [ ] Progress updates announced
  - [ ] No unlabeled buttons or inputs

### Persistence
- [ ] WPM saved to localStorage on change
- [ ] WPM loaded from localStorage on mount
- [ ] Default to 350 WPM if no saved value

### Edge Cases
- [ ] Auto-pause on tab blur
  - [ ] `document.visibilitychange` listener
  - [ ] Pauses playback when tab is hidden
  - [ ] Does NOT resume when tab is visible again (user must manually resume)

- [ ] Clamp rewind/FF at boundaries
  - [ ] Rewind at index 0: stays at 0
  - [ ] FF at last word: stays at last word
  - [ ] Visual feedback (buttons disabled at boundaries)

- [ ] Handle empty textarea
  - [ ] "Load Text" button disabled
  - [ ] `disabled:opacity-50 disabled:cursor-not-allowed`

- [ ] Load new text while playing
  - [ ] Pauses current playback
  - [ ] Resets to index 0
  - [ ] Loads new text correctly

- [ ] Single-word text
  - [ ] Displays correctly
  - [ ] ORP calculates correctly
  - [ ] Completion screen shows "Read 1 word in Xs"

- [ ] Very long words (>20 chars)
  - [ ] ORP calculates correctly
  - [ ] No overflow (text wraps or truncates)

- [ ] Text with only punctuation (edge case)
  - [ ] Parses correctly
  - [ ] Doesn't crash

### Final Polish
- [ ] Hover states on all buttons (color change)
- [ ] Active states on buttons (`active:scale-95`)
- [ ] Progress bar transition (100ms linear)
- [ ] No layout shifts on load
- [ ] No hydration errors (Next.js)
- [ ] Clean console (no warnings or errors)

### Testing (Day 3)
- [ ] Keyboard-only navigation (no mouse)
- [ ] 200% browser zoom (text remains functional)
- [ ] Sample text loads correctly
- [ ] Completion screen flow works
- [ ] All edge cases handled gracefully
- [ ] No accessibility errors (axe DevTools)

---

## Final Review

### Functionality Checklist
- [ ] Words display with correct ORP (red, bold)
- [ ] Play/Pause works (Space, button, tap)
- [ ] Speed adjustment updates delay immediately
- [ ] Rewind/FF jump exactly 10 words
- [ ] Reset returns to word 0 and pauses
- [ ] Completion screen shows correct stats
- [ ] "Read Again" restarts from beginning
- [ ] "Load New Text" clears and resets
- [ ] Sample text loads correctly
- [ ] WPM persists across page reloads

### Accessibility Checklist
- [ ] VoiceOver/NVDA pass
- [ ] All controls announced correctly
- [ ] Contrast ratios pass (WCAG 2.1 AA)
- [ ] Focus indicators visible
- [ ] Keyboard-only navigation works
- [ ] Touch targets ≥48×48px (mobile)
- [ ] No accessibility errors (axe DevTools)

### Responsive Checklist
- [ ] Mobile: Single column, works on iOS/Android
- [ ] Tablet: Two columns, readable
- [ ] Desktop: Two columns, max-width 1280px
- [ ] No horizontal scroll at any breakpoint
- [ ] Font sizes adjust correctly
- [ ] Buttons resize appropriately

### Edge Cases Checklist
- [ ] Empty textarea handled
- [ ] Tab blur auto-pauses
- [ ] Rewind/FF boundaries respected
- [ ] Load new text while playing works
- [ ] Single-word text works
- [ ] Very long words work
- [ ] 200% zoom works

---

## Deployment

- [ ] Self-test with all checklists above
- [ ] Deploy to preview environment
- [ ] Share preview link with Bob/Howard for UX review
- [ ] Address feedback
- [ ] Final testing on production-like environment
- [ ] Deploy to production
- [ ] Verify production deployment works
- [ ] Monitor for errors (Sentry, logs)

---

## Post-Launch (Optional Enhancements)

### Phase 2 Features (Not MVP)
- [ ] Light mode toggle
- [ ] Custom color schemes
- [ ] Show previous/next words faded (context mode)
- [ ] Reading stats dashboard
- [ ] Export reading stats
- [ ] Swipe gestures on mobile (if not conflicting with browser)
- [ ] Font size customization
- [ ] Paragraph markers on progress bar
- [ ] Keyboard shortcut overlay (press `?` to show)
- [ ] Save reading position (resume later)
- [ ] Multiple text slots (switch between articles)
- [ ] Social sharing ("I just read 1,247 words at 450 WPM!")

---

**When you check every box above, this feature is DONE. Ship it.**

---

**End of Implementation Checklist**
