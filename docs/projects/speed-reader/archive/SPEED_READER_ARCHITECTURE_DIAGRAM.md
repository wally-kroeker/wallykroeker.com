# Speed Reader - Architecture Diagram

**Visual Reference for Mario**
**Date:** 2026-01-16

---

## File Structure & Dependencies

```
app/tools/speed-reader/
│
├── page.tsx                          [Route Entry Point]
│   │
│   └── imports: Reader
│       └── exports: metadata (SEO)
│
├── Reader.tsx                        [Main Orchestrator]
│   │
│   ├── imports: useRSVPReader, useLocalStorage
│   ├── imports: TextInput, WordDisplay, ProgressBar, Controls
│   │
│   ├── manages: keyboard event handlers
│   └── manages: layout (2-col desktop, stack mobile)
│
├── useRSVPReader.ts                  [Core State Hook]
│   │
│   ├── imports: utils (parseText, formatWord, calculateDelay)
│   ├── imports: types (WordFormat, ProgressInfo)
│   │
│   ├── manages: text, words, currentIndex, isPlaying, wpm
│   ├── provides: play, pause, togglePlay, rewind, fastForward, reset
│   └── provides: currentWord, progress, updateWPM, loadText
│
├── useLocalStorage.ts                [Persistence Hook]
│   │
│   ├── manages: localStorage get/set
│   └── provides: [value, setValue] tuple
│
├── utils.ts                          [Pure Functions]
│   │
│   ├── exports: getORP(word) → number
│   ├── exports: formatWord(word) → WordFormat
│   ├── exports: calculateDelay(word, wpm) → number
│   └── exports: parseText(text) → string[]
│
├── types.ts                          [TypeScript Interfaces]
│   │
│   ├── exports: WordFormat { before, orp, after }
│   └── exports: ProgressInfo { currentWord, totalWords, ... }
│
├── TextInput.tsx                     [Component]
│   │
│   ├── props: onTextSubmit(text)
│   └── renders: <textarea>, buttons, word count
│
├── WordDisplay.tsx                   [Component]
│   │
│   ├── props: word (WordFormat | null), isPlaying, onClick
│   └── renders: word with ORP highlighted, or empty/finished state
│
├── ProgressBar.tsx                   [Component]
│   │
│   ├── props: currentWord, totalWords, percentComplete, estimatedTime
│   └── renders: progress bar + stats
│
└── Controls.tsx                      [Component]
    │
    ├── props: isPlaying, wpm, onPlayPause, onRewind, onFF, onReset, onWPMChange
    └── renders: playback buttons, slider, preset buttons
```

---

## Component Tree

```
page.tsx
└── <Reader>
    ├── <TextInput
    │     onTextSubmit={loadText}
    │   />
    │
    └── <div className="reader-display-column">
        │
        ├── <WordDisplay
        │     word={currentWord}
        │     isPlaying={isPlaying}
        │     onClick={togglePlay}
        │   />
        │
        ├── <ProgressBar
        │     currentWord={progress.currentWord}
        │     totalWords={progress.totalWords}
        │     percentComplete={progress.percentComplete}
        │     estimatedTimeRemaining={progress.estimatedTimeRemaining}
        │   />
        │
        └── <Controls
              isPlaying={isPlaying}
              wpm={wpm}
              onPlayPause={togglePlay}
              onRewind={() => rewind(10)}
              onFastForward={() => fastForward(10)}
              onReset={reset}
              onWPMChange={updateWPM}
            />
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User Action: Paste text                                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  TextInput.tsx                                               │
│  - User types in <textarea>                                 │
│  - Clicks "Load Text" button                                │
│  - Calls: onTextSubmit(inputText)                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Reader.tsx                                                  │
│  - Receives text via loadText callback                      │
│  - Calls: loadText(text) from useRSVPReader                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  useRSVPReader hook                                          │
│  - setText(newText)                                          │
│  - useEffect triggers on text change                        │
│  - Calls: parseText(text) → words[]                         │
│  - Sets: words, currentIndex=0, isPlaying=false             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  User Action: Click Play                                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  WordDisplay.tsx or Controls.tsx                             │
│  - onClick={togglePlay} or onPlayPause()                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  useRSVPReader hook                                          │
│  - setIsPlaying(true)                                        │
│  - useEffect detects isPlaying change                       │
│  - Starts timer loop:                                       │
│    1. Get current word: words[currentIndex]                │
│    2. Calculate delay: calculateDelay(word, wpm)           │
│    3. setTimeout(() => advanceWord(), delay)               │
│    4. advanceWord() → currentIndex++                       │
│    5. Repeat until end                                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Derived Values (recalculated on each render)               │
│  - currentWord = formatWord(words[currentIndex])            │
│  - progress = { currentWord, totalWords, percent, time }    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  UI Components (receive updated props)                      │
│  - WordDisplay shows formatted word with ORP                │
│  - ProgressBar shows percentage + stats                     │
│  - Controls shows play/pause icon, current WPM              │
└─────────────────────────────────────────────────────────────┘
```

---

## State Management (useRSVPReader)

```
State Variables:
┌──────────────────────────────────────────────────────────┐
│ text: string              // Raw input text             │
│ words: string[]           // Parsed word array          │
│ currentIndex: number      // Current word position      │
│ isPlaying: boolean        // Playback state             │
│ wpm: number               // Words per minute           │
│ timerRef: NodeJS.Timeout  // setTimeout reference       │
└──────────────────────────────────────────────────────────┘

Derived Values (computed on render):
┌──────────────────────────────────────────────────────────┐
│ currentWord: WordFormat | null                           │
│   → formatWord(words[currentIndex])                     │
│                                                          │
│ progress: ProgressInfo                                   │
│   → { currentWord, totalWords, percentComplete, time }  │
└──────────────────────────────────────────────────────────┘

Control Functions:
┌──────────────────────────────────────────────────────────┐
│ play()           // Start playback                       │
│ pause()          // Stop playback                        │
│ togglePlay()     // Toggle play/pause                    │
│ rewind(n)        // Go back N words                      │
│ fastForward(n)   // Skip ahead N words                   │
│ reset()          // Return to beginning                  │
│ updateWPM(wpm)   // Change speed                         │
│ loadText(text)   // Load new text                        │
└──────────────────────────────────────────────────────────┘
```

---

## Timer Loop Logic

```
useEffect(() => {
  if (isPlaying && currentIndex < words.length) {

    const word = words[currentIndex]
    const delay = calculateDelay(word, wpm)

    timerRef.current = setTimeout(() => {
      advanceWord()  // Increments currentIndex
    }, delay)

    return () => clearTimeout(timerRef.current)  // Cleanup
  }
}, [isPlaying, currentIndex, words, wpm])


Function: calculateDelay(word, wpm)
┌────────────────────────────────────────────┐
│ baseDelay = 60000 / wpm                    │
│                                            │
│ if word.length > 8:                        │
│   baseDelay += (word.length - 8) * 50     │
│                                            │
│ if word.endsWith(','):                     │
│   baseDelay += 100                         │
│                                            │
│ if word.endsWith('.'):                     │
│   baseDelay += 300                         │
│                                            │
│ return Math.max(baseDelay, 100)            │
└────────────────────────────────────────────┘
```

---

## ORP Calculation

```
Function: getORP(word)
┌────────────────────────────────────────────┐
│ if word.length <= 1: return 0              │
│ if word.length <= 3: return floor(len/2)   │
│ return floor(len/2) - 1                    │
└────────────────────────────────────────────┘

Examples:
"a"          → ORP = 0  → "[a]"
"at"         → ORP = 1  → "a[t]"
"the"        → ORP = 1  → "t[h]e"
"reading"    → ORP = 2  → "re[a]ding"
"technology" → ORP = 4  → "tech[n]ology"


Function: formatWord(word)
┌────────────────────────────────────────────┐
│ orpIndex = getORP(word)                    │
│                                            │
│ return {                                   │
│   before: word.slice(0, orpIndex)          │
│   orp: word[orpIndex]                      │
│   after: word.slice(orpIndex + 1)          │
│ }                                          │
└────────────────────────────────────────────┘
```

---

## Keyboard Event Handling (in Reader.tsx)

```
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {

    // Don't capture if user is typing in textarea
    if (e.target instanceof HTMLTextAreaElement) return

    switch (e.key) {
      case ' ':
        e.preventDefault()
        togglePlay()
        break

      case 'ArrowLeft':
        e.preventDefault()
        rewind(10)
        break

      case 'ArrowRight':
        e.preventDefault()
        fastForward(10)
        break

      case 'Escape':
        e.preventDefault()
        reset()
        break
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [togglePlay, rewind, fastForward, reset])
```

---

## LocalStorage Integration

```
In Reader.tsx:
┌────────────────────────────────────────────────────────┐
│ const [savedWPM, setSavedWPM] =                        │
│   useLocalStorage('speedReader_wpm', 300)              │
│                                                        │
│ const { wpm, updateWPM, ... } = useRSVPReader(savedWPM)│
│                                                        │
│ useEffect(() => {                                      │
│   setSavedWPM(wpm)                                     │
│ }, [wpm, setSavedWPM])                                 │
└────────────────────────────────────────────────────────┘

On page load:
1. useLocalStorage reads 'speedReader_wpm' from localStorage
2. Returns saved value (or 300 if not found)
3. Passes to useRSVPReader as initial WPM

On WPM change:
1. User adjusts slider → updateWPM(newValue)
2. useRSVPReader updates wpm state
3. useEffect detects change → setSavedWPM(wpm)
4. useLocalStorage writes to localStorage
```

---

## Responsive Layout

```
Desktop (≥768px):
┌─────────────────────────────────────────────────────────┐
│  Header                                                 │
├────────────────────────┬────────────────────────────────┤
│  TextInput             │  WordDisplay                   │
│  (45% width)           │  (55% width)                   │
│                        │  ProgressBar                   │
│                        │  Controls                      │
└────────────────────────┴────────────────────────────────┘

Mobile (<768px):
┌─────────────────────────────────────────────────────────┐
│  Header                                                 │
├─────────────────────────────────────────────────────────┤
│  TextInput                                              │
│  (full width)                                           │
├─────────────────────────────────────────────────────────┤
│  WordDisplay                                            │
│  (full width)                                           │
├─────────────────────────────────────────────────────────┤
│  ProgressBar                                            │
│  (full width)                                           │
├─────────────────────────────────────────────────────────┤
│  Controls                                               │
│  (full width)                                           │
└─────────────────────────────────────────────────────────┘


Implementation:
<div className="grid md:grid-cols-2 gap-8">
  <div>{/* TextInput */}</div>
  <div>{/* WordDisplay + Progress + Controls */}</div>
</div>
```

---

## CSS Classes (add to globals.css)

```css
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
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
  @apply w-14 h-14 flex items-center justify-center;
}

.control-btn-secondary {
  @apply p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
  @apply w-12 h-12 flex items-center justify-center;
}

.preset-btn {
  @apply flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm;
  @apply focus:outline-none focus:ring-2 ring-blue-500;
}

.preset-btn.active {
  @apply bg-blue-600 hover:bg-blue-700;
}

.speed-slider {
  @apply h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer;
}

.speed-slider::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full;
}

.speed-slider::-moz-range-thumb {
  @apply w-4 h-4 bg-blue-500 rounded-full border-0;
}
```

---

## Dependencies (Already in Project)

```json
{
  "dependencies": {
    "react": "18.3.1",              // ✓ Already installed
    "react-dom": "18.3.1",          // ✓ Already installed
    "next": "14.2.5",               // ✓ Already installed
    "tailwindcss": "3.4.7"          // ✓ Already installed
  }
}
```

**Optional (recommended):**
```bash
npm install lucide-react
```
For icons: Play, Pause, Rewind, FastForward, RotateCcw

**Alternative:** Use Unicode symbols if not installing lucide:
- Play: "▶"
- Pause: "❚❚"
- Rewind: "◄◄"
- FastForward: "►►"
- Reset: "⟲"

---

## Build & Test Commands

```bash
# Development
npm run dev
# Visit: http://localhost:3000/tools/speed-reader

# Type checking
npx tsc --noEmit

# Production build
npm run build

# Production server
npm run start
```

---

## Quick Implementation Checklist

**Day 1:**
- [ ] Create `/app/tools/speed-reader/` directory
- [ ] Copy types.ts from design doc
- [ ] Copy utils.ts from design doc
- [ ] Copy useRSVPReader.ts from design doc
- [ ] Copy useLocalStorage.ts from design doc
- [ ] Create basic page.tsx
- [ ] Create basic Reader.tsx
- [ ] Create basic WordDisplay.tsx
- [ ] Test: See words advancing

**Day 2:**
- [ ] Create Controls.tsx
- [ ] Create ProgressBar.tsx
- [ ] Create TextInput.tsx
- [ ] Wire all components in Reader.tsx
- [ ] Add keyboard shortcuts
- [ ] Test: All interactions work

**Day 3:**
- [ ] Add CSS to globals.css
- [ ] Add localStorage persistence
- [ ] Add completion state
- [ ] Mobile responsive testing
- [ ] Cross-browser testing
- [ ] Final polish

---

**End of Architecture Diagram**

This visual reference shows the complete system architecture. All code is in SPEED_READER_TECHNICAL_DESIGN.md.
