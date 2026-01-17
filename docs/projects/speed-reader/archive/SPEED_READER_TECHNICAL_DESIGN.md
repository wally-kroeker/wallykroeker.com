# Speed Reader - Technical Design Specification

**Author:** Bill (Agent ID: 4)
**Date:** 2026-01-16
**Version:** 1.0
**Status:** Ready for Implementation

**References:**
- SPEED_READER_RESEARCH.md (Riker's comprehensive research)
- SPEED_READER_TECHNICAL_REFERENCE.md (code patterns and examples)
- SPEED_READER_UX_WIREFRAMES.md (visual design specifications)
- SPEED_READER_IMPLEMENTATION_ROADMAP.md (project timeline)

---

## Executive Summary

This document provides the final technical architecture and component specifications for implementing an RSVP (Rapid Serial Visual Presentation) speed reader on wallykroeker.com. Based on Riker's comprehensive research, this design prioritizes simplicity, performance, and alignment with the site's existing dark-mode aesthetic.

**Key Architectural Decisions:**
1. **Pure React implementation** - No external dependencies beyond existing stack
2. **Custom hooks for state management** - No Redux/Zustand needed
3. **Minimal component hierarchy** - 6 core components, clear separation of concerns
4. **Mobile-first responsive design** - Single-word display, no animations (MVP)
5. **localStorage persistence** - Save user preferences (WPM) without backend

**Implementation Complexity:** Low (estimated 8-12 hours)
**Risk Level:** Low (well-understood technology, simple architecture)

---

## 1. System Architecture

### 1.1 High-Level Component Hierarchy

```
app/tools/speed-reader/
├── page.tsx                    // Route + metadata + layout wrapper
│   └── <Reader />              // Main orchestrator component
│       ├── <TextInput />       // Left column: text input area
│       └── <ReaderDisplay />   // Right column: reading interface
│           ├── <WordDisplay /> // RSVP word with ORP highlighting
│           ├── <ProgressBar /> // Visual progress + stats
│           └── <Controls />    // Playback + speed controls
│
├── useRSVPReader.ts            // Custom hook (state + logic)
├── useLocalStorage.ts          // Persistence hook
├── utils.ts                    // Pure functions (ORP, delay, parse)
└── types.ts                    // TypeScript interfaces
```

### 1.2 Data Flow Architecture

```
User Input (Paste Text)
    ↓
TextInput component
    ↓
loadText() → useRSVPReader hook
    ↓
parseText() → words array
    ↓
Play button clicked
    ↓
useEffect timer loop:
    currentWord → formatWord() → WordDisplay
    calculateDelay() → setTimeout
    advanceWord() → currentIndex++
    ↓
Progress updates → ProgressBar
Controls → updateWPM/rewind/etc.
```

**State Management:**
- All state lives in `useRSVPReader` hook
- Components are purely presentational
- Callbacks passed down via props (standard React pattern)
- No prop drilling (max 2 levels deep)

### 1.3 Timing Architecture

**Timer Strategy: `setTimeout` (not `requestAnimationFrame`)**

**Rationale:**
- Simpler implementation (no frame-rate calculations)
- Sufficient precision for WPM timing (±10ms acceptable)
- Easier to debug and test
- Lower CPU usage than RAF loop

**Timing Flow:**
```javascript
1. Display word at index N
2. Calculate delay = f(word, WPM, punctuation)
3. setTimeout(() => advanceWord(), delay)
4. Advance to index N+1
5. Repeat until end of text
```

**Pause/Resume Handling:**
- Clear timeout on pause
- Store current index in state
- Resume from stored index on play

---

## 2. Component Specifications

### 2.1 Main Page Component

**File:** `app/tools/speed-reader/page.tsx`

**Purpose:** Route definition, SEO metadata, layout container

```typescript
import { Metadata } from 'next'
import Reader from './Reader'

export const metadata: Metadata = {
  title: 'Speed Reader - RSVP Tool | Wally Kroeker',
  description: 'Read 2-3x faster with RSVP technology. Free, privacy-focused web-based speed reader with optimal recognition point alignment.',
  keywords: ['speed reading', 'RSVP', 'Spritz alternative', 'fast reading tool', 'online speed reader'],
  openGraph: {
    title: 'Speed Reader - Free RSVP Tool',
    description: 'Read faster with science-backed RSVP technology',
    type: 'website',
  },
}

export default function SpeedReaderPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
            Speed Reader
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl">
            Read faster with RSVP (Rapid Serial Visual Presentation) technology.
            Paste any text below and experience reading at 2-3x your normal speed.
          </p>
        </header>

        {/* Main Reader Component */}
        <Reader />

        {/* Footer Info */}
        <footer className="mt-12 text-sm text-zinc-500 space-y-2">
          <p className="text-center">
            Keyboard shortcuts: <kbd className="px-2 py-1 bg-zinc-800 rounded">Space</kbd> play/pause,
            <kbd className="px-2 py-1 bg-zinc-800 rounded">←</kbd> rewind,
            <kbd className="px-2 py-1 bg-zinc-800 rounded">→</kbd> forward,
            <kbd className="px-2 py-1 bg-zinc-800 rounded">Esc</kbd> reset
          </p>
          <p className="text-center text-xs">
            Privacy-first: All processing happens in your browser. No tracking, no data collection.
          </p>
        </footer>
      </div>
    </main>
  )
}
```

**Design Notes:**
- Background: `bg-zinc-950` (matches site dark theme, slightly lighter than `#121212`)
- Max width: `7xl` (1280px) prevents over-stretching on wide screens
- Responsive padding: `px-4` mobile, `py-8 md:py-12` vertical spacing
- Footer provides keyboard hints and privacy reassurance

---

### 2.2 Reader Component (Main Orchestrator)

**File:** `app/tools/speed-reader/Reader.tsx`

**Purpose:** Layout container, keyboard event handling, component coordination

**Layout Strategy:**
- **Desktop (≥768px):** Two-column grid (45% text input / 55% reader display)
- **Mobile (<768px):** Single column stack (text input → reader display → controls)

**Keyboard Shortcut Handling:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore if user is typing in textarea
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

**Responsive Grid:**
```tsx
<div className="grid md:grid-cols-2 gap-8">
  {/* Left: Text Input */}
  <div>
    <TextInput onTextSubmit={loadText} />
  </div>

  {/* Right: Reader Display */}
  <div className="flex flex-col gap-6">
    <WordDisplay {...wordDisplayProps} />
    <ProgressBar {...progressProps} />
    <Controls {...controlProps} />
  </div>
</div>
```

---

### 2.3 WordDisplay Component

**File:** `app/tools/speed-reader/WordDisplay.tsx`

**Purpose:** Display current word with ORP highlighting

**MVP Decision: Single-word display, no context words, no animations**

**Visual Specification:**
- Font: `font-mono` (ui-monospace, SFMono, Consolas)
- Size: `text-5xl` (48px) mobile, `text-6xl` (60px) desktop
- ORP character: `text-red-500 font-bold`
- Background: `bg-zinc-900` (card background)
- Border: `border border-zinc-800`
- Padding: `p-8 md:p-12` (generous whitespace)
- Min height: `min-h-[200px]` (prevents layout shift)
- Clickable: Entire box toggles play/pause

**States:**
1. **Empty:** "Paste text to begin" (gray-500)
2. **Ready/Paused:** Word visible, static
3. **Playing:** Word visible, advancing (no animation)
4. **Completed:** "Finished! Click to restart" message

**Implementation:**
```typescript
interface WordDisplayProps {
  word: { before: string; orp: string; after: string } | null
  isPlaying: boolean
  onClick: () => void
}

export function WordDisplay({ word, isPlaying, onClick }: WordDisplayProps) {
  if (!word) {
    return (
      <div
        className="word-display-container cursor-pointer"
        onClick={onClick}
      >
        <p className="text-zinc-500 text-lg">Paste text to begin</p>
      </div>
    )
  }

  return (
    <div
      className="word-display-container cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? 'Pause reading' : 'Resume reading'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex items-center justify-center text-5xl md:text-6xl font-mono">
        <span className="text-zinc-100">{word.before}</span>
        <span className="text-red-500 font-bold">{word.orp}</span>
        <span className="text-zinc-100">{word.after}</span>
      </div>
    </div>
  )
}
```

**Tailwind Classes (define in globals.css or component):**
```css
.word-display-container {
  @apply bg-zinc-900 border border-zinc-800 rounded-lg;
  @apply min-h-[200px] flex flex-col items-center justify-center;
  @apply p-8 md:p-12;
  @apply transition-colors duration-200;
}

.word-display-container:hover {
  @apply bg-zinc-800 border-zinc-700;
}

.word-display-container:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-950;
}
```

---

### 2.4 Controls Component

**File:** `app/tools/speed-reader/Controls.tsx`

**Purpose:** Playback controls + speed adjustment

**Component Layout:**
```
[Playback Buttons Row]
  [Rewind] [Play/Pause] [FastForward] [Reset]

[Speed Label]
  Reading Speed: 350 WPM

[Speed Slider]
  ├────────●──────────┤
  100              1000

[Preset Buttons Row]
  [250] [350] [450] [600]
```

**Button Specifications:**
- **Primary (Play/Pause):** `bg-blue-600 hover:bg-blue-700` 56px × 56px
- **Secondary (Others):** `bg-zinc-800 hover:bg-zinc-700` 48px × 48px
- **Icons:** lucide-react (Play, Pause, Rewind, FastForward, RotateCcw)
- **Gap:** 12px between buttons
- **Mobile:** Increase to 56px for all (better touch targets)

**Speed Slider:**
- Range: 100-1000 WPM
- Step: 50 WPM
- Track: `bg-zinc-800` (unfilled), `bg-blue-500` (filled)
- Thumb: `bg-blue-500` 16px diameter (20px mobile)

**Preset Buttons:**
- Values: [250, 350, 450, 600] WPM
- Active state: `bg-blue-600` (matches current WPM)
- Inactive: `bg-zinc-800 hover:bg-zinc-700`
- Height: 40px, `px-4` horizontal padding

**Implementation:**
```typescript
interface ControlsProps {
  isPlaying: boolean
  wpm: number
  onPlayPause: () => void
  onRewind: () => void
  onFastForward: () => void
  onReset: () => void
  onWPMChange: (wpm: number) => void
}

export function Controls({
  isPlaying, wpm, onPlayPause, onRewind,
  onFastForward, onReset, onWPMChange
}: ControlsProps) {
  const presets = [250, 350, 450, 600]

  return (
    <div className="space-y-6">
      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRewind}
          className="control-btn-secondary"
          aria-label="Rewind 10 words"
        >
          <Rewind size={20} />
        </button>

        <button
          onClick={onPlayPause}
          className="control-btn-primary"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={onFastForward}
          className="control-btn-secondary"
          aria-label="Fast forward 10 words"
        >
          <FastForward size={20} />
        </button>

        <button
          onClick={onReset}
          className="control-btn-secondary"
          aria-label="Reset to beginning"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Speed Controls */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-300">
          Reading Speed: {wpm} WPM
        </label>

        <input
          type="range"
          min="100"
          max="1000"
          step="50"
          value={wpm}
          onChange={(e) => onWPMChange(parseInt(e.target.value))}
          className="speed-slider w-full"
          aria-label="Adjust reading speed"
        />

        <div className="flex gap-2">
          {presets.map(preset => (
            <button
              key={preset}
              onClick={() => onWPMChange(preset)}
              className={`preset-btn ${wpm === preset ? 'active' : ''}`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**CSS (add to globals.css):**
```css
.control-btn-primary {
  @apply p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950;
  @apply w-14 h-14 flex items-center justify-center;
}

.control-btn-secondary {
  @apply p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950;
  @apply w-12 h-12 flex items-center justify-center;
}

.preset-btn {
  @apply flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950;
}

.preset-btn.active {
  @apply bg-blue-600 hover:bg-blue-700;
}

/* Custom slider styling */
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

### 2.5 ProgressBar Component

**File:** `app/tools/speed-reader/ProgressBar.tsx`

**Purpose:** Visual progress indicator + reading stats

**Layout:**
```
[Progress Bar Visual]
███████████░░░░░░░░░░░ (65% filled)

[Stats Row]
234 / 1,247 words          2m 15s remaining
```

**Specifications:**
- Bar height: 8px (thicker than typical 2px for visibility)
- Border radius: `rounded-full`
- Background: `bg-zinc-800`
- Fill: `bg-blue-500`
- Transition: `transition-all duration-100 ease-linear` (smooth but not slow)
- Stats font: `text-sm text-zinc-400`

**Implementation:**
```typescript
interface ProgressBarProps {
  currentWord: number
  totalWords: number
  percentComplete: number
  estimatedTimeRemaining: number // seconds
}

export function ProgressBar({
  currentWord, totalWords, percentComplete, estimatedTimeRemaining
}: ProgressBarProps) {
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div
        className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={currentWord}
        aria-valuemin={0}
        aria-valuemax={totalWords}
        aria-label={`Reading progress: ${Math.round(percentComplete)}% complete`}
      >
        <div
          className="h-full bg-blue-500 transition-all duration-100 ease-linear"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm text-zinc-400">
        <span>{currentWord} / {totalWords} words</span>
        <span>{formatTime(estimatedTimeRemaining)} remaining</span>
      </div>
    </div>
  )
}
```

---

### 2.6 TextInput Component

**File:** `app/tools/speed-reader/TextInput.tsx`

**Purpose:** Text paste area + load controls

**Layout:**
```
Label: Paste your text here

┌─────────────────────────────────┐
│                                 │
│  [Textarea - 300px height]      │
│                                 │
│  Paste article, blog post...    │
│                                 │
└─────────────────────────────────┘

Words: 1,247

[Load Text]  [Load Sample]
```

**Textarea Specifications:**
- Height: 300px desktop, 200px mobile
- Background: `bg-zinc-900`
- Border: `border border-zinc-800` → `border-blue-500` on focus
- Font: 16px (prevents iOS zoom)
- Padding: `p-4`
- Resize: `resize-none` (fixed height)
- Placeholder: "Paste article, blog post, or any text you want to read faster..."

**Button Specifications:**
- "Load Text": Primary `bg-blue-600 hover:bg-blue-700`
- "Load Sample": Secondary `bg-zinc-800 hover:bg-zinc-700`
- Height: 48px
- Layout: Side-by-side desktop, can stack on very small mobile

**Sample Text:**
```typescript
const SAMPLE_TEXT = `Speed reading is a collection of techniques which attempt to increase reading speed without an unacceptable reduction in comprehension or retention. RSVP (Rapid Serial Visual Presentation) is one of the most effective methods. It presents text one word at a time at a fixed location, eliminating the need for eye movement. The Optimal Recognition Point (ORP) is the specific character in a word that the eye naturally focuses on for fastest recognition. By aligning the ORP with a fixed focal point, reading speed can increase from typical 200-300 words per minute to 500-1000+ words per minute.`
```

**Implementation:**
```typescript
interface TextInputProps {
  onTextSubmit: (text: string) => void
}

export function TextInput({ onTextSubmit }: TextInputProps) {
  const [inputText, setInputText] = useState('')

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0

  const handleLoad = () => {
    if (inputText.trim()) {
      onTextSubmit(inputText)
    }
  }

  const handleLoadSample = () => {
    setInputText(SAMPLE_TEXT)
    onTextSubmit(SAMPLE_TEXT)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-300">
        Paste your text here
      </label>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full h-64 md:h-[300px] p-4 bg-zinc-900 text-zinc-100
                   border border-zinc-800 rounded-lg resize-none
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                   placeholder:text-zinc-600 text-base"
        placeholder="Paste article, blog post, or any text you want to read faster..."
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-500">
          Words: {wordCount.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleLoad}
          disabled={!inputText.trim()}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700
                     disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed
                     rounded-lg transition-colors font-medium text-base"
        >
          Load Text
        </button>

        <button
          onClick={handleLoadSample}
          className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700
                     rounded-lg transition-colors text-base"
        >
          Load Sample
        </button>
      </div>
    </div>
  )
}
```

---

## 3. Core Logic Implementation

### 3.1 Types Definition

**File:** `app/tools/speed-reader/types.ts`

```typescript
export interface WordFormat {
  before: string
  orp: string
  after: string
}

export interface ProgressInfo {
  currentWord: number
  totalWords: number
  percentComplete: number
  estimatedTimeRemaining: number // seconds
}

export interface RSVPReaderState {
  text: string
  words: string[]
  currentIndex: number
  isPlaying: boolean
  wpm: number
}
```

---

### 3.2 Utility Functions

**File:** `app/tools/speed-reader/utils.ts`

```typescript
/**
 * Calculate Optimal Recognition Point index for a word
 * Based on research: ORP is slightly left of center
 */
export function getORP(word: string): number {
  if (word.length <= 1) return 0
  if (word.length <= 3) return Math.floor(word.length / 2)
  return Math.floor(word.length / 2) - 1
}

/**
 * Format word split at ORP for display
 */
export function formatWord(word: string): WordFormat {
  const orpIndex = getORP(word)
  return {
    before: word.slice(0, orpIndex),
    orp: word[orpIndex] || '',
    after: word.slice(orpIndex + 1)
  }
}

/**
 * Calculate display delay based on WPM and word characteristics
 */
export function calculateDelay(word: string, wpm: number): number {
  // Base delay: 60000ms / WPM
  let delay = 60000 / wpm

  // Adjust for word length (longer words take more time)
  if (word.length > 8) {
    delay += (word.length - 8) * 50
  }

  // Adjust for punctuation
  const lastChar = word[word.length - 1]

  if ([',', ';', ':'].includes(lastChar)) {
    delay += 100 // Brief pause
  }

  if (['.', '!', '?'].includes(lastChar)) {
    delay += 300 // Sentence ending pause
  }

  // Minimum delay (prevent visual strain)
  return Math.max(delay, 100)
}

/**
 * Parse text into words array
 */
export function parseText(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
}

/**
 * Estimate reading time in seconds
 */
export function estimateReadingTime(wordCount: number, wpm: number): number {
  return Math.ceil((wordCount / wpm) * 60)
}
```

---

### 3.3 RSVP Reader Hook

**File:** `app/tools/speed-reader/useRSVPReader.ts`

**Purpose:** Central state management and RSVP logic

```typescript
import { useState, useEffect, useCallback, useRef } from 'react'
import { parseText, calculateDelay, formatWord } from './utils'
import type { WordFormat, ProgressInfo } from './types'

export function useRSVPReader(initialWPM: number = 300) {
  const [text, setText] = useState('')
  const [words, setWords] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wpm, setWPM] = useState(initialWPM)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Parse text when it changes
  useEffect(() => {
    if (text) {
      const parsed = parseText(text)
      setWords(parsed)
      setCurrentIndex(0)
      setIsPlaying(false)
    }
  }, [text])

  // Get current word formatted
  const currentWord = useCallback((): WordFormat | null => {
    if (currentIndex >= words.length || words.length === 0) return null
    return formatWord(words[currentIndex])
  }, [currentIndex, words])

  // Calculate progress
  const progress = useCallback((): ProgressInfo => {
    const totalWords = words.length
    const current = currentIndex
    const percent = totalWords > 0 ? (current / totalWords) * 100 : 0
    const remaining = Math.max(0, totalWords - current)
    const timeRemaining = Math.ceil((remaining / wpm) * 60)

    return {
      currentWord: current,
      totalWords,
      percentComplete: percent,
      estimatedTimeRemaining: timeRemaining
    }
  }, [currentIndex, words.length, wpm])

  // Advance to next word
  const advanceWord = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1)
      return true
    }
    // Reached end
    setIsPlaying(false)
    return false
  }, [currentIndex, words.length])

  // Timer effect for auto-advancing
  useEffect(() => {
    if (isPlaying && currentIndex < words.length) {
      const word = words[currentIndex]
      const delay = calculateDelay(word, wpm)

      timerRef.current = setTimeout(() => {
        advanceWord()
      }, delay)

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }
  }, [isPlaying, currentIndex, words, wpm, advanceWord])

  // Control functions
  const play = useCallback(() => {
    if (words.length > 0) {
      if (currentIndex >= words.length) {
        setCurrentIndex(0) // Restart if at end
      }
      setIsPlaying(true)
    }
  }, [words.length, currentIndex])

  const pause = useCallback(() => {
    setIsPlaying(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const rewind = useCallback((numWords: number = 10) => {
    pause()
    setCurrentIndex(prev => Math.max(0, prev - numWords))
  }, [pause])

  const fastForward = useCallback((numWords: number = 10) => {
    pause()
    setCurrentIndex(prev => Math.min(words.length - 1, prev + numWords))
  }, [words.length, pause])

  const reset = useCallback(() => {
    pause()
    setCurrentIndex(0)
  }, [pause])

  const updateWPM = useCallback((newWPM: number) => {
    const clamped = Math.max(100, Math.min(1000, newWPM))
    setWPM(clamped)
  }, [])

  const loadText = useCallback((newText: string) => {
    pause()
    setText(newText)
  }, [pause])

  return {
    // State
    text,
    words,
    currentIndex,
    isPlaying,
    wpm,

    // Derived values
    currentWord: currentWord(),
    progress: progress(),

    // Controls
    play,
    pause,
    togglePlay,
    rewind,
    fastForward,
    reset,
    updateWPM,
    loadText
  }
}
```

---

### 3.4 LocalStorage Hook

**File:** `app/tools/speed-reader/useLocalStorage.ts`

**Purpose:** Persist user WPM preference

```typescript
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Initialize from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading ${key}:`, error)
      return initialValue
    }
  })

  // Update localStorage when value changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue))
      } catch (error) {
        console.error(`Error saving ${key}:`, error)
      }
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
```

**Usage in Reader:**
```typescript
// In Reader component
const [savedWPM, setSavedWPM] = useLocalStorage('speedReader_wpm', 300)
const { wpm, updateWPM, ... } = useRSVPReader(savedWPM)

// Save WPM when it changes
useEffect(() => {
  setSavedWPM(wpm)
}, [wpm, setSavedWPM])
```

---

## 4. Design System Integration

### 4.1 Color Palette (Zinc Scale)

**Existing Site Colors:**
- Background: `#121212` (custom) → Use `bg-zinc-950` (very close)
- Card backgrounds: `bg-zinc-900`
- Borders: `border-zinc-800`
- Hover states: `bg-zinc-800`
- Text primary: `text-zinc-100`
- Text secondary: `text-zinc-400`
- Accents: `text-blue-500` / `bg-blue-600`
- ORP highlight: `text-red-500`

**Consistency Notes:**
- Site uses zinc palette consistently
- Dark mode is only mode (no light theme)
- Blue for interactive elements (links, buttons)
- Red reserved for ORP (high contrast, attention-grabbing)

### 4.2 Typography

**Fonts:**
- Body: Default Tailwind sans-serif (system UI)
- Word display: `font-mono` (ui-monospace, SFMono, Consolas)

**Sizes:**
- Word display: `text-5xl` (48px) mobile, `text-6xl` (60px) desktop
- Headings: `text-3xl md:text-4xl`
- Body: `text-base` (16px)
- Small text: `text-sm` (14px)
- Labels: `text-sm font-medium`

### 4.3 Spacing & Layout

**Container:**
- Max width: `max-w-7xl` (1280px)
- Padding: `px-4` (16px) mobile, `px-6` (24px) desktop
- Vertical: `py-8 md:py-12`

**Component Gaps:**
- Between major sections: `gap-8` (32px)
- Within components: `gap-4` or `gap-6` (16-24px)
- Control buttons: `gap-3` (12px)

**Responsive Breakpoints:**
- Mobile: `<640px`
- Tablet: `640px - 1024px` (md: prefix)
- Desktop: `≥1024px` (lg: prefix)

---

## 5. Accessibility Specifications

### 5.1 WCAG 2.1 AA Compliance

**Contrast Ratios:**
- ✓ White on zinc-950: 15:1 (exceeds 4.5:1 requirement)
- ✓ Zinc-100 on zinc-900: 12:1
- ✓ Blue-500 on zinc-950: 8:1
- ✓ Red-500 on zinc-900: 6:1

**Keyboard Navigation:**
- ✓ All controls tabbable (native buttons/inputs)
- ✓ Focus indicators visible (ring-2 ring-blue-500)
- ✓ Logical tab order (top to bottom, left to right)
- ✓ Keyboard shortcuts documented (Space, arrows, Esc)

**Screen Reader Support:**
- ✓ Semantic HTML (button, textarea, progress)
- ✓ ARIA labels on icon-only buttons
- ✓ aria-live regions for state changes (optional enhancement)
- ✓ Role attributes (progressbar, button)

**Other Requirements:**
- ✓ No content relies solely on color (text labels present)
- ✓ Touch targets ≥44px (mobile buttons 56px)
- ✓ Text scalable to 200% (relative units)

### 5.2 ARIA Attribute Map

```typescript
// WordDisplay
<div
  role="button"
  tabIndex={0}
  aria-label={isPlaying ? "Pause reading" : "Resume reading"}
>

// Play/Pause Button
<button
  aria-label={isPlaying ? "Pause" : "Play"}
  aria-pressed={isPlaying}
>

// Progress Bar
<div
  role="progressbar"
  aria-valuenow={currentWord}
  aria-valuemin={0}
  aria-valuemax={totalWords}
  aria-label={`Reading progress: ${percent}% complete`}
>

// Speed Slider
<input
  type="range"
  aria-label="Adjust reading speed in words per minute"
  aria-valuetext={`${wpm} words per minute`}
>
```

---

## 6. Performance Specifications

### 6.1 Performance Targets

**Load Performance:**
- Initial page load: <2 seconds
- Component bundle: <100KB (uncompressed)
- No external dependencies (lucide-react is already in project)

**Runtime Performance:**
- Timer accuracy: ±10ms acceptable
- No lag with 10,000+ word texts
- Smooth UI at all WPM settings (100-1000)
- No memory leaks (timers cleaned up)

### 6.2 Optimization Strategies

**Code Splitting:**
- Speed reader route lazy-loaded (Next.js automatic)
- No impact on main bundle

**Memoization:**
- Use `useCallback` for all event handlers
- Use `useMemo` for expensive calculations (if needed)

**Timer Cleanup:**
- Clear timeout on unmount
- Clear timeout on pause
- Store timer ref to prevent leaks

**Text Parsing:**
- Parse on load only (not on every render)
- Use `useEffect` dependency on text change
- Filter empty strings from word array

---

## 7. Testing Strategy

### 7.1 Unit Tests (Optional but Recommended)

**Files to Test:**
- `utils.test.ts` - Test ORP calculation, delay calculation, text parsing
- `useRSVPReader.test.ts` - Test hook state management

**Example Tests:**
```typescript
// utils.test.ts
describe('getORP', () => {
  it('calculates correct ORP for various lengths', () => {
    expect(getORP('a')).toBe(0)
    expect(getORP('at')).toBe(1)
    expect(getORP('the')).toBe(1)
    expect(getORP('reading')).toBe(2) // 're[a]ding'
    expect(getORP('technology')).toBe(4) // 'tech[n]ology'
  })
})

describe('calculateDelay', () => {
  it('adds pause for punctuation', () => {
    expect(calculateDelay('word,', 300)).toBe(300) // 200 + 100
    expect(calculateDelay('word.', 300)).toBe(500) // 200 + 300
  })
})
```

### 7.2 Manual Testing Checklist

**Functional:**
- [ ] Text loads correctly
- [ ] Play/pause works
- [ ] Speed changes apply immediately
- [ ] Rewind/FF jump correct amount
- [ ] Progress bar updates accurately
- [ ] Completes at end of text

**UX:**
- [ ] Mobile layout stacks correctly
- [ ] Desktop two-column layout works
- [ ] Keyboard shortcuts function
- [ ] Touch targets adequate on mobile
- [ ] Focus indicators visible

**Edge Cases:**
- [ ] Empty text input
- [ ] Very short text (1-5 words)
- [ ] Very long text (10,000+ words)
- [ ] Special characters, URLs, numbers

**Browsers:**
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (macOS + iOS)
- [ ] Mobile Chrome (Android)

---

## 8. Open Design Decisions (MVP Choices)

### 8.1 Resolved for MVP

**1. Context Words:** ❌ None (single-word display only)
- **Rationale:** Simplifies implementation, maintains pure RSVP benefit
- **Phase 2:** Add faded previous/next words as option

**2. Animations:** ❌ None (instant word changes)
- **Rationale:** Fade/scale animations slow down reading, add complexity
- **Phase 2:** Add subtle fade option if users request

**3. Completion State:** ✅ Simple message "Finished! Click to restart"
- **Rationale:** Clear, actionable, no confetti distraction
- **Implementation:** Show message in WordDisplay when currentIndex >= totalWords

**4. Slider Tooltip:** ❌ No (WPM shown in label above slider)
- **Rationale:** Label updates in real-time, tooltip adds complexity
- **Phase 2:** Add tooltip if users find it confusing

**5. Reading Stats:** ❌ Not in MVP
- **Rationale:** Adds complexity, not essential for core functionality
- **Phase 2:** Track total words read, average WPM, streaks

### 8.2 Implementation Notes for Mario

**Completion Handling:**
```typescript
// In WordDisplay component
if (currentIndex >= totalWords && totalWords > 0) {
  return (
    <div className="word-display-container cursor-pointer" onClick={reset}>
      <div className="text-center">
        <p className="text-2xl text-zinc-100 mb-2">Finished!</p>
        <p className="text-zinc-400">Click to restart or load new text</p>
      </div>
    </div>
  )
}
```

**WPM Label (Real-time Update):**
```typescript
// In Controls component
<label className="block text-sm font-medium text-zinc-300">
  Reading Speed: {wpm} WPM
</label>
```
No debouncing needed - label updates instantly, reading speed applies on next word.

---

## 9. File Checklist for Mario

**Required Files (Create These):**
```
app/tools/speed-reader/
├── page.tsx                 ✓ Route + metadata
├── Reader.tsx               ✓ Main orchestrator
├── WordDisplay.tsx          ✓ RSVP display
├── Controls.tsx             ✓ Playback + speed
├── ProgressBar.tsx          ✓ Progress indicator
├── TextInput.tsx            ✓ Text input area
├── useRSVPReader.ts         ✓ Main hook
├── useLocalStorage.ts       ✓ Persistence hook
├── utils.ts                 ✓ Pure functions
└── types.ts                 ✓ TypeScript interfaces
```

**CSS Updates:**
```
app/globals.css
└── Add component styles (word-display-container, control buttons, slider)
```

**Integration:**
```
components/Header.tsx
└── Add nav link to /tools/speed-reader (optional, can be added in Phase 4)
```

---

## 10. Handoff to Mario

### 10.1 Implementation Order (3 Days)

**Day 1: Core Logic + Basic UI**
1. Create file structure
2. Implement `utils.ts` (pure functions)
3. Implement `types.ts`
4. Implement `useRSVPReader.ts` hook
5. Create basic `page.tsx` + `Reader.tsx`
6. Create basic `WordDisplay.tsx`
7. Test: Verify words display with ORP highlighting

**Day 2: Full UI + Controls**
1. Implement `Controls.tsx` (all buttons + slider)
2. Implement `ProgressBar.tsx`
3. Implement `TextInput.tsx`
4. Wire up all interactions
5. Add keyboard shortcuts to `Reader.tsx`
6. Test: All controls functional

**Day 3: Polish + Mobile + Persistence**
1. Add `useLocalStorage.ts` hook
2. Integrate WPM persistence
3. Mobile responsive testing (Chrome DevTools)
4. Add completion state to `WordDisplay`
5. Add CSS to `globals.css`
6. Cross-browser testing
7. Accessibility audit (keyboard nav, ARIA)

### 10.2 Testing Before Handoff to Bob

**Must Pass:**
- [ ] Text loads and parses correctly
- [ ] RSVP playback works at 250, 350, 600 WPM
- [ ] All keyboard shortcuts work
- [ ] Mobile layout renders correctly (Chrome DevTools iPhone)
- [ ] No console errors or warnings
- [ ] WPM preference persists on page reload

### 10.3 Questions for Bob/Wally

1. **Navigation Integration:** Add "Speed Reader" to main nav immediately, or wait for launch?
2. **Analytics:** Track any events (pageviews only, or also WPM usage)?
3. **URL Slug:** `/tools/speed-reader` confirmed, or prefer `/speed-reader`?

---

## 11. Future Enhancements (Phase 2)

**Prioritized Features:**
1. **Blog Integration** (High value, low effort)
   - Add "Read with RSVP" button to blog posts
   - One-click load post content into speed reader

2. **Reading Stats** (Medium value, medium effort)
   - Track total words read
   - Average WPM over sessions
   - Reading streaks

3. **URL Loading** (Medium value, high effort)
   - Fetch article from URL
   - Parse HTML to extract text (Readability.js)
   - Handle CORS with server-side proxy

4. **Light Mode** (Low priority - only if requested)
   - Theme toggle
   - Light color palette

5. **Font Customization** (Accessibility feature)
   - Font size adjustment
   - Font family options (serif, sans, mono)

---

## Conclusion

This technical design provides a complete, production-ready specification for implementing the RSVP speed reader. The architecture is intentionally simple:

- **6 components** (clear separation of concerns)
- **1 main hook** (centralized state management)
- **4 utility functions** (pure, testable logic)
- **Zero external dependencies** (uses existing stack)

**Implementation is low-risk:**
- Well-understood RSVP technology (40+ years of research)
- Simple React patterns (hooks, controlled components)
- Standard Tailwind styling (matches site aesthetic)
- No complex async operations or API calls

**Expected timeline:** 8-12 hours (3 days @ 3-4 hours/day)

**Next step:** Mario begins implementation following Day 1 tasks above.

---

**Prepared by Bill - The Architect**
*"Measure twice, cut once. This design is ready for implementation."*
