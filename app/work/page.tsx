import Container from '@/components/Container'
import { site } from '@/lib/siteConfig'

export default function WorkPage() {
  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10">
          <h1 className="text-xl font-semibold">Work With Me</h1>
          <p className="mt-2 text-zinc-300 max-w-3xl">
            Advisory sprints, not endless projects. We clarify the problem, prototype the path, and document the handoff. You keep the keys.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={site.calendar} className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Book a chat</a>
            <a href={site.linkedin} className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">LinkedIn</a>
            <a href={site.x} className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">X (Twitter)</a>
            <a href={site.email} className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Email</a>
          </div>
        </div>
      </Container>
    </section>
  )
}
