# Speed Reader - Component Hierarchy & Data Flow

**Visual reference for implementation**

---

## Component Tree

```
SpeedReaderPage
│
├── Header
│   ├── Title: "Speed Reader"
│   └── Subtitle: "Read faster with RSVP technology"
│
├── MainContainer (responsive: single column mobile, two columns desktop)
│   │
│   ├── LeftColumn (TextInputSection)
│   │   ├── Heading: "PASTE YOUR TEXT"
│   │   ├── TextInput
│   │   │   ├── Textarea (value: inputText, onChange: setInputText)
│   │   │   └── WordCount (computed: inputText.split(/\s+/).length)
│   │   └── LoadButtons
│   │       ├── LoadTextButton (onClick: loadText, disabled: !inputText)
│   │       └── LoadSampleButton (onClick: loadSample)
│   │
│   └── RightColumn (ReaderSection)
│       ├── Heading: "READER DISPLAY"
│       │
│       ├── WordDisplay
│       │   ├── EmptyState (if !words.length)
│       │   ├── ActiveWord (if words.length > 0)
│       │   │   ├── BeforeORP (text-white)
│       │   │   ├── ORPChar (text-red-500, font-bold)
│       │   │   └── AfterORP (text-white)
│       │   └── PausedMessage (if paused && pauseDuration > 2s)
│       │
│       ├── ProgressBar
│       │   ├── ProgressTrack (bg-gray-700)
│       │   │   └── ProgressFill (bg-blue-500, width: `${percentComplete}%`)
│       │   └── ProgressStats
│       │       ├── WordCount: "234 / 1,247 words"
│       │       └── TimeRemaining: "2m 15s remaining"
│       │
│       └── Controls
│           ├── PlaybackButtons
│           │   ├── RewindButton (onClick: rewind, disabled: currentIndex === 0)
│           │   ├── PlayPauseButton (onClick: togglePlayPause, primary)
│           │   ├── FastForwardButton (onClick: fastForward, disabled: currentIndex === totalWords - 1)
│           │   └── ResetButton (onClick: reset)
│           │
│           ├── SpeedControl
│           │   ├── SpeedLabel: "Speed: {wpm} WPM"
│           │   ├── SpeedSlider (min: 100, max: 1000, step: 50, value: wpm, onChange: setWpm)
│           │   └── PresetButtons
│           │       ├── Preset250 (onClick: setWpm(250))
│           │       ├── Preset350 (onClick: setWpm(350))
│           │       ├── Preset450 (onClick: setWpm(450))
│           │       └── Preset600 (onClick: setWpm(600))
│           │
│           └── KeyboardHints: "Space (play/pause) • ← (rewind) • → (forward) • Esc (reset)"
│
└── CompletionScreen (rendered conditionally when isComplete === true)
    ├── Checkmark (✓ green-500)
    ├── Title: "You're done!"
    ├── Stats
    │   ├── WordCount: "Read {totalWords} words"
    │   ├── ElapsedTime: "in {formatTime(elapsedTime)}"
    │   └── AverageWPM: "(Average: {avgWPM} WPM)"
    └── Actions
        ├── ReadAgainButton (onClick: reset + play)
        └── LoadNewTextButton (onClick: clearText)
```

---

## State Management

### Component State (in SpeedReaderPage)

```typescript
// User input
const [inputText, setInputText] = useState<string>('');

// Reader state (managed by useRSVPReader hook)
const {
  words,              // string[] - parsed word array
  currentIndex,       // number - current word position (0-based)
  isPlaying,          // boolean - playback state
  wpm,                // number - reading speed (100-1000)
  isComplete,         // boolean - reached end of text
  elapsedTime,        // number - total reading time in seconds
  play,               // () => void
  pause,              // () => void
  togglePlayPause,    // () => void
  rewind,             // () => void (back 10 words)
  fastForward,        // () => void (forward 10 words)
  reset,              // () => void (index = 0, pause)
  loadText,           // (text: string) => void
  setWpm,             // (wpm: number) => void
} = useRSVPReader();

// Computed values
const currentWord = words[currentIndex] || '';
const totalWords = words.length;
const percentComplete = totalWords > 0 ? (currentIndex / totalWords) * 100 : 0;
const wordsRemaining = totalWords - currentIndex;
const estimatedSecondsRemaining = (wordsRemaining / wpm) * 60;
const averageWPM = elapsedTime > 0 ? Math.round((totalWords / elapsedTime) * 60) : wpm;
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ USER ACTIONS                                                │
└───────┬─────────────────────────────────────────────────────┘
        │
        ├─► Paste text into textarea → setInputText(text)
        │
        ├─► Click "Load Text" → loadText(inputText)
        │       └─► parseText(inputText) → words array
        │           └─► currentIndex = 0, isPlaying = false
        │
        ├─► Press Space / Click Play → play()
        │       └─► isPlaying = true
        │           └─► Start interval timer
        │               └─► Every calculateDelay(currentWord, wpm) ms:
        │                   └─► currentIndex++
        │                       └─► if currentIndex >= totalWords:
        │                           └─► isComplete = true
        │
        ├─► Press Space / Click Pause → pause()
        │       └─► isPlaying = false
        │           └─► Clear interval timer
        │
        ├─► Drag speed slider → setWpm(newWPM)
        │       └─► Save to localStorage
        │           └─► Next word uses new delay (no restart needed)
        │
        ├─► Press ← / Click Rewind → rewind()
        │       └─► currentIndex = Math.max(0, currentIndex - 10)
        │
        ├─► Press → / Click FF → fastForward()
        │       └─► currentIndex = Math.min(totalWords - 1, currentIndex + 10)
        │
        ├─► Press Esc / Click Reset → reset()
        │       └─► currentIndex = 0, isPlaying = false
        │
        └─► Click "Read Again" (on completion) → reset() + play()
                └─► currentIndex = 0, isComplete = false, isPlaying = true

┌─────────────────────────────────────────────────────────────┐
│ AUTO ACTIONS (no user input)                                │
└───────┬─────────────────────────────────────────────────────┘
        │
        ├─► On mount → Load WPM from localStorage
        │       └─► const savedWPM = localStorage.getItem('rsvp-wpm')
        │           └─► if savedWPM: setWpm(Number(savedWPM))
        │
        ├─► On WPM change → Save to localStorage
        │       └─► localStorage.setItem('rsvp-wpm', String(wpm))
        │
        └─► On tab blur (document.hidden) → Auto-pause
                └─► if (document.hidden && isPlaying): pause()
```

---

## Hook Implementation: `useRSVPReader`

```typescript
function useRSVPReader() {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(350);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Load saved WPM on mount
  useEffect(() => {
    const savedWPM = localStorage.getItem('rsvp-wpm');
    if (savedWPM) setWpm(Number(savedWPM));
  }, []);

  // Save WPM on change
  useEffect(() => {
    localStorage.setItem('rsvp-wpm', String(wpm));
  }, [wpm]);

  // Auto-pause on tab blur
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden && isPlaying) {
        pause();
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);

  // Main reading loop
  useEffect(() => {
    if (!isPlaying || words.length === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (currentIndex >= words.length) {
      setIsComplete(true);
      setIsPlaying(false);
      setElapsedTime(Date.now() - startTimeRef.current);
      return;
    }

    const currentWord = words[currentIndex];
    const delay = calculateDelay(currentWord, wpm);

    timerRef.current = setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, words, wpm]);

  const play = () => {
    if (words.length === 0) return;
    if (currentIndex === 0) startTimeRef.current = Date.now();
    setIsPlaying(true);
  };

  const pause = () => setIsPlaying(false);

  const togglePlayPause = () => {
    if (isPlaying) pause();
    else play();
  };

  const rewind = () => {
    setCurrentIndex(prev => Math.max(0, prev - 10));
  };

  const fastForward = () => {
    setCurrentIndex(prev => Math.min(words.length - 1, prev + 10));
  };

  const reset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsComplete(false);
    setElapsedTime(0);
  };

  const loadText = (text: string) => {
    const parsedWords = parseText(text);
    setWords(parsedWords);
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsComplete(false);
    setElapsedTime(0);
  };

  return {
    words,
    currentIndex,
    isPlaying,
    wpm,
    isComplete,
    elapsedTime,
    play,
    pause,
    togglePlayPause,
    rewind,
    fastForward,
    reset,
    loadText,
    setWpm,
  };
}
```

---

## Utility Functions Summary

### `getORP(word: string): number`
Calculates the index of the Optimal Recognition Point.
```typescript
if (word.length <= 1) return 0;
if (word.length <= 3) return Math.floor(word.length / 2);
return Math.floor(word.length / 2) - 1;
```

### `formatWord(word: string): { before, orp, after }`
Splits word into three parts for rendering.
```typescript
const orpIndex = getORP(word);
return {
  before: word.slice(0, orpIndex),
  orp: word[orpIndex] || '',
  after: word.slice(orpIndex + 1),
};
```

### `calculateDelay(word: string, wpm: number): number`
Returns delay in milliseconds based on WPM + word characteristics.
```typescript
let delay = 60000 / wpm;
if (word.length > 8) delay += (word.length - 8) * 50;
if (lastChar === ',') delay += 100;
if (lastChar === '.') delay += 300;
return Math.max(delay, 100);
```

### `parseText(text: string): string[]`
Converts text into word array.
```typescript
return text.trim().split(/\s+/).filter(w => w.length > 0);
```

### `formatTimeRemaining(seconds: number): string`
Formats seconds as "2m 15s".
```typescript
if (seconds < 60) return `${seconds}s`;
const mins = Math.floor(seconds / 60);
const secs = seconds % 60;
return `${mins}m ${secs}s`;
```

---

## ARIA Attributes Reference

### WordDisplay
```html
<div
  role="button"
  tabIndex={0}
  aria-label="Reading area. Press Space to play or pause."
  onClick={togglePlayPause}
  className="word-display"
>
  {/* word content */}
</div>
```

### PlayPauseButton
```html
<button
  aria-label={isPlaying ? "Pause reading" : "Play reading"}
  aria-pressed={isPlaying}
  onClick={togglePlayPause}
>
  {isPlaying ? <Pause /> : <Play />}
</button>
```

### ProgressBar
```html
<div
  role="progressbar"
  aria-valuenow={currentIndex}
  aria-valuemin={0}
  aria-valuemax={totalWords}
  aria-label={`Reading progress: ${Math.round(percentComplete)}% complete`}
>
  {/* progress bar visual */}
</div>
```

### SpeedSlider
```html
<input
  type="range"
  min="100"
  max="1000"
  step="50"
  value={wpm}
  onChange={e => setWpm(Number(e.target.value))}
  aria-label="Reading speed in words per minute"
  aria-valuetext={`${wpm} words per minute`}
/>
```

### IconButtons
```html
<button aria-label="Rewind 10 words" onClick={rewind}>
  <Rewind />
</button>

<button aria-label="Fast forward 10 words" onClick={fastForward}>
  <FastForward />
</button>

<button aria-label="Reset to beginning" onClick={reset}>
  <RotateCcw />
</button>
```

### LiveRegion (state announcements)
```html
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {isPlaying ? "Reading started" : isComplete ? "Finished reading" : "Reading paused"}
</div>
```

---

## Keyboard Event Handler

```typescript
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    // Don't intercept when typing in textarea
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
}, [togglePlayPause, rewind, fastForward, reset, setWpm]);
```

---

## Responsive Layout (Tailwind)

### Container
```tsx
<div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-16">
  {/* content */}
</div>
```

### Two-Column Layout (Desktop)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div>{/* Text Input */}</div>
  <div>{/* Reader Display */}</div>
</div>
```

### Single-Column Layout (Mobile)
```tsx
<div className="flex flex-col gap-6">
  <div>{/* Text Input */}</div>
  <div>{/* Reader Display */}</div>
</div>
```

### Font Size (Responsive)
```tsx
<div className="text-5xl md:text-6xl 2xl:text-7xl font-mono">
  {/* word display - 48px → 60px → 72px */}
</div>
```

### Button Size (Responsive)
```tsx
<button className="w-14 h-14 md:w-12 md:h-12">
  {/* 56px mobile, 48px desktop */}
</button>
```

---

**This diagram should give you a complete mental model of the system. Refer back to it when implementing each component.**

---

**End of Component Hierarchy**
