'use client'

import { useState, useEffect, useCallback } from 'react'
import Container from '@/components/Container'
import figlet from 'figlet'
// @ts-expect-error — figlet font modules have no type declarations
import Standard from 'figlet/importable-fonts/Standard'
// @ts-expect-error — figlet font modules have no type declarations
import Doom from 'figlet/importable-fonts/Doom'
// @ts-expect-error — figlet font modules have no type declarations
import Big from 'figlet/importable-fonts/Big'
// @ts-expect-error — figlet font modules have no type declarations
import Slant from 'figlet/importable-fonts/Slant'
// @ts-expect-error — figlet font modules have no type declarations
import Banner3 from 'figlet/importable-fonts/Banner3'
// @ts-expect-error — figlet font modules have no type declarations
import Ghost from 'figlet/importable-fonts/Ghost'
// @ts-expect-error — figlet font modules have no type declarations
import Graffiti from 'figlet/importable-fonts/Graffiti'
// @ts-expect-error — figlet font modules have no type declarations
import Isometric1 from 'figlet/importable-fonts/Isometric1'

const FONTS: Record<string, string> = {
  Standard,
  Doom,
  Big,
  Slant,
  Banner3,
  Ghost,
  Graffiti,
  Isometric1,
}

interface GalleryItem {
  id: string
  prompt: string
  font: string
  art: string
  timestamp: number
}

const STORAGE_KEY = 'ascii-art-gallery'
const MAX_GALLERY_ITEMS = 50

function loadGallery(): GalleryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveGallery(items: GalleryItem[]) {
  const capped = items.slice(0, MAX_GALLERY_ITEMS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped))
  } catch {
    // localStorage full or unavailable
  }
  return capped
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ASCII_CHARS = ' .:-=+*#%@'
const MAX_ASCII_WIDTH = 120

function imageToAscii(img: HTMLImageElement, maxWidth: number = MAX_ASCII_WIDTH): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const aspect = img.height / img.width
  // Characters are ~2x taller than wide, so halve the height ratio
  const width = Math.min(maxWidth, img.width)
  const height = Math.floor(width * aspect * 0.5)

  canvas.width = width
  canvas.height = height
  ctx.drawImage(img, 0, 0, width, height)

  const imageData = ctx.getImageData(0, 0, width, height)
  const pixels = imageData.data
  let ascii = ''

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const brightness = (pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114) / 255
      const charIndex = Math.floor(brightness * (ASCII_CHARS.length - 1))
      ascii += ASCII_CHARS[charIndex]
    }
    ascii += '\n'
  }

  return ascii
}

type Mode = 'text' | 'image'

export default function AsciiPage() {
  const [mode, setMode] = useState<Mode>('text')
  const [prompt, setPrompt] = useState('')
  const [font, setFont] = useState('Standard')
  const [output, setOutput] = useState('')
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [copied, setCopied] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [converting, setConverting] = useState(false)
  const [imageWidth, setImageWidth] = useState(MAX_ASCII_WIDTH)

  useEffect(() => {
    for (const [key, data] of Object.entries(FONTS)) {
      figlet.parseFont(key, data)
    }
    setFontsLoaded(true)
  }, [])

  useEffect(() => {
    setGallery(loadGallery())
  }, [])

  const generate = useCallback(() => {
    if (!prompt.trim() || !fontsLoaded) return

    figlet.text(prompt.trim(), { font: font as figlet.Fonts }, (err, result) => {
      if (err || !result) return
      setOutput(result)

      const item: GalleryItem = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        prompt: prompt.trim(),
        font,
        art: result,
        timestamp: Date.now(),
      }
      setGallery(prev => saveGallery([item, ...prev]))
    })
  }, [prompt, font, fontsLoaded])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      generate()
    }
  }

  const copyToClipboard = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable
    }
  }

  const handleImageUpload = useCallback((file: File) => {
    setConverting(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const art = imageToAscii(img, imageWidth)
        setOutput(art)
        const item: GalleryItem = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          prompt: file.name,
          font: `Image (${imageWidth}w)`,
          art,
          timestamp: Date.now(),
        }
        setGallery(prev => saveGallery([item, ...prev]))
        setConverting(false)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [imageWidth])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleImageUpload(file)
  }, [handleImageUpload])

  const deleteItem = (id: string) => {
    setGallery(prev => saveGallery(prev.filter(item => item.id !== id)))
  }

  return (
    <Container className="py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">ASCII Art Generator</h1>
        <p className="text-zinc-400">Generate ASCII art from text or images.</p>
      </div>

      {/* Mode Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-zinc-900 p-1 w-fit">
        <button
          onClick={() => setMode('text')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === 'text' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Text
        </button>
        <button
          onClick={() => setMode('image')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === 'image' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Image
        </button>
      </div>

      {/* Text Mode Controls */}
      {mode === 'text' && (
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter text..."
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
          />
          <select
            value={font}
            onChange={e => setFont(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
          >
            {Object.keys(FONTS).map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <button
            onClick={generate}
            disabled={!prompt.trim() || !fontsLoaded}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate
          </button>
        </div>
      )}

      {/* Image Mode Controls */}
      {mode === 'image' && (
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm text-zinc-400">Width:</label>
            <input
              type="range"
              min={40}
              max={200}
              value={imageWidth}
              onChange={e => setImageWidth(Number(e.target.value))}
              className="flex-1 accent-blue-600"
            />
            <span className="text-sm text-zinc-400 w-16 text-right">{imageWidth} cols</span>
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="rounded-lg border-2 border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 p-12 text-center transition-colors cursor-pointer"
            onClick={() => document.getElementById('ascii-image-input')?.click()}
          >
            <input
              id="ascii-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
            />
            {converting ? (
              <p className="text-zinc-400 text-sm">Converting...</p>
            ) : (
              <>
                <p className="text-zinc-300 text-sm font-medium mb-1">Drop an image here or click to upload</p>
                <p className="text-zinc-500 text-xs">PNG, JPG, GIF, WebP</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mb-12 relative group">
          <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-6 overflow-x-auto">
            <pre className="text-green-400 text-xs sm:text-sm leading-tight font-mono whitespace-pre">
              {output}
            </pre>
          </div>
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-700"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}

      {/* Gallery */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-6 border-b border-zinc-800 pb-3">
          Gallery
          {gallery.length > 0 && (
            <span className="ml-2 text-sm font-normal text-zinc-500">({gallery.length})</span>
          )}
        </h2>

        {gallery.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 border-dashed p-12 text-center">
            <p className="text-zinc-500 text-sm">No ASCII art yet. Generate something above to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {gallery.map(item => (
              <div key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-zinc-100 font-medium">&ldquo;{item.prompt}&rdquo;</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-500">{item.font}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-500">{formatTime(item.timestamp)}</span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors text-sm px-2 py-1"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-green-400/80 text-xs leading-tight font-mono whitespace-pre">
                    {item.art}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
