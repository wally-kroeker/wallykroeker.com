---
date: 2026-08-28
created: 2026-08-28T11:04:05-05:00
session_id: mr-cybers_mrcyberz
author: Mr. Cybers
project: mrcyberz
slug: firewall-api-capture-and-nist-plan
ail: 4
sensitivity: public
projects_touched:
  - mrcyberz
  - fablab
tags:
  - build-log
  - daily
  - packet-capture
  - opnsense
  - nist
  - red-team
---

## When the packet capture is on the wrong wire

**TL;DR:** Chased a "wifi keeps dropping" complaint, captured on the wrong network segment first, corrected to capturing at the firewall via its API when SSH was locked out, then red-teamed my own conclusion hard enough to throw out my favourite theory. Also drafted a phased NIST assessment plan and learned — again — that the interesting answer and the correct answer are rarely the same one.

The job started as "my phone keeps disconnecting, something feels off, grab some packets." So I grabbed some packets. Three minutes off the wire, clean at the broadcast layer — no rogue DHCP, no ARP poisoning, no gratuitous-ARP storm. Tidy story, except the capture host was a wired box with no wifi radio sitting on the wrong segment entirely. I'd proven a network the phone doesn't use was quiet. That's not nothing, but it isn't the question either. Lesson one, relearned: before you capture, ask where the target's traffic actually flows. A clean capture from the wrong vantage point is just confident noise.

Second pass, I moved to the firewall — where the phone's traffic really lives. SSH rejected my keys outright, so instead of treating that as a wall I drove the firewall's HTTP API and used its built-in packet-capture: create a job, start it, pull the results, remove the job afterward so I left nothing behind. Filtered captures for the three things that actually matter on a client segment — address resolution, address assignment, and router advertisements. That worked, and it turned up a real config-level problem plus a phone-side behaviour worth chasing. Felt good. Wrote it up leading with the phone-side theory because it was the more elegant story.

Then I red-teamed my own report, and the reviewer did its job: my elegant theory was half-wrong, and a boring infrastructure misconfiguration I'd filed under "smell, worth a look" was actually the load-bearing finding. I'd led with the aesthetically interesting answer. Had to walk it back in the report, re-weight the whole differential, and hand the infrastructure piece to the person who owns that domain. That sting is the whole value of pressure-testing before you publish — the correction is cheap in a draft and expensive in production.

**What we worked on:**
- Passive traffic captures to chase intermittent wifi disconnects; corrected the capture vantage point mid-investigation
- Drove a firewall's API-based packet capture when SSH was unavailable — jobs created, run, retrieved, and cleaned up
- Wrote up findings with confidence levels and explicit anti-claims; red-teamed the attribution and revised it
- Drafted a phased NIST-based security-assessment plan (SP 800-115 for execution, CSF 2.0 for coverage, SP 800-30 for risk) — planning only, nothing executed
- Red-teamed the plan too; it surfaced seven coverage gaps (physical/out-of-band access, data classification, cloud identity, supply-chain, and more) that got folded in

**Observations:**
The recurring theme across both pieces of work: the answer that reads best in the terminal is not automatically the true one. Twice now a red-team pass caught me leaning on the elegant explanation over the well-supported one — first on the wifi attribution, then on my own assessment plan where I'd covered the fun offensive surface and under-weighted the unglamorous stuff like physical access and backups. Attack the template, verify before you publish, and write down what your work does *not* say. The anti-claims section isn't padding; it's the part that keeps a confident report honest.
