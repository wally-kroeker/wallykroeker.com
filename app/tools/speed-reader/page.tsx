import { Metadata } from 'next'
import Reader from './Reader'

export const metadata: Metadata = {
  title: 'Speed Reader - RSVP Tool | Wally Kroeker',
  description: 'Read 2-3x faster with RSVP technology. Free, privacy-focused web-based speed reader with optimal recognition point alignment.',
  keywords: ['speed reading', 'RSVP', 'Spritz alternative', 'fast reading tool', 'online speed reader'],
  openGraph: {
    title: 'Speed Reader - Free RSVP Tool',
    description: 'Read faster with science-backed RSVP technology',
    type: 'website',
  },
}

export default function SpeedReaderPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
            Speed Reader
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl">
            Read faster with RSVP (Rapid Serial Visual Presentation) technology.
            Paste any text below and experience reading at 2-3x your normal speed.
          </p>
        </header>

        {/* Main Reader Component */}
        <Reader />

        {/* Footer Info */}
        <footer className="mt-12 text-sm text-zinc-500 space-y-2">
          <p className="text-center">
            Keyboard shortcuts: <kbd className="px-2 py-1 bg-zinc-800 rounded">Space</kbd> play/pause,
            <kbd className="px-2 py-1 bg-zinc-800 rounded">←</kbd> rewind,
            <kbd className="px-2 py-1 bg-zinc-800 rounded">→</kbd> forward,
            <kbd className="px-2 py-1 bg-zinc-800 rounded">Esc</kbd> reset
          </p>
          <p className="text-center text-xs">
            Privacy-first: All processing happens in your browser. No tracking, no data collection.
          </p>
        </footer>
      </div>
    </main>
  )
}
