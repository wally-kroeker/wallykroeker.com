import type { WordFormat } from './types'

interface WordDisplayProps {
  word: WordFormat | null
  isPlaying: boolean
  isComplete: boolean
  onClick: () => void
  onReset: () => void
}

export function WordDisplay({ word, isPlaying, isComplete, onClick, onReset }: WordDisplayProps) {
  if (isComplete) {
    return (
      <div
        className="word-display-container cursor-pointer"
        onClick={onReset}
        role="button"
        tabIndex={0}
        aria-label="Reading complete. Click to restart"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onReset()
          }
        }}
      >
        <div className="text-center">
          <p className="text-2xl text-zinc-100 mb-2">Finished!</p>
          <p className="text-zinc-400">Click to restart or load new text</p>
        </div>
      </div>
    )
  }

  if (!word) {
    return (
      <div
        className="word-display-container cursor-pointer"
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label="Paste text to begin"
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
