import Container from '@/components/Container'
import { getDaemonData, DaemonSection } from '@/lib/daemon'
import DaemonHero from './components/DaemonHero'
import DaemonCard from './components/DaemonCard'

export const metadata = {
  title: 'Daemon — Personal API | Wally Kroeker',
  description: 'A public API representing who I am, what I build, and how I work. Part of the Daemon ecosystem for human-AI collaboration.',
}

export default async function DaemonPage() {
  const data = await getDaemonData()

  // Hero section
  const aboutSection = data.sections.find(s => s.name === 'ABOUT')
  
  // Primary info cards
  const primarySections = ['MISSION', 'AI_PARTNERSHIP', 'PROJECTS', 'TELOS']
    .map(name => data.sections.find(s => s.name === name))
    .filter((s): s is DaemonSection => s !== undefined)

  // Secondary info cards
  const secondarySections = ['PREFERENCES', 'DAILY_ROUTINE', 'PREDICTIONS', 'CURRENT_LOCATION']
    .map(name => data.sections.find(s => s.name === name))
    .filter((s): s is DaemonSection => s !== undefined)

  // Media sections
  const mediaSections = ['FAVORITE_BOOKS', 'FAVORITE_MOVIES', 'FAVORITE_PODCASTS']
    .map(name => data.sections.find(s => s.name === name))
    .filter((s): s is DaemonSection => s !== undefined)

  return (
    <>
      {/* Hero Section */}
      <DaemonHero aboutSection={aboutSection} />

      {/* Primary Info Cards */}
      {primarySections.length > 0 && (
        <section className="py-16 border-t border-zinc-900">
          <Container>
            <h2 className="text-2xl font-bold text-white mb-10">Core</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {primarySections.map((section) => (
                <DaemonCard key={section.name} section={section} size="large" />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Secondary Info Cards */}
      {secondarySections.length > 0 && (
        <section className="py-16 border-t border-zinc-900">
          <Container>
            <h2 className="text-2xl font-bold text-white mb-10">Preferences & Patterns</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {secondarySections.map((section) => (
                <DaemonCard key={section.name} section={section} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Media Sections */}
      {mediaSections.length > 0 && (
        <section className="py-16 border-t border-zinc-900">
          <Container>
            <h2 className="text-2xl font-bold text-white mb-10">Favorites</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {mediaSections.map((section) => (
                <DaemonCard key={section.name} section={section} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* API Info Section */}
      <section className="py-16 border-t border-zinc-900">
        <Container>
          <div className="bg-zinc-900 rounded-2xl p-8 md:p-12 border border-zinc-800">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  What is a Daemon?
                </h2>
                <p className="text-zinc-400 mb-4 leading-relaxed">
                  A Daemon is a personal API that represents you. It exposes structured information 
                  about who you are and how you work — queryable by both humans and AI systems.
                </p>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  Part of Daniel Miessler's vision for connecting humans through AI-powered 
                  personal assistants. Your daemon can interact with other daemons to find 
                  common ground, schedule meetings, or discover shared interests.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://github.com/danielmiessler/Daemon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    Daemon Project
                  </a>
                  <a 
                    href="https://github.com/wally-kroeker/Daemon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-600 hover:text-white transition-colors"
                  >
                    My Fork
                  </a>
                </div>
              </div>
              <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800 font-mono text-sm">
                <div className="text-zinc-500 mb-2"># Query this daemon</div>
                <div className="text-emerald-400">GET</div>
                <div className="text-zinc-300 break-all">wallykroeker.com/daemon</div>
                <div className="mt-4 text-zinc-500"># Sections available</div>
                <div className="text-zinc-300">
                  {data.sections.map(s => s.name).join(', ') || 'Loading...'}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
