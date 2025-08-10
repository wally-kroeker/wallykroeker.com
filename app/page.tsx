import { projects } from '@/data/projects'
import Container from '@/components/Container'

export default function Page() {
  return (
    <>
      <section>
        <Container>
          <div className="pt-12 pb-8 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                I build open, useful systems so more people can thrive.
              </h1>
              <p className="mt-4 text-zinc-300 max-w-2xl">
                Proof‑of‑work over promises. Transparent build logs, field guides, and minimal tools you can reuse today. No trackers. No fluff.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#projects" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Explore Projects</a>
                <a href="/loop" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Read Cognitive Loop</a>
                <a href="/community" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Join the Community</a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl">
                <h2 className="text-sm font-medium text-zinc-300">Compass</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                  <li>Useful &gt; perfect</li>
                  <li>Transparency &gt; mystique</li>
                  <li>Privacy &gt; tracking</li>
                  <li>Community &gt; ego</li>
                  <li>Open & local & resilient</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="projects" className="border-t border-zinc-900">
        <Container>
          <div className="py-10">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-semibold">Featured Projects</h2>
              <a href="/projects" className="text-sm text-zinc-400 hover:text-white">See all →</a>
            </div>
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <a key={p.title} href={p.href} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition">
                  <div className="text-xs uppercase tracking-wide text-zinc-400">{p.meta}</div>
                  <h3 className="mt-1 text-lg font-medium">{p.title}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{p.blurb}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm">
                    <span className="underline underline-offset-4">{p.cta}</span>
                    <span aria-hidden>→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
