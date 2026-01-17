# Speed Reader - Quick Reference Card

**For:** Mario (implementation)
**From:** Howard (UX)
**Purpose:** One-page summary of critical decisions and specs

---

## Critical UX Decisions

| Question | Answer | Rationale |
|----------|--------|-----------|
| Context words? | **No** | Pure RSVP—no visual clutter |
| Completion state? | **Message + buttons** | Closure + clear next actions |
| Word transitions? | **Instant** | No animations—maintains focus |
| Slider WPM display? | **Yes, live updates** | Precise feedback during drag |
| Icon-only buttons? | **Yes** (with ARIA labels) | Space-efficient, accessible |
| Reduce motion? | **Yes** | Respect `prefers-reduced-motion` |
| Light mode? | **No** (MVP) | Dark only—matches site |

---

## Component Specifications (MVP)

### Word Display
```typescript
// Desktop
fontSize: 60px
minHeight: 200px
padding: 48px 32px

// Mobile
fontSize: 48px
minHeight: 180px
padding: 32px 24px

// ORP
color: red-500
fontWeight: bold
```

### Buttons
```typescript
// Desktop
playPause: 56×56px (bg-blue-600)
secondary: 48×48px (bg-gray-700)

// Mobile (all larger for touch)
playPause: 56×56px
secondary: 56×56px

// Minimum: 48×48px
```

### Speed Slider
```typescript
range: 100–1000 WPM
step: 50 WPM
default: 350 WPM
thumbSize: 20px (desktop), 24px (mobile)
```

---

## Keyboard Shortcuts

| Key | Action | Implementation |
|-----|--------|----------------|
| **Space** | Play/Pause | `togglePlayPause()` |
| **←** | Rewind 10 words | `currentIndex = Math.max(0, currentIndex - 10)` |
| **→** | Fast Forward 10 | `currentIndex = Math.min(totalWords - 1, currentIndex + 10)` |
| **Esc** | Reset | `currentIndex = 0; pause()` |
| **+** | Speed +50 | `setWpm(Math.min(1000, wpm + 50))` |
| **-** | Speed -50 | `setWpm(Math.max(100, wpm - 50))` |

**IMPORTANT:** Disable shortcuts when textarea has focus.

---

## Accessibility Checklist

- [ ] All buttons have `aria-label` (icon-only buttons)
- [ ] Focus indicators: 2px blue-500 ring (visible on Tab)
- [ ] Progress bar: `role="progressbar"` + `aria-valuenow/min/max`
- [ ] State changes: `aria-live="polite"` announcements
- [ ] Contrast: White on gray-900 = 15:1 ✓, Red-500 = 4.6:1 ✓
- [ ] Touch targets: Minimum 48×48px
- [ ] Tab order: Textarea → Buttons → Display → Controls
- [ ] Keyboard-only navigation: All functions accessible

---

## Mobile Touch Interactions

### Primary Actions
- **Tap word display:** Play/Pause (largest touch target)
- **Tap play button:** Play/Pause (redundant, but familiar)

### Touch Target Sizes
```typescript
wordDisplay: Full width/height (180px+ tall)
buttons: 56×56px (mobile), 48×48px (desktop)
buttonGap: 12px (prevent mis-taps)
```

### NO Gestures
- ❌ Swipe on word display (conflicts with browser back/forward)
- ❌ Pinch to zoom (use browser's native zoom)
- ❌ Long press (adds complexity, not MVP-critical)

---

## Copy & Messaging

### Empty State
```
Paste text to begin
```

### Paused State (after 2s)
```
Paused • Press Space to continue
```

### Completion Screen
```
✓ You're done!

Read 1,247 words in 3m 34s
(Average: 350 WPM)

[Read Again]  [Load New Text]
```

### Keyboard Hint (below controls)
```
Keyboard: Space (play/pause) • ← (rewind) • → (forward) • Esc (reset)
```

---

## State Machine

```
EMPTY → (Load text) → READY
READY → (Play) → PLAYING
PLAYING → (Pause) → PAUSED
PLAYING → (End) → COMPLETE
COMPLETE → (Read Again) → READY
COMPLETE → (Load New) → EMPTY
```

**Edge Cases:**
- Load new text while playing: Pause, reset to READY
- Tab loses focus: Auto-pause playback
- Rewind past start: Clamp to index 0
- FF past end: Clamp to last word

---

## Responsive Breakpoints

| Breakpoint | Layout | Word Font | Buttons |
|------------|--------|-----------|---------|
| **<640px** | Single column | 48px | 56px |
| **640–1024px** | Two columns | 60px | 48px |
| **≥1024px** | Two columns, max-w-7xl | 60px | 48px (56px play) |

**Preset Buttons:**
- <400px: 2×2 grid
- ≥400px: Horizontal row

---

## Core Utilities

### ORP Calculation
```typescript
function getORP(word: string): number {
  if (word.length <= 1) return 0;
  if (word.length <= 3) return Math.floor(word.length / 2);
  return Math.floor(word.length / 2) - 1;
}
```

### Word Formatting
```typescript
function formatWord(word: string) {
  const orpIndex = getORP(word);
  return {
    before: word.slice(0, orpIndex),
    orp: word[orpIndex] || '',
    after: word.slice(orpIndex + 1),
  };
}
```

### Delay Calculation
```typescript
function calculateDelay(word: string, wpm: number): number {
  let delay = 60000 / wpm; // Base delay

  // Adjust for word length
  if (word.length > 8) {
    delay += (word.length - 8) * 50;
  }

  // Adjust for punctuation
  const lastChar = word[word.length - 1];
  if (lastChar === ',' || lastChar === ';') delay += 100;
  if (lastChar === '.' || lastChar === '!' || lastChar === '?') delay += 300;

  return Math.max(delay, 100); // Minimum 100ms
}
```

---

## Persistence

```typescript
// On mount: Load saved WPM
useEffect(() => {
  const savedWPM = localStorage.getItem('rsvp-wpm');
  if (savedWPM) setWpm(Number(savedWPM));
}, []);

// On WPM change: Save
useEffect(() => {
  localStorage.setItem('rsvp-wpm', String(wpm));
}, [wpm]);
```

---

## Sample Text (for "Load Sample" button)

```typescript
const SAMPLE_TEXT = `Reading faster doesn't mean skimming. With RSVP technology, you can maintain comprehension while dramatically increasing your reading speed. The key is the Optimal Recognition Point—that red letter you see? It's positioned exactly where your eye naturally focuses. By eliminating the need to move your eyes across the page, you can read 2-3 times faster than normal. Try adjusting the speed until you find your sweet spot. Most people are comfortable between 300-400 words per minute.`;
```

---

## Auto-Pause on Tab Switch

```typescript
useEffect(() => {
  function handleVisibilityChange() {
    if (document.hidden && isPlaying) {
      pause();
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, [isPlaying]);
```

---

## Testing Checklist

### Functionality
- [ ] Words display one at a time with correct ORP
- [ ] Play/Pause works (Space, button, tap)
- [ ] Speed adjustment updates delay immediately
- [ ] Rewind/FF work correctly
- [ ] Reset returns to word 0
- [ ] Completion screen shows correct stats

### Accessibility
- [ ] VoiceOver/NVDA read all controls correctly
- [ ] Keyboard-only navigation works (Tab through all elements)
- [ ] Focus indicators visible on all interactive elements
- [ ] Contrast ratios pass (use WebAIM checker)
- [ ] Touch targets ≥48×48px on mobile

### Responsive
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on tablet (iPad)
- [ ] Test on desktop (1920×1080 and 1280×720)
- [ ] Test at 200% browser zoom

### Edge Cases
- [ ] Empty textarea (Load button disabled)
- [ ] Single-word text
- [ ] Very long word (>20 characters)
- [ ] Text with only punctuation
- [ ] Tab loses focus (auto-pauses)

---

## Non-Negotiables

1. **ORP formula must be exact:** `floor(length/2) - 1` for words >3 chars
2. **No animations on word change:** Instant transitions only
3. **WCAG 2.1 AA compliance:** Focus indicators, ARIA labels, contrast ratios
4. **Mobile-first:** Test on real devices, not just browser dev tools
5. **Instant responsiveness:** <100ms lag on all interactions

---

## You Can Adjust

- Exact spacing values (within reasonable bounds)
- Color shades (as long as contrast passes)
- Button icon sizes (20–24px range is fine)
- Animation timing for non-word elements (progress bar, etc.)

---

## Questions?

Refer to **SPEED_READER_UX_SPECIFICATION.md** for full details.
If anything is unclear, ask Howard before implementing.

**Goal:** Users read 2-3× faster with full comprehension. Everything else supports that.

---

**End of Quick Reference**
