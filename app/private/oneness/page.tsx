import type { Metadata } from 'next'

// Private page — intentionally excluded from sitemap, robots, and all nav.
// Audio is served via /api/manifesto-audio (gated by same middleware).
// To update text: edit the section components below.
// To update audio: replace private-assets/manifesto/oneness-foundation-reading.mp3 and redeploy.

export const metadata: Metadata = {
  title: 'The Oneness Framework',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}

export default function OnenessManifestoPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24">

        {/* Header */}
        <header className="mb-14">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-5">Private — The Oneness Framework</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-zinc-100 leading-snug mb-3">
            A Post-Partisan Manifesto
          </h1>
          <p className="text-zinc-500 text-sm">Land-foundation edition</p>
        </header>

        {/* Audio player */}
        <div className="mb-14 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Listen — 8m 37s</p>
          <audio
            controls
            preload="none"
            className="w-full"
            style={{ colorScheme: 'dark' }}
          >
            <source src="/api/manifesto-audio" type="audio/mpeg" />
            Your browser does not support audio playback.
          </audio>
          <p className="text-zinc-600 text-xs mt-3">Read by a British voice. Written in the winter of 2026.</p>
        </div>

        {/* Opening */}
        <section className="mb-12 prose-section">
          <p className="text-zinc-300 text-lg leading-relaxed">
            Before any framework for human arrangements can stand, there is a prior question: what are we arranging ourselves on? The land is not a resource for either system. It is not the property of markets, nor the commons of any communal arrangement. It preceded both, and it will outlast both. Any framework that treats the land as an input to human flourishing, rather than as the condition of it, has already made the foundational error. This document begins there.
          </p>
        </section>

        {/* Preamble */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-zinc-200 mb-5 pb-3 border-b border-zinc-800">Preamble</h2>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>
              As we stand at the crossroads of unprecedented technological advancement and social transformation, we recognize that our established systems no longer serve the full spectrum of human potential and aspiration. The artificial divisions between market and community, between profit and purpose, have created false choices that limit our collective future.
            </p>
            <p>
              This manifesto proposes a new framework. Not as a revolution that tears down, but as an evolution that builds upon. We envision a society that transcends partisan divisions by recognizing that different modes of living and working can coexist within a unified whole, connected by thoughtful transition mechanisms that preserve dignity, choice, and opportunity for all.
            </p>
          </div>
        </section>

        {/* Foundation */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-zinc-200 mb-5 pb-3 border-b border-zinc-800">Foundation: The Ground</h2>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>
              All five principles that follow govern relationships between human beings. How we organize work, share resources, and build transitions between ways of living. They are necessary. They are not sufficient.
            </p>
            <p>
              Beneath the market system and the communal system is the land itself. Neither system owns it. Both systems are its tenants. This is not a principle in the same register as the five below. It is the precondition for any of them being legitimate.
            </p>
            <p>
              The land is not a commodity to be managed sustainably. It is a relative. A being in relationship with the people who live on it, and with all life that depends on it. This framing comes from indigenous governance systems that functioned for thousands of years before they were disrupted. Not dismantled. Disrupted. Those systems were not theories reacting to something bad. They were relationships built over millennia with the specific land in which they were rooted. That distinction matters. What is proposed here is not a new ideology imposed on land. It is a recognition that the land has its own integrity that no human arrangement, market or communal, is above.
            </p>
            <p>
              What this means, practically. Neither the market system nor the communal system proposed in this manifesto may treat land as raw material or resource inventory. Transition mechanisms between systems must account for land stewardship obligations, not just human equity. The framework is explicitly downstream of the land. It operates within the land&apos;s conditions, not above them.
            </p>
            <p>
              On the enforcement question. How do we enforce care for the land within such a framework? The answer is that enforcement is the wrong frame. If land sovereignty is the foundation, not an output, then a community that fails in its relationship with the land has not violated a rule. It has stepped off the ground the whole structure rests on. That is not an enforcement problem. It is a legitimacy problem.
            </p>
          </div>

          {/* Settler acknowledgment — formatted as a distinct inset */}
          <div className="mt-8 bg-zinc-900/60 border border-zinc-800 rounded-lg p-6">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">A real and unresolved obligation</p>
            <div className="space-y-3 text-zinc-400 text-sm leading-relaxed">
              <p>
                This document was written by a settler of Mennonite lineage, planning to build a retreat on thirteen acres near Elie, Manitoba. Treaty One territory, and the homeland of the Métis Nation. The ideas in this Foundation draw from indigenous governance principles.
              </p>
              <p>
                Drawing from these ideas carries an obligation. Not to extract the concept of land sovereignty and apply it to a settler framework, but to seek actual relationship with the Anishinaabe, Cree, Oji-Cree, Dakota, and Dene peoples, and the Métis Nation, whose traditional territory this land is. The stewardship laws of the people actually from the land take precedence over how any community structures itself. That relationship has not yet been sought. This framework cannot be fully honest until it has been.
              </p>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-zinc-200 mb-7 pb-3 border-b border-zinc-800">Core Principles</h2>
          <div className="space-y-10">

            <div>
              <h3 className="text-base font-medium text-zinc-200 mb-3">
                <span className="text-zinc-500 mr-2">I.</span>Dual Systems, Single Framework
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                We affirm that both market-oriented systems and communal arrangements have virtues worthy of preservation. Rather than forcing all citizens into a single economic model, we propose a framework where both systems operate in parallel: innovation, efficiency, and entrepreneurship on one side; communal arrangements that prioritize mutual aid, shared resources, and collective wellbeing on the other. These systems shall not exist in isolation, but as complementary parts of a greater whole, with regulated pathways between them. Both operate within the prior claim of the land on which they are built.
              </p>
            </div>

            <div>
              <h3 className="text-base font-medium text-zinc-200 mb-3">
                <span className="text-zinc-500 mr-2">II.</span>Voluntary Participation
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                No person shall be coerced into either the market or communal system. The right to choose one&apos;s economic and social arrangements is fundamental. The role of governance is not to dictate participation, but to ensure fair transitions between systems when individuals choose to move between them.
              </p>
            </div>

            <div>
              <h3 className="text-base font-medium text-zinc-200 mb-3">
                <span className="text-zinc-500 mr-2">III.</span>Regulated Transitions
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                The boundary between systems shall be permeable but regulated. When individuals choose to transition: those moving from market to communal arrangements shall contribute resources in a fair and transparent manner. Those moving from communal to market arrangements shall receive equitable startup support. Transition mechanisms shall prevent exploitation while ensuring mobility.
              </p>
            </div>

            <div>
              <h3 className="text-base font-medium text-zinc-200 mb-3">
                <span className="text-zinc-500 mr-2">IV.</span>Technological Integration
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                Advanced artificial intelligence and automation shall serve human flourishing in both systems. In market arrangements, AI shall enhance productivity while respecting human dignity. In communal arrangements, AI shall support self-sufficiency and reduce toil. AI governance shall prevent technological power from becoming concentrated in either system.
              </p>
            </div>

            <div>
              <h3 className="text-base font-medium text-zinc-200 mb-3">
                <span className="text-zinc-500 mr-2">V.</span>Wealth and Resource Balance
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                To prevent the accumulation of extreme inequality that destabilizes the entire framework: the market system shall be subject to limitations on extreme wealth concentration. The communal system shall be entitled to a fair share of the wealth that flows from shared labor and shared land. Transparent mechanisms shall ensure neither system becomes impoverished relative to the other.
              </p>
            </div>

          </div>
        </section>

        {/* Path Forward */}
        <section className="mb-16">
          <h2 className="text-lg font-semibold text-zinc-200 mb-5 pb-3 border-b border-zinc-800">The Path Forward</h2>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>
              This framework does not promise utopia. It acknowledges the complexity of human desires and the diversity of human values. What it offers instead is a practical approach to transcending the false choices of the past. A system that honors both the individual&apos;s drive to excel and the community&apos;s need for connection, resting on ground that belongs to neither.
            </p>
            <p>
              As technological change accelerates and traditional employment patterns are disrupted, this framework provides a humane alternative to either enforced conformity or abandoned masses. It is not a final destination, but an evolving process. A commitment to finding balance in a world of constant change.
            </p>
            <p>
              We invite all who seek a more balanced future to join in refining and implementing this vision. Not through partisan conflict, but through thoughtful collaboration and practical experimentation. The path forward begins with those willing to imagine that our deepest disagreements might contain the seeds of our most profound consensus.
            </p>
          </div>
        </section>

        {/* Footer note */}
        <footer className="border-t border-zinc-800 pt-8">
          <p className="text-zinc-600 text-sm">Land-foundation edition — 2026. Subject to revision as the land relationship deepens.</p>
        </footer>

      </article>
    </div>
  )
}
