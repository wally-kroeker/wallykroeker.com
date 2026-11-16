const AIL_LEVELS: Record<number, string> = {
  0: 'Human Created, No AI Involved',
  1: 'Human Created, Minor AI Assistance',
  2: 'Human Created, Major AI Augmentation',
  3: 'AI Created, Human Full Structure',
  4: 'AI Created, Human Basic Idea',
  5: 'AI Created, Little Human Involvement',
}

interface AilBadgeProps {
  level?: number
}

export default function AilBadge({ level }: AilBadgeProps) {
  if (level === undefined || level === null || !(level in AIL_LEVELS)) return null

  return (
    <a
      href="https://danielmiessler.com/blog/ai-influence-level-ail"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors no-underline"
      title={`AI Influence Level ${level}: ${AIL_LEVELS[level]}`}
    >
      <span className="font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
        AIL {level}
      </span>
      <span>{AIL_LEVELS[level]}</span>
    </a>
  )
}
