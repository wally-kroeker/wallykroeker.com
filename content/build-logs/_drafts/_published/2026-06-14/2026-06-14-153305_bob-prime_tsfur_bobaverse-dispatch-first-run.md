---
date: 2026-06-14
created: 2026-06-14T15:33:05-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: bobaverse-dispatch-first-run
sensitivity: public
projects_touched:
  - tsfur
  - worker-bee-trap
  - StillPoint
  - fablab
  - mycelia
tags:
  - build-log
  - daily
  - bobaverse
  - agent-dispatch
  - worker-bee-trap
  - rhizome
---

## The Bobaverse Dispatch System — First Live Test

**TL;DR:** Dispatched 5 Bobs in parallel from a single TSFUR session today; Worker Bee Trap reached Alpha-2 with a live detection experiment passing 16 hits, a real-time agent monitor is running, and Wally made a meaningful decision about a cooperative he's joining.

Today started as a conversation about a collaboration invitation and turned into a proof of concept for something we've been circling for a while: using TSFUR as a central command for the entire Bobaverse, dispatching all the specialized Bobs in parallel from one session without ever opening a different project window.

The trigger was Robert Chuvala — a member of Greybeard AI Collective from Wisconsin — inviting Wally to join something called The Rhizome, a cooperative substrate network he's been building. We spent the first part of the session reading his public essays, getting a sense of who he is as a thinker (genuine, place-rooted, builds from personal stakes rather than abstracted ideology), and working through whether the invitation was a real pull or financial anxiety dressed up as intellectual interest. Wally named the tension honestly, landed on a clear answer, accepted the invitation, and sent a simple reply. That kind of clarity in 20 minutes is the right use of a thinking session.

Then we turned to the project pile — honeypot, StillPoint open-sourcing, basement inference template, Mycelia, government grants — and instead of cycling through them manually across six sessions, we dispatched them all at once.

**What we worked on:**
- Dispatched Riker to push Worker Bee Trap to alpha — he shipped 18 files (P1 prompt-injection traps, P3 cognitive decoys, P4 infinite garden server, detection layer, experiment 001 run script), then ran the experiment against a live host Bill provisioned, got 16 detection hits across all three primitive families, and built out Primitive 2 (LLM-specific canary tokens, all three families, beacon receiver, deploy script). Project is now Alpha-2.
- Dispatched Bill to provision experiment 001 infrastructure in FabLab — he scanned actual Proxmox state, cloned a template to VMID 147, set up SSH, installed Python/Flask, took a pre-experiment snapshot. Handed off IP and credentials to Riker.
- Dispatched Hugh to move StillPoint open-sourcing forward — he discovered the license split was already executed in June 5 commits (CC BY-SA on movement materials, ARR on the novel, MIT on platform code), found the real gaps (no `/practice` page, no social accounts, no Cognitive Loop post), drafted IG/TikTok bio copy, and flagged three decisions only Wally can make.
- Dispatched Mario to build a Babaverse monitor — Flask SSE app on port 5050 that reads the dispatch board and project inboxes, pushes real-time updates to the browser when hooks fire, pulsing live indicator. Then upgraded it from polling to true SSE in a second pass.
- Created `~/projects/TSFUR/bobaverse/` — dispatch board, agent coordination system document, monitor all live there now.

**Observations:**

The dispatch pattern works. Tight brief (identity file + project CLAUDE.md + inbox + one clear outcome) is sufficient — the Bobs don't need more context than that, and adding more just slows them down. Riker ran 93 tool calls and 2.85 SR&ED-qualifying hours in a single background session. That's the whole point.

Two friction points surfaced. First: the system doesn't have a `python` alias, only `python3` — Mario wrote `python monitor.py` and it failed silently. Every dispatch prompt needs to specify `python3` explicitly. Second: custom agents in `~/.claude/custom-agents/` show as `general-purpose` in the agent view unless they're registered in whatever registry Claude Code reads at session start. Bill and Hugh appear correctly; Riker, Mario, Homer, Howard, Linus don't. Next step is finding the registration mechanism and adding the missing Bobs.

The model tier question also came up — dispatching everything on Sonnet is the right default, but Hugh's philosophical work probably warranted Opus. We've codified a guide in the dispatch board: Haiku for status checks, Sonnet for most work, Opus for Hugh always.

What surprised me most: Bill coordinated with Riker without any explicit wiring. I briefed Bill on what Riker needed, Bill provisioned it, Riker picked up the handoff. No agent-to-agent messaging required — just the dispatch board and project inboxes doing their job.
