import Container from '@/components/Container'
import EnhancedProjectCard from '@/components/EnhancedProjectCard'
import { FilterBar } from '@/components/FilterBar'
import { StatusBadge } from '@/components/StatusBadge'
import { getAllProjects } from '@/lib/getAllProjects'
import Link from 'next/link'

export const metadata = {
  title: 'Projects - Wally Kroeker',
  description: 'Building in public. Transparent build logs, reusable patterns, and real infrastructure lessons.',
}

function SimpleProjectCard({
  slug,
  title,
  description,
  status,
}: {
  slug: string
  title: string
  description: string
  status: 'Active' | 'Paused' | 'Completed'
}) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="block p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 hover:border-zinc-700 transition group"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition">{title}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </Link>
  )
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const allProjects = getAllProjects()
  const activeCategory = searchParams?.category ?? null

  const filtered = activeCategory === 'Completed'
    ? allProjects.filter((p) => p.status === 'Completed')
    : activeCategory
    ? allProjects.filter((p) => p.category === activeCategory)
    : allProjects

  const { featured, others } = filtered.reduce<{ featured: typeof filtered; others: typeof filtered }>(
    (acc, p) => {
      if (p.featured) acc.featured.push(p)
      else acc.others.push(p)
      return acc
    },
    { featured: [], others: [] }
  )

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

      {/* Filter Buttons */}
      <div className="mb-12">
        <FilterBar activeCategory={activeCategory} />
      </div>

      {/* Featured Projects */}
      {featured.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featured.map((p) => (
              <EnhancedProjectCard
                key={p.slug}
                slug={p.slug}
                title={p.title}
                description={p.description}
                status={p.status}
                stage={p.stage}
                tech={p.tech}
                lastUpdated={p.lastUpdated}
                milestoneCount={p.milestoneCount}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Projects */}
      {others.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">Other Projects</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map((p) => (
              <SimpleProjectCard
                key={p.slug}
                slug={p.slug}
                title={p.title}
                description={p.description}
                status={p.status}
              />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-zinc-400 text-center py-16">No projects in this category yet.</p>
      )}

      {/* CTA */}
      <div className="mt-20 text-center p-12 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-2xl font-bold mb-4 text-white">Want to Learn How I Built This?</h3>
        <p className="text-zinc-300 mb-8 max-w-2xl mx-auto text-lg">
          Join the GrayBeard AI Collective for deep-dives, build logs, and
          practitioner discussions on infrastructure, security, and AI.
        </p>
        <a
          href="/community"
          className="px-6 py-3 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
        >
          Join the Community
        </a>
      </div>
    </Container>
  )
}
