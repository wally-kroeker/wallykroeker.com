'use client'

import { useRef, useState } from 'react'

interface LoopAudioPlayerProps {
  slug: string
  title: string
  substackAudioUrl?: string  // Substack podcast MP3, used if no local Kokoro file
}

export default function LoopAudioPlayer({ slug, title, substackAudioUrl }: LoopAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  // Prefer local Kokoro audio; fall back to Substack's own podcast audio
  const audioSrc = `/audio/loop/${slug}.mp3`

  const handlePlay = () => {
    audioRef.current?.play()
    setIsPlaying(true)
  }

  const handlePause = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const handleError = () => {
    // Local Kokoro file missing — swap src to Substack audio if available
    if (substackAudioUrl && audioRef.current && audioRef.current.src !== substackAudioUrl) {
      audioRef.current.src = substackAudioUrl
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 flex items-center gap-4">
      <span className="text-zinc-400 text-sm font-medium shrink-0">Listen</span>

      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
        onError={handleError}
        preload="none"
      />

      {/* Play / Pause toggle */}
      {!isPlaying ? (
        <button
          onClick={handlePlay}
          title="Play"
          className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-zinc-100 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      ) : (
        <button
          onClick={handlePause}
          title="Pause"
          className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-zinc-100" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>
      )}

      {/* Stop */}
      <button
        onClick={handleStop}
        title="Stop"
        className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5 text-zinc-100" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6h12v12H6z" />
        </svg>
      </button>

      <span className="text-zinc-600 text-xs hidden sm:block truncate">{title}</span>
    </div>
  )
}
