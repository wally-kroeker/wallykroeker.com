'use client'

import { useRouter } from 'next/navigation'

const FILTERS = [
  { label: 'All Projects', value: null },
  { label: 'Infrastructure', value: 'Infrastructure' },
  { label: 'AI & Automation', value: 'AI & Automation' },
  { label: 'Community', value: 'Community' },
  { label: 'Completed', value: 'Completed' },
] as const

export function FilterBar({ activeCategory }: { activeCategory: string | null }) {
  const router = useRouter()

  const push = (value: string | null) => {
    router.push(value ? `/projects?category=${encodeURIComponent(value)}` : '/projects')
  }

  return (
    <div className="flex flex-wrap gap-3">
      {FILTERS.map(({ label, value }) => {
        const isActive = activeCategory === value
        return (
          <button
            key={label}
            onClick={() => push(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
