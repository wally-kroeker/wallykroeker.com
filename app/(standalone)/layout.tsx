import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PAI Command Center — Built by Agent Swarm',
  description: 'Live demo of PAI multi-agent orchestration: 3 parallel agents, 15 ISC criteria, 7 Algorithm phases.',
}

export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0f', color: '#e2e8f0' }}>
        {children}
      </body>
    </html>
  )
}
