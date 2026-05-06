import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'The FabLab — my home infrastructure, in production',
  description:
    'A two-host Proxmox cluster running 30+ self-hosted services from a closet in Manitoba. SSO, SIEM, secrets, backups, AI. It just runs.',
  alternates: { canonical: 'https://wallykroeker.com/fablab' },
  openGraph: {
    title: 'The FabLab — my home infrastructure, in production',
    description:
      '30+ self-hosted services. Two Proxmox hypervisors. Production-grade SSO, SIEM, secrets, backups. From a closet in Manitoba.',
    url: 'https://wallykroeker.com/fablab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The FabLab — my home infrastructure, in production',
    description:
      '30+ self-hosted services. Two Proxmox hypervisors. SSO, SIEM, secrets, backups. From a closet in Manitoba.',
  },
}

const STATS: Array<{ n: string; label: string }> = [
  { n: '30+', label: 'Self-hosted services' },
  { n: '2', label: 'Proxmox hypervisors' },
  { n: '2', label: 'Segmented VLANs' },
  { n: '17', label: 'Endpoints reporting to SIEM' },
  { n: '3', label: 'Tier backup' },
  { n: '1', label: 'Closet' },
]

const CAPABILITIES: Array<{ title: string; body: string; includes: string }> = [
  {
    title: 'Personal AI Infrastructure',
    body: 'The lab runs a multi-agent AI system I use daily. Specialized assistants for infrastructure, design, research, security, and writing — each with their own context, memory, and tools. Backed by a self-hosted LLM gateway, a TTS engine for narration, and a notification fabric for human-in-the-loop approvals.',
    includes: 'LLM gateway, voice synthesis, agent orchestration, capture pipeline.',
  },
  {
    title: 'Workflow & Productivity',
    body: 'Automation, task management, personal finance, knowledge base. The boring middle layer of a life, owned and operated.',
    includes: 'n8n, Vikunja, Firefly III, Seafile.',
  },
  {
    title: 'Media & Family',
    body: 'Streaming server, photo library, offline knowledge archive (Wikipedia, Stack Overflow, medical and survival references — for when the internet isn’t there).',
    includes: 'Jellyfin, Immich, Kiwix.',
  },
  {
    title: 'Identity & Security',
    body: 'Single sign-on across the lab. SIEM watching every host. Centralized secrets vault. Defense-in-depth that wouldn’t embarrass a small enterprise.',
    includes: 'Authentik (OIDC), Wazuh (XDR), Infisical (vault), Cloudflare Access.',
  },
]

const PILLARS: Array<{ title: string; body: string }> = [
  {
    title: 'Network',
    body: 'Two VLANs — production and management — segmented at the firewall, with explicit allow rules between tiers. OPNsense handles routing, DNS (Unbound), DHCP, and a WireGuard tunnel that selectively routes specific containers through a commercial VPN while leaving everything else on the home connection. Split-DNS means the same hostnames work locally and remotely; no tunnel-DNS fuckery.',
  },
  {
    title: 'Identity & Access',
    body: 'Authentik as the OIDC provider. Single sign-on into the hypervisors, the VDI gateway, and the workspace platform. Tailscale subnet router for remote access — no port forwarding to the internet, ever. Cloudflare Access in front of anything that does need to be public.',
  },
  {
    title: 'Observability',
    body: 'Wazuh manager with agents on every host, container, and the firewall itself. File integrity monitoring, log correlation, vulnerability detection. Uptime monitoring with push alerts to a self-hosted notification server. Real metrics, real alerts, real on-call (of one).',
  },
  {
    title: 'Backups',
    body: '3-tier backup strategy: daily VM/container snapshots to the primary NAS, weekly snapshots to an off-host NAS in a different room, encrypted file-level backups via restic. Tested. Annoying to set up once. Boring forever after.',
  },
  {
    title: 'Deployment',
    body: 'Every service has a runbook. Most have a docker-compose file in git. Secrets injected at deploy time from the vault, never written into compose files. New services follow a documented pattern: allocate IP, clone container template, push compose, register DNS, done.',
  },
]

const UPDATED = '2026-05-06'

export default function FabLabPage() {
  return (
    <div className="fablab-page">
      <article className="fl-article">
        <header className="fl-hero">
          <div className="fl-eyebrow">
            <span className="fl-status-dot" aria-hidden="true" />
            <span>Production</span>
          </div>
          <h1>The FabLab.</h1>
          <p className="fl-subhead">
            A two-host Proxmox cluster running <strong>30+ self-hosted services</strong> for my AI,
            my finances, my media, my workflows, my family. From a closet in Manitoba. With
            production-grade SSO, SIEM, secrets management, and backups.
          </p>
          <p className="fl-supporting">
            Most &ldquo;home labs&rdquo; run a Plex box and call it a day. The FabLab is what happened when I
            decided to actually own my stack &mdash; identity, monitoring, secrets, backups, the AI
            assistant that runs my work &mdash; instead of paying twelve different SaaS companies to
            know me. It&rsquo;s not impressive because it&rsquo;s big. It&rsquo;s impressive because it&rsquo;s{' '}
            <em>boring on purpose.</em> It just runs.
          </p>
        </header>

        <section className="fl-stats" aria-label="By the numbers">
          <ul>
            {STATS.map((s) => (
              <li key={s.label}>
                <span className="fl-stat-n">{s.n}</span>
                <span className="fl-stat-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="fl-section">
          <h2>What it runs</h2>
          <div className="fl-cards">
            {CAPABILITIES.map((c) => (
              <article className="fl-card" key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <p className="fl-card-includes">
                  <span>Includes:</span> {c.includes}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="fl-section">
          <h2>How it&rsquo;s built</h2>
          <div className="fl-pillars">
            {PILLARS.map((p) => (
              <div className="fl-pillar" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="fl-section fl-why">
          <h2>Why</h2>
          <p>
            I built this because I got tired of renting my own life from twelve companies that
            change their pricing every quarter, harvest my data, and decide my &ldquo;personal&rdquo;
            data is theirs to train on. I wanted to know exactly what my stack was doing, and I
            wanted to be the one who fixed it when it broke.
          </p>
          <p>
            It&rsquo;s also a hell of a teacher. There&rsquo;s no learning curve like running production
            infrastructure that your wife will notice if it&rsquo;s down. Every service in the lab
            taught me something I now know cold &mdash; TLS, DNS, identity, observability, backup,
            network segmentation, container orchestration. The lab is the curriculum.
          </p>
          <p>
            If you&rsquo;re an engineer thinking about building something like this, I&rsquo;m happy to
            compare notes. The build log is over <Link href="/projects/fablab">here</Link> and
            I&rsquo;m reachable through the <Link href="/about">contact page</Link>. If you&rsquo;re a
            hiring manager wondering whether I can run your stack &mdash; yeah, I can run your
            stack.
          </p>
        </section>

        <footer className="fl-footer">
          <nav className="fl-crosslinks" aria-label="Cross-links">
            <Link href="/projects/fablab">Build log index &rarr;</Link>
            <Link href="/build-log">All build logs &rarr;</Link>
            <Link href="/projects/bob-and-friends">Bob &amp; friends (the AI side) &rarr;</Link>
          </nav>
          <p className="fl-updated">Last updated {UPDATED}.</p>
        </footer>
      </article>
    </div>
  )
}
