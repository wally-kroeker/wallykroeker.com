'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import Container from '@/components/Container'

export default function Easter2026Page() {
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch('/api/easter2026/photos')
      const data = await res.json()
      setPhotos(data.photos || [])
    } catch {
      // silently fail — gallery just stays empty
    }
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current)
    }
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('photo', file)

    try {
      const res = await fetch('/api/easter2026/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed')
      } else {
        setSuccess('Photo uploaded!')
        setPhotos(prev => [data.filename, ...prev])
        if (successTimerRef.current) clearTimeout(successTimerRef.current)
        successTimerRef.current = setTimeout(() => setSuccess(''), 3000)
      }
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Container className="py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-5xl mb-4">🐣</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Easter 2026
        </h1>
        <p className="text-xl text-zinc-400">
          Family Gathering
        </p>
      </div>

      {/* Event Details */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 mb-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-4">Details</h2>
        <div className="space-y-3 text-zinc-300">
          <div className="flex items-start gap-3">
            <span className="text-zinc-500 shrink-0">Date</span>
            <span>Sunday, April 5, 2026</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-zinc-500 shrink-0">Time</span>
            <span>TBD</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-zinc-500 shrink-0">Location</span>
            <span>TBD</span>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">
          Share Your Photos
        </h2>
        <p className="text-zinc-400 text-center mb-6">
          Upload photos from the gathering — JPG, PNG, or WebP up to 10MB
        </p>

        <div className="flex justify-center">
          <label className="w-full sm:w-auto cursor-pointer">
            <div className={`
              flex items-center justify-center gap-2
              w-full sm:w-auto px-8 py-4
              bg-white text-zinc-950 font-semibold
              rounded-xl text-lg
              hover:bg-zinc-200 transition-colors
              ${uploading ? 'opacity-50 pointer-events-none' : ''}
            `}>
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Upload Photo
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {error && (
          <p className="text-red-400 text-center mt-4">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-center mt-4">{success}</p>
        )}
      </div>

      {/* Photo Gallery */}
      <div>
        {photos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg">No photos yet — be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div key={photo} className="aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                <img
                  src={`/api/easter2026/image?f=${encodeURIComponent(photo)}`}
                  alt="Easter 2026 family photo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
