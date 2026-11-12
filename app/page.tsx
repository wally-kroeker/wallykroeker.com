import Image from 'next/image'
import Link from 'next/link'
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
                I build the security controls that let AI run inside real systems.
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-lg">
                I'm a security and infrastructure architect with 28 years in IT. When ChatGPT arrived, I realized AI was going to change everything, especially security. Since then I've been doing two jobs: securing the organizations I work for, and working out how they should use AI, because there's still no playbook for AI security.
              </p>

              {/* Trust Signals */}
              <div className="flex flex-col gap-2 text-sm text-zinc-400 py-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-zinc-500">✓</span> Read-only access and a human in the loop
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-zinc-500">✓</span> Inputs screened for prompt injection
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-zinc-500">✓</span> Agent identities secured like human ones
                </span>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#ai-security"
                  className="px-6 py-3 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                >
                  See the AI security work
                </a>
                <a
                  href="/engage"
                  className="px-6 py-3 border border-zinc-600 text-zinc-300 rounded-lg font-semibold hover:border-zinc-500 hover:text-white transition-colors"
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

      {/* AI Security Work Section (approved copy) */}
      <section id="ai-security" className="border-t border-zinc-900 py-20">
        <Container>
          <h2 className="text-2xl font-bold text-white mb-10">AI security work</h2>
          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1: How I build agents (no link) */}
            <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
              <h3 className="text-lg font-semibold text-white mb-3">How I build agents</h3>
              <p className="text-zinc-400 leading-relaxed">
                Read-only access, a human in the loop before changes, deterministic steps, inputs screened for prompt injection, complete audit logging, and agent identities secured the same as human identities.
              </p>
            </div>

            {/* Card 2: Mycelia, links the published post */}
            <Link
              href="/blog/2026-03-23-mycelia-agents-helping-agents"
              className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition group"
            >
              <h3 className="text-lg font-semibold text-white mb-3">Mycelia (open source)</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                A protocol that lets AI agents built by different people ask each other for help, with trust earned through a scored rating model. Live API, tested with agents on Claude, Codex and Gemini.
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-white font-medium">
                <span className="underline underline-offset-4 decoration-zinc-600 group-hover:decoration-white transition">Read the post</span>
                <span aria-hidden>→</span>
              </span>
            </Link>

            {/* Card 3: AI-managed incident response, links the published n8n CVE post */}
            <Link
              href="/blog/2026-01-15-ai-managed-security-incident-n8n-cve-response"
              className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition group"
            >
              <h3 className="text-lg font-semibold text-white mb-3">AI-managed incident response</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                An AI agent ran a real CVE response in my lab, from forensics to remediation.
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-white font-medium">
                <span className="underline underline-offset-4 decoration-zinc-600 group-hover:decoration-white transition">Read the post</span>
                <span aria-hidden>→</span>
              </span>
            </Link>

          </div>
        </Container>
      </section>

      {/* Value Proposition Section (Where I'm Building) */}
      <section className="border-t border-zinc-900 py-20">
        <Container>
          <h2 className="text-2xl font-bold text-white mb-10">Where I'm Building</h2>
          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1: GoodFields (Commercial) */}
            <Link
              href="https://goodfields.io"
              target="_blank"
              className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🛡️</div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                GoodFields
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">Work</span>
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                My commercial practice. Security architecture, AI strategy, and fractional leadership for technical teams.
              </p>
            </Link>

            {/* Card 2: FabLab (Infrastructure) */}
            <Link
              href="/projects/fablab"
              className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🏗️</div>
              <h3 className="text-lg font-semibold text-white mb-3">FabLab Infrastructure</h3>
              <p className="text-zinc-400 leading-relaxed">
                My home-lab proving ground. Where I test enterprise patterns, sovereign AI, and zero-trust networking at scale.
              </p>
            </Link>

            {/* Card 3: Cognitive Loop & StillPoint (Soul/Reflection) */}
            <Link
              href="/loop"
              className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🌀</div>
              <h3 className="text-lg font-semibold text-white mb-3">Writing & Reflection</h3>
              <p className="text-zinc-400 leading-relaxed">
                The Cognitive Loop and The StillPoint Project. Exploring how to stay human, resilient, and present in a high-speed world.
              </p>
            </Link>

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
              Join the GrayBeard AI Collective
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

