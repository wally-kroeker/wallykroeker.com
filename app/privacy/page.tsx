import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Privacy policy for wallykroeker.com. No third-party trackers. Cookie-free analytics via GoatCounter.',
  alternates: { canonical: 'https://wallykroeker.com/privacy' },
}

export default function Privacy() {
  return (
    <div className="p-8 text-zinc-300 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-white">Privacy</h1>
      <p>This site does not use cookies, fingerprinting, or third-party trackers.</p>
      <p>
        Basic visitor analytics are collected via{' '}
        <a href="https://www.goatcounter.com" className="underline hover:text-white" rel="noopener noreferrer" target="_blank">
          GoatCounter
        </a>
        , an open-source, privacy-respecting analytics tool. GoatCounter does not use cookies,
        does not collect personal data, and does not track individuals across sites.
      </p>
      <p>Minimal server logs are retained for operational purposes only.</p>
    </div>
  )
}
