2025 Wasn’t the “Year of the Agent” – It Was the Year We Found the Edges

From the trenches with infra and ops teams who have to keep the lights on.

1. Remember “The Year of the Agent”?

At the end of 2024 and into early 2025, you couldn’t move in tech media without hitting a prediction that “2025 will be the Year of the Agent.”

VC theses, conference talks, and blog posts all converged: autonomous AI agents were going to transform knowledge work, orchestrate complex workflows, and quietly replace a big chunk of coordination and glue work in our organizations.

A year later, if you’re running infrastructure for a 200-person shop in a place like Manitoba, it probably doesn’t feel like that. You might have Copilot, a few pilots running, and some impressive demos—but very little you’d trust to run unattended at 3am.

My core hypothesis, backed by the research behind this article, is:

2025 wasn’t the Year of the Agent. It was the year we discovered what agents can’t do reliably yet—and quietly built the infrastructure that might make them work later.

And yes, the irony is not lost on me: this article itself was assembled with the help of multiple AI agents—search, summarization, comparison—stitched together by hand. The process worked, but it was brittle and deeply personal; I tweaked prompts, rewired tools, and patched failures on the fly. That’s the real state of the art.

2. Where Agents Actually Are (Not the Slideware Version)

When you look past vendor decks and into production surveys and incident reports, a very different picture emerges:

80% of companies say their AI agents have taken unintended actions—including accessing unauthorized systems, exposing sensitive data, or downloading sensitive content.

More than 80% of AI projects never make it to meaningful production, roughly twice the failure rate of traditional IT projects.

Even among teams with agents in production, 70% are rebuilding their AI stack every three months or faster—framework churn and breaking changes make stability hard.

96% of enterprises plan to expand agent use, but only about 1% report systems they’re comfortable letting make independent decisions.

That last point is the paradox of 2025: nearly everyone wants more agents; almost nobody trusts them.

This is normal in technology adoption. Every disruptive wave has a 3–4 year “trough of disillusionment” where we discover all the edge cases and failure modes the hype never mentioned. Cloud, containers, Kubernetes, microservices—all went through it. AI agents are right in that trough now.

3. The Terminology Retreat

One of the clearest signals that reality has bitten is the language shift over the last 18 months. We’ve quietly walked back the boldest words:

“Autonomous agents” → “Agentic workflows”

“Fully automated” → “Human-in-the-loop”

“Agent systems” → “AI copilots”

“Self-improving” → “Guided learning”

That’s not just marketing spin; it’s the industry subconsciously admitting what ops and infra people already know:

These systems are powerful, but they are not robust enough to be left alone.

We’re building assistive automation, not digital employees. At least, not yet.

4. Enterprise Reality vs. The Shiny New Stack

Copilot in the real world

At the start of 2025, Microsoft added “agent functionality” inside Copilot across Microsoft 365. On paper, it’s compelling: summarize meetings, draft emails, pull numbers from Excel, eventually orchestrate tasks.

In practice, what I hear—and experience—is more mixed:

Confusion about where data goes and how it’s stored.

Lots of “almost right” outputs that still require a human to verify.

Licensing and rollout complexity that outpaces the value for many mid-market orgs.

Scaffolding the tools and context for agents to generate quality output is difficult and requires significant technical expertise.

Copilot is agentic under the hood, but from an infra perspective it behaves more like a noisy junior assistant than a reliable operator.

The stack problem

One of my favorite stats from the research: 70% of teams running AI agents in production rebuild or significantly reconfigure their stack every three months or faster.

That matches my lived reality. My own “agent stack” is in constant flux:

New orchestration frameworks.

New observability tools.

New safety layers.

New model choices as pricing and quality shift.

Every “shiny new thing” promises to finally make agents robust and manageable. Every time, I have to choose between learning yet another framework… or finishing work that actually pays bills.

Startups and early-days platforms

Platforms like ATXP and others are getting real investment and shipping impressive capabilities around agent orchestration, evaluation, and observability. I’ve been hands-on with some of them.

They are good. But they’re also clearly early:

Opinionated in ways that don’t always match existing infra.

Strong demos, but thin runbooks for ugly enterprise realities.

Limited patterns for rollback, failure isolation, and governance.

Again: normal for year two of a technology wave—but not “plug it into production and sleep well” territory.

5. “Managing Agents” as the New Excel Skill (and Why That’s a Problem)

A useful analogy:

Every company has to have one or two “Excel wizards”—people who could bend spreadsheets into full applications. Those skills were unevenly distributed; most staff could do a VLOOKUP, but only a few understood the monster workbook that actually ran payroll reporting.

We’re in the same place with agents:

A small number of people can make agents do magic—multi-step workflows, tool orchestration, solid prompting, debugging.

Most people try a few times, get inconsistent results, and retreat to familiar tools.

The skill gap matters because current-gen agents are not “set and forget.” They require:

Continuous prompt and tool refinement.

Careful scoping and permissioning.

Monitoring, evaluation, and feedback loops.

And that’s before cost enters the picture.

On my own Claude $30/month plan, I routinely slam into rate limits as soon as I start running longer agentic workflows.  (research, planning, coding, and retrieval chained together).  In fact I had to add credits to my anthropic account just to finish the research for this post.  To keep things smooth, I need to move into higher-tier or Opus-based usage, which can get expensive fast if you’re running agents all day across a team.  Switching to cheaper models like haiku for easier tasks helps but that then proves the point, it takes a human to guide it. 

For most individuals and SMBs, that pushes “serious agent use” back into specialist hands—the AI equivalent of the Excel wizard—rather than democratizing it.

6. Where Agents Do Shine: Infrastructure & the “Fab Lab” Use Case

One place I’ve found agents genuinely transformative is infrastructure work, not app UX.

Why? Because infra has two great properties for LLMs:

Strict syntax and structure. Config files, router ACLs, firewall rules, Kubernetes manifests, Docker Compose, YAML—all of it has to be exactly right.

Clear feedback loops. Either the container comes up, the port opens, the service responds… or it doesn’t.

Anyone who’s fought with YAML knows that a single misplaced space or { can break an entire pipeline. This is precisely the kind of pattern-heavy, highly structured task LLMs are surprisingly good at.

In my own “FabLab” at home—a personal datacenter I am building out with opensource infrastructure to prove the feasibility of this.  With my agent by my side I was able to.

Described the financial tooling I wanted (Firefly III with a Postgres backend, proper backups, and reverse proxy).

Asked an infra-focused agent to:

Design a Docker-based architecture.

Generate the Docker Compose, .env files.

Document the whole setup, in a project folder using git to monitor change. 

With a bit of review and small tweaks, I had the system up and ready for real data inside an hour. The time savings weren’t in “creative insight”; they were in removing 200 lines of brittle, repetitive YAML work and documenting it as I went.

That’s the key pattern I see for infra and ops:

Treat agents as syntax accelerators and documentation engines for your environment, not as fully trusted, on-call reliability engineers you hand the pager to.

Used this way, they help chip away at the IT debt that accumulates as systems sprawl—without pretending they can own your incident queue.

7. Security & Privacy: Bob, PAI, and Nation-State Abuse

I spend a lot of time thinking about security and AI. My own Personal AI Infrastructure (I call it Bob) ** “Bob,”** is built on top of Claude Code and Daniel Miessler’s PAI (Personal AI) repository. Bob helps with:

Financial tracking and forecasting.

Drafting proposals and quotes.

Managing marketing content and basic ops tasks.

I wrote about this in more detail in “Meet Bob: 48 hours with my AI business partner” on wallykroeker.com, but the important point is this:

Bob is genuinely useful because he has deep context about my life and business.

That’s also what makes him dangerous if mishandled.

The broader data bears out the risk side:

69% of organizations say they’ve deployed AI agents, but only 21% have adequate visibility and controls to secure them—a 79% blind spot.

In one 2025 survey, nearly 40% of companies reported agents accessing systems they weren’t supposed to, and about a third saw agents touch sensitive data inappropriately.

And the threat landscape is evolving fast. In November, Anthropic disclosed that a suspected Chinese state-sponsored group used Claude Code to automate a large espionage campaign—roughly 80–90% of the technical actions were carried out by the AI, with humans selecting targets and approving big decisions.

Whatever you think about the framing, it’s a clear signal: attackers are experimenting with agentic tooling just as aggressively as defenders.

For infra and security teams, nothing about this is mystical. The controls we need are the same ones we’ve always needed:

Least privilege for tools and agents. If an agent doesn’t need shell access, don’t give it shell access.

Segmentation and blast-radius control. Run agent-connected services in constrained environments, with clear egress controls.

Auditability. Log every tool call and decision as if a junior admin were doing it.

Human approval for high-risk actions. Treat “human-in-the-loop” not as a marketing phrase, but as a control requirement.

And for highly sensitive data (PHI, law enforcement data, deeply personal context), it’s time to take local and open-weights models seriously—accepting the operational burden in exchange for tighter data control.

8. So… Was 2025 the Year of the Agent or Not?

There was real progress this year, especially in Q4:

Anthropic shipped a Claude Agent SDK, moving from “cobble your own” to a more structured agent framework.

They hit $1B+ in revenue with Claude Code, proving there’s a real business around agent-assisted development.

Snowflake announced a $200M partnership focused explicitly on agentic AI, and Accenture committed to multi-year agent deployments for Fortune 500 clients.

Microsoft expanded deep integration of Claude into Copilot and GitHub.

If your definition of “Year of the Agent” is “the year the infrastructure finally got serious”, then 2025 arguably qualifies.

But that’s not what most of the early-2025 hype promised. Those headlines were about:

Autonomous agents transforming day-to-day work.

Fully automated workflows replacing coordination roles.

Agents reliably handling complex, multi-step tasks without supervision.

On that definition, the research is clear:

Agents remain experimental, heavily scaffolded systems that require close supervision.

Most organizations are still stuck in pilot purgatory.

The people getting value are those treating agents as constrained assistants with strong guardrails, not as autonomous coworkers.

As Andrej Karpathy has pointed out, LLMs are astonishing but probabilistic; they’re sometimes wrong and genuinely hard to compose into reliable systems. Building production systems around them is as hard as building early distributed systems—this is going to take years, not quarters.

Cleanlab’s CEO, Curtis Northcutt, has said publicly that agentic AI probably won’t really “gel” until around 2027, once we have better tooling, patterns, and operational experience.

That aligns almost perfectly with the historical 6–10 year maturation cycle we saw with cloud, containers, and microservices.

9. If You’re Frustrated, You’re Probably Doing It Right

One of my favorite lines from the research is:

“If you’re frustrated with AI agents right now, that means you’re doing the real work.”

The “real work” here is:

Instrumenting agents like any other distributed system.

Designing for failure modes, not happy paths.

Narrowing scopes until workflows are testable and debuggable.

Writing runbooks and roll-back plans instead of just demos.

Documenting what doesn’t work, not just what plays well on stage.

The hype cycle’s trough isn’t a failure; it’s where we separate technology that works from technology that merely demos well. The practitioners who stay in the game now—infra engineers, sysadmins, SREs—are the ones who will define the patterns everyone else uses when this finally stabilizes.

10. Call to Action: Join the Greybeard AI Collective

This is exactly why I started the Greybeard AI Collective.

It’s not a marketing play—it’s a place for:

Infra and ops people who’ve lived through previous hype cycles.

Folks actually wiring agents into real systems, not just building demos.

People willing to share failures, ugly hacks, and half-working patterns so the rest of us don’t repeat them.

If you’re:

The person everyone asks about Copilot,

The one maintaining the homelab that quietly outperforms half your vendor stack, or

The sysadmin in a mid-market Manitoba business trying to balance “play with the new thing” against “please don’t break payroll”…

…then you’re exactly who this is for.

Connect with me, drop a comment, or reach out directly if you want to compare notes. 2025 wasn’t the Year of the Agent.

But if we do the boring, disciplined work now, we might look back in 2028 and realize this was the year the right people started taking agents seriously.

