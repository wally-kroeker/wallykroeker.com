---
title: "The Digital Blacksmith"
description: "How AI-assisted practitioners are becoming the problem-solving partners their communities need"
date: 2026-01-27
status: "published"
reviewed: true
sensitivity: "public"
tags:
  - ai
  - infrastructure
  - pai
  - consulting
  - graybeard-collective
category: "AI Infrastructure"
featured: true
---

*How AI-assisted practitioners are becoming the problem-solving partners their communities need*

---

## The Elm Creek Blacksmith

My dad grew up in the 1940s on a farm near Elm Creek, Manitoba - a community of about 2,000 people servicing the surrounding farms. I remember him telling me about visiting the blacksmith's shop as a boy. He'd stand there watching the machinery - a gasoline motor driving pulleys along the ceiling, powering a lathe and other equipment - fascinated by how this one person could listen to a farmer explain a problem and then just *make* the thing that solved it.

The blacksmith wasn't just the person who put shoes on horses. He was the problem solver. Farmers would show up at his shop with a broken cultivator tooth, a worn-out plow blade, or sometimes just an idea sketched on the back of an envelope. "I need something that can do *this*," they'd say, gesturing at the problem they couldn't quite articulate.

And the blacksmith would listen. He'd turn the broken piece over in his hands. He'd ask questions about the soil, the crop, the way the implement was being used. Then he'd fire up the forge, select his materials, and create - not a mass-produced replacement, but something custom-fitted to that farmer's specific situation.

The blacksmith wasn't following templates. He was combining deep knowledge of materials, mastery of craft, and a collection of existing tools to forge solutions that no catalog could provide. He was a *problem-solving partner* who happened to work with iron and fire.

I've been thinking about that blacksmith a lot lately. Because AI coding has let me become a digital blacksmith.

---

## The Forge Has Changed, The Role Hasn't

What made the blacksmith special wasn't just that he could shape metal. Lots of people could swing a hammer. The blacksmith's power came from the combination:

**Materials expertise.** He understood iron, steel, the behavior of metal under heat and stress. He knew what would hold, what would flex, what would shatter.

**Craft mastery.** Thousands of hours at the forge and lathe had trained his hands and eyes. He could read the color of heated metal like others read words, and knew which tool on the line shaft to use for each job.

**Existing tooling.** His shop held anvils, tongs, forms, and fixtures accumulated over years. Each tool multiplied what his hands could accomplish.

**Context understanding.** He knew the farms, the farmers, the local soil conditions. He didn't just make tools - he made tools that fit *this place* and *these people*.

**Speed of forging.** When a farmer needed something, the blacksmith could deliver it in hours or days - not weeks waiting for a distant catalog order.

Now imagine transposing this to 2026.

The forge is Claude Code. The raw materials are GitHub repos, APIs, scripts, and data sources - the building blocks of digital capability. The craft is systems thinking, problem decomposition, and understanding what outputs actually serve people. The existing tooling is the accumulated knowledge of infrastructure, secure networks, frameworks, and integration patterns.

And the role? The role is exactly the same. People show up with problems they can't quite articulate. They need someone who can listen, understand the real issue, and forge a custom solution that no off-the-shelf product provides.

The digital blacksmith doesn't just use tools. They make them. And in the AI + Claude Code era, the speed of forging has become fast enough that this role is finally viable again.

---

## A Forge Session

Let me tell you about a forge session from last week.

A friend who owns a small business called me in - five Windows PCs, a new office building, persistent complaints about network performance. Their SaaS applications (SOS Inventory for operations, Spexbuilder for their product configuration) were running slowly. Intermittent hangs, frustrating timeouts. The business owner suspected the network cabling in their new building was faulty.

I showed up with 20+ years of IT experience. I know networks. I can run ping and traceroute in my sleep. I can identify gateway latency, trace packet paths, spot obvious bottlenecks.

Here's what I could have done with traditional expertise alone:

Fire up a terminal. Ping the gateway. Run traceroute to their SaaS providers. Watch the numbers for an hour. Maybe run a packet capture, stare at Wireshark for a while. At the end, tell them: "Looks fine to me. The network seems stable."

And the client would nod politely. And remain skeptical. Because their lived experience says something is wrong. And "looks fine to me" from a consultant doesn't erase the freezing screens they deal with every day.

Worse: the problems were intermittent. They might not happen during the few hours I was on-site. And I couldn't camp out in their office for a week hoping to catch one.

This is where the forge comes in.

I had my Linux laptop, but no expensive network testing tools - no Fluke, no protocol analyzer. What I did have was Claude Code. So instead of starting with manual troubleshooting, I started by creating a project folder and having Claude nmap the network and classify all the equipment. I gathered the SaaS provider URLs. And then I realized: I could forge the tools I needed on the fly, customized to this exact situation.

**Phase one: On-site validation.**

I built PowerShell scripts that could run on each Windows workstation. But these weren't just ping tests - they tested the gateway, my Linux laptop, *and* made TCP connections to actually exercise the application layer. If there were faults in the network cabling, these tests would find them.

To deploy the scripts, I didn't need USB sticks. I spun up a quick Python web server on my laptop, and the Windows machines just connected to its IP address. The web interface had a button to execute the diagnostics, display the results, and save them back to a log on my server.

Within a couple hours, I had validated that the cabling was solid. Every workstation showed clean connectivity - no packet loss, no latency spikes, application-layer connections completing normally.

But that didn't explain the intermittent slowdowns. Which meant the problem was elsewhere.

**Phase two: Long-term monitoring.**

They had an old Windows 10 PC running as a file server in the back. Perfect. I forged a PowerShell-based monitoring server specifically so it could run on their existing hardware - no need to leave my laptop behind.

The monitoring server ran continuously for a week, testing connections to their specific SaaS applications every 30 seconds: SOS Inventory, Spexbuilder, the exact services they were complaining about. The web UI let staff click a button whenever they experienced a slowdown - "I just saw it freeze" - timestamped and correlated with the network data.

Seven days later, I came back.

The monitoring had collected 19,425 data points. Not my qualitative assessment of an hour's observation - *19,425 objective measurements* of exactly what their network was doing.

And the analysis told a clear story:

**Network performance: Perfect.** 0% packet loss. Stable latency. The cabling was fine.

**SOS Inventory: Server-side slowdowns.** The SaaS provider's infrastructure was occasionally lagging - visible in the connection times, unrelated to local network health.

**Spexbuilder: Mysterious timeout spikes.** 19-21 second delays appearing regularly - almost certainly an application or server issue, not network.

I generated a natural language report the business owner could actually read. No jargon, no packet dumps - just clear explanations of what the data showed.

The client had what they really needed: *proof*. Evidence they could show to their SaaS vendors. Objective data that exonerated their network cabling. Confidence that the problem wasn't theirs to fix.

And they kept the tools. Next time something seems slow, they can run their own diagnostics. They don't need to call me - they have the capability themselves.

This is what the blacksmith does. Not just solve the problem - *forge a tool that solves it, and leave that tool in the client's hands.*

---

## Why Toolmaking Beats Manual Expertise

Let me be precise about what happened on that engagement, because the advantages of forging tools over applying expertise manually are specific and concrete.

**Scale.** I ran 19,425 tests over seven days. No human can do that manually. My expertise was amplified by scale that flesh-and-blood attention cannot achieve.

**Continuity.** The tools ran while I slept, while I worked on other projects, while I lived my life. Unattended operation broke the constraint that I personally had to be present for every observation.

**Objectivity.** "Trust my expertise" is a request for faith. "Here's 19,425 data points" is evidence. In client conversations, data beats qualitative assessment every time. It's not about doubting expertise - it's about providing proof that expertise can stand behind.

**Specificity.** Generic network tests check generic endpoints. My forged tools tested *their exact context* - their SaaS providers, their usage patterns, their specific concerns. Custom fit, not off-the-rack.

**Sovereignty.** When I left, the client didn't just have a diagnosis. They had reusable tools. They can run future diagnostics themselves. I transferred capability, not just conclusions. That's empowerment, not dependency.

**Speed.** And here's the kicker - I built all of this in hours, not weeks. The AI-assisted forge makes custom toolmaking fast enough to be practical for one-off client engagements. This service model wasn't viable before. It is now.

None of this replaces expertise. I still needed 20 years of IT knowledge to know *what* to test, *how* to interpret results, *what* mattered. The tools amplified my expertise. They didn't substitute for it.

That's the blacksmith way. The forge doesn't replace the smith's knowledge. It multiplies what that knowledge can accomplish.

---

## The Craft of Good Toolmaking

Forging isn't just writing code. There's craft here - choices that separate useful tools from digital junk.

**Problem decomposition.** On that project, I had to understand the *layers* - network connectivity, DNS resolution, gateway latency, SaaS application response times, client-side rendering. Each layer needs different tests. Understanding what to isolate is expertise; the tools just automate the testing.

**Deployment constraints.** The business runs Windows workstations. My monitoring server had to run on their old Windows 10 file server, execute unattended for days, survive reboots and user interference. Toolmaking for the real world means designing for actual constraints.

**Output design.** 19,425 data points are useless to a business owner. The real craft is in the analysis pipeline that transforms raw data into actionable insight. CSV files for archives, natural language summaries for humans. Designing outputs that serve the person who receives them - that's where empathy meets engineering.

**Modularity.** I used Python on my laptop for initial deployment, then built a PowerShell monitoring server for their Windows environment. Each piece designed for its context, each piece composable. Good tools evolve. Monolithic solutions calcify.

**Ethics.** This is the one that doesn't show up in technical discussions, but it matters most. When you forge tools, you're making choices about power.

A monitoring tool can be surveillance - watching workers, creating records that become weapons. Or it can be diagnostic - understanding systems, empowering owners.

The tools I built serve the client, not me. They're transparent about what they collect. They transfer capability instead of creating dependency. They leave when I leave - no hidden backdoors, no ongoing data extraction.

Toolmaking is not morally neutral. The blacksmith chooses what to forge.

---

## The Deeper Question: Forging for What?

Two blacksmiths can work with the same materials and make very different things.

One forges chains. Another forges plowshares.

In the AI + cloud-code era, this choice is present in every tool we create. And it's easy to miss, because we're focused on the technical challenge, not the ethical implications.

**Two kinds of blacksmiths:**

The authority-based smith says: "Trust my expertise. I'll handle it. You don't need to understand."

This creates dependency. The client needs the consultant for every future problem. The expertise stays locked inside the expert.

The evidence-based smith says: "Here's the data. Here's what I see. Here's how you can see it too."

This transfers agency. The client gains capability. The expertise propagates outward.

Both smiths solve problems. But they leave different things behind.

**Two kinds of tools:**

Extraction tools watch, collect, and report to distant owners. They treat users as resources to be monitored. They concentrate power.

Empowerment tools enable, illuminate, and leave capability in users' hands. They treat people as agents who deserve to understand their own systems. They distribute power.

Those monitoring tools could have been surveillance. I could have built something that phones home to me, that gives me visibility into their network forever, that creates dependency for ongoing "analysis."

Instead, they're diagnostic. They run locally. The data stays with the client. I walk away and the capability remains.

This isn't about being a saint. It's about recognizing that the tools we forge have values embedded in them. Those values matter. Choose them deliberately.

---

## The Speed of the New Forge

Here's what's changed.

A decade ago, custom toolmaking for a small five-PC business engagement would have been absurd. The development time would have exceeded the project budget. The expertise required to build robust monitoring scripts, deploy them cross-platform, create analysis pipelines - that was a software development project, not a consulting engagement.

So we made do with manual expertise. We showed up, looked around, made assessments based on limited observation, and moved on. Custom tooling was reserved for enterprise clients with enterprise budgets.

The AI + cloud-code forge changes this equation.

Claude Code doesn't write perfect code. But it dramatically accelerates the path from "I need a tool that does X" to "I have a tool that does X." On that project, what would have taken three days of custom scripting in 2015 took six hours. What would have been prohibitively expensive becomes practical.

This isn't about replacing expertise with AI. It's about practitioners gaining a forge that makes custom toolmaking fast enough for everyday problem-solving.

I should be honest about one thing: this works because of twenty years of accumulated pattern-recognition. I knew what to test, what mattered, what to ignore. A newcomer using the same tools might build monitoring scripts that miss the actual problem entirely. The forge amplifies judgment - it doesn't replace it.

The Elm Creek blacksmith wasn't competing with factories that mass-produced tools. He was providing something factories couldn't: custom solutions for specific contexts, available immediately, fitted to local needs.

The modern digital blacksmith isn't competing with software companies that build enterprise products. We're providing something products can't: custom solutions for specific problems, available in hours, fitted to this client's exact situation.

The forge has changed. The role is the same. The speed is finally right.

---

## Becoming a Blacksmith

Maybe you've read this far and something resonates.

Maybe you've felt the tension between your expertise and its limits. You know the answer, but you can't prove it. You could solve the problem, if only you could be in ten places at once. You leave engagements knowing you helped, but wishing you could leave more behind.

The blacksmith path isn't about abandoning expertise. It's about extending it.

Here's how to start:

**Find one situation** where custom tools would deliver better outcomes than manual work alone. Not hypothetically - a real situation you're facing or have faced.

Maybe it's monitoring that needs to run longer than you can stay. Maybe it's analysis that would be tedious manually but trivial for code. Maybe it's a data transformation that could be done once, right, instead of repeatedly, approximately.

**Forge that tool.** Use Claude Code, use Cursor, use whatever AI-assisted development environment you prefer. You'll be slower at first than doing it manually - that's fine. You're learning the forge.

**Test it.** Not in isolation, but on the real problem. See where it breaks, where it falls short, where it needs refinement.

**Harden it.** Improve based on what you learned. Make it robust enough to run unattended, to handle edge cases, to fail gracefully.

**Hand it off.** This is the most important step. Don't just solve the problem - leave the tool behind. Transfer capability. Create sovereignty.

Then do it again. With a different problem. With different tools. Each time, your forge gets richer - more patterns, more reusable pieces, more instincts about what to build.

---

## The Inheritance

My dad's memories of the Elm Creek blacksmith aren't really about iron and fire. They're about a person who showed up for his community. Who listened to problems. Who used his skills and his tools to create solutions that served his neighbors.

That blacksmith is long gone. The farms have consolidated. The horses don't need shoeing anymore.

But the role endures. Communities still need problem-solving partners. People still show up with challenges they can't quite articulate. There's still a need for someone who can listen, understand, and forge custom solutions.

The materials have changed. The skills have evolved. The forge is digital now.

But when a small business calls with network problems they can't diagnose, and I show up with AI-assisted development tools and leave behind monitoring scripts they can run themselves - I'm doing the same work.

You don't become a blacksmith by replacing expertise with AI. You become a blacksmith by recognizing when forging tools multiplies expertise into outcomes manual work can't reach.

The forge is hot. The iron is ready. What will you make?

---

## Join the Collective

If this resonates, I'm building a community of practitioners who think this way - the [GrayBeard AI Collective](https://discord.gg/Skn98TXg).

IT veterans sharing what actually works, not vendor pitches or courses. We meet monthly to show what we're forging.

**First meetup: Tonight, January 27, 2026 at 7:00 PM Central on Discord.**

Join us: [discord.gg/Skn98TXg](https://discord.gg/Skn98TXg)

---

*Wally Kroeker builds things at the intersection of security, infrastructure, and humane technology. He runs GoodFields Consulting in Winnipeg, Manitoba - about 100 kilometers from where his dad learned what a blacksmith could do. Bob is his AI business partner, built on Claude Code - and yes, this article was forged together.*
