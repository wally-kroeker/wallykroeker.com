import Container from '@/components/Container'
import { DaemonSection } from '@/lib/daemon'

interface DaemonHeroProps {
  aboutSection?: DaemonSection
}

export default function DaemonHero({ aboutSection }: DaemonHeroProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-zinc-950 to-zinc-950" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(16 185 129) 1px, transparent 1px),
                           linear-gradient(to bottom, rgb(16 185 129) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      <Container className="relative">
        <div className="max-w-4xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950/50 border border-emerald-800/50 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">Daemon Active</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="text-emerald-400">/</span>daemon
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-zinc-300 mb-8 leading-relaxed max-w-2xl">
            A public API representing who I am, what I care about, and how I work.
            Queryable by humans and AI systems alike.
          </p>
          
          {/* About content if available */}
          {aboutSection && (
            <div className="mt-8 p-6 bg-zinc-900/80 border border-zinc-800 rounded-xl backdrop-blur-sm">
              <div 
                className="prose prose-invert prose-zinc prose-p:text-zinc-300 prose-p:leading-relaxed max-w-none"
                dangerouslySetInnerHTML={{ __html: aboutSection.html }}
              />
            </div>
          )}
          
          {/* Quick Info */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-zinc-800">
            <div>
              <div className="text-sm text-zinc-500 mb-1">Format</div>
              <div className="text-lg font-semibold text-white">daemon.md</div>
            </div>
            <div>
              <div className="text-sm text-zinc-500 mb-1">Protocol</div>
              <div className="text-lg font-semibold text-white">MCP Compatible</div>
            </div>
            <div>
              <div className="text-sm text-zinc-500 mb-1">Upstream</div>
              <div className="text-lg font-semibold text-white">danielmiessler/Daemon</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
