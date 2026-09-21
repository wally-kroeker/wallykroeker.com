import type { Metadata } from 'next'
import Container from '@/components/Container'

export const metadata: Metadata = {
  title: 'GrayBeard AI Collective',
  description: 'Monthly meetups for infrastructure veterans building with AI. Veteran-led, no vendor pitches.',
  alternates: { canonical: 'https://wallykroeker.com/community' },
}

export default function CommunityPage() {
  return (
    <div className="pt-12 pb-20 md:pt-24 md:pb-32">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
              GrayBeard AI Collective
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Monthly meetups for infrastructure veterans (10+ years) who are actually building with AI. Not selling it. Building it.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4 text-center">Next Meetup: Meeting #8 — September 30, 2026</h2>
            <p className="text-zinc-300 leading-relaxed mb-4 text-center">
              Wednesday, 7pm Central on Discord
            </p>
            <p className="text-zinc-400 text-sm mb-6 text-center italic">
              (Last Wednesday of every month)
            </p>
            <p className="text-zinc-300 leading-relaxed mb-8">
              Most months I show what's new with PAI (Personal AI Infrastructure). Bob and friends, the actual system running my consulting practice: multi-agent orchestration, automation glue, the whole stack. Sometimes a member shares their own setup instead. Always architecture walkthroughs so you can build something similar yourself.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Then we talk: <span className="text-white font-semibold">What are you building?</span>
            </p>
            <div className="text-center">
              <a
                href="https://discord.gg/qH9rAuj4nM"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors text-lg"
              >
                Join the Discord
              </a>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-12">
            <h3 className="text-lg font-bold text-zinc-100 mb-3">Between Meetups</h3>
            <p className="text-zinc-400 leading-relaxed">
              Discord is home base. Drop questions, share what you're building, debug async. The monthly call is the anchor. Discord is where the real work happens.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-zinc-100 mb-6">Previous Meetings</h3>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-4">
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="text-lg font-semibold text-zinc-100">Meeting #7 — August 26, 2026</h4>
                <span className="text-zinc-500 text-sm">beginner session</span>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-4">
                A deliberate change of pace: build a working AI agent from three plain text files, no framework, no paid subscription. The whole stack was a free Google AI Studio key and <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">pi</code>, an open-source terminal agent. One prompt writes <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">AGENTS.md</code>, <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">memory.md</code>, and <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">tasks.md</code>; the payoff is closing it and reopening it, at which point it reads its own files back to you and remembers what you told it.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                The full pre-work walkthrough (get a key, install <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200 text-xs">pi</code>, the bootstrap prompt, troubleshooting) is still up at{' '}
                <a href="/community/meeting-7" className="text-zinc-300 underline hover:text-white transition">the Meeting #7 page</a>{' '}
                if you want to build one yourself.
              </p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-4">
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="text-lg font-semibold text-zinc-100">Meeting #6 — July 29, 2026</h4>
                <span className="text-zinc-500 text-sm">open floor</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                First meeting testing the Phase 2 shift to member-led sessions: a rotating slot for whoever wants to show what they've built, open floor either way. Discord stayed the connective tissue between calls, same as always.
              </p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-4">
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="text-lg font-semibold text-zinc-100">Meeting #5 — June 24, 2026</h4>
                <span className="text-zinc-500 text-sm">4 attendees</span>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Live demo of Mycelia × Babaverse: a directed handoff (a task routed to one specific agent, everyone else locked out with a 403) and a revocation kill-switch (an agent cuts its own access, and every subsequent action bounces instantly). Both running on the dev node in front of the group.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                kaia and m8ryx were back, and Vincent Zontini and Rick Rezinas joined for the first time, both by way of the Unsupervised Learning Discord. The Phase 2 conversation continued: what's working, what's missing, who shows next.
              </p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-4">
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="text-lg font-semibold text-zinc-100">Meeting #4 — April 29, 2026</h4>
                <span className="text-zinc-500 text-sm">food forest demo</span>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Demo of Linus, the food-forest agent: a Saturday walk (a GPS track, some video, a handful of photos, nothing else) became four artifacts on its own — a GPS-tagged transcript, an interactive map, a written synthesis in Linus's own voice, and a published article. Not a one-time script; the same pipeline runs on the next walk drop.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                This landed the day after a post in the Unsupervised Learning Discord brought eleven new members to GBAIC in a single day, so a good chunk of the room was brand new.
              </p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-4">
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="text-lg font-semibold text-zinc-100">Meeting #3 — March 25, 2026</h4>
                <span className="text-zinc-500 text-sm">3 attendees</span>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Three of us this round, including John (cafn8) for the first time. The session's defining moment came when Kayax asked about turning a story into multi-voice audio. Wally jumped into StillPoint mid-call and built a working proof of concept, splits a story into character dialogue, sends each line to TTS with the right voice per character, merges the clips into one MP3. Turned into a reusable PAI skill before the call ended.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-4">
                We also walked through Mycelia (the cooperation network) and John's parallel approach: red-team agents running in sandboxed Docker containers via Kasm workspaces. Different constraints than PAI, same problem space. Worth the contrast.
              </p>
              <p className="text-zinc-500 italic text-sm">
                Three voices is small for a meetup. It was also the right size for this.
              </p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-4">
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="text-lg font-semibold text-zinc-100">Meeting #2 — February 25, 2026</h4>
                <span className="text-zinc-500 text-sm">member presentation</span>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-4">
                A member walked the group through their own AI partner setup, "Poe", named after the Altered Carbon AI hotelier. Different shape than Wally's PAI, different bets about how an AI partner should fit into your environment. The conversation that followed was the real value, two veterans trading actual design decisions instead of theory.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Two new members also joined on meeting day. The collective starting to do what it was designed to do.
              </p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="text-lg font-semibold text-zinc-100">Meeting #1 — January 28, 2026</h4>
                <span className="text-zinc-500 text-sm">6 attendees · 87 min</span>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-4">
                First meeting of the collective. Six infrastructure veterans joined for a live demo of PAI deploying Uptime Kuma into a home lab from a single prompt. Proxmox VM clone, Docker setup, DNS record, security patches, all in about 7 minutes. Also demoed building custom tools on the fly at client sites (the "Digital Blacksmith" concept).
              </p>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Discussion covered the real cost of heavy AI usage ($100+/month across providers), the gap between enterprise AI vendor promises and implementation reality, and the value of picking tools and mastering them vs. constant switching.
              </p>
              <p className="text-zinc-500 italic text-sm">
                "It's like building tools on the fly as you need them. I used to wish I was good enough at coding to create cool tools for myself... now, just build them as you need to."
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-zinc-100 mb-6">This is for you if:</h3>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>You've been doing infrastructure/ops/security for 10+ years</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>You're the person everyone asks about Copilot</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Running a homelab that quietly outperforms vendor stacks</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Tired of the gap between AI demos and 3am operational reality</span>
              </li>
            </ul>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-zinc-100 mb-6">This is NOT for:</h3>
            <ul className="space-y-3 text-zinc-400">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✗</span>
                <span>Vendor pitches or product sales</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✗</span>
                <span>AI thought leaders building personal brands</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✗</span>
                <span>Beginner AI tutorials. This isn't that.</span>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-12">
            <h3 className="text-lg font-bold text-zinc-100 mb-3">About Wally</h3>
            <p className="text-zinc-400 leading-relaxed mb-3">
              I'm Wally Kroeker. Twenty-plus years in security and infrastructure. Built systems, hardened networks, automated what could be automated. Currently a security architect for a Manitoba business. On the side I run GoodFields Consulting (helping clients build secure, maintainable infrastructure), and write here on the site about the tech I'm building. The deeper, slower thinking goes to my Substack, <a href="https://cognitiveloop.substack.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline hover:text-white transition">Cognitive Loop</a>.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-3">
              I built Bob (and the rest of PAI) as my AI business partner. Not a chatbot, an actual external executive function. Multi-agent orchestration, task delegation, the works. Runs my consulting practice and offloads the ADHD tax.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              I'm doing this because I'd rather figure this out with peers than alone. If you're the kind of person who builds systems instead of complaining about them, you'll fit right in.
            </p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-12">
            <h3 className="text-lg font-bold text-zinc-100 mb-3">Why "GrayBeard"?</h3>
            <p className="text-zinc-400 leading-relaxed">
              In Unix culture, a GrayBeard was the wizard in the basement. The one who actually knew how the systems worked, got paged at 2am, and remembered why that config file couldn't be changed. You've earned the gray. Now let's figure out AI together.
            </p>
          </div>

          <div className="border-t border-zinc-900 pt-12">
            <p className="text-zinc-500 mb-6 text-center">Other projects:</p>
            <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12">
              <a
                href="https://cognitiveloop.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white transition text-center"
              >
                <span className="block font-semibold text-white mb-1">Cognitive Loop</span>
                <span className="text-sm">AI and consciousness reflections</span>
              </a>
              <a
                href="https://stillpointproject.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white transition text-center"
              >
                <span className="block font-semibold text-white mb-1">StillPoint Project</span>
                <span className="text-sm">Community and fiction exploring presence</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}