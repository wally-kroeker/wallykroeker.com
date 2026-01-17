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
