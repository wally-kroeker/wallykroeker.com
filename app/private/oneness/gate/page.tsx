'use client'

import { Suspense, useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function GateForm() {
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/private/oneness'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/manifesto-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      })

      if (res.ok) {
        router.replace(next)
      } else {
        setError("That passphrase doesn't match. Try again.")
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        value={passphrase}
        onChange={e => setPassphrase(e.target.value)}
        placeholder="Passphrase"
        autoComplete="off"
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 text-sm"
        disabled={loading}
      />
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !passphrase}
        className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-200 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
      >
        {loading ? 'Checking…' : 'Continue'}
      </button>
    </form>
  )
}

export default function ManifestoGatePage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-zinc-600 text-sm tracking-widest uppercase mb-3">Private</p>
          <h1 className="text-2xl font-semibold text-zinc-200">Enter passphrase</h1>
        </div>
        <Suspense fallback={null}>
          <GateForm />
        </Suspense>
      </div>
    </div>
  )
}
