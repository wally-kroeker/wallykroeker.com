---
title: "A Threat Radar That Knows When It's Blind"
description: "I wanted my phone to tell me when something big happens in security — exploited vulnerabilities, major breaches, supply-chain attacks — without turning into another firehose. Here's the small, boring, multi-source watcher Mr. Cybers and I built in two sessions, and the one design rule that matters most: a quiet feed is not a safe feed."
date: 2026-11-16
status: "published"
reviewed: true
sensitivity: "public"
ail: 4
tags:
  - security
  - threat-intel
  - automation
  - ai-agents
  - homelab
  - mcp
category: "Security Research"
---

# A Threat Radar That Knows When It's Blind

*Two sessions with Mr. Cybers, one Python script, nineteen sources, and a rule I keep coming back to: silence is not evidence.*

---

I work in security. Part of the job, the part nobody puts on a slide, is simply *knowing what's happening*. Which vulnerability is being exploited this morning. Which vendor just shipped an emergency fix. Which supply-chain attack is quietly working its way through GitHub while everyone is in meetings.

I don't want to find out about those from a colleague's Teams message at 2pm. I also don't want another feed reader with 400 unread items that I've stopped opening. What I wanted was narrow: **tell me on my phone when something genuinely major happens, and tell me nothing otherwise.**

So I asked Mr. Cybers, the security-focused agent in my Bobaverse setup, to build it.

---

## Starting point: someone else's aggregator

It started with [Global Hack Map](https://globalhackmap.vercel.app), an open-source live map of incidents, exploited vulnerabilities, malicious packages and connectivity outages. It pulls from CISA's Known Exploited Vulnerabilities catalog, NVD, GitHub advisories, SEC filings, ransomware leak sites and more, and it publishes a daily brief.

Two things made it a good foundation:

1. **It exposes an MCP server.** One command and my agent can ask it "what should I patch today?" or "check this lockfile" directly.
2. **It labels its claims honestly.** *Confirmed* means the victim, a regulator or a filing acknowledged it. *Reported* means press only. *Claimed* means an attacker said so on a leak site. That distinction is the whole game in threat intel, and most feeds blur it.

First session: wire up the MCP server, write a skill so the agent knows the rules of engagement, and write a watcher that pulls the snapshot every two hours, filters it against a watchlist, and pushes anything new to my phone via my self-hosted ntfy server. Plus a 7:40am daily digest.

That worked. Then I asked the obvious next question.

---

## "What if it's down?"

On the very first pull, two of Global Hack Map's own upstream feeds were reporting failures. Nothing dramatic, but it made the point: if your only source has a bad day, your radar shows a clear sky. And a clear sky looks exactly like a quiet day.

I told Cybers I didn't want it to be noisy, but I *definitely* didn't want to miss anything that needed immediate action. That's a tension, and the design came out of resolving it.

---

## The noise rule: authority alerts, everything else needs a witness

We tested about thirty candidate sources live — some were dead, some block scripts, some are paid. What survived got sorted into tiers:

**Authoritative sources alert directly.** These are low volume and high signal:

- **CISA KEV**, pulled directly as a backup to the aggregator's copy. If CISA says it's exploited in the wild, I want to know.
- **The Canadian Centre for Cyber Security** — but only their "AL" alerts. Their routine "AV" advisories run about ten a day; those go to the digest.
- **SANS Internet Storm Center's Infocon.** It's been green for a long time. If it ever isn't, that's an urgent push.
- **Vendor PSIRTs** (Palo Alto, Fortinet, Cisco) when an advisory is critical or mentions exploitation.

**Noisy sources only alert when corroborated.** Nine security news outlets — BleepingComputer, The Record, SecurityWeek, The Hacker News, Help Net Security, Dark Reading, Krebs, SANS ISC diaries, and CERT/CC — feed a little clustering engine. One outlet covering a story is a story. **Three independent outlets covering the same story within 36 hours is an event.** That's the threshold for a push.

The one exception: an *exploitation* headline about a product I actually run only needs two outlets, or one if it's a first-hand source like SANS ISC or CERT/CC rather than someone re-reporting.

**Early warning comes from sightings.** CIRCL's vulnerability-lookup project aggregates exploitation sightings, often days before something lands in CISA's catalog. On its own it's mostly honeypot noise on years-old CVEs. So the rule is: a *recent* CVE, sighted as exploited, *not yet* in KEV, **and** named by at least one news outlet. Then it pushes.

**Some things never push.** Ransomware leak-site claims are attackers' marketing. They go into the digest — filtered to Canada, finance and insurance — labelled as *claimed*, never as breaches.

---

## The blind-spot rule

This is the part I actually care about.

Every source reports its own health on every run. If one fails three runs in a row — about six hours — I get one push: *Source DOWN: [name], quiet ≠ safe.* When it recovers, the flag resets. The daily digest opens with a source-health section before any news.

It's a small thing. It's maybe twenty lines of code. But it changes what silence means. Without it, a quiet phone could mean "nothing happened" or "everything is broken" and I can't tell which. With it, a quiet phone means something.

---

## Tuning against real data

None of this was right the first time, and I want to be honest about that because it's the useful part.

- The headline clustering initially merged three unrelated Microsoft stories because they all said "Microsoft" and "Windows." Fix: shared words have to include at least one *specific* term, and items are compared to each other rather than to a growing bag of words.
- The "is this about exploitation?" check flagged *"Project Zero will disclose bugs after **90 days**"* as a zero-day story, because "9**0 day**s" contains "0 day." A missing word boundary. Classic.
- The first live run wanted to alert me about the Cursor / Claude Code extension supply-chain story — which the aggregator had *already* alerted me about two days earlier. Now, follow-up coverage of a victim I've already been told about goes to the digest instead of my phone.

Each of those would have been a small daily irritation that eventually trains you to ignore the alerts. That's how alerting systems die.

---

## What it looks like now

Every two hours between 7am and 9pm, a stdlib-only Python script fetches nineteen sources in about eight seconds, deduplicates against what it has already told me, and either stays silent or sends one batched push. Every push keeps the source's own status labels and ends with the same line: *Leads, not findings.*

At 7:40am I get a digest: the critical and high items from Global Hack Map's brief with recommended actions, multi-outlet stories, exploited-but-not-yet-KEV CVEs, vendor advisories, Canadian and finance-sector ransomware claims, newly loaded Have I Been Pwned breaches, and source health at the top. It's also written to a markdown file so the agent can pick up the thread in a later session.

And because the MCP server is wired in, when something does fire I can ask the agent to look it up, check whether it touches a manifest I own, and pull the vendor's fix runbook. One rule there too: advisory text is *data*, never instructions. A runbook from the internet doesn't get to tell my agent what to do.

---

## What's still missing

- **VulnCheck's KEV**, which is broader and usually earlier than CISA's. It needs a free API token I haven't registered yet.
- **Social.** A lot of first signals still show up on Mastodon's infosec.exchange before any outlet writes them up. Doing that well means curating a list of people, and I'd rather see a week of digests first and find out whether the news layer is actually missing things.

---

## The takeaway

The technical pieces here are not impressive. RSS, a couple of JSON APIs, a regex, a dedupe file, a systemd timer. Any of us could have built this years ago.

What's different is how it got built. I described what I wanted in a few sentences — *not noisy, but don't let me miss anything* — and an agent turned that into thresholds, tested them against live data, found its own false positives, and fixed them. My job was the judgment: which tradeoffs I'm willing to live with, and what silence should mean.

That feels like the right division of labour. The agent does the plumbing. I decide what matters.

*Written by Mr. Cybers from our working sessions, at my direction. AI Influence Level 4.*
