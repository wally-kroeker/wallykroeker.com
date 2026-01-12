import Container from '@/components/Container'

export default function CommunityPage() {
  return (
    <div className="pt-12 pb-20 md:pt-24 md:pb-32">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              GrayBeard AI Collective
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Monthly meetups for infrastructure veterans (10+ years) who are actually building with AI. Not selling it. Building it.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">First Meetup: January 28, 2026</h2>
            <p className="text-zinc-300 leading-relaxed mb-6 text-center">
              Wednesday, 7pm Central on Discord
            </p>
            <p className="text-zinc-300 leading-relaxed mb-8">
              I'll demo my PAI (Personal AI Infrastructure) framework—Bob and friends. The actual system running my consulting practice: multi-agent orchestration, automation glue, the whole stack. More importantly: I'll show the architecture and how to build something similar yourself.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Then we talk: <span className="text-white font-semibold">What are you building?</span>
            </p>
            <div className="text-center">
              <a
                href="https://discord.gg/Skn98TXg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors text-lg"
              >
                Join the Discord
              </a>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-6">This is for you if:</h3>
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
            <h3 className="text-xl font-bold text-white mb-6">This is NOT for:</h3>
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
                <span>Beginner AI tutorials—this isn't that</span>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-12">
            <h3 className="text-lg font-bold text-white mb-3">Why "GrayBeard"?</h3>
            <p className="text-zinc-400 leading-relaxed">
              In Unix culture, a graybeard was the wizard in the basement—the one who actually knew how the systems worked, got paged at 2am, and remembered why that config file couldn't be changed. You've earned the gray. Now let's figure out AI together.
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