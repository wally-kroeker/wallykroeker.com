# 2025 Wasn't the "Year of the Agent" – It Was the Year We Found the Edges

*From the trenches with infra and ops folks who've been here before.*

---

## The Origin Story

In November, I met up for beers with two colleagues I've known for years. Both are veteran IT infrastructure people, the kind who've been through enough hype cycles to know the difference between demos and 3am pages.

I talked about Bob, my personal AI agent I am using and building.  It is a setup built on Claude Code and a github project called Personal AI Infrastructure. They were curious about the architecture, how I'd structured the context, what actually worked versus what was still brittle.

The conversation drifted to the old Manitoba VMUG. The VMware User Group that used to bring infrastructure people together to share what actually worked in production. No vendor pitches, no slideware, just practitioners showing real implementations and honest war stories.

"We should have a place like that to share." one of them said.

I went home and registered the domain: **Greybeard AI Collective**.

Not "greybeard" as in literal gray hair (though plenty of us have that). **Greybeard as in: you've been in the trenches long enough to see the deeper patterns in systems.** You know what it looks like when hype meets operational reality. You've deployed enough "revolutionary" technologies to recognize when something's ready versus when it's still baking.

This post is why that conversation matters—and why the second meeting needs to happen.

---

## Remember "The Year of the Agent"?

At the end of 2024 and into early 2025, you couldn't read tech news without running accross a headline similar to this. **"2025 will be the Year of the Agent."**

VC theses, conference talks, and blog posts all converged: autonomous AI agents were going to transform knowledge work, orchestrate complex workflows, and quietly replace a big chunk of coordination and glue work in our organizations.

A year later, if you're running infrastructure for a mid-market company—especially outside Silicon Valley—it probably doesn't feel like that happened. You might have Copilot, a few pilots running, and some impressive demos. But very little you'd trust to run unattended at 3am.

**My hypothesis, backed by the research behind this article:**

> 2025 wasn't the Year of the Agent. It was the year we discovered what agents can't do reliably yet—and quietly built the infrastructure that might make them work later.

And yes, the irony is not lost on me: this article itself was assembled with the help of multiple AI agents—search, summarization, comparison—stitched together by hand. The process worked, but it was **a brittle and deeply personal workflow** I tweaked prompts, rewired tools, and patched failures on the fly.

At the end of 2025 I think people have been able to get agents to do amazing things, but it is still all very custom.

---

## Where Agents Actually Are (Production Reality)

When you look past vendor decks and into production surveys and incident reports, a very different picture emerges:

### The Numbers Don't Lie

- **80% of companies say their AI agents have taken unintended actions**—including accessing unauthorized systems, exposing sensitive data, or downloading sensitive content inappropriately. *(SailPoint 2025 survey of 100+ security leaders)*

- **95% of AI agent projects failed to reach meaningful production** in 2025. MIT surveyed 1,837 teams; only 95 were actually running agents in production. *(MIT 2025 study)*

- **70% of teams with agents in production rebuild their AI stack every three months or faster**—framework churn and breaking changes make stability nearly impossible. *(Cleanlab AI Production Survey 2025)*

- **96% of enterprises plan to expand agent use, but only ~1% report systems they're comfortable letting make independent decisions.** *(McKinsey 2025 survey)*

That last point is the **paradox of 2025**: nearly everyone wants more agents; almost nobody trusts them.

This is normal in technology adoption. Every disruptive wave has a **3–4 year "trough of disillusionment"** where we discover all the edge cases and failure modes the hype never mentioned.

Cloud went through it (2008-2011). Containers went through it (2016-2018). Kubernetes went through it (2017-2019). Microservices went through it (2017-2019).

AI agents are right in that trough now.

---

## The Terminology Retreat

One of the clearest signals that reality has bitten is the **language shift** over the last 18 months.  I spend a lot of time keeping up on AI news and I have seen the words being used to describe aent functionality walked back:

- **"Autonomous agents"** → "Agentic workflows"
- **"Fully automated"** → "Human-in-the-loop"
- **"Agent systems"** → "AI copilots"
- **"Self-improving"** → "Guided learning"

That's not just marketing spin—it's the industry subconsciously admitting what ops and infra people already know:

> **These systems are powerful, but they are not robust enough to be left alone.**

We're building assistive automation, not digital employees. At least, not yet.

---

## Enterprise Reality: Copilot, Stack Churn, and the Excel Wizard Problem

### Copilot in the Real World

At the start of 2025, Microsoft added "agent functionality" inside Copilot across Microsoft 365. On paper, it's compelling: summarize meetings, draft emails, pull numbers from Excel, eventually orchestrate tasks.

In practice, what I hear—and experience—is more mixed:

- Confusion about where data goes and how it's stored
- Lots of "almost right" outputs that still require human verification
- Licensing and rollout complexity that outpaces the value for many mid-market orgs
- Scaffolding the tools and context for agents to generate quality output **requires significant technical expertise**

Copilot is agentic under the hood, but from an infra perspective it behaves more like **a noisy junior assistant** than a reliable operator.

### The Stack Problem

One of my favorite stats from the research: **70% of teams running AI agents in production rebuild or significantly reconfigure their stack every three months or faster.**

That matches my lived reality. My own "agent stack" is in constant flux:

- New orchestration frameworks
- New observability tools
- New safety layers
- New model choices as pricing and quality shift

Every "shiny new thing" promises to finally make agents robust and manageable. Every time, I have to choose between learning yet another framework… or finishing work that actually pays bills.

### "Managing Agents" as the New Excel Skill (and Why That's a Problem)

A useful analogy:

Every company has one or two **"Excel wizards"**—people who could bend spreadsheets into full applications. Those skills were unevenly distributed; most staff could do a VLOOKUP, but only a few understood the monster workbook that actually ran payroll reporting.

**We're in the same place with agents:**

- A small number of people can make agents do magic—multi-step workflows, tool orchestration, solid prompting, debugging
- Most people try a few times, get inconsistent results, and retreat to familiar tools

The skill gap matters because **current-gen agents are not "set and forget."** They require:

- Continuous prompt and tool refinement
- Careful scoping and permissioning
- Monitoring, evaluation, and feedback loops

And that's before cost enters the picture.

On my own Claude $30/month plan, I routinely slam into rate limits as soon as I start running longer agentic workflows (research, planning, coding, and retrieval chained together). In fact, **I had to add credits to my Anthropic account just to finish the research for this post.** To keep things smooth, I need to move into higher-tier or Opus-based usage, which can get expensive fast if you're running agents all day across a team.

For most individuals and SMBs, that pushes "serious agent use" back into **specialist hands**—the AI equivalent of the Excel wizard—rather than democratizing it.

---

## Where Agents Do Shine: Infrastructure Work

One place I've found agents genuinely transformative is **infrastructure work**

Why? Because infra has two great properties for LLMs:

1. **Strict syntax and structure.** Config files, router ACLs, firewall rules, Kubernetes manifests, Docker Compose, Bicep and Ansible, YAML based and all of it has to be exactly right.

2. **Clear feedback loops.**  The port opens, the service responds… or it doesn't.

Anyone who's fought with YAML knows that a single misplaced space or brace can break an entire pipeline. This is precisely the kind of **pattern-heavy, highly structured task** LLMs are surprisingly good at.

### The FabLab Example

In my own "FabLab" at home—a personal datacenter I'm building out with open-source infrastructure—I've been testing this. With my agent by my side, I was able to:

- Describe the financial tooling I wanted (Firefly III with a Postgres backend, and proper backups. )
- Ask an infra-focused agent to:
  - Design a Docker-based architecture
  - Generate the Docker Compose and .env files
  - Document the whole setup in a project folder using git to monitor changes

With a bit of review and small tweaks, I had the system up and ready for real data **inside an hour.**

The time savings weren't in "creative insight"—they were in **removing 200 lines of brittle, repetitive YAML work** and documenting it as I went.

**That's the key pattern I see for infra and ops:**

> Treat agents as **syntax accelerators and documentation engines** for your environment, not as fully trusted, on-call reliability engineers you hand the pager to.

Used this way, they help chip away at the IT debt that accumulates as systems sprawl—without pretending they can own your incident queue.

---

## Security & Privacy: Bob, PAI, and Nation-State Threats

I spend a lot of time thinking about security and AI. My own **Personal AI Infrastructure** (I call it Bob) is built on top of Claude Code and Daniel Miessler's PAI repository. Bob helps with:

- Financial tracking and forecasting
- Drafting proposals and quotes
- Managing marketing content and basic ops tasks

I wrote about this in more detail in ["Meet Bob: 48 hours with my AI business partner"](https://wallykroeker.com/blog/meet-bob-48-hours-with-my-ai-business-partner) on my site, but the important point is this:

> **Bob is genuinely useful because he has deep context about my life and business.**
> **That's also what makes him dangerous if mishandled.**

### The Broader Security Picture

The data bears out the risk side:

- **69% of organizations say they've deployed AI agents, but only 21% have adequate visibility and controls to secure them**—a 79% blind spot. *(Akto Security Survey 2025)*

- **39% of companies reported agents accessing systems they weren't supposed to**, and about a third saw agents touch sensitive data inappropriately. (sniker athe the double antandra) *(Akto Security Survey 2025)*

- **In November 2025, Anthropic disclosed that a suspected Chinese state-sponsored group used Claude Code to automate a large espionage campaign**—roughly 80–90% of the technical actions were carried out by the AI, with humans selecting targets and approving big decisions.

Whatever you think about the framing, it's a clear signal: **attackers are experimenting with agentic tooling just as aggressively as defenders.**

### The Controls We Need

For infra and security teams, nothing about this is mystical. The controls we need are the same ones we've always needed:

1. **Least privilege for tools and agents.** If an agent doesn't need shell access, don't give it shell access.

2. **Segmentation and blast-radius control.** Run agent-connected services in constrained environments, with clear egress controls.

3. **Auditability.** Log every tool call and decision as if a junior admin were doing it.

4. **Human approval for high-risk actions.** Treat "human-in-the-loop" not as a marketing phrase, but as a **control requirement.**

And for highly sensitive data (PII,PHI, law enforcement data, deeply personal context), **it's time to take local and open-weights models seriously**—accepting the operational burden in exchange for tighter data control.  We can run powerful AI models 

---

## So… Was 2025 the Year of the Agent or Not?

### There Was Real Progress (Q4 2025)

To be fair, there was real infrastructure progress this year, especially in Q4:

- **Anthropic shipped the Claude Agent SDK** (September 29, 2025), moving from "cobble your own" to a more structured agent framework
- **Claude Code hit $1B+ in revenue** (December 3, 2025), proving there's a real business around agent-assisted development
- **Snowflake announced a $200M partnership** (December 3, 2025) focused explicitly on agentic AI
- **Accenture committed to multi-year agent deployments** (December 9, 2025) for Fortune 500 clients
- **Microsoft expanded deep integration of Claude into Copilot and GitHub** (November 18, 2025)

If your definition of **"Year of the Agent"** is **"the year the infrastructure finally got serious"**, then 2025 arguably qualifies.

### But That's Not What the Hype Promised

Those early-2025 headlines were about:

- Autonomous agents transforming day-to-day work
- Fully automated workflows replacing coordination roles
- Agents reliably handling complex, multi-step tasks without supervision

**On that definition, the research is clear:**

> Agents remain experimental, heavily scaffolded systems that require close supervision. Most organizations are still stuck in pilot purgatory. The people getting value are those treating agents as **constrained assistants with strong guardrails**, not as autonomous coworkers.

As **Andrej Karpathy** has pointed out, LLMs are astonishing but probabilistic; they're sometimes wrong and genuinely hard to compose into reliable systems. Building production systems around them is as hard as building early distributed systems—**this is going to take years, not quarters.**

**Curtis Northcutt** (CEO of Cleanlab) has said publicly that agentic AI probably won't really "gel" until around **2027**, once we have better tooling, patterns, and operational experience.

That aligns almost perfectly with the **historical 6–10 year maturation cycle** we saw with cloud, containers, and microservices.

---

## If You're Frustrated, You're Probably Doing It Right

One of my favorite insights from the research is:

> **"If you're frustrated with AI agents right now, that means you're doing the real work."**

The "real work" here is:

- Instrumenting agents like any other distributed system
- Designing for failure modes, not happy paths
- Narrowing scopes until workflows are testable and debuggable
- Writing runbooks and roll-back plans instead of just demos
- **Documenting what doesn't work**, not just what plays well on stage

The hype cycle's trough isn't a failure—**it's where we separate technology that works from technology that merely demos well.**

The practitioners who stay in the game now—infra engineers, sysadmins, SREs—are the ones who will **define the patterns** everyone else uses when this finally stabilizes.

---

## The Greybeard AI Collective: Why This Matters

This is exactly why that conversation with my colegues over beer stuck with me.

We need a place for:

- **Infra and ops people who've lived through previous hype cycles**
- Folks actually wiring agents into real systems, not just building demos
- People willing to share failures, ugly hacks, and half-working patterns so the rest of us don't repeat them

**Greybeard doesn't mean you have gray hair** (though if you check my profile picuture I definatly do.). It means:

> You've been in the trenches long enough to see the deeper patterns in systems. You know what it looks like when hype meets operational reality.

If you're feeling overwhelmed by the pace of AI development, or worried you'll be left behind if you don't keep up—**you're not alone.** That conversation with my colegues confirmed it. Lots of experienced people are in that same place.

Maybe you've played with Copilot at work, or spun up your own AI experiments at home. Maybe you're the person everyone asks "what's the deal with this AI stuff?" because you're the one who actually understands infrastructure.

**That's who this is for.**

Not vendor pitches. Not slideware. Not "thought leaders" selling courses.

Just practitioners sharing what actually works—and being honest about what doesn't.

---

## Join the Second Meeting

If you're:

- The person everyone asks about Copilot
- The one maintaining the homelab that quietly outperforms half your vendor stack
- The sysadmin trying to balance "play with the new thing" against "please don't break payroll"

…then you're exactly who this is for.

**Connect with me:**
- Comment below
- Find me at [wallykroeker.com](https://wallykroeker.com)
- Email: wally@goodfields.io

2025 wasn't the Year of the Agent.

But if we do the boring, disciplined work now—**documenting failures, sharing patterns, building guardrails**—we might look back in 2028 and realize this was the year the right people started taking agents seriously.

---

## Sources

*(To be added from research document - key citations)*

1. **SailPoint 2025 Survey** - 80% unintended actions
2. **MIT 2025 Study** - 95% project failure rate (1,837 respondents, 95 in production)
3. **Cleanlab AI Production Survey 2025** - 70% rebuild stack every 3 months ([cleanlab.ai](https://cleanlab.ai/ai-agents-in-production-2025/))
4. **Akto Security Survey 2025** - 69% deployed, 21% visibility, 39% unauthorized access ([akto.io](https://www.akto.io/blog/state-of-agentic-ai-security-2025))
5. **Anthropic Official News** - Claude Agent SDK (Sept 29), $1B revenue (Dec 3), Snowflake $200M (Dec 3), Accenture partnership (Dec 9), Microsoft integration (Nov 18)

*[Full bibliography and research methodology available on request]*

---

**About the Author**

Wally Kroeker is a security and infrastructure practitioner with 20+ years experience. He runs [GoodFields Consulting](https://goodfields.io), focusing on security architecture and pragmatic AI implementation. He writes about technology, infrastructure, and building humane systems at [wallykroeker.com](https://wallykroeker.com).
