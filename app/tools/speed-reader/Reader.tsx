'use client'

import { useEffect } from 'react'
import { useRSVPReader } from './useRSVPReader'
import { useLocalStorage } from './useLocalStorage'
import { WordDisplay } from './WordDisplay'
import { Controls } from './Controls'
import { ProgressBar } from './ProgressBar'
import { TextInput } from './TextInput'

export default function Reader() {
  const [savedWPM, setSavedWPM] = useLocalStorage('speedReader_wpm', 350)
  const {
    words,
    currentIndex,
    isPlaying,
    wpm,
    currentWord,
    progress,
    togglePlay,
    rewind,
    fastForward,
    reset,
    updateWPM,
    loadText
  } = useRSVPReader(savedWPM)

  // Save WPM when it changes
  useEffect(() => {
    setSavedWPM(wpm)
  }, [wpm, setSavedWPM])

  // Keyboard shortcuts
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

  // Auto-pause when tab loses focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        togglePlay()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isPlaying, togglePlay])

  const isComplete = words.length > 0 && currentIndex >= words.length - 1 && !isPlaying

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left: Text Input */}
      <div>
        <TextInput onTextSubmit={loadText} />
      </div>

      {/* Right: Reader Display */}
      <div className="flex flex-col gap-6">
        <WordDisplay
          word={currentWord}
          isPlaying={isPlaying}
          isComplete={isComplete}
          onClick={togglePlay}
          onReset={reset}
        />
        <ProgressBar {...progress} />
        <Controls
          isPlaying={isPlaying}
          wpm={wpm}
          onPlayPause={togglePlay}
          onRewind={() => rewind(10)}
          onFastForward={() => fastForward(10)}
          onReset={reset}
          onWPMChange={updateWPM}
        />
      </div>
    </div>
  )
}
