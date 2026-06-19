'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

const GOOD_BOY_PHRASES = [
  'WOOF WOOF WOOF',
  'Yes, VERY good boy!!',
  '*tail spinning like a helicopter*',
  'THE BESTEST BOY',
  'ZOOMIES ACTIVATED 🏃💨',
  '*knocks over everything with tail*',
  'WHO IS A GOOD BOY? JAX IS.',
  'bork bork bork bork',
  '🐾 stamp of approval 🐾',
  '*brings you his favourite toy*',
]

const PAW_PRINTS = ['🐾', '🦴', '🐕', '🐶', '🎾', '💛', '🐾', '🦴']

export default function JaxPage() {
  const [pets, setPets] = useState(0)
  const [phrase, setPhrase] = useState('')
  const [paws, setPaws] = useState<{ id: number; x: number; y: number; icon: string }[]>([])
  const [nextId, setNextId] = useState(0)

  function handlePet() {
    const newPets = pets + 1
    setPets(newPets)
    setPhrase(GOOD_BOY_PHRASES[newPets % GOOD_BOY_PHRASES.length])
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const icon = PAW_PRINTS[Math.floor(Math.random() * PAW_PRINTS.length)]
    const id = nextId
    setNextId(id + 1)
    setPaws(prev => [...prev, { id, x, y, icon }])
    setTimeout(() => setPaws(prev => prev.filter(p => p.id !== id)), 1200)
  }

  const excitementLevel = Math.min(pets, 10)
  const tailWag = pets > 0 ? `animate-bounce` : ''

  return (
    <div
      className="min-h-screen bg-zinc-950 relative overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* Floating paw clicks */}
      {paws.map(p => (
        <span
          key={p.id}
          className="absolute pointer-events-none text-3xl animate-ping"
          style={{ left: p.x - 16, top: p.y - 16, animationDuration: '0.8s' }}
        >
          {p.icon}
        </span>
      ))}

      <div className="max-w-2xl mx-auto px-6 py-20 text-center">

        {/* Header paw trail */}
        <div className="text-3xl mb-6 tracking-widest opacity-50">
          🐾 🐾 🐾 🐾 🐾
        </div>

        {/* Big dog face */}
        <div className={`text-[120px] leading-none mb-4 ${tailWag} inline-block`}>
          🐕
        </div>

        {/* Main statement */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
          Jax is a{' '}
          <span className="text-yellow-400">Good Dog.</span>
        </h1>

        <p className="text-zinc-400 text-xl mb-2">
          This is a verified fact. Science agrees. No further questions.
        </p>

        <div className="flex justify-center gap-2 text-2xl my-6">
          {Array.from({ length: Math.min(excitementLevel, 10) }).map((_, i) => (
            <span key={i}>🦴</span>
          ))}
        </div>

        {/* Pet button */}
        <button
          onClick={(e) => { e.stopPropagation(); handlePet() }}
          className="mt-4 px-10 py-5 bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-black text-2xl rounded-2xl transition-all duration-150 active:scale-95 shadow-lg hover:shadow-yellow-400/30 hover:shadow-2xl"
        >
          🖐️ Pet Jax {pets > 0 && `(×${pets})`}
        </button>

        {/* Reaction phrase */}
        {phrase && (
          <div className="mt-6 text-yellow-300 text-2xl font-bold animate-pulse">
            {phrase}
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-3xl mb-1">🌟</div>
            <div className="text-white font-bold text-lg">10/10</div>
            <div className="text-zinc-500 text-sm">Good Boy Score</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-3xl mb-1">🎾</div>
            <div className="text-white font-bold text-lg">∞</div>
            <div className="text-zinc-500 text-sm">Zoomies Available</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-3xl mb-1">💛</div>
            <div className="text-white font-bold text-lg">Very</div>
            <div className="text-zinc-500 text-sm">Good Boy</div>
          </div>
        </div>

        {/* Footer facts */}
        <div className="mt-12 space-y-2 text-zinc-500 text-sm">
          <p>🐾 Click anywhere to leave paw prints</p>
          <p>🦴 Pet Jax to unlock reactions</p>
          <p>🐕 Jax does not endorse this website but would knock it over with his tail</p>
        </div>

        <div className="text-3xl mt-12 tracking-widest opacity-30">
          🐾 🐾 🐾 🐾 🐾
        </div>
      </div>
    </div>
  )
}
