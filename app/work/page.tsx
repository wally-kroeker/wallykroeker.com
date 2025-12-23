import Container from '@/components/Container'
import ServiceCard from '@/components/ServiceCard'
import ProcessStep from '@/components/ProcessStep'

export const metadata = {
  title: 'Work With Wally - AI Security & Infrastructure Consulting',
  description: 'Helping technical teams navigate AI adoption with security-first strategies, pragmatic frameworks, and transparent processes.',
}

function Testimonial({
  quote,
  author,
  role
}: {
  quote: string
  author: string
  role: string
}) {
  return (
    <div className="p-8 border border-zinc-800 rounded-xl bg-zinc-900/30">
      <blockquote className="text-lg text-zinc-300 italic mb-6">"{quote}"</blockquote>
      <div>
        <div className="font-semibold text-white">{author}</div>
        <div className="text-sm text-zinc-500">{role}</div>
      </div>
    </div>
  )
}

export default function WorkPage() {
  return (
    <Container className="max-w-5xl py-16">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <h1 className="text-4xl font-bold mb-6 text-white">Work With Me</h1>
        <p className="text-xl text-zinc-300 leading-relaxed">
          I help technical teams navigate AI adoption with security-first
          strategies, pragmatic frameworks, and transparent processes.
          No vendor pitches. No fluff. Just experienced guidance.
        </p>
      </div>

      {/* Service Packages */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-white">Services</h2>

        <div className="space-y-8">
          {/* Service 1: AI Security Assessment */}
          <ServiceCard
            title="AI Security Assessment"
            duration="2-4 weeks"
            description="Evaluate your AI systems for security risks before they reach production. I review architecture, data flow, access controls, and guardrails—then deliver a prioritized remediation roadmap."
            includes={[
              "Security architecture review (infrastructure, API, data flow)",
              "Threat modeling for AI-specific risks (prompt injection, data leakage, model extraction)",
              "Guardrail assessment (input validation, output filtering, rate limiting)",
              "Prioritized remediation roadmap with cost/effort estimates",
              "2 follow-up sessions (implementation support)"
            ]}
            bestFor="Teams evaluating AI pilots or preparing for production launch"
          />

          {/* Service 2: AI Strategy & ROI Analysis */}
          <ServiceCard
            title="AI Strategy & ROI Analysis"
            duration="3-5 weeks"
            description="Cut through vendor hype. I help you evaluate AI opportunities, calculate real ROI (not pilot metrics), and design implementation roadmaps that account for production realities."
            includes={[
              "Current state assessment (workflows, pain points, AI readiness)",
              "Use case evaluation (feasibility, cost, risk, ROI projection)",
              "Vendor/tool comparison (LLM APIs, self-hosted models, frameworks)",
              "Implementation roadmap (phased approach, resource requirements)",
              "Pilot design framework (how to test if it'll actually work)",
              "3 follow-up sessions (ongoing strategy refinement)"
            ]}
            bestFor="CTOs and IT directors evaluating AI investments"
          />

          {/* Service 3: Infrastructure Design & Advisory */}
          <ServiceCard
            title="Infrastructure Design & Advisory"
            duration="4-8 weeks"
            description="Design resilient, secure infrastructure for AI workloads or modernize existing systems. I bring 15+ years of infrastructure experience plus real-world patterns from FabLab (my home lab that runs enterprise patterns)."
            includes={[
              "Architecture design (compute, networking, storage, security)",
              "Technology selection (Proxmox vs VMware, Kubernetes vs Docker, cloud vs on-prem)",
              "Security hardening (IdP integration, zero trust, access control)",
              "Deployment roadmap (phased migration, rollback plans)",
              "Documentation & runbooks (handoff to your team)",
              "Ongoing advisory (monthly check-ins for 3 months)"
            ]}
            bestFor="Organizations modernizing infrastructure or scaling AI workloads"
          />
        </div>
      </div>

      {/* Pricing Philosophy */}
      <div className="mb-20 p-8 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-2xl font-bold text-white mb-4">Pricing Philosophy</h3>
        <p className="text-zinc-300 mb-4 text-lg">
          I charge based on value delivered, not hours logged. Project scope and pricing are defined upfront in a detailed proposal.
        </p>
        <p className="text-zinc-300">
          <strong className="text-white">Typical engagement</strong>: 3-5 weeks
          of focused work (strategy + implementation guidance).
        </p>
      </div>

      {/* Process */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-white">How We Work Together</h2>

        <div className="grid md:grid-cols-4 gap-6">
          <ProcessStep
            number="1"
            title="Initial Call"
            description="Free 60-minute discovery call to understand your challenge and determine fit."
          />
          <ProcessStep
            number="2"
            title="Proposal"
            description="I send a detailed proposal with scope, deliverables, timeline, and fixed pricing."
          />
          <ProcessStep
            number="3"
            title="Kick-off"
            description="We align on goals, review technical context, and establish communication rhythm."
          />
          <ProcessStep
            number="4"
            title="Execution"
            description="I deliver work in weekly increments with regular check-ins and transparent documentation."
          />
        </div>
      </div>

      {/* Social Proof */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-white">What Clients Say</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <Testimonial
            quote="Wally helped us identify critical security gaps in our LLM deployment that our internal team missed. His recommendations were practical, not just theoretical."
            author="Information Security Manager"
            role="FinTech Scale-up"
          />
          <Testimonial
            quote="The infrastructure design Wally delivered for our on-prem AI cluster saved us months of trial and error. It's solid, secure, and easy to manage."
            author="CTO"
            role="Healthcare Tech Co."
          />
        </div>

        <p className="mt-8 text-zinc-500 text-sm text-center italic">
          * Representative feedback from recent consulting engagements.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center p-12 bg-zinc-900 rounded-xl border border-zinc-800">
        <h2 className="text-3xl font-bold mb-4 text-white">Let's Talk</h2>
        <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
          Book a free 60-minute call to discuss your AI security, strategy,
          or infrastructure challenges. No obligation. No sales pitch.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a href="mailto:wally@goodfields.io?subject=Consulting Inquiry"
            className="px-6 py-3 bg-white text-zinc-950 rounded-lg font-semibold hover:bg-zinc-200 transition-colors">
            Email: wally@goodfields.io
          </a>
          <a href="https://calendly.com" className="px-6 py-3 border border-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition-colors">
            Schedule Call
          </a>
        </div>
      </div>
    </Container>
  )
}
