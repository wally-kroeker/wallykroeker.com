import Container from '@/components/Container'
import EnhancedProjectCard from '@/components/EnhancedProjectCard'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'

export const metadata = {
  title: 'Projects - Wally Kroeker',
  description: 'Building in public. Transparent build logs, reusable patterns, and real infrastructure lessons.',
}

function FilterButton({ children, active = false }: { children: React.ReactNode, active?: boolean }) {
  return (
    <button className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${active
        ? 'bg-zinc-100 text-zinc-900 font-semibold'
        : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
      }`}>
      {children}
    </button>
  )
}

function SimpleProjectCard({
  slug,
  title,
  description,
  status
}: {
  slug: string
  title: string
  description: string
  status: "Active" | "Paused" | "Completed"
}) {
  return (
    <Link href={`/projects/${slug}`} className="block p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 hover:border-zinc-700 transition group">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition">{title}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </Link>
  )
}

export default function ProjectsPage() {
  return (
    <Container className="py-16">
      {/* Header */}
      <div className="mb-12 border-b border-zinc-800 pb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">Projects</h1>
        <p className="text-xl text-zinc-300 max-w-3xl leading-relaxed">
          Building in public. Transparent build logs, reusable patterns, and
          real infrastructure lessons. All open-source or documented openly.
        </p>
      </div>

      {/* Filter/Search (Visual only) */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3">
          <FilterButton active>All Projects</FilterButton>
          <FilterButton>Infrastructure</FilterButton>
          <FilterButton>AI & Automation</FilterButton>
          <FilterButton>Security</FilterButton>
          <FilterButton>Completed</FilterButton>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white">Active Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <EnhancedProjectCard
            slug="fablab"
            title="FabLab Infrastructure"
            description="Enterprise-grade home lab demonstrating Proxmox clustering, Authentik IdP, Cloudflare tunnels, and self-hosted services at scale"
            status="Active"
            stage="Phase 3 Complete"
            tech={["Proxmox", "Docker", "Authentik", "Cloudflare", "OPNsense"]}
            lastUpdated="Dec 7, 2025"
            milestoneCount={12}
          // image="/images/projects/fablab-hero.png" // omit until available
          />

          <EnhancedProjectCard
            slug="bob-and-friends"
            title="Bob & Personal AI Infrastructure (PAI)"
            description="ADHD-optimized AI assistant system built on Claude Code with custom skills, hooks, publishing workflows, and memory systems"
            status="Active"
            stage="Daily Use"
            tech={["Claude Code", "TypeScript", "N8N", "Git", "MCP"]}
            lastUpdated="Dec 13, 2025"
            milestoneCount={8}
          // image="/images/projects/bob-hero.png" // omit until available
          />
        </div>
      </div>

      {/* Other Projects */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">Other Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <SimpleProjectCard
            slug="taskman"
            title="TaskMan (Vikunja Fork)"
            description="Enhanced task management with AI breakdown, Linear-style shortcuts, and workflow automation"
            status="Paused"
          />

          <SimpleProjectCard
            slug="wallykroeker-com"
            title="wallykroeker.com"
            description="This site - Next.js 14, dark-first design, privacy-conscious, git-first publishing"
            status="Active"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center p-12 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-2xl font-bold mb-4 text-white">
          Want to Learn How I Built This?
        </h3>
        <p className="text-zinc-300 mb-8 max-w-2xl mx-auto text-lg">
          Join the Greybeard AI Collective for deep-dives, build logs, and
          practitioner discussions on infrastructure, security, and AI.
        </p>
        <a href="/community" className="px-6 py-3 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors">
          Join the Community
        </a>
      </div>
    </Container>
  );
}
