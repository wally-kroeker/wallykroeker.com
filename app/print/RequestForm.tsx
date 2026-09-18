'use client'

import { useState } from 'react'
import Link from 'next/link'

const NEEDS = [
  { value: 'part', label: 'Fix a part', hint: 'broken or discontinued' },
  { value: 'design', label: 'Design or 3D print', hint: 'from an idea or sketch' },
  { value: 'custom', label: 'Custom name or gift', hint: 'keychains, toys' },
  { value: 'tech', label: 'Tech problem', hint: 'computer, Wi-Fi, scams' },
  { value: 'other', label: 'Something else', hint: 'just ask' },
]

const PLACEHOLDERS: Record<string, string> = {
  part: 'What broke? What is it from (make and model if you know)?',
  design: 'What are you picturing? Rough size, what it needs to do.',
  custom: 'What would you like? Colours, size, who it is for.',
  tech: 'What is going on? A computer or Wi-Fi acting up, a strange message, or an idea for a sensor or alarm.',
  other: 'Tell me what is going on.',
}

const MAX_PHOTOS = 3

// Phone photos are often 5-10MB. Shrink them in the browser before sending so the
// upload works on one bar of rural LTE. Re-encoding also drops the location data a
// phone camera writes into the file. If the browser can't read the format (HEIC on
// some Androids), the original goes up unchanged.
async function shrinkPhoto(file: File): Promise<Blob> {
  if (file.size < 1.5 * 1024 * 1024) return file
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = reject
      i.src = url
    })
    const scale = Math.min(1, 2000 / Math.max(img.naturalWidth, img.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    return blob && blob.size < file.size ? blob : file
  } catch {
    return file
  } finally {
    URL.revokeObjectURL(url)
  }
}

export default function RequestForm() {
  const [need, setNeed] = useState('part')
  const [photos, setPhotos] = useState<File[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  function addPhotos(list: FileList | null) {
    if (!list) return
    const next = [...photos, ...Array.from(list)].slice(0, MAX_PHOTOS)
    setPhotos(next)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const data = new FormData(form)
    data.delete('photos')

    if (!String(data.get('phone') || '').trim() && !String(data.get('email') || '').trim()) {
      setError('Please add a phone number or an email so I can reply.')
      return
    }

    setStatus('sending')
    try {
      for (let i = 0; i < photos.length; i++) {
        const blob = await shrinkPhoto(photos[i])
        const name = blob === photos[i] ? photos[i].name : `photo-${i + 1}.jpg`
        data.append('photos', blob, name)
      }
      const res = await fetch('/api/print-request', { method: 'POST', body: data })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || 'That did not go through. Please text 204-799-8082 instead.')
        setStatus('idle')
        return
      }
      setStatus('done')
      form.reset()
      setPhotos([])
      document.getElementById('request')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch {
      setError('No connection, it looks like. Please try again, or text 204-799-8082.')
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-center" role="status">
        <p className="text-2xl font-semibold text-white">Got it. Thank you!</p>
        <p className="mt-3 text-lg text-zinc-200">
          I&rsquo;ll text or email you back, usually within a day or two.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-amber-400 underline underline-offset-4"
        >
          Send another request
        </button>
      </div>
    )
  }

  const field =
    'mt-1.5 block w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-lg text-white placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40'
  const label = 'block text-base font-medium text-zinc-200'

  return (
    <form onSubmit={onSubmit} onChange={() => error && setError('')} className="space-y-6">
      <fieldset>
        <legend className={label}>What do you need?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {NEEDS.map((n) => (
            <label
              key={n.value}
              className={`cursor-pointer rounded-xl border px-3 py-3 transition-colors ${
                need === n.value
                  ? 'border-amber-500 bg-amber-500/15 text-white'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300'
              }`}
            >
              <input
                type="radio"
                name="need"
                value={n.value}
                checked={need === n.value}
                onChange={() => setNeed(n.value)}
                className="sr-only"
              />
              <span className="block font-semibold">{n.label}</span>
              <span className="block text-sm text-zinc-400">{n.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="pr-description" className={label}>
          Tell me about it
        </label>
        <textarea
          id="pr-description"
          name="description"
          rows={4}
          maxLength={4000}
          className={field}
          placeholder={PLACEHOLDERS[need]}
        />
      </div>

      {need === 'custom' && (
        <div>
          <label htmlFor="pr-printname" className={label}>
            Name or words to print <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <input id="pr-printname" name="printName" type="text" maxLength={80} className={field} placeholder="e.g. EMMA" />
        </div>
      )}

      <div>
        <span className={label}>
          Photos <span className="font-normal text-zinc-400">(optional, up to {MAX_PHOTOS})</span>
        </span>
        <p className="mt-1 text-sm text-zinc-400">
          For a broken part, a photo with a ruler or a coin beside it helps a lot. For a tech problem or a
          strange message, a screenshot works.
        </p>
        {photos.length > 0 && (
          <ul className="mt-3 space-y-2">
            {photos.map((p, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
                <span className="truncate pr-3">{p.name || `Photo ${i + 1}`}</span>
                <button
                  type="button"
                  onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="shrink-0 text-amber-400 underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        {photos.length < MAX_PHOTOS && (
          <label className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-600 px-4 py-4 text-base text-zinc-200 hover:border-amber-500">
            <input
              type="file"
              name="photos"
              accept="image/*,.heic,.heif"
              multiple
              className="sr-only"
              onChange={(e) => {
                addPhotos(e.target.files)
                e.target.value = ''
              }}
            />
            {photos.length ? 'Add another photo' : 'Add a photo'}
          </label>
        )}
      </div>

      <div>
        <label htmlFor="pr-name" className={label}>
          Your name
        </label>
        <input id="pr-name" name="name" type="text" required maxLength={100} autoComplete="name" className={field} />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-zinc-400">How should I reach you? Phone or email, either one is fine.</p>
        <div>
          <label htmlFor="pr-phone" className={label}>
            Phone (text is fine)
          </label>
          <input id="pr-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" inputMode="tel" className={field} />
        </div>
        <div>
          <label htmlFor="pr-email" className={label}>
            Email
          </label>
          <input id="pr-email" name="email" type="email" maxLength={200} autoComplete="email" className={field} />
        </div>
      </div>

      {/* Honeypot: hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="pr-website">Website</label>
        <input id="pr-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-base text-red-200" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-xl bg-amber-500 px-6 py-4 text-lg font-semibold text-zinc-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send my request'}
      </button>

      <p className="text-sm text-zinc-400">
        Your details and photos go only to me, and I only use them to answer
        your request. <Link href="/privacy#print-requests" className="underline underline-offset-2">What I keep</Link>.
      </p>
    </form>
  )
}
