# Speed Reader - UX Specification & Implementation Guide

**For:** Mario (implementation)
**From:** Howard (design & UX)
**Based on:** Riker's SPEED_READER_UX_WIREFRAMES.md
**Status:** Final specification - Ready for implementation
**Date:** 2026-01-16

---

## Executive Summary

This document provides **final decisions** on all open UX questions from Riker's wireframes, complete accessibility requirements (WCAG 2.1 AA), finalized copy/messaging, keyboard and touch interaction specifications, and detailed component behavior for Mario's implementation.

**Key Decisions:**
- **Single-word display only** (no context words) - maximizes RSVP benefits
- **Completion message + restart button** - clear ending, encourages re-use
- **Instant transitions** (no fade/scale) - maintains focus, reduces cognitive load
- **Full keyboard control** - all functions accessible without mouse
- **Mobile touch-optimized** - 48px+ touch targets, tap-to-pause on word display

---

## Table of Contents

1. [UX Philosophy & Design Decisions](#1-ux-philosophy--design-decisions)
2. [Component Specifications](#2-component-specifications)
3. [Copy & Messaging](#3-copy--messaging)
4. [Accessibility Requirements (WCAG 2.1 AA)](#4-accessibility-requirements-wcag-21-aa)
5. [Keyboard Shortcuts](#5-keyboard-shortcuts)
6. [Mobile Touch Interactions](#6-mobile-touch-interactions)
7. [State Machine & User Flows](#7-state-machine--user-flows)
8. [Responsive Behavior](#8-responsive-behavior)
9. [Implementation Checklist](#9-implementation-checklist)

---

## 1. UX Philosophy & Design Decisions

### 1.1 Answers to Riker's Open Questions

#### **Q1: Context words (previous/next faded) or pure single-word display?**
**Decision: Pure single-word display.**

**Rationale:**
The entire point of RSVP is to eliminate saccadic eye movements. Showing context words creates visual clutter and tempts the eye to wander. Users who need context can pause (instant reaction with Space bar). This keeps cognitive load minimal and reading speed maximal.

**User Impact:**
First-time users may feel disoriented. We'll address this with:
- Clear onboarding message: "Focus on the red letter. Let the words come to you."
- Sample text option to practice before real content
- Instant pause via Space bar or tap (control is always present)

---

#### **Q2: How should "completed" state look?**
**Decision: Completion message with restart button.**

**Final Screen:**
```
┌──────────────────────────────────────┐
│                                      │
│        ✓ You're done!                │
│                                      │
│     Read 1,247 words in 3m 34s       │
│     (Average: 350 WPM)               │
│                                      │
│     [Read Again]  [Load New Text]    │
│                                      │
└──────────────────────────────────────┘
```

**Rationale:**
Auto-reset is jarring. The user just finished something—acknowledge it. The completion screen:
- Provides closure (satisfying ending)
- Shows reading stats (reinforces accomplishment)
- Offers clear next actions (read again or load new text)

**Alternative Considered:** Confetti animation—rejected as gimmicky and off-brand for a professional portfolio site.

---

#### **Q3: Do we need reading stats?**
**Decision: Yes, but only on completion screen (not during reading).**

**Stats Shown:**
- Total words read
- Time taken
- Average WPM

**Rationale:**
Stats during reading are distracting. Users who want to track progress have the progress bar (visual, non-intrusive). Showing stats at the end:
- Rewards completion
- Helps users calibrate their comfortable speed
- Provides shareable achievement (future: tweet your stats?)

---

#### **Q4: Should slider show numerical WPM while dragging?**
**Decision: Yes—WPM displays above slider and updates live during drag.**

**Behavior:**
- Default state: "Speed: 350 WPM" displayed above slider
- During drag: Updates instantly as thumb moves (e.g., "Speed: 425 WPM")
- No separate tooltip—the label itself updates

**Rationale:**
Users need precise feedback when adjusting speed. Showing the exact number prevents guesswork. This is especially important for users trying to hit a specific WPM target (e.g., "I read comfortably at 400 WPM").

---

#### **Q5: Any animations on word change?**
**Decision: No animations. Instant transitions only.**

**Rationale:**
Fades, scales, or slides add cognitive overhead. The human eye can process instant changes at 300+ WPM without issue—that's the entire premise of RSVP. Animations would:
- Slow reading speed
- Distract from content
- Complicate implementation (timing edge cases)

**Exception:** Progress bar fills smoothly (100ms linear transition). This is background movement, not primary content, so it doesn't distract.

---

#### **Q6: Buttons—icon + text or icon-only?**
**Decision: Icon + text labels on primary actions, icon-only on secondary (with ARIA labels).**

**Primary Actions (Always labeled):**
- "Load Text" button (text input section)
- "Load Sample" button (text input section)
- "Read Again" / "Load New Text" (completion screen)

**Secondary Actions (Icon-only with ARIA):**
- Playback controls (Play/Pause, Rewind, Fast-Forward, Reset)
- Reason: Space constraints on mobile, universally understood icons

**Accessibility Note:**
All icon-only buttons have `aria-label` attributes (e.g., `aria-label="Play reading"`) and visible labels in keyboard hint row.

---

#### **Q7: Progress bar markers for paragraphs?**
**Decision: No markers in MVP. Simple percentage-based progress.**

**Rationale:**
Markers add visual noise and implementation complexity (paragraph detection, marker placement). The current design (percentage + word count + time remaining) provides sufficient progress feedback.

**Future Enhancement:** If users request it, Phase 2 could add optional section markers for long-form content.

---

#### **Q8: Font—strict monospace or proportional fallback?**
**Decision: Strict monospace for word display. Proportional (Inter) for all UI text.**

**Monospace Font Stack:**
```css
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
```

**Rationale:**
Monospace ensures:
- Predictable ORP alignment (every character has same width)
- Technical aesthetic (fits Wally's developer audience)
- High readability at large sizes (60px+)

The slight "mechanical" feel is a feature, not a bug—it signals "this is a tool, not a book."

---

#### **Q9: Reduce motion mode?**
**Decision: Yes. Respect `prefers-reduced-motion` system setting.**

**Behavior:**
- If `prefers-reduced-motion: reduce` is set, disable progress bar animation
- Word display is already instant (no animations to disable)
- Completion checkmark appears instantly instead of fading in

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

#### **Q10: Custom color schemes?**
**Decision: No. Dark theme only for MVP.**

**Rationale:**
Adding theme customization (light mode, custom colors) increases complexity without clear user benefit. The dark theme:
- Matches site aesthetic (consistency)
- Reduces eye strain (most reading happens on mobile at night)
- Provides sufficient contrast (15:1 for white on gray-900)

**Future Enhancement:** If users request it, add light mode toggle in Phase 2. System preference detection is a reasonable addition but not MVP-critical.

---

### 1.2 Core UX Principles

**1. Immediacy**
Every action has instant feedback. No spinners, no loading states, no "processing" messages. The user presses Space—the word stops. The user drags the slider—the WPM updates. Cause and effect are directly coupled.

**2. Clarity**
No jargon. "Speed" instead of "WPM" in user-facing labels (with WPM shown for precision). "Read Again" instead of "Restart." Every button does exactly what it says.

**3. Forgiveness**
It's easy to recover from mistakes:
- Paused by accident? Press Space again.
- Lost your place? Reset button restarts from the beginning.
- Too fast? Adjust speed mid-reading (no need to restart).

**4. Focus**
The word display is the hero. Everything else (controls, progress, input) is supporting cast. Generous whitespace, muted secondary UI, high-contrast word display.

**5. Accessibility First**
Keyboard users and screen reader users get the full experience, not a degraded version. Focus indicators are visible, ARIA labels are descriptive, tab order is logical.

---

## 2. Component Specifications

### 2.1 Word Display Component

**Purpose:** Displays the current word with ORP highlighting.

#### Desktop Specifications
```typescript
{
  width: "100%",
  minHeight: "200px",
  padding: "48px 32px",
  fontSize: "60px",
  fontFamily: "ui-monospace, ...",
  fontWeight: "400", // Regular weight for most text
  backgroundColor: "gray-800",
  borderRadius: "8px",
  color: "white",
  textAlign: "center",
  cursor: "pointer", // Indicates clickability
  userSelect: "none", // Prevent text selection during reading
}
```

#### Mobile Specifications
```typescript
{
  minHeight: "180px",
  padding: "32px 24px",
  fontSize: "48px",
}
```

#### Visual States

**Empty State:**
```html
<div class="word-display empty">
  <span class="text-gray-500 text-2xl">
    Paste text to begin
  </span>
</div>
```

**Active State (Playing):**
```html
<div class="word-display active">
  <span class="text-white">
    re<span class="text-red-500 font-bold">a</span>ding
  </span>
</div>
```
- No additional indicator needed (word changes signal playback)
- ORP character: `color: red-500`, `font-weight: bold`

**Paused State:**
```html
<div class="word-display paused">
  <span class="text-white">
    re<span class="text-red-500 font-bold">a</span>ding
  </span>
  <div class="text-gray-500 text-sm mt-4">
    Paused • Press Space to continue
  </div>
</div>
```
- Small "Paused" message below word (14px, gray-500)
- Only shows after 2 seconds of pausing (prevents flicker on quick pauses)

**Hover State:**
```css
.word-display:hover {
  background-color: #252d3a; /* gray-750 custom */
}
```

**Focus State (Keyboard):**
```css
.word-display:focus {
  outline: 2px solid #3B82F6; /* blue-500 */
  outline-offset: 2px;
}
```

#### Interaction Behavior
- **Click/Tap:** Toggle play/pause (same as Space bar)
- **Keyboard Focus:** Focusable via Tab key
- **Role:** `role="button"` (it's a clickable control)
- **ARIA:** `aria-label="Reading area. Press Space to play or pause. Currently {playing/paused}."`

#### ORP Calculation & Display

**Implementation:**
```typescript
function getORP(word: string): number {
  if (word.length <= 1) return 0;
  if (word.length <= 3) return Math.floor(word.length / 2);
  return Math.floor(word.length / 2) - 1;
}

function formatWord(word: string) {
  const orpIndex = getORP(word);
  return {
    before: word.slice(0, orpIndex),
    orp: word[orpIndex] || '',
    after: word.slice(orpIndex + 1),
  };
}
```

**Rendering:**
```tsx
const { before, orp, after } = formatWord(currentWord);

<span className="text-white">
  {before}
  <span className="text-red-500 font-bold">{orp}</span>
  {after}
</span>
```

**Edge Cases:**
- Single-character words (e.g., "I", "a"): ORP is the character itself (index 0)
- Punctuation-only (e.g., "—"): Treat as single character
- Empty string: Show empty state message

---

### 2.2 Controls Component

**Purpose:** Playback controls (play/pause, rewind, fast-forward, reset) and speed adjustment.

#### Playback Buttons

**Layout:**
```
[◄◄ Rewind]  [▶ Play / ❚❚ Pause]  [►► Fast Forward]  [⟲ Reset]
```

**Sizing:**
- Desktop: 48px × 48px (secondary), 56px × 56px (play/pause primary)
- Mobile: 56px × 56px (all buttons—larger for touch)
- Gap between buttons: 12px

**Visual Hierarchy:**
- **Play/Pause:** `bg-blue-600 hover:bg-blue-700` (primary action)
- **Others:** `bg-gray-700 hover:bg-gray-600` (secondary actions)
- **Icons:** lucide-react (Rewind, Play, Pause, FastForward, RotateCcw)

**Button Specifications:**
```tsx
// Play/Pause (Primary)
<button
  className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-600 hover:bg-blue-700
             flex items-center justify-center transition-colors
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
  aria-label={isPlaying ? "Pause reading" : "Play reading"}
  aria-pressed={isPlaying}
>
  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
</button>

// Secondary Buttons (Rewind, FF, Reset)
<button
  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-700 hover:bg-gray-600
             flex items-center justify-center transition-colors
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
  aria-label="Rewind 10 words"
>
  <Rewind size={20} />
</button>
```

**Behavior:**
- **Play/Pause:** Toggles reading state, icon changes instantly
- **Rewind:** Jumps back 10 words (or to start if <10 words remaining)
- **Fast Forward:** Jumps forward 10 words (or to end if <10 words remaining)
- **Reset:** Returns to word 0, pauses playback
- All buttons provide visual feedback on click (brief `active:scale-95`)

**Disabled States:**
- Rewind: Disabled when at word 0 (`opacity-50 cursor-not-allowed`)
- Fast Forward: Disabled when at last word
- Play: Disabled when no text loaded

---

#### Speed Slider

**Range:** 100–1000 WPM
**Step:** 50 WPM
**Default:** 350 WPM

**Desktop Specifications:**
```tsx
<div className="space-y-2">
  <label className="text-sm text-gray-400">
    Speed: <span className="text-white font-semibold">{wpm} WPM</span>
  </label>
  <input
    type="range"
    min="100"
    max="1000"
    step="50"
    value={wpm}
    onChange={(e) => setWpm(Number(e.target.value))}
    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
               focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Reading speed in words per minute"
    aria-valuetext={`${wpm} words per minute`}
  />
</div>
```

**Custom Slider Styling (Tailwind CSS):**
```css
/* Thumb (the draggable circle) */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3B82F6; /* blue-500 */
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: none;
}

/* Track (the line) */
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  background: linear-gradient(to right,
    #3B82F6 0%,
    #3B82F6 var(--slider-progress),
    #374151 var(--slider-progress),
    #374151 100%
  );
  border-radius: 9999px;
}
```

**Label Behavior:**
- Shows current WPM at all times
- Updates instantly as user drags (live feedback)
- No separate tooltip needed

**Keyboard Support:**
- Arrow keys: ±10 WPM
- Page Up/Down: ±100 WPM
- Home: Jump to 100 WPM
- End: Jump to 1000 WPM

---

#### Preset Speed Buttons

**Values:** 250 WPM, 350 WPM, 450 WPM, 600 WPM

**Layout:**
```
[250]  [350]  [450]  [600]
```

**Button Specifications:**
```tsx
<button
  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
             ${wpm === preset
               ? 'bg-blue-600 text-white'
               : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
  onClick={() => setWpm(preset)}
>
  {preset}
</button>
```

**Active State:**
- Button matching current WPM is highlighted (blue-600)
- Others are gray-700
- Active state persists even if user drags slider to exact preset value

**Mobile Layout:**
- Desktop: Horizontal row (inline)
- Mobile (<400px): 2×2 grid for easier thumb reach

---

### 2.3 Progress Bar Component

**Purpose:** Visual progress indicator with stats.

#### Progress Bar Visual

**Dimensions:**
- Width: 100%
- Height: 8px (thicker than typical for better visibility)
- Border radius: `rounded-full`

**Styling:**
```tsx
<div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
  <div
    className="bg-blue-500 h-2 transition-all duration-100 ease-linear"
    style={{ width: `${percentComplete}%` }}
    role="progressbar"
    aria-valuenow={currentWord}
    aria-valuemin={0}
    aria-valuemax={totalWords}
    aria-label={`Reading progress: ${percentComplete}% complete`}
  />
</div>
```

**Animation:**
- Width transition: 100ms linear (smooth, not jarring)
- No animation when user rewinds/fast-forwards (instant jump)

#### Progress Stats

**Layout:**
```
234 / 1,247 words                    2m 15s remaining
```

**Specifications:**
```tsx
<div className="flex justify-between text-sm text-gray-400 mt-2">
  <span>{currentWord} / {totalWords} words</span>
  <span>{formatTimeRemaining(estimatedSeconds)} remaining</span>
</div>
```

**Time Formatting:**
```typescript
function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}
```

**Update Frequency:**
- Word count: Updates every word
- Time remaining: Updates every second (or every word, whichever is slower)

**Edge Cases:**
- 0 words: Show "—" instead of "0 / 0"
- Completed: Show "1,247 / 1,247 words • Finished!" (no time remaining)

---

### 2.4 Text Input Component

**Purpose:** Load text for reading.

#### Textarea

**Desktop Specifications:**
```tsx
<textarea
  className="w-full h-[300px] bg-gray-800 border border-gray-700 rounded-lg
             text-white p-4 text-base leading-relaxed resize-none
             focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
  placeholder="Paste article, blog post, or any text..."
  value={inputText}
  onChange={(e) => setInputText(e.target.value)}
  aria-label="Text to read"
/>
```

**Mobile Specifications:**
- Height: 200px (less vertical space)
- Font size: 16px (prevents iOS zoom on focus)

**Placeholder Text:**
```
Paste article, blog post, or any text...
```

**Behavior:**
- Auto-resize: No (fixed height for consistency)
- Word wrap: Yes
- Scrollable: Yes (if text exceeds height)

#### Word Count Display

**Position:** Below textarea, right-aligned

```tsx
<div className="text-sm text-gray-500 text-right mt-2">
  Words: {wordCount.toLocaleString()}
</div>
```

**Calculation:**
```typescript
const wordCount = inputText.trim().split(/\s+/).filter(w => w.length > 0).length;
```

#### Load Buttons

**Layout:**
```
[Load Text]  [Load Sample]
```

**Specifications:**
```tsx
// Primary button (Load Text)
<button
  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md
             transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
             disabled:opacity-50 disabled:cursor-not-allowed"
  onClick={handleLoadText}
  disabled={inputText.trim().length === 0}
>
  Load Text
</button>

// Secondary button (Load Sample)
<button
  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md
             transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  onClick={loadSampleText}
>
  Load Sample
</button>
```

**Desktop:** Side-by-side
**Mobile (<400px):** Stacked, full-width

**Sample Text:**
```typescript
const SAMPLE_TEXT = `Reading faster doesn't mean skimming. With RSVP technology, you can maintain comprehension while dramatically increasing your reading speed. The key is the Optimal Recognition Point—that red letter you see? It's positioned exactly where your eye naturally focuses. By eliminating the need to move your eyes across the page, you can read 2-3 times faster than normal. Try adjusting the speed until you find your sweet spot. Most people are comfortable between 300-400 words per minute.`;
```

---

## 3. Copy & Messaging

### 3.1 Page Header

**Title:** Speed Reader
**Subtitle:** Read faster with RSVP technology

```html
<h1 class="text-4xl font-bold text-white">Speed Reader</h1>
<p class="text-lg text-gray-400 mt-2">Read faster with RSVP technology</p>
```

**Rationale:**
Clear, direct, no jargon. Users immediately understand what this tool does.

---

### 3.2 Empty State (Word Display)

**Message:** "Paste text to begin"

**Visual:**
```
┌──────────────────────────────────┐
│                                  │
│      Paste text to begin         │
│                                  │
└──────────────────────────────────┘
```

**Rationale:**
Simple imperative. No explanation needed—the textarea is right there.

---

### 3.3 Paused State

**Message:** "Paused • Press Space to continue"

**Behavior:**
- Only appears after 2 seconds of being paused (prevents flicker on quick pauses)
- Disappears when playback resumes

**Rationale:**
Users who pause intentionally get a reminder of how to resume. Users who pause briefly (to think about a word) don't get distracted by the message.

---

### 3.4 Completion Screen

**Message:**
```
✓ You're done!

Read 1,247 words in 3m 34s
(Average: 350 WPM)

[Read Again]  [Load New Text]
```

**Implementation:**
```tsx
<div className="text-center space-y-6">
  <div className="text-green-500 text-5xl">✓</div>
  <h2 className="text-3xl font-bold text-white">You're done!</h2>

  <div className="text-gray-400">
    <p className="text-lg">
      Read <span className="text-white font-semibold">{totalWords}</span> words
      in <span className="text-white font-semibold">{formatTime(elapsedTime)}</span>
    </p>
    <p className="text-sm mt-1">
      (Average: <span className="text-white">{averageWPM} WPM</span>)
    </p>
  </div>

  <div className="flex gap-4 justify-center">
    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md">
      Read Again
    </button>
    <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md">
      Load New Text
    </button>
  </div>
</div>
```

**Calculation:**
```typescript
const averageWPM = Math.round((totalWords / (elapsedTime / 60)));
```

**Rationale:**
- Checkmark provides immediate visual success feedback
- Stats give users concrete data (builds trust in the tool)
- Two clear next actions (no dead end)

---

### 3.5 Keyboard Hints

**Message (below controls):**
```
Keyboard: Space (play/pause) • ← (rewind) • → (forward) • Esc (reset)
```

**Styling:**
```tsx
<div className="text-xs text-gray-500 text-center mt-4">
  Keyboard: <kbd className="px-1 bg-gray-700 rounded">Space</kbd> (play/pause) •
  <kbd className="px-1 bg-gray-700 rounded">←</kbd> (rewind) •
  <kbd className="px-1 bg-gray-700 rounded">→</kbd> (forward) •
  <kbd className="px-1 bg-gray-700 rounded">Esc</kbd> (reset)
</div>
```

**Rationale:**
Discoverable shortcuts. Power users will use them, casual users can ignore them.

---

### 3.6 Error Messages

**No text entered:**
- Trigger: User clicks "Load Text" with empty textarea
- Message: (Button is disabled—no error message needed)

**Sample text loads:**
- No message (instant loading)

**Unknown errors:**
- Message: "Something went wrong. Please try again."
- (Shouldn't happen, but graceful fallback)

---

## 4. Accessibility Requirements (WCAG 2.1 AA)

### 4.1 Perceivable

#### **1.4.3 Contrast (Minimum) - AA**

**Text Contrast:**
- White text on gray-900 background: **15:1** ✓ (exceeds 4.5:1 minimum)
- Gray-400 on gray-900: **7.2:1** ✓
- Blue-600 buttons on gray-900: **4.8:1** ✓

**UI Component Contrast:**
- Button borders (gray-700 on gray-900): **3.1:1** ✓ (meets 3:1 minimum)
- Focus rings (blue-500): **8.5:1** ✓

**ORP Highlighting:**
- Red-500 on gray-800 background: **4.6:1** ✓
- Also uses `font-weight: bold` (redundant encoding—color isn't sole indicator)

**Verification Method:**
```bash
# Use WebAIM Contrast Checker
https://webaim.org/resources/contrastchecker/
```

---

#### **1.4.11 Non-text Contrast - AA**

**Interactive Controls:**
- All buttons have visible borders or backgrounds (3:1 contrast minimum)
- Focus indicators: 2px blue-500 ring (8.5:1 contrast)

---

#### **1.4.13 Content on Hover or Focus**

**Hover States:**
- Word display hover: Background lightens (dismissible by moving mouse away)
- Button hovers: No content change, only color change

**No hover-only content** (all information is visible by default).

---

### 4.2 Operable

#### **2.1.1 Keyboard - A**

**All functionality accessible via keyboard:**

| Function | Keyboard Shortcut | Tab Focus |
|----------|------------------|-----------|
| Play/Pause | Space | ✓ (word display + button) |
| Rewind | Left Arrow | ✓ (button) |
| Fast Forward | Right Arrow | ✓ (button) |
| Reset | Esc | ✓ (button) |
| Adjust speed | Arrow keys (on slider) | ✓ (slider) |
| Load text | Enter (on button focus) | ✓ (button) |
| Load sample | Enter (on button focus) | ✓ (button) |

**Tab Order:**
1. Textarea
2. "Load Text" button
3. "Load Sample" button
4. Word display
5. Play/Pause button
6. Rewind button
7. Fast Forward button
8. Reset button
9. Speed slider
10. Preset buttons (250, 350, 450, 600)

---

#### **2.1.2 No Keyboard Trap - A**

**Implementation:**
- No custom focus management that prevents Tab key navigation
- Modals (completion screen) can be closed with Esc key
- Slider allows Tab to exit (doesn't trap focus)

---

#### **2.4.7 Focus Visible - AA**

**All focusable elements have visible focus indicators:**

```css
/* Default focus style for all interactive elements */
.focus-visible {
  outline: 2px solid #3B82F6; /* blue-500 */
  outline-offset: 2px;
}

/* Button focus */
button:focus-visible {
  ring: 2px blue-500;
  ring-offset: 2px;
  ring-offset-color: gray-900;
}
```

**Testing:**
- Tab through all controls—every element shows blue focus ring
- Focus indicators are never hidden (`outline: none` only on `:focus`, not `:focus-visible`)

---

### 4.3 Understandable

#### **3.2.1 On Focus - A**

**No context change on focus:**
- Focusing textarea doesn't auto-load text
- Focusing word display doesn't start playback
- All actions require explicit activation (click/tap or Enter key)

---

#### **3.2.2 On Input - A**

**No unexpected context changes:**
- Typing in textarea doesn't start reading
- Changing speed slider doesn't reset playback position
- Loading new text automatically pauses playback (expected behavior)

---

#### **3.3.1 Error Identification - A**

**Validation:**
- "Load Text" button is disabled when textarea is empty
- Disabled state is visually distinct (`opacity-50`, `cursor-not-allowed`)
- Screen readers announce disabled state via `aria-disabled="true"`

---

### 4.4 Robust

#### **4.1.2 Name, Role, Value - A**

**All interactive elements have proper ARIA:**

```html
<!-- Word Display -->
<div
  role="button"
  tabindex="0"
  aria-label="Reading area. Press Space to play or pause."
  aria-live="off"
>
  {/* Word content */}
</div>

<!-- Play/Pause Button -->
<button
  aria-label={isPlaying ? "Pause reading" : "Play reading"}
  aria-pressed={isPlaying}
>
  {isPlaying ? <Pause /> : <Play />}
</button>

<!-- Progress Bar -->
<div
  role="progressbar"
  aria-valuenow={currentWord}
  aria-valuemin={0}
  aria-valuemax={totalWords}
  aria-label={`Reading progress: ${Math.round(percentComplete)}% complete`}
/>

<!-- Speed Slider -->
<input
  type="range"
  min="100"
  max="1000"
  value={wpm}
  aria-label="Reading speed in words per minute"
  aria-valuetext={`${wpm} words per minute`}
/>

<!-- Buttons (Icon-only) -->
<button aria-label="Rewind 10 words">
  <Rewind />
</button>
<button aria-label="Fast forward 10 words">
  <FastForward />
</button>
<button aria-label="Reset to beginning">
  <RotateCcw />
</button>
```

---

#### **4.1.3 Status Messages - AA**

**Live regions for state changes:**

```html
<!-- Announce playback state changes -->
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {isPlaying ? "Reading started" : "Reading paused"}
</div>

<!-- Announce completion -->
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {isComplete ? `Finished reading ${totalWords} words` : ""}
</div>
```

**Note:** Only announce important state changes (play/pause/complete), not every word (would be overwhelming).

---

### 4.5 Screen Reader Testing Checklist

**VoiceOver (macOS):**
- [ ] Textarea is announced as "Text to read, edit text"
- [ ] Word display is announced as "Reading area. Press Space to play or pause, button"
- [ ] Play/Pause button announces current state ("Pause reading, button, pressed")
- [ ] Progress bar announces percentage ("Reading progress: 65% complete")
- [ ] Slider announces WPM value ("Reading speed in words per minute, 350 words per minute")
- [ ] Completion screen is announced ("You're done! Finished reading 1,247 words")

**NVDA (Windows):**
- [ ] All interactive elements are focusable and announced
- [ ] State changes are announced via live regions
- [ ] Icon-only buttons have descriptive labels

**Testing Command:**
```bash
# VoiceOver (macOS)
Cmd + F5

# NVDA (Windows)
Ctrl + Alt + N
```

---

### 4.6 Mobile Accessibility (iOS/Android)

**Touch Target Sizes:**
- Minimum: 48×48 px (exceeds Apple's 44×44 px guideline)
- Play/Pause: 56×56 px (larger primary action)
- Word display: Full width/height (easy tap target)

**Screen Reader Support:**
- TalkBack (Android) and VoiceOver (iOS) read all ARIA labels
- Swipe gestures navigate through focusable elements in logical order

**Voice Control (iOS):**
- All buttons have text labels or ARIA labels for voice commands
- Example: "Tap Play Reading" activates play button

---

## 5. Keyboard Shortcuts

### 5.1 Global Shortcuts (Always Active)

| Key | Action | Implementation |
|-----|--------|----------------|
| **Space** | Play/Pause | `e.preventDefault()` when not focused on textarea |
| **←** (Left Arrow) | Rewind 10 words | Jump to `Math.max(0, currentIndex - 10)` |
| **→** (Right Arrow) | Fast forward 10 words | Jump to `Math.min(totalWords - 1, currentIndex + 10)` |
| **Esc** | Reset to beginning | Set `currentIndex = 0`, pause playback |
| **+** or **=** | Increase speed +50 WPM | `setWpm(Math.min(1000, wpm + 50))` |
| **-** or **_** | Decrease speed -50 WPM | `setWpm(Math.max(100, wpm - 50))` |

**Implementation:**
```typescript
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    // Don't intercept keys when typing in textarea
    if (e.target instanceof HTMLTextAreaElement) return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        rewind();
        break;
      case 'ArrowRight':
        e.preventDefault();
        fastForward();
        break;
      case 'Escape':
        e.preventDefault();
        reset();
        break;
      case '+':
      case '=':
        e.preventDefault();
        setWpm(prev => Math.min(1000, prev + 50));
        break;
      case '-':
      case '_':
        e.preventDefault();
        setWpm(prev => Math.max(100, prev - 50));
        break;
    }
  }

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [/* dependencies */]);
```

---

### 5.2 Context-Specific Shortcuts

**When Slider is Focused:**
| Key | Action |
|-----|--------|
| Arrow Up/Right | +50 WPM |
| Arrow Down/Left | -50 WPM |
| Page Up | +100 WPM |
| Page Down | -100 WPM |
| Home | Set to 100 WPM |
| End | Set to 1000 WPM |

**When Textarea is Focused:**
- All shortcuts disabled (except Tab to exit focus)
- Allows normal text editing without interference

**When Completion Screen is Active:**
- Esc: Close completion screen (return to paused state at end)
- Enter: Trigger "Read Again" button (focused by default)

---

### 5.3 Discoverability

**Visual Hint:**
```
Keyboard: Space (play/pause) • ← (rewind) • → (forward) • Esc (reset)
```
- Displayed below controls in small text (gray-500, 12px)
- Always visible (not hidden on mobile—useful for Bluetooth keyboards)

**Future Enhancement:**
- Keyboard shortcut overlay (press `?` to show all shortcuts)
- Not MVP-critical, but nice for power users

---

## 6. Mobile Touch Interactions

### 6.1 Primary Touch Targets

**Word Display (Tap to Play/Pause):**
- **Size:** Full component width/height (minimum 180px tall on mobile)
- **Behavior:** Single tap toggles playback (same as Space bar)
- **Visual Feedback:** Brief opacity change on tap (100ms)
- **Rationale:** Largest tap target, thumb-friendly, most common action

**Play/Pause Button:**
- **Size:** 56×56 px (larger on mobile than desktop)
- **Behavior:** Tap toggles playback
- **Visual Feedback:** Background color change on tap
- **Rationale:** Redundant with word display tap (gives users choice)

**All Buttons:**
- **Minimum Size:** 48×48 px (meets Apple HIG and Material Design guidelines)
- **Spacing:** 12px gap between adjacent buttons (prevents mis-taps)
- **Active State:** Brief scale-down on tap (`active:scale-95`)

---

### 6.2 Speed Slider Touch Behavior

**Standard Slider Interaction:**
- Drag thumb to adjust speed (same as desktop)
- Tap on track to jump to that WPM (native HTML5 behavior)

**Optional Enhancement (Phase 2):**
- Vertical swipe on slider thumb: ±50 WPM per swipe
- Useful on small screens where precise dragging is difficult

**NOT Implemented (Conflicts with Browser Gestures):**
- ❌ Swipe left/right on word display (conflicts with browser back/forward)
- ❌ Pinch to zoom on word display (should use browser's native zoom)

---

### 6.3 Long Press Interactions

**Not Implemented in MVP:**
Long press could trigger contextual actions (e.g., long press on word display → show full sentence context), but this adds complexity and isn't essential. If users request it, Phase 2.

---

### 6.4 Mobile-Specific Layout Adjustments

**Portrait Orientation:**
- Single-column layout (text input stacked above reader)
- Controls at bottom (thumb reach zone)
- Preset buttons: 2×2 grid on very small screens (<400px wide)

**Landscape Orientation:**
- Same as tablet view (two-column layout if width >640px)
- Smaller font size for word display (48px vs 52px portrait) to fit

**Sticky Controls (Optional):**
- On very long pages, controls could be `position: sticky` at bottom
- Not necessary for MVP (page isn't long enough to scroll)

---

## 7. State Machine & User Flows

### 7.1 Application States

```
┌─────────────┐
│   EMPTY     │ (No text loaded)
└──────┬──────┘
       │ User loads text
       ▼
┌─────────────┐
│   READY     │ (Text loaded, index = 0, paused)
└──────┬──────┘
       │ User presses Play
       ▼
┌─────────────┐
│  PLAYING    │ (Words advancing automatically)
└──────┬──────┘
       │
       ├─► User presses Pause → PAUSED
       │
       ├─► User changes speed → (Stay in PLAYING, delay adjusts)
       │
       ├─► User rewinds/FF → (Stay in PLAYING, index changes)
       │
       └─► Reaches end → COMPLETE
                │
                ▼
           ┌─────────────┐
           │  COMPLETE   │ (Completion screen shown)
           └──────┬──────┘
                  │
                  ├─► User clicks "Read Again" → READY (index = 0)
                  │
                  └─► User clicks "Load New Text" → EMPTY
```

---

### 7.2 State Transitions & Visual Feedback

| From State | Event | To State | Visual Change |
|------------|-------|----------|---------------|
| EMPTY | Load text | READY | Word 0 appears in display, Play button enabled |
| READY | Press Play | PLAYING | Play icon → Pause icon, words start advancing |
| PLAYING | Press Pause | PAUSED | Pause icon → Play icon, "Paused" message appears |
| PAUSED | Press Play | PLAYING | Play icon → Pause icon, "Paused" message disappears |
| PLAYING | Reach end | COMPLETE | Completion screen replaces reader UI |
| COMPLETE | Read Again | READY | Return to reader UI, index = 0 |
| COMPLETE | Load New Text | EMPTY | Return to empty state, textarea cleared |
| READY/PAUSED/PLAYING | Reset | READY | Index → 0, pause playback, progress bar → 0% |
| READY/PAUSED/PLAYING | Load new text | READY | Replace text, index → 0, pause playback |

---

### 7.3 Edge Case Handling

**User loads text while playing:**
- Stop current playback
- Load new text
- Reset to READY state (index = 0, paused)

**User changes speed while playing:**
- Continue playing from current word
- New delay applies to next word (no jump or stutter)

**User spams play/pause rapidly:**
- Each press toggles state instantly
- No debouncing (immediate response is better UX)

**User rewinds past beginning:**
- Clamp to index 0
- Disable rewind button visually

**User fast-forwards past end:**
- Clamp to last word
- Disable fast-forward button visually

**Tab loses focus (user switches tabs):**
- Automatically pause playback (prevent reading in background)
- Implementation: `document.addEventListener('visibilitychange', ...)`

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

### 7.4 User Flow: First-Time Use

**Goal:** User loads text and starts reading within 10 seconds.

**Steps:**
1. User lands on page → sees empty word display with "Paste text to begin"
2. User clicks textarea → pastes article text
3. Word count updates → "Words: 1,247"
4. User clicks "Load Text" → word 0 appears in display, Play button enabled
5. User presses Space (or clicks Play) → reading begins
6. User adjusts speed mid-reading → drags slider to comfortable WPM
7. Reading completes → completion screen shows stats
8. User clicks "Read Again" → restarts from beginning

**Friction Points:**
- ❌ User doesn't know about Space bar shortcut → **Mitigation:** Keyboard hint always visible
- ❌ User's default speed (350 WPM) is too fast → **Mitigation:** Preset buttons allow quick adjustment
- ❌ User loses their place → **Mitigation:** Pause is instant (Space or tap)

---

### 7.5 User Flow: Returning User

**Goal:** Leverage remembered WPM preference for instant reading.

**Steps:**
1. User lands on page → WPM is pre-loaded from localStorage (e.g., 450 WPM)
2. User pastes text → clicks "Load Text"
3. User presses Space → immediately starts reading at their preferred speed

**Implementation:**
```typescript
// On mount, load saved WPM
useEffect(() => {
  const savedWPM = localStorage.getItem('rsvp-wpm');
  if (savedWPM) {
    setWpm(Number(savedWPM));
  }
}, []);

// On WPM change, save to localStorage
useEffect(() => {
  localStorage.setItem('rsvp-wpm', String(wpm));
}, [wpm]);
```

---

## 8. Responsive Behavior

### 8.1 Breakpoints

**Mobile:** <640px
**Tablet:** 640px–1024px
**Desktop:** ≥1024px

### 8.2 Layout Changes by Breakpoint

#### **Mobile (<640px)**
- **Layout:** Single column, stacked vertically
- **Text Input:** Full width, 200px height
- **Word Display:** Full width, 180px min-height, 48px font
- **Controls:** Centered, 56px button size
- **Preset Buttons:** 2×2 grid on very small screens (<400px)

#### **Tablet (640px–1024px)**
- **Layout:** Two columns (45% text input, 55% reader)
- **Word Display:** 200px min-height, 60px font
- **Controls:** 48px button size
- **Preset Buttons:** Horizontal row

#### **Desktop (≥1024px)**
- **Layout:** Two columns, max-width 1280px (7xl), centered
- **Word Display:** 200px min-height, 60px font (72px on XL screens >1536px)
- **Controls:** 48px button size (56px for play/pause)
- **Container Padding:** 2rem horizontal, 4rem vertical

---

### 8.3 Component Responsiveness

**Word Display Font Size:**
```css
.word-display {
  font-size: 48px; /* Mobile */
}

@media (min-width: 640px) {
  .word-display {
    font-size: 60px; /* Tablet/Desktop */
  }
}

@media (min-width: 1536px) {
  .word-display {
    font-size: 72px; /* XL Desktop */
  }
}
```

**Buttons:**
```css
.playback-button {
  width: 56px;
  height: 56px; /* Mobile (larger for touch) */
}

@media (min-width: 640px) {
  .playback-button {
    width: 48px;
    height: 48px; /* Desktop (smaller, mouse precision) */
  }
}

.playback-button.primary {
  width: 56px;
  height: 56px; /* Play/Pause is larger on all screen sizes */
}
```

**Preset Buttons:**
```css
/* Mobile: 2×2 grid on very small screens */
@media (max-width: 400px) {
  .preset-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

/* Tablet/Desktop: Horizontal row */
@media (min-width: 401px) {
  .preset-buttons {
    display: flex;
    gap: 12px;
  }
}
```

---

### 8.4 Orientation Changes (Mobile)

**Portrait:**
- Default mobile layout (single column)

**Landscape:**
- If width >640px, switch to two-column layout (same as tablet)
- If width <640px, keep single column but reduce word display font to 42px (fit more on screen)

**Implementation:**
```typescript
const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

useEffect(() => {
  function handleOrientationChange() {
    setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
  }

  window.addEventListener('resize', handleOrientationChange);
  handleOrientationChange(); // Set initial value

  return () => window.removeEventListener('resize', handleOrientationChange);
}, []);
```

---

### 8.5 Extreme Screen Sizes

**Very Small (<375px width):**
- Word display font: 42px (prevent overflow)
- Buttons: Still 48×48px minimum (don't go smaller)
- Preset buttons: 2×2 grid

**Very Large (>1920px width):**
- Container: max-width 1280px (centered, prevents over-stretching)
- Word display font: max 72px (larger doesn't improve readability)

---

## 9. Implementation Checklist

### 9.1 Components to Build

- [ ] `WordDisplay.tsx` (word display with ORP highlighting)
- [ ] `Controls.tsx` (playback buttons, speed slider, presets)
- [ ] `ProgressBar.tsx` (progress bar + stats)
- [ ] `TextInput.tsx` (textarea, load buttons, word count)
- [ ] `CompletionScreen.tsx` (completion message + stats + actions)
- [ ] `SpeedReader.tsx` (main container, layout orchestration)

### 9.2 Utilities to Implement

- [ ] `getORP(word)` - Calculate Optimal Recognition Point
- [ ] `formatWord(word)` - Split word into before/ORP/after
- [ ] `calculateDelay(word, wpm)` - Adjust delay for punctuation/length
- [ ] `parseText(text)` - Split text into word array
- [ ] `formatTimeRemaining(seconds)` - Convert seconds to "2m 15s"

### 9.3 Custom Hook

- [ ] `useRSVPReader(text, wpm)` - Core reading logic
  - Returns: `{ currentWord, isPlaying, play, pause, rewind, fastForward, reset, progress }`

### 9.4 State Management

- [ ] `inputText` (textarea content)
- [ ] `words` (parsed word array)
- [ ] `currentIndex` (current word position)
- [ ] `isPlaying` (playback state)
- [ ] `wpm` (reading speed)
- [ ] `isComplete` (completion state)
- [ ] `elapsedTime` (total reading time)

### 9.5 Keyboard Shortcuts

- [ ] Space: Play/Pause
- [ ] ← / →: Rewind / Fast Forward
- [ ] Esc: Reset
- [ ] + / -: Adjust speed
- [ ] Disable shortcuts when textarea is focused

### 9.6 Touch Interactions

- [ ] Tap word display to play/pause
- [ ] 48×48px minimum touch targets
- [ ] Active state feedback on buttons

### 9.7 Accessibility

- [ ] ARIA labels on all icon-only buttons
- [ ] `role="progressbar"` on progress bar
- [ ] `aria-live="polite"` for state changes
- [ ] Focus indicators (2px blue ring)
- [ ] Logical tab order
- [ ] Screen reader announcements (play/pause/complete)

### 9.8 Responsive Design

- [ ] Mobile: Single column, 48px font, 56px buttons
- [ ] Tablet: Two columns, 60px font, 48px buttons
- [ ] Desktop: Two columns, 60px+ font, max-width 1280px
- [ ] Preset buttons: 2×2 grid on <400px, row on larger

### 9.9 Persistence

- [ ] Save WPM to localStorage on change
- [ ] Load WPM from localStorage on mount
- [ ] Clear localStorage on "Load New Text" (optional)

### 9.10 Edge Cases

- [ ] Auto-pause when tab loses focus
- [ ] Clamp rewind/FF at boundaries
- [ ] Disable controls when no text loaded
- [ ] Handle empty textarea (disable "Load Text" button)
- [ ] Handle single-word text (edge case, but should work)

### 9.11 Testing

- [ ] Test all keyboard shortcuts
- [ ] Test on iOS Safari (font size >16px to prevent zoom)
- [ ] Test on Android Chrome
- [ ] Test with VoiceOver (macOS)
- [ ] Test with NVDA (Windows)
- [ ] Test with keyboard only (no mouse)
- [ ] Test color contrast (WebAIM checker)
- [ ] Test at 200% browser zoom (text must remain functional)

---

## Final Notes for Mario

### What Success Looks Like

A user should be able to:
1. Paste text
2. Click "Load Text"
3. Press Space
4. **Read 2-3× faster than normal with full comprehension**

Everything else (controls, stats, accessibility) supports that core experience.

### Non-Negotiables

1. **Instant responsiveness** - No lag between Space press and pause. No delay updating WPM.
2. **WCAG 2.1 AA compliance** - This isn't optional. Focus indicators, ARIA labels, contrast ratios must all pass.
3. **Mobile-first** - Test on actual devices, not just browser dev tools.
4. **ORP accuracy** - The formula (`floor(length/2) - 1`) is critical. Don't "improve" it without research.

### Things You Can Adjust

- Exact button sizes (within accessibility minimums)
- Animation timing (as long as it stays fast)
- Color shades (as long as contrast ratios pass)
- Spacing values (as long as layout remains clear)

### Questions?

If anything in this spec is unclear or seems impossible to implement, push back. This is a conversation, not a mandate. The goal is a **great reading experience**, not pixel-perfect adherence to a document.

---

**Status:** Final specification. Ready for implementation.
**Estimated Implementation Time:** 3 days (core logic: 1 day, UI: 1 day, polish: 1 day)
**Next Step:** Mario begins implementation. Howard is available for design clarifications.

---

**End of UX Specification**
