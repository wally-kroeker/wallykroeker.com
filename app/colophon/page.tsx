import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Colophon',
  description: 'How this site is built. Next.js, Tailwind, Markdown, Cloudflare Tunnel.',
  alternates: { canonical: 'https://wallykroeker.com/colophon' },
}

export default function Colophon() {
  return (
    <div className="p-8 text-zinc-300 max-w-2xl space-y-6">
      <p>Built with Next.js + Tailwind. Content in Markdown. Deployed from an LXC via Cloudflare Tunnel.</p>

      <div>
        <h2 className="text-lg font-semibold mb-2">AI Disclosure</h2>
        <p className="text-zinc-400 text-sm">
          Posts and build logs on this site carry an{' '}
          <a
            href="https://danielmiessler.com/blog/ai-influence-level-ail"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 underline hover:text-white"
          >
            AI Influence Level (AIL)
          </a>{' '}
          label when present. The framework is Daniel Miessler&rsquo;s. Six levels, AIL 0 through AIL 5,
          ranging from no AI involvement to AI-created with little human input. The label tells you how
          the piece was made, not whether it&rsquo;s worth reading.
        </p>
      </div>
    </div>
  )
}
