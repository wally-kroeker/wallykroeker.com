# Speed Reader - UX Wireframes & Design Specifications

**For:** Bill (design phase)
**Purpose:** Visual layout guidance and interaction patterns
**Companion docs:** SPEED_READER_RESEARCH.md (research), SPEED_READER_TECHNICAL_REFERENCE.md (implementation)

---

## 1. Design Philosophy

**Principles:**
- **Dark-first:** Match wallykroeker.com aesthetic (gray-900 background, high contrast text)
- **Minimal:** No clutter, focus on reading experience
- **Fast:** Instant load, no animations that distract
- **Accessible:** Large touch targets, keyboard-friendly, screen reader support
- **Mobile-first:** Most use case is reading on phones during commutes

**Visual Style:**
- Consistent with existing site (Tailwind default palette)
- Monospace font for word display (better ORP alignment)
- Red ORP indicator (Spritz signature, high recognition)
- Generous whitespace (reduce visual stress)

---

## 2. Desktop Layout (≥768px)

```
┌─────────────────────────────────────────────────────────────┐
│ [Site Nav]                                       [Tools]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Speed Reader                                                │
│  Read faster with RSVP technology                            │
│                                                               │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                   │
│  PASTE YOUR TEXT         │        READER DISPLAY             │
│                          │                                   │
│  ┌────────────────────┐ │         ┌──────────────────┐      │
│  │                    │ │         │                  │      │
│  │  [Text Area]       │ │         │    re[a]ding     │      │
│  │  (h=300px)         │ │         │   (60px font)    │      │
│  │                    │ │         │                  │      │
│  │  Paste article...  │ │         └──────────────────┘      │
│  │                    │ │                                   │
│  └────────────────────┘ │         [Progress Bar]            │
│                          │         ███████░░░░░░░ 65%        │
│  Words: 1,247           │         234/1,247 words           │
│                          │         2m 15s remaining          │
│  [Load Text]            │                                   │
│  [Load Sample]          │         CONTROLS                  │
│                          │                                   │
│                          │         [◄◄] [▶/❚❚] [►►] [⟲]     │
│                          │                                   │
│                          │         Speed: 350 WPM            │
│                          │         ├────●─────────┤          │
│                          │         100        1000           │
│                          │                                   │
│                          │         [250] [350] [450] [600]   │
│                          │                                   │
├──────────────────────────┴──────────────────────────────────┤
│                                                               │
│  Keyboard: Space (play/pause) • ← (rewind) • → (forward)    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Layout Breakdown

**Grid Structure:**
- Two-column layout: 45% text input, 55% reader display
- Gap: 2rem (32px)
- Container: max-w-7xl, centered
- Padding: 2rem horizontal, 4rem vertical

**Left Column (Text Input):**
- Textarea: Full width, 300px height, gray-800 background
- Rounded corners (8px), subtle border (gray-700)
- Placeholder: "Paste article, blog post, or any text..."
- Word count below: Small text, gray-500
- Buttons: Primary (blue-600) + Secondary (gray-700)

**Right Column (Reader):**
- Word display: Center-aligned, large font (60px desktop, 48px mobile)
- ORP character: Red-500, bold
- Background: Gray-800, rounded (8px), generous padding (48px vertical)
- Hover state: Subtle highlight (gray-750)
- Click target: Entire box (tap to pause/play)

---

## 3. Mobile Layout (<768px)

```
┌───────────────────────────────┐
│ [☰] Speed Reader              │
├───────────────────────────────┤
│                               │
│  PASTE YOUR TEXT              │
│                               │
│  ┌─────────────────────────┐ │
│  │                         │ │
│  │ [Text Area]             │ │
│  │ (h=200px)               │ │
│  │                         │ │
│  └─────────────────────────┘ │
│                               │
│  Words: 1,247                │
│  [Load Text] [Sample]        │
│                               │
├───────────────────────────────┤
│                               │
│  READER                       │
│                               │
│  ┌─────────────────────────┐ │
│  │                         │ │
│  │     re[a]ding           │ │
│  │    (48px font)          │ │
│  │                         │ │
│  └─────────────────────────┘ │
│                               │
│  [Progress Bar]               │
│  ███████░░░░░░░ 65%           │
│  234/1,247 • 2m 15s           │
│                               │
│  CONTROLS                     │
│  ┌───────────────────────┐   │
│  │ [◄◄] [▶❚❚] [►►] [⟲]  │   │
│  └───────────────────────┘   │
│                               │
│  Speed: 350 WPM               │
│  ├───────●──────────┤         │
│                               │
│  [250] [350] [450] [600]      │
│                               │
└───────────────────────────────┘
```

### Mobile-Specific Adjustments

**Stack Vertically:**
- Text input at top (collapsible after loading?)
- Reader display in middle
- Controls at bottom (thumb-reach zone)

**Touch Targets:**
- Minimum 44x44px (Apple HIG)
- Buttons: 48px height, full-width on small screens
- Slider: Larger thumb (20px diameter vs 16px desktop)

**Font Scaling:**
- Word display: 48px (readable without zoom)
- Body text: 16px (native size)
- Button text: 14-16px

**Spacing:**
- Reduced padding (16px vs 32px desktop)
- Tighter gaps between elements (16px vs 24px)

---

## 4. Component Specifications

### 4.1 Word Display Component

**Desktop Dimensions:**
- Width: Auto (flex-grow)
- Height: 200px minimum
- Padding: 48px vertical, 32px horizontal
- Font: 60px monospace (ui-monospace, SFMono, Consolas)

**Mobile Dimensions:**
- Height: 180px minimum
- Padding: 32px vertical, 24px horizontal
- Font: 48px monospace

**Visual States:**
1. **Empty:** "Paste text to begin" (gray-500, 24px)
2. **Active (playing):** Word visible, no additional indicator
3. **Paused:** Word visible, subtle "Paused" text below?
4. **Hover:** Background lightens slightly (gray-750)
5. **Focus:** Blue ring (2px, blue-500)

**ORP Highlighting:**
- Before ORP: White text (inherit)
- ORP character: Red-500, font-bold
- After ORP: White text (inherit)

**Optional Context:**
- Show full word below in smaller text (16px, gray-600)
- OR show previous/next word faded (30% opacity)
- Bill's choice: Context aids comprehension but reduces pure RSVP benefit

### 4.2 Controls Component

**Playback Buttons:**
- Size: 48px × 48px (desktop), 56px × 56px (mobile)
- Layout: Horizontal row, centered
- Spacing: 12px gap
- Icons: lucide-react (Rewind, Play, Pause, FastForward, RotateCcw)

**Button Hierarchy:**
1. **Primary (Play/Pause):** Blue-600, larger (56px desktop)
2. **Secondary (Rewind/FF/Reset):** Gray-700, standard (48px desktop)

**Speed Slider:**
- Range: 100-1000 WPM
- Step: 50 WPM
- Thumb: Blue-500, 16px diameter (20px mobile)
- Track: Gray-700 background, blue-500 fill
- Labels: "100" and "1000" at ends, or just current WPM above

**Preset Buttons:**
- Size: Auto-width (px-4), 40px height
- Layout: Horizontal row, equal spacing
- Active state: Blue-600 (selected), Gray-700 (unselected)
- Values: [250, 350, 450, 600] WPM

### 4.3 Progress Bar Component

**Dimensions:**
- Width: 100% (container width)
- Height: 8px (thicker than typical 2px for better visibility)
- Border radius: 9999px (fully rounded)

**Visual:**
- Background: Gray-700
- Fill: Blue-500
- Transition: Width 100ms linear (smooth progress)

**Stats Below:**
- Two-column layout: "234/1,247 words" (left), "2m 15s remaining" (right)
- Font: 14px, gray-400
- Spacing: 8px above bar

### 4.4 Text Input Component

**Textarea:**
- Width: 100%
- Height: 300px (desktop), 200px (mobile)
- Background: Gray-800
- Border: 1px gray-700, 2px blue-500 on focus
- Font: 16px (prevent iOS zoom), line-height 1.5
- Padding: 16px
- Resize: None (fixed height)

**Buttons:**
- "Load Text": Primary (blue-600), 48px height
- "Load Sample": Secondary (gray-700), 48px height
- Layout: Side-by-side (desktop), stacked (mobile <400px)

**Word Count:**
- Position: Below textarea, right-aligned
- Font: 14px, gray-500
- Format: "Words: 1,247"

---

## 5. Interaction Patterns

### 5.1 Keyboard Shortcuts

| Key | Action | Visual Feedback |
|-----|--------|-----------------|
| **Space** | Play/Pause | Button icon changes, word display pauses |
| **←** | Rewind 10 words | Brief highlight on rewind button |
| **→** | Fast forward 10 words | Brief highlight on FF button |
| **Esc** | Reset to beginning | Word display resets, progress bar at 0% |
| **+/=** | Increase speed (+50 WPM) | Slider updates, WPM label changes |
| **-/_** | Decrease speed (-50 WPM) | Slider updates, WPM label changes |

**Implementation Note:**
- Disable shortcuts when focus is in textarea (don't interfere with typing)
- Show keyboard hint below controls (small text, gray-500)

### 5.2 Touch Gestures (Mobile)

| Gesture | Action | Use Case |
|---------|--------|----------|
| **Tap word display** | Play/Pause | Primary control (thumb-friendly) |
| **Swipe up/down on slider** | Adjust speed | Alternative to dragging slider |
| **Long press word display** | Show context menu? | Future: Font size, theme, etc. |

**Optional (Phase 2):**
- Swipe left on word display: Rewind
- Swipe right on word display: Fast forward
- (Test carefully: May conflict with browser gestures)

### 5.3 State Transitions

```
[Empty State]
    ↓ (User pastes text + clicks "Load Text")
[Ready State] (word at index 0, paused)
    ↓ (User clicks Play or presses Space)
[Playing State] (auto-advancing words)
    ↓ (User clicks Pause or presses Space)
[Paused State] (word visible, timer stopped)
    ↓ (Reaches end of text)
[Complete State] (option: auto-reset or show completion message)
```

**Visual Indicators:**
- Ready: Play button enabled, word visible
- Playing: Pause icon, words advancing, progress bar moving
- Paused: Play icon, word static, progress bar static
- Complete: "Finished!" message, option to reset or load new text

---

## 6. Responsive Breakpoints

### 6.1 Tailwind Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| **Mobile** | <640px | Single column, controls at bottom |
| **Tablet** | 640-1024px | Two columns, side-by-side |
| **Desktop** | ≥1024px | Two columns, wider max-width (7xl) |

### 6.2 Component Responsiveness

**Word Display:**
- Font size: 48px (mobile) → 60px (tablet) → 72px (desktop XL)
- Padding: 24px (mobile) → 32px (tablet) → 48px (desktop)

**Controls:**
- Buttons: 56px (mobile) → 48px (desktop) — larger on mobile for touch
- Preset buttons: Full-width (mobile <400px) → auto-width (larger)

**Text Input:**
- Height: 200px (mobile) → 300px (tablet+)
- Buttons: Stacked (mobile <400px) → side-by-side (larger)

---

## 7. Accessibility Checklist

### 7.1 WCAG 2.1 AA Compliance

**Visual:**
- [x] Contrast ratio ≥4.5:1 for text (white on gray-900 = 15:1)
- [x] Contrast ratio ≥3:1 for UI components (buttons, borders)
- [x] Focus indicators visible (2px blue ring)
- [x] No content relies solely on color (text labels on buttons)

**Keyboard:**
- [x] All controls accessible via Tab
- [x] Logical tab order (top to bottom, left to right)
- [x] Space/Enter activates buttons
- [x] Esc closes/resets (expected behavior)

**Screen Reader:**
- [x] Semantic HTML (button, textarea, progress)
- [x] ARIA labels on icon-only buttons
- [x] Live region announces state changes (playing/paused)
- [x] Progress updates announced (via aria-live="polite")

**Other:**
- [x] Text scales to 200% without loss of functionality
- [x] Works with keyboard only (no mouse required)
- [x] Pause on blur (stop reading if user switches tabs)

### 7.2 ARIA Attributes

```html
<!-- Word Display -->
<div
  role="button"
  tabindex="0"
  aria-label="Reading area. Press Space to play or pause."
  aria-live="off"
>
  <!-- Word content -->
</div>

<!-- Play/Pause Button -->
<button
  aria-label={isPlaying ? "Pause reading" : "Play reading"}
  aria-pressed={isPlaying}
>
  {isPlaying ? <Pause /> : <Play />}
</button>

<!-- Progress -->
<div
  role="progressbar"
  aria-valuenow={currentWord}
  aria-valuemin="0"
  aria-valuemax={totalWords}
  aria-label={`Reading progress: ${percentComplete}% complete`}
>
  <!-- Progress bar visual -->
</div>

<!-- Speed Slider -->
<input
  type="range"
  aria-label="Reading speed in words per minute"
  aria-valuetext={`${wpm} words per minute`}
/>
```

---

## 8. Design Tokens (Tailwind)

### 8.1 Colors

```javascript
// Already in wallykroeker.com theme
colors: {
  gray: {
    900: '#111827', // Background
    800: '#1F2937', // Card background
    750: '#252d3a', // Hover state (custom)
    700: '#374151', // Borders, secondary buttons
    600: '#4B5563', // Disabled states
    500: '#6B7280', // Secondary text
    400: '#9CA3AF', // Tertiary text
  },
  blue: {
    700: '#1D4ED8', // Button hover
    600: '#2563EB', // Primary buttons
    500: '#3B82F6', // Accents
  },
  red: {
    500: '#EF4444', // ORP highlight
  },
  white: '#FFFFFF', // Primary text
}
```

### 8.2 Typography

```javascript
fontFamily: {
  mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
  sans: ['Inter', 'system-ui', 'sans-serif'],
}

fontSize: {
  'xs': '12px',
  'sm': '14px',
  'base': '16px',
  'lg': '18px',
  'xl': '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
  '5xl': '48px',
  '6xl': '60px',
  '7xl': '72px',
}
```

### 8.3 Spacing

```javascript
spacing: {
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '6': '24px',
  '8': '32px',
  '12': '48px',
  '16': '64px',
}
```

---

## 9. Design Decisions & Rationale

### 9.1 Why Monospace Font?

**Pros:**
- Consistent character width makes ORP alignment predictable
- "Code-like" aesthetic fits technical audience
- High readability at large sizes

**Cons:**
- Less elegant than proportional fonts
- May feel "mechanical" to some users

**Decision:** Use monospace. The technical benefits outweigh aesthetic concerns, and the audience (developers/makers) will appreciate the precision.

### 9.2 Why Red for ORP?

**Pros:**
- High contrast against white text
- Instantly recognizable (Spritz signature)
- Eye naturally drawn to red (attention color)

**Cons:**
- Red can signal "error" in some contexts
- Color-blind users may not distinguish

**Decision:** Use red with fallback (bold + slightly larger font size ensures visibility even without color perception).

### 9.3 Why Dark Theme Only?

**Pros:**
- Matches site aesthetic
- Reduces eye strain for long reading sessions
- Most speed reading happens on mobile at night (commute home)

**Cons:**
- Some users prefer light mode

**Decision:** Dark only for MVP. Add light mode toggle in Phase 2 if users request it. (Check localStorage for system preference as fallback?)

### 9.4 Why Two-Column Desktop Layout?

**Pros:**
- Keeps text input visible (easy to reload/edit)
- Natural separation: input (left) → output (right)
- Uses screen real estate efficiently

**Cons:**
- Horizontal space wasted on ultrawide monitors

**Decision:** Two-column with max-width (7xl = 1280px). Prevents over-stretching on huge screens while maintaining usable layout on standard displays.

---

## 10. Bill's Design Deliverables

### 10.1 Required for Mario's Implementation

1. **Component Specs:**
   - Final dimensions for all components (desktop + mobile)
   - Exact Tailwind classes for each element
   - Interaction states (hover, focus, active, disabled)

2. **Layout Specs:**
   - Grid/flex specifications
   - Spacing values (gap, padding, margin)
   - Breakpoint adjustments

3. **Color/Typography:**
   - Confirm color palette (or suggest adjustments)
   - Font size decisions (especially word display)
   - Line heights, letter spacing

4. **Interactions:**
   - Finalize keyboard shortcuts
   - Touch gesture support (yes/no for Phase 1?)
   - Animation timing (fade-in for words, progress bar transition speed)

### 10.2 Optional (Nice to Have)

- Figma mockup (visual reference)
- Interactive prototype (InVision, Framer)
- Accessibility audit notes
- Dark mode variant (if different from specs above)

---

## 11. Open Questions for Bill

**UX Decisions:**
1. Should we show context words (previous/next faded) or pure single-word display?
2. How should "completed" state look? Message, confetti, auto-reset?
3. Do we need a "reading stats" section (total words read, average WPM)?
4. Should slider show numerical WPM while dragging (tooltip)?

**Visual Polish:**
5. Any subtle animations on word change? (Fade, scale, slide?)
6. Should buttons have icon + text labels, or icon-only?
7. Progress bar: Should it show markers for paragraphs/sections?
8. Font choice: Strict monospace or allow fallback to proportional (Inter)?

**Accessibility:**
9. Do we need a "reduce motion" mode (disable word transitions)?
10. Should we support custom color schemes (not just dark/light)?

---

## Conclusion

This wireframe provides a comprehensive visual foundation for the speed reader implementation. Key design principles:

1. **Simplicity:** Two-column layout, clear hierarchy
2. **Focus:** Large, readable word display dominates the UI
3. **Control:** Accessible controls without clutter
4. **Responsive:** Mobile-first, scales elegantly to desktop
5. **Accessible:** Keyboard, screen reader, high contrast support

**Next Steps:**
1. Bill reviews wireframes and creates detailed component specs
2. Bill answers open questions (context words, animations, etc.)
3. Bill delivers finalized design to Mario for implementation

**Estimated design time:** 4-6 hours for Bill (wireframes, component specs, interaction details)

---

**End of UX Wireframes Document**
