---
title: "The Blacksmith's Forge"
description: "What the prompts actually looked like. Spoiler: they weren't sophisticated."
date: 2026-02-01
status: "published"
reviewed: false
sensitivity: "public"
tags:
  - ai
  - infrastructure
  - pai
  - consulting
  - graybeard-collective
  - claude-code
category: "AI Infrastructure"
featured: true
---

*What the prompts actually looked like. Spoiler: they weren't sophisticated.*

---

After I published [The Digital Blacksmith](/blog/2026-01-27-the-digital-blacksmith), several people in the [GrayBeard AI Collective](https://discord.gg/Skn98TXg) asked the obvious question:

"What did you actually say to Claude?"

Fair question. I talked about forging tools, about 19,425 data points, about PowerShell monitoring servers and cross-platform deployment. That sounds like maybe there was some sophisticated prompt engineering involved.

Here's the thing: there wasn't.

---

## The Setup

First, let me be clear about what I was using.

Not Bob. Not my PAI (Personal AI Infrastructure) system with its agent orchestration and knowledge graphs and voice integration. Just vanilla Claude Code - the command-line interface you can install with `npm install -g @anthropic-ai/claude-code`.

I literally had just installed it when I walked into that client site. I had my Linux laptop, a terminal, and the `claude` command.

That's it.

No special prompts. No system instructions. No carefully crafted personas or chain-of-thought frameworks. Just me, a terminal, and twenty years of knowing what questions to ask.

---

## Before the First Hammer Falls

Actually, I left something out.

Before I typed that first prompt, I spent about twenty minutes getting Claude oriented. Created a project folder, dumped the output of an nmap scan into a file, problem description as I understood it, slow SaaS apps, angry users, new building with suspect cabling, ISP that had already been called.

I documented which SaaS sites were the issue. I captured the network layout. I gave Claude the context before asking it to build anything.

This is the blacksmith part nobody thinks about: studying the workpiece. A smith doesn't just grab random metal and start hammering. They examine what they're working with, understand its properties, figure out what they're actually trying to make. The customer says "I need a gate hinge." The smith asks: how heavy is the gate? What's the post made of? Indoor or outdoor? Left swing or right?

Claude Code works the same way. You can skip the context-gathering and just start prompting, but you'll spend twice as long iterating because the AI doesn't understand the environment. Give it the network map, the error messages, the constraints - and suddenly the first attempt is usually right.

Twenty minutes of preparation saved hours of iteration. That's not AI magic. That's just how good work gets done.

---

## What the Prompts Actually Looked Like

I'm going to reconstruct some of these from memory, because I wasn't keeping a transcript. But I'm not embellishing - these are representative of what I actually typed.

### The Network Discovery

When I first sat down at the client site, I needed to understand what was on the network. My prompt was something like:

```
I'm diagnosing network issues at a small business. They have Windows
workstations and SaaS apps running slow. Can you help me nmap their
network (192.168.100.0/24) and categorize what we find?
```

Claude helped me run `nmap -sP 192.168.100.0/24` and organize the results. No magic. Just asking for what I needed.

### The Baseline Script

I wanted a script that would capture the current state of the network - interface stats, error counters, DNS config, routing table. My prompt:

```
Write a bash script that captures network baseline information -
interface status, error counters, DNS configuration, ARP table.
Output to a baseline.txt file.
```

What I got back was `baseline.sh`. It detected the network interface, grabbed stats from `/sys/class/net`, dumped `/etc/resolv.conf`, ran `arp -a`. Maybe 50 lines of bash. Worked on the first try, which honestly surprised me a little.

### The DNS Comparison Tool

The ISP DNS seemed slow. I wanted to compare it against public resolvers. My prompt:

```
Write a bash script that compares DNS resolution times across
multiple resolvers - the gateway (192.168.100.1), Cloudflare
(1.1.1.1), Google (8.8.8.8), and Quad9 (9.9.9.9). Run multiple
iterations and show averages.
```

Result: `dnstest.sh`. About 80 lines. Took each resolver, ran `dig` against it 20 times, calculated min/avg/max, generated a summary. First try.

The output looked like this:

```
Resolver         Avg(ms)  Min(ms)  Max(ms) Failures
ISP_Router            17       14       40        0
Cloudflare            54       49       64        0
Google                61       55       76        0
Quad9                 55       37       97        0

RECOMMENDATION: ISP DNS is performing well. No change needed.
```

Turns out the ISP's DNS was actually the fastest. Good to know.

### The SaaS Response Time Tester

I needed to break down where time was being spent when connecting to their SaaS apps. Not just "is it reachable" but "where is the latency?" My prompt:

```
Write a bash script that tests response times to a SaaS URL,
breaking down DNS lookup time, TCP connect time, TLS handshake,
time to first byte, and total time. Use curl timing.
```

Claude wrote `apptest.sh`, using curl's `-w` format string to extract each timing phase. Maybe 60 lines. First try.

### The Long-Running Monitor

Here's where it got interesting. I needed something that would run for a week, testing network connectivity and SaaS response times continuously. My prompt evolved over a few iterations:

```
Write a bash script called soak.sh that monitors network health
continuously. It should:
- Ping the gateway, a LAN device, and an external IP (1.1.1.1)
- Test response times to SaaS URLs (provided as arguments)
- Log results to CSV every 5 seconds
- Show a console summary line for each sample
- Flag anomalies (packet loss, slow DNS, high latency)
- Run for a configurable duration

The output format should be:
[timestamp] +elapsed  GW: Xms LAN: Xms EXT: Xms SOS: Xms SPEX: Xms
```

The first version worked. The second version added anomaly detection. The third added interface counter logging. Each iteration was "add this feature" - never a rewrite.

---

## The Python Layer

Bash is great for network diagnostics. But for the deployment workflow - serving scripts to Windows machines over HTTP - I needed something with a web server.

My prompt:

```
Write a Python script that serves as a simple HTTP server for
deploying PowerShell scripts to Windows machines. It should:
- Serve files from the current directory
- Have an endpoint that accepts test results as JSON
- Show a simple web page listing connected clients
```

Python is perfect for this. AI writes Python exceptionally well - it's seen so many examples that basic web servers are almost trivial for it. `test_server.py` was about 100 lines and served as the deployment hub.

---

## The PowerShell Problem

The monitoring needed to run on their old Windows 10 file server - I couldn't leave my Linux laptop on-site for a week. This meant PowerShell.

My prompt:

```
Write a PowerShell script that runs as a continuous network
monitor on Windows. It should:
- Test ping to the gateway and an external IP
- Test response times to SaaS URLs (SOS Inventory, Spexbuilder)
- Log results to CSV
- Serve a web interface where users can report issues
- Run unattended for days

The web interface should show current status and let users
click a button to report "it's slow right now" with a timestamp.
```

This one took a couple iterations. The first version had the basic monitoring but the web server was clunky. I asked Claude to improve the HTML output. Then I asked for a status page that auto-refreshed. Then a download link for the logs.

The final `Start-SoakMonitor.ps1` was about 300 lines. It ran for seven days without supervision, collected 19,425 samples, and gave users a simple way to correlate their "it's slow" complaints with actual network data.

---

## The Cable Testing Suite

I also needed to test physical connections - was the cabling in the new building actually faulty? My prompt:

```
Write a PowerShell script that tests cable connection quality
between workstations. It should:
- Run 50 pings and calculate packet loss, latency, jitter
- Test TCP connections on a specific port
- Test large packets to verify MTU
- Output a grade: GOOD, FAIR, or POOR
- Be simple enough for non-technical staff to run
```

The grading logic came out clean:

```powershell
# Grading Criteria
# GOOD: 0% packet loss, <2ms latency, <5ms jitter
# FAIR: 1-5% packet loss, or elevated latency/jitter
# POOR: >5% packet loss
```

Every workstation came back GOOD. Cabling wasn't the problem.

---

## What Made It Work

Let me be honest about what's happening here.

The prompts weren't sophisticated. "Write a bash script that does X" is not prompt engineering. There's no chain-of-thought, no few-shot examples, no carefully tuned system prompts.

What made it work was knowing *what to ask for*.

Twenty years of IT experience told me:

- Network diagnostics should be layered: local, LAN, WAN, DNS, application
- Long-running tests catch intermittent problems that spot-checks miss
- Users need a way to correlate their experience with technical data
- Output needs to be both machine-readable (CSV) and human-readable (summaries)
- Deployment to Windows machines needs a different approach than Linux scripts
- The evidence needs to be exportable so clients can share it with vendors

Claude doesn't know those things. Claude doesn't know that you should test the gateway separately from external hosts to isolate ISP issues from local network issues. Claude doesn't know that a "slow SaaS app" complaint needs to be broken down into DNS, connect, TLS, and application phases.

I knew those things. Claude wrote the code.

---

## The Pattern

Here's what I noticed across all these tools:

**First attempts mostly worked.** Maybe 80% of scripts ran correctly on the first try. The remaining 20% needed minor tweaks - a typo, a missing dependency check, a formatting issue.

**Iteration was fast.** When something needed adjustment, I'd just say "change the output format to X" or "add handling for this edge case." No need to explain the whole context again.

**Bash is reliable.** For Linux-based diagnostics, Claude's bash is solid. It knows standard tools, handles pipelines well, does error checking correctly.

**Python for web stuff.** Whenever I needed HTTP servers, JSON parsing, or web interfaces, Python was the obvious choice. AI writes good Python.

**PowerShell is powerful but verbose.** The Windows scripts took more iteration because PowerShell has quirks. But the core logic was right from the start.

---

## What I'm Not Saying

I'm not saying anyone can do this without experience.

If you don't know what to test, you'll get scripts that test the wrong things. If you don't understand network layers, you'll miss where the problem actually is. If you don't know what "time to first byte" means, you won't think to ask for it.

The AI amplifies what you already know. It doesn't replace it.

A junior admin using Claude Code might build monitoring scripts that completely miss the actual issue. They might collect thousands of data points that don't answer the right question. They might deploy tools that give false confidence.

The blacksmith metaphor holds: the forge makes things faster, but you still need to know what to make.

---

## What's Actually Stopping People

Here's the thing about AI-assisted toolmaking - it's not about prompts or expensive tools. Claude Code is $20/month. The scripts it wrote could have been written by any competent sysadmin with enough time.

I walked into that client site figuring I could probably forge custom tools on the fly. I'd done it before. I knew that "write a bash script that does X" would produce something usable in 30 seconds.

A lot of veteren IT people just haven't tried it yet. They think AI coding is for developers. They think you need special skills. They think the prompts must be complicated. They're not, though.

You need to know your domain. You need to be able to describe what you want. You need to iterate when the first attempt isn't quite right.

That's it.

---

## If You Want to Try This

If you're in the GrayBeard Collective, here's what I'd suggest: find one problem you'd normally solve manually. Something you'd do with a quick terminal session, or a few hours of clicking around.

Describe it to Claude Code:

"Write a bash script that checks if my SSL certificates are expiring in the next 30 days."

"Write a Python script that monitors disk usage and alerts if any mount point is over 90%."

"Write a PowerShell script that inventories installed software on a Windows machine."

You'll probably be surprised how well it works on the first try.

---

## The Forge Is Open

The tools I built for that Greenslade engagement weren't magic. They were straightforward scripts, forged quickly, customized to a specific problem.

The forge wasn't sophisticated. I just asked for what I needed.

And the result - 19,425 data points, objective evidence, tools the client kept - came from combining domain expertise with AI assistance.

Simple prompts, twenty years of knowing what questions to ask. That's the combination.

That's the blacksmith's forge. It's not the prompts that matter - it's knowing what to make.

---

*Want to see more behind-the-scenes content? Join the [GrayBeard AI Collective](https://discord.gg/Skn98TXg). Monthly meetups, async discussion, practitioners sharing what actually works.*

---

*Wally Kroeker builds things at the intersection of security, infrastructure, and humane technology. He runs GoodFields Consulting in Winnipeg, Manitoba. Bob is his AI business partner - but this article was about what happens when you don't have Bob handy and just need to get work done.*

---

*This article was researched and drafted by Wally's agent team - Nova handled the initial research and drafting, Howard reviewed for voice authenticity. Wally provided direction and final review. The forge works for writing too, apparently.*
