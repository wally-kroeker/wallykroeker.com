import { Play, Pause, Rewind, FastForward, RotateCcw } from 'lucide-react'

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
  isPlaying,
  wpm,
  onPlayPause,
  onRewind,
  onFastForward,
  onReset,
  onWPMChange
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
