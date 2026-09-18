import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Privacy policy for wallykroeker.com. No third-party trackers. Cookie-free analytics via self-hosted Umami.',
  alternates: { canonical: 'https://wallykroeker.com/privacy' },
}

export default function Privacy() {
  return (
    <div className="p-8 text-zinc-300 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-white">Privacy</h1>
      <p>This site does not use cookies, fingerprinting, or third-party trackers.</p>
      <p>
        Basic visitor analytics are collected via a self-hosted instance of{' '}
        <a href="https://umami.is" className="underline hover:text-white" rel="noopener noreferrer" target="_blank">
          Umami
        </a>
        , an open-source (MIT license), privacy-respecting analytics tool. Umami does not use cookies,
        does not collect personal data, does not fingerprint visitors, and does not track individuals across sites.
        All analytics data is stored on our own infrastructure — no third parties involved.
      </p>
      <p>Minimal server logs are retained for operational purposes only.</p>
      <h2 id="print-requests" className="pt-4 text-lg font-semibold text-white">FabLab requests</h2>
      <p>
        When you send a request from the <a href="/print" className="underline hover:text-white">FabLab page</a>, your
        name, phone or email, description, and any photos are stored privately on my own server. They are never
        published, and I use them only to reply to you and quote your job. I get a notification on my phone when a
        request comes in. Ask me any time and I&rsquo;ll delete yours.
      </p>
    </div>
  )
}
