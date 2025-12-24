import Container from '@/components/Container'

export default function Page() {
  const cards = [
    {
      icon: "💼",
      title: "GoodFields Consulting",
      description: "Security assessments, AI implementation consulting, and pragmatic guidance for teams navigating AI adoption.",
      cta: "Visit GoodFields.io",
      href: "https://goodfields.io"
    },
    {
      icon: "🧠",
      title: "Cognitive Loop",
      description: "Posts exploring consciousness, presence, and human+AI collaboration. Subscribe for honest reflections.",
      cta: "Read on Substack",
      href: "https://cognitiveloop.substack.com"
    },
    {
      icon: "🌌",
      title: "StillPoint Project",
      description: "Solarpunk fiction, consciousness exploration, and community for discussing presence, resilience, and technology serving humanity.",
      cta: "Visit StillPoint",
      href: "https://stillpointproject.org"
    },
    {
      icon: "💼",
      title: "Follow on LinkedIn",
      description: "Technical posts, AI insights, and announcements about the Greybeard AI Collective (launching early 2026).",
      cta: "Connect on LinkedIn",
      href: "https://www.linkedin.com/in/wally-kroeker/"
    }
  ]

  return (
    <div className="pt-12 pb-20 md:pt-24 md:pb-32">
      <Container>
        {/* Hero Section */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's Build Together
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Whether you need secure AI implementation, want to follow the journey, or explore what I'm building—here's how.
          </p>
        </div>

        {/* Connection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {cards.map((card) => (
            <a 
              key={card.title} 
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-600 hover:bg-zinc-900 transition flex flex-col h-full"
            >
              <div className="text-4xl mb-6">{card.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition">
                {card.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed mb-8 flex-grow">
                {card.description}
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-white font-medium mt-auto">
                <span className="underline underline-offset-4 decoration-zinc-600 group-hover:decoration-white transition">
                  {card.cta}
                </span>
                <span aria-hidden>→</span>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="text-center">
          <a 
            href="/projects" 
            className="text-zinc-400 hover:text-white transition inline-flex items-center gap-2 text-lg"
          >
            Or explore my technical projects and build logs <span aria-hidden>→</span>
          </a>
        </div>
      </Container>
    </div>
  )
}
