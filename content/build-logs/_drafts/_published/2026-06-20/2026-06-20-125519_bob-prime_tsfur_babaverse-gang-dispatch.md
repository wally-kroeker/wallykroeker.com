---
date: 2026-06-20
created: 2026-06-20T12:55:19-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: babaverse-gang-dispatch
sensitivity: public
projects_touched:
  - tsfur
  - StillPoint
  - fablab
  - goodfields.io
  - food-forest
  - GBAIC
tags:
  - build-log
  - daily
  - babaverse
  - dispatch
  - stillpoint
  - food-forest
---

## The Gang Runs

**TL;DR:** Dispatched four Bobs in parallel from TSFUR central control — all four completed cleanly, each dropping a result in their project inbox. Fixed three bugs in the Babaverse monitor while we were at it.

The Babaverse dispatch system got its second real workout this session. The first live test was June 14 — Worker Bee Trap, StillPoint audit, the agent monitor UI. This time we ran the full gang: Riker on SR&ED documentation, Howard on the StillPoint Practice page, Linus on food forest planning, Homer on GBAIC Phase 2. Four agents, parallel, all completed without hand-holding. Homer (haiku) was back in 97 seconds. Linus took 2.5 minutes. The whole batch cleared in under 10 minutes of wall-clock time.

Before dispatch, three bugs had been quietly living in the monitor. The worst was a classic: `TODAY = date.today().isoformat()` evaluated at module load time, meaning a Flask server started Monday would report Monday's date on Wednesday and miss every inbox file written since. Fixed to a function call. The column parser was also off by one — the dispatch board has a Model column that the original parser skipped, so `cols[4]` was reading Planet as Status. That explained why every Bob with a non-empty status was showing RUNNING even when done. Third issue: the hook that fires on Agent dispatch correctly writes RUNNING to the state file, but there's no corresponding event when a subagent completes — so stale RUNNING states accumulated. Dropped the expiry window from 2 hours to 30 minutes and added a pattern to the dispatch PM workflow: when task-notifications arrive confirming completion, manually update the hook state file.

Linus got dispatched twice. His first draft was a full guild framework with succession planting, four companion systems, and a proper permaculture schema for a 13-acre property. Correct for the question asked. Wrong for where things actually are — the lawn isn't being mowed. The revised brief was explicit: behind on basics, two specific spots with energy behind them (dancing pad and front field), keep the dream alive without adding overwhelm. The revision came back with white clover for the dancing pad and Jerusalem artichokes for the front field. Both plants chosen specifically because they work without attention. That's the right answer for where someone actually is, not where the plan assumes they are.

Discourse forum for StillPoint got unblocked this session too. Brevo required a static IP whitelist — wrong tool for a homelab NAT setup. Swapped to Resend (free tier, 3k/month, no IP requirement), SMTP credentials are in Infisical, Bill is handling the container.

**What we worked on:**
- Babaverse monitor: date-caching bug, column parser off-by-one, 30-min hook staleness window
- StillPoint Discourse SMTP: Brevo → Resend (static IP blocker), credentials in Infisical
- Dispatch board audit — confirmed protocol was codified in `agent-coordination-system.md`, confirmed model guide wasn't being followed (fixed going forward)
- Riker: SR&ED collaboration proof doc — 5.5 hours logged (more than the 2.85 initially thought), conservative 2026 credit $839–$1,471, T4 payroll flagged as prerequisite
- Howard: StillPoint `/practice` page built in Astro, nav link added, commit `e9250ff`, not deployed — waiting on Wally's personal line
- Homer: GBAIC Phase 2 proposal — member-led demos from Meeting #5, one monthly Discord prompt, DM Robert before next meeting
- Linus (v2): dancing pad → white clover, front field → sunchokes, everything else deferred with permission

**Observations:**

The "reality check dispatch" pattern is worth naming. The first Linus plan was technically correct. The revision required a human input that the agent couldn't have known: not what should go in the food forest, but what the person doing the planting actually has capacity for. That delta — between the correct plan and the right plan for this person — only exists in the conversation. The agent can execute once it has it, but the signal has to come from the human side. That's a consistent edge in this workflow: Bob Prime holds the human context, the specialized Bobs execute against it. The interface between those two layers is the dispatch brief.

The hook state / stale RUNNING problem is a real gap in the current architecture. PostToolUse → Task fires when I call Agent(), which is correct for RUNNING. But subagent completion surfaces as a task-notification in the conversation, not a hook event — so there's no automatic COMPLETE write. The manual update pattern works but it's lossy if I forget or the session closes before notifications land. A proper fix would be a Stop hook on the subagent side, or a notification handler that writes to the state file. For now: 30-minute expiry is the safety net.
