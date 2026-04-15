'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface LoopAudioPlayerProps {
  slug: string
  title: string
  substackAudioUrl?: string
}

const SPEEDS = [1, 1.5, 2] as const

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function LoopAudioPlayer({ slug, title, substackAudioUrl }: LoopAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const scrubberRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1)
  const [hasError, setHasError] = useState(false)

  const audioSrc = `/audio/loop/${slug}.mp3`

  // Sync time updates from audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  const handleSpeed = (s: (typeof SPEEDS)[number]) => {
    setSpeed(s)
    if (audioRef.current) {
      audioRef.current.playbackRate = s
    }
  }

  const handleScrub = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    const bar = scrubberRef.current
    if (!audio || !bar || !duration) return
    const rect = bar.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = pct * duration
  }, [duration])

  const handleError = () => {
    // Local Kokoro file missing — swap to Substack audio
    if (substackAudioUrl && audioRef.current && !audioRef.current.src.includes('substack.com')) {
      audioRef.current.src = substackAudioUrl
      setHasError(false)
    } else {
      setHasError(true)
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (hasError) return null

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
      <audio
        ref={audioRef}
        src={audioSrc}
        onError={handleError}
        preload="metadata"
      />

      {/* Top row: play button, scrubber, time */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
          className="w-11 h-11 shrink-0 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
        >
          {!isPlaying ? (
            <svg className="w-5 h-5 text-zinc-100 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-zinc-100" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </button>

        {/* Scrubber */}
        <div
          ref={scrubberRef}
          onClick={handleScrub}
          className="flex-1 h-2 bg-zinc-800 rounded-full cursor-pointer relative group"
        >
          <div
            className="absolute inset-y-0 left-0 bg-zinc-500 group-hover:bg-zinc-400 rounded-full transition-colors"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Time */}
        <span className="text-xs text-zinc-500 tabular-nums shrink-0 w-[85px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Bottom row: speed controls + title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => handleSpeed(s)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                speed === s
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
        <span className="text-zinc-600 text-xs truncate ml-3">{title}</span>
      </div>
    </div>
  )
}
