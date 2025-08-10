import Container from '@/components/Container'
import { projects } from '@/data/projects'

export default function ProjectsPage() {
  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10">
          <h1 className="text-xl font-semibold">Projects</h1>
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <a key={p.title} href={p.href} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition">
                <div className="text-xs uppercase tracking-wide text-zinc-400">{p.meta}</div>
                <h3 className="mt-1 text-lg font-medium">{p.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{p.blurb}</p>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
