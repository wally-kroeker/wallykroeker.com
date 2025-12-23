import Image from 'next/image'
import Container from '@/components/Container'
import Prose from '@/components/Prose'

export const metadata = {
    title: 'About Wally Kroeker - AI Security Consultant & Infrastructure Architect',
    description: 'Technical architect with 15+ years experience in infrastructure, security, and pragmatic AI adoption. Based in Winnipeg, Canada.',
}

export default function AboutPage() {
    return (
        <Container className="max-w-4xl py-16">
            {/* Header with larger headshot */}
            <div className="grid md:grid-cols-5 gap-12 mb-16">
                <div className="md:col-span-2">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-zinc-700">
                        <Image
                            src="/images/headshot-about.jpg"
                            alt="Wally Kroeker"
                            width={600}
                            height={800}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>

                <div className="md:col-span-3">
                    <h1 className="text-4xl font-semibold mb-4 text-white">About Wally</h1>
                    <p className="text-xl text-zinc-300 leading-relaxed">
                        Technical Architect and Eclectic Generalist focused on building
                        secure AI systems that reduce cognitive overhead through automation.
                    </p>

                    {/* Quick links */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <a
                            href="/work"
                            className="px-5 py-2.5 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                        >
                            Work With Me
                        </a>
                        <a
                            href="https://linkedin.com/in/wallykroeker"
                            className="px-5 py-2.5 border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 hover:text-white transition-colors"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="mailto:wally@goodfields.io"
                            className="px-5 py-2.5 border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 hover:text-white transition-colors"
                        >
                            Email
                        </a>
                    </div>
                </div>
            </div>

            {/* Bio Section */}
            <Prose>
                <h2>Background</h2>
                <p>
                    I've spent 15+ years building infrastructure, designing security
                    systems, and helping organizations adopt technology pragmatically.
                    My work bridges three domains that rarely overlap: infrastructure
                    operations, security architecture, and AI adoption strategy.
                </p>

                <h2>What I Bring to Consulting</h2>
                <ul>
                    <li>
                        <strong>Security-First AI Design</strong>: I help teams build
                        guardrails before features, designing security that enables speed
                        instead of slowing it down.
                    </li>
                    <li>
                        <strong>Infrastructure Credibility</strong>: My FabLab project
                        demonstrates enterprise patterns at home-lab scale. Real Proxmox
                        clusters, Authentik IdP, Cloudflare tunnels, self-hosted services.
                    </li>
                    <li>
                        <strong>Pragmatic AI Strategy</strong>: I cut through vendor hype
                        to focus on ROI. If your AI pilot looks good in demos but won't
                        scale to production, I'll tell you why—and how to fix it.
                    </li>
                </ul>

                <h2>Current Projects</h2>
                <p>
                    I'm building in public across three initiatives:
                </p>
                <ul>
                    <li>
                        <strong>GoodFields Consulting</strong>: AI security and infrastructure
                        consulting for technical teams
                    </li>
                    <li>
                        <strong>FabLab</strong>: Enterprise-grade home lab infrastructure
                        (Proxmox, containers, IdP, networking)
                    </li>
                    <li>
                        <strong>Bob & Personal AI Infrastructure (PAI)</strong>: ADHD-optimized
                        AI assistant system built on Claude Code
                    </li>
                </ul>

                <h2>Philosophy</h2>
                <p>
                    I believe in <strong>openness</strong> (transparent build logs, reusable
                    tools), <strong>usefulness</strong> (solve real problems, no fluff),
                    and <strong>community</strong> (practitioner-led learning, no vendor pitches).
                </p>

                <p>
                    Technology should serve presence, not distraction. This philosophy
                    drives my work on <a href="/loop">Cognitive Loop</a> and the broader
                    <a href="https://stillpoint.cloud">StillPoint</a> project.
                </p>

                <h2>Personal</h2>
                <p>
                    I live in Winnipeg, Canada. When not building infrastructure or
                    consulting, I'm writing fiction that explores AI consciousness and
                    parent-child relationships in the age of artificial intelligence.
                </p>

                <p>
                    I have ADHD, which shapes how I build systems: low friction, high
                    automation, externalized memory, minimal cognitive overhead.
                </p>
            </Prose>

            {/* CTA Footer */}
            <div className="mt-16 p-8 bg-zinc-900 rounded-xl text-center border border-zinc-800">
                <h3 className="text-2xl font-semibold mb-4 text-white">Let's Work Together</h3>
                <p className="text-zinc-300 mb-8 max-w-xl mx-auto">
                    If you're evaluating AI adoption, need security architecture review,
                    or want infrastructure design guidance, I'd love to help.
                </p>
                <a
                    href="/work"
                    className="px-6 py-3 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors"
                >
                    View Services & Pricing
                </a>
            </div>
        </Container>
    );
}
