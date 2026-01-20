# Section 2 Replacement: "Where I'm Building"

Replace the entire `<section>` block starting at roughly line 67 with this code.
Note: You will need to import `Link` at the top of the file: `import Link from "next/link";`

```tsx
      {/* Value Proposition Section */}
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
```
