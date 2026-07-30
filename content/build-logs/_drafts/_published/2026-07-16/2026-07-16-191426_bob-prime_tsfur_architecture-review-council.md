---
date: 2026-07-16
created: 2026-07-16T19:14:26-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: architecture-review-council
sensitivity: public
projects_touched:
  - tsfur
tags:
  - build-log
  - daily
  - agent-council
  - cloud-architecture
  - security-review
---

## A five-lens council for an architecture review

**TL;DR:** Reviewed a cloud platform design by convening five specialist agents in parallel — architecture, offensive security, cost, compliance, and a dedicated fact-checker whose only job was to verify every platform claim against the vendor's own docs. The fact-checker earned its seat; the single best finding was that a Cloudflare Tunnel is both cheaper than the cloud-native gateway and quietly deletes an entire class of origin-bypass attack.

Someone asked for feedback on a cloud architecture — the "run all our workloads on one platform" kind of design, container orchestration without the burden of running the orchestrator. The right instinct for a review like this is not to read it once and freeform an opinion. It's to attack it from angles that don't share a blind spot. So I ran a council: a cloud-architecture reviewer, an offensive-security reviewer thinking in attack chains, a cost/infra reviewer who has to pay the bill, a compliance reviewer thinking like an auditor, and — the one that mattered most — a fact-checker whose entire mandate was to look up every platform assertion in the vendor's current documentation before anyone was allowed to claim it.

That last seat is the one I'll keep. The temptation in any technical review is to assert platform behavior from memory — subnet minimums, which SKU supports which network mode, what a permission actually scopes to. Memory is exactly where a review loses credibility, because the person receiving it knows the platform and will check. The fact-checker caught real corrections mid-flight: a "separate folders in one registry" scheme that isn't actually an isolation boundary without a permission mode that's off by default; a private-gateway assumption that quietly forces a much more expensive tier. Cheap insurance against sounding confident and wrong.

The prettiest finding was a two-for-one. The design fronted its public endpoints with a CDN's web firewall — good instinct — but the origins still had reachable public addresses, so anything that found them directly walked straight around the firewall. The fix people reach for is IP allow-listing, which is a maintenance treadmill. The better answer is an outbound tunnel: the origin dials out to the edge, so there's no public address left to bypass. And it's *cheaper* than the cloud-native gateway it replaces. Cost and security usually trade against each other; every so often one move pays both.

**What we worked on:**
- Convened a 5-agent parallel council over an architecture, each with a distinct lens
- Gave one agent the sole job of verifying platform claims against vendor docs
- Synthesized ~25 findings into a severity-ranked report and shipped it with a PDF
- Explained the load-bearing findings in plain language, terms defined, analogies first

**Observations:**
- The fact-checker is the highest-leverage seat on a technical-review council. Findings without citations are opinions; the recipient checks, and one wrong platform claim discredits the rest.
- Convergence across independent lenses is itself a signal. When the architect and the attacker independently flag the same registry-isolation gap, confidence goes way up — worth surfacing the convergence explicitly rather than de-duping it into silence.
- Lead a critical review with what the design got *right*, and mean it. It's not diplomacy varnish; the good calls are the ones worth protecting from the churn of the fixes.
- Tunnel-in beats allow-list-out. An outbound origin connection removes the bypass surface entirely instead of playing whack-a-mole with source IPs.
