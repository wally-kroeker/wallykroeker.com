import Container from '@/components/Container'
import { projects } from '@/data/projects'
import { getAllProjectHubs, isPublic } from '@/lib/markdown'
import Link from 'next/link'

export default async function ProjectsPage() {
  const projectHubs = await getAllProjectHubs()
  console.log('[DEBUG] Project hubs found:', projectHubs.length)
  projectHubs.forEach(p => {
    console.log(`[DEBUG] ${p.slug}:`, p.meta)
  })
  const publicProjects = projectHubs.filter((p) => isPublic(p.meta))
  console.log('[DEBUG] Public projects after filter:', publicProjects.length)

  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10">
          <h1 className="text-xl font-semibold">Projects</h1>

          {/* Code Projects - Dynamic from content/projects */}
          {publicProjects.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">Code Projects</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicProjects.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition"
                  >
                    <div className="text-xs uppercase tracking-wide text-zinc-400">
                      {p.meta.stage || 'In Progress'}
                    </div>
                    <h3 className="mt-1 text-lg font-medium">{p.meta.title}</h3>
                    <div
                      className="mt-2 text-sm text-zinc-300 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: p.html }}
                    />
                    {p.meta.links?.repo && (
                      <div className="mt-3 text-xs text-zinc-500">
                        View on GitHub →
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Community & External Projects */}
          <div className="mt-10">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-4">Community & External</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <a
                  key={p.title}
                  href={p.href}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition"
                >
                  <div className="text-xs uppercase tracking-wide text-zinc-400">{p.meta}</div>
                  <h3 className="mt-1 text-lg font-medium">{p.title}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{p.blurb}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
