import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Colophon',
  description: 'How this site is built. Next.js, Tailwind, Markdown, Cloudflare Tunnel.',
  alternates: { canonical: 'https://wallykroeker.com/colophon' },
}

export default function Colophon() {
  return (
    <div className="p-8 text-zinc-300">
      Built with Next.js + Tailwind. Content in Markdown. Deployed from an LXC via Cloudflare Tunnel.
    </div>
  )
}
