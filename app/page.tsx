import Image from 'next/image'
import { projects } from '@/data/projects'
import Container from '@/components/Container'

export default function Page() {
  return (
    <>
      <section className="pt-12 pb-16 md:pt-24 md:pb-24">
        <Container>
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="md:col-span-6 flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                I build secure, open AI systems
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-lg">
                20+ years building secure infrastructure. Now exploring how AI and humans work together without losing our humanity. Building in public, sharing what I learn.
              </p>

              {/* Trust Signals */}
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400 py-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-zinc-500">✓</span> 20+ years infrastructure
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-zinc-500">✓</span> Security-first AI
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-zinc-500">✓</span> Open-source advocate
                </span>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="/engage"
                  className="px-6 py-3 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Let's Connect
                </a>
              </div>
            </div>

            {/* Right Column - Headshot */}
            <div className="md:col-span-6 flex justify-center md:justify-end">
              <div className="relative rounded-2xl border-2 border-zinc-800 overflow-hidden shadow-2xl hover:border-zinc-700 transition w-full max-w-md bg-zinc-900">
                <Image
                  src="/images/headshot.jpg"
                  alt="Wally Kroeker, AI Security Consultant"
                  width={600}
                  height={750}
                  priority
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Value Proposition Section */}
      <section className="border-t border-zinc-900 py-20">
        <Container>
          <h2 className="text-2xl font-bold text-white mb-10">What I Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-white mb-3">Security-First AI</h3>
              <p className="text-zinc-400 leading-relaxed">
                Build guardrails before features. Design security that enables speed, not slows it down.
              </p>
            </div>
            <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition">
              <div className="text-3xl mb-4">🏗️</div>
              <h3 className="text-lg font-semibold text-white mb-3">Infrastructure as Proof</h3>
              <p className="text-zinc-400 leading-relaxed">
                FabLab demonstrates enterprise patterns at home-lab scale. Real infrastructure, real lessons.
              </p>
            </div>
            <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-white mb-3">Pragmatic AI Adoption</h3>
              <p className="text-zinc-400 leading-relaxed">
                Cut through hype. ROI-focused strategies for technical teams evaluating AI pilots.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Projects Section */}
      <section id="projects" className="border-t border-zinc-900 py-20">
        <Container>
          <div className="flex items-baseline justify-between gap-4 mb-10">
            <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
            <a href="/projects" className="text-sm text-zinc-400 hover:text-white transition">See all projects →</a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <a key={p.title} href={p.href} className="group rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-600 hover:bg-zinc-900 transition">
                <div className="text-xs uppercase tracking-wide text-zinc-500 font-semibold group-hover:text-zinc-400 mb-3">{p.meta}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition">{p.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">{p.blurb}</p>
                <div className="inline-flex items-center gap-2 text-sm text-white font-medium">
                  <span className="underline underline-offset-4 decoration-zinc-600 group-hover:decoration-white transition">{p.cta}</span>
                  <span aria-hidden>→</span>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Community CTA */}
      <section className="py-20 border-t border-zinc-900">
        <Container>
          <div className="bg-zinc-900 rounded-2xl p-8 md:p-12 text-center border border-zinc-800">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join the Greybeard AI Collective
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto text-lg">
              Practitioner community for infrastructure engineers and security folks
              navigating AI adoption. Real experiences. No vendor pitches.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/community" className="px-6 py-3 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition">
                Learn More
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

