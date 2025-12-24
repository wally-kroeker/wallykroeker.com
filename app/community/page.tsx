import Container from '@/components/Container'

export default function CommunityPage() {
  return (
    <div className="pt-12 pb-20 md:pt-24 md:pb-32">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Greybeard AI Collective
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed mb-12">
            Regular meetups for infrastructure and security folks navigating AI adoption.
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Coming Early 2026</h2>
            <p className="text-zinc-300 leading-relaxed mb-8">
              A peer learning community for greybeards—people who've seen tech cycles come and go and want to learn and share practical AI insights together.
            </p>
            <a 
              href="https://www.linkedin.com/in/wally-kroeker/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
            >
              Follow on LinkedIn for Updates
            </a>
          </div>

          <div className="border-t border-zinc-900 pt-12">
            <p className="text-zinc-500 mb-6 italic">In the meantime, check out:</p>
            <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12">
              <a 
                href="https://cognitiveloop.substack.com"
                target="_blank"
                rel="noopener noreferrer" 
                className="text-zinc-300 hover:text-white transition"
              >
                <span className="block font-semibold text-white mb-1">Cognitive Loop</span>
                <span className="text-sm">AI and consciousness reflections</span>
              </a>
              <a 
                href="https://stillpointproject.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white transition"
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