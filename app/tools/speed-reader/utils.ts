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
export function formatWord(word: string): { before: string; orp: string; after: string } {
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

/**
 * Format time remaining in human-readable format
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}m ${secs}s`
}
