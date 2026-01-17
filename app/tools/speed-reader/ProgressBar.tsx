import { formatTimeRemaining } from './utils'
import type { ProgressInfo } from './types'

export function ProgressBar({
  currentWord,
  totalWords,
  percentComplete,
  estimatedTimeRemaining
}: ProgressInfo) {
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
        <span>{currentWord} / {totalWords.toLocaleString()} words</span>
        <span>{formatTimeRemaining(estimatedTimeRemaining)} remaining</span>
      </div>
    </div>
  )
}
