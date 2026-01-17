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
