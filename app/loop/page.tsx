import Container from '@/components/Container'
import { site } from '@/lib/siteConfig'

export default function LoopPage() {
  return (
    <section className="border-t border-zinc-900">
      <Container>
        <div className="py-10 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <h1 className="text-xl font-semibold">Cognitive Loop</h1>
            <p className="mt-2 text-zinc-300">
              Transparent human+AI writing. Ship the thinking, not just the conclusions.
            </p>
            <div className="mt-4 flex gap-3">
              <a href={site.substack} className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Read on Substack</a>
              <a href="/loop/what-is" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">What is Cognitive Loop?</a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
