import Container from '@/components/Container'

export default function WorkPage() {
  const services = [
    {
      title: "Secure Foundations Review",
      description: "A calm, complete look at your systems—cloud to floor—through a privacy-first lens.",
      points: [
        "Compliance checked (PIPEDA, PCI) and every finding mapped to simple next actions",
        "Delivered as a clear report and executive summary you can act on",
        "Outcome: Confidence, clarity, and technology that endures"
      ]
    },
    {
      title: "AI Jumpstart for Practical Humans",
      description: "Explore where AI actually fits in your daily work—no hype, just clarity.",
      points: [
        "Hands-on workshop or consultation to identify secure, high-impact use-cases",
        "Platform-agnostic approach focused on privacy, governance, and practical ROI",
        "Outcome: Confidence to use AI safely, effectively, and on your own terms"
      ]
    },
    {
      title: "Private ChatGPT",
      description: "Runs on your server or Manitoba-hosted by us—no chats or files are sent to public AI.",
      points: [
        "Connects safely to your docs and tools (M365/SharePoint, file shares, n8n/MCP) with access controls",
        "Includes governance, admin training, and optional managed support",
        "Outcome: Your team can finally use AI with confidential data—summarize, draft, and search—without privacy risk"
      ]
    }
  ]

  return (
    <div className="pt-12 pb-20 md:pt-24 md:pb-32">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Work With Me
          </h1>
          <p className="text-xl text-zinc-400 mb-16">
            Security & AI Strategy for Practical Humans
          </p>

          <h2 className="text-2xl font-bold text-white mb-8">Services</h2>
          
          <div className="space-y-16">
            {services.map((service, index) => (
              <div key={service.title} className="group">
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-200 transition">
                  {service.title}
                </h3>
                <p className="text-zinc-300 leading-relaxed mb-6 italic">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.points.map((point, i) => (
                    <li key={i} className="flex gap-3 text-zinc-400">
                      <span className="text-zinc-600">—</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {index < services.length - 1 && (
                  <hr className="border-zinc-900" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-zinc-900 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-6">Let's Talk</h2>
            <p className="text-zinc-400 mb-8 text-lg">
              Ready to explore how we can work together?
            </p>
            <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start">
              <a 
                href="/engage" 
                className="px-6 py-3 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
              >
                Let's Connect
              </a>
              <a 
                href="mailto:wally@goodfields.io" 
                className="text-zinc-300 hover:text-white underline underline-offset-4 decoration-zinc-700 hover:decoration-white transition"
              >
                wally@goodfields.io
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}