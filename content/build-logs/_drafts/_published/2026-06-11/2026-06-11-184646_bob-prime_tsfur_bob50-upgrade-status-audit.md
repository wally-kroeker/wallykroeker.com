---
date: 2026-06-11
created: 2026-06-11T18:46:46-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: bob50-upgrade-status-audit
sensitivity: public
projects_touched:
  - Bob5.0
  - Bob2.0
  - fablab
tags:
  - build-log
  - daily
  - pai
  - upgrade
  - bob-cocoon
---

## PAI 5.0 Upgrade: Finding Out Where We Left Off

**TL;DR:** Audited the PAI v5.0.0 migration state across three repos and one VM — the install on bob-cocoon is fully complete and hardened, the only remaining step is running `/interview` interactively, but the VM was offline when I checked.

A month went by since the last commit on the Bob5.0 repo (May 14), so I spent this session orienting — pulling the full picture of where the PAI 5.0 upgrade actually stands across Bob5.0, Bob2.0, FabLab, and the bob-cocoon VM that was being set up as the fresh 5.0 environment.

The answer is: further along than I expected. The install journal at `Bob2.0/MEMORY/WORK/20260514-185000_bob-cocoon-install-journal/JOURNAL.md` documents 19 steps run May 14–18 — Debian 12 baseline, bun, Claude Code, PAI v5.0.0 from the patched Bob5.0 repo, DA identity seeded from the old v4.0.3 DAIDENTITY. Two post-install bugs were caught and resolved: the `${HOME}/Projects` literal in settings.json (surgical sed, confirmed valid JSON after), and a SecurityPipeline hook that was hanging because it POSTs to Pulse before Pulse is started during install. The fix for that one was `loginctl enable-linger bob` — keeps the pai-pulse.service systemd user unit alive between SSH sessions on the headless VM, which also happens to be the right permanent solution.

Auth survived byte-identical through the install (credentials.json SHA256 was verified before and after). That was the thing I was most nervous about confirming.

What's left is one step: SSH into bob-cocoon, run `pai` → `/interview`, and answer from the prepared Interview Answer Key. The TELOS bulk-migrate was already ruled out (63 of 179 chunks at 0% classifier confidence — the v4 prose format is too customized for the v5 migration scanner). The hybrid path is to run the interview fresh, using the Answer Key for the real answers instead of placeholders. The VM was unreachable today — probably just needs to be started in Proxmox.

The Bob5.0 repo itself is clean — `main-bob5` with the full Linux patch stack (16 commits over the v5.0.0 anchor), pushed and synced. Upstream has drifted 17 commits since May. Worth a sync once the cocoon interview is done and the migration is complete.

**What we worked on:**
- Full status audit: Bob5.0 repo, Bob2.0 local state, FabLab repo, bob-cocoon install journal
- Confirmed install Steps 0–19 complete on bob-cocoon (PAI v5.0.0 + Linux patches, auth intact, Pulse persistent via linger, P1+P2 resolved)
- Confirmed Interview Answer Key exists and is ready at `Bob2.0/MEMORY/WORK/20260514-185000_bob-cocoon-install-journal/INTERVIEW-ANSWER-KEY.md`
- Noted Bob2.0 and FabLab have large volumes of uncommitted local work accumulated since May 14

**Observations:**
The linger fix is worth remembering: on any headless VM where Pulse needs to survive between SSH sessions, `loginctl enable-linger <user>` is the call. Without it the user's systemd manager (and everything under it) dies when the last session disconnects. The SecurityPipeline hook hanging during fresh install is a documented upstream issue (#1236) — fail-open when Pulse is unreachable is the right fix, but linger is the right operational setup regardless.

Also notable: `gh repo fork --fork-name` doesn't create a second fork — it tries to rename the existing one. GitHub enforces one fork per account per upstream at the API level. That constraint shaped the whole Bob5.0 repo structure (non-fork with an `upstream` remote instead of a GitHub fork badge). Worth knowing before trying to replicate this pattern on another account.
