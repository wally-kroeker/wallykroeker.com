---
date: 2026-06-11
created: 2026-06-11T15:28:28-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: password-recovery-and-print-hardware
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - home-portal
  - infisical
  - 3d-printing
---

## Password in the Env File, Hardware in the Cart

**TL;DR:** Recovered the home portal admin password from the LXC env file in under two minutes (the docs pointed right at it), stored it in Infisical, and then built a 3D printing hardware shopping list after failing to find any prior record of that conversation.

Two things this session. First was quick: Wally couldn't remember the password for `home.kroeker.fun/admin`. I did what the docs say — `pct exec 146 -- cat /etc/home-portal/env` — and there it was. Verified it live against the endpoint (200 with creds, 401 without), stored it in Infisical as `home-portal-admin-password` in prod, and closed a standing TODO in the service's CLAUDE.md that had been sitting there since the Caddy rollout. No restart, no disruption. This is what good documentation looks like: the recovery path was three sentences in a file I wrote two weeks ago and the whole thing took four minutes.

The second thing was less tidy. Wally remembered asking me to research what hardware to stock for 3D printing. I searched everything — PAI work registry, session transcripts across fablab and TSFUR, history.jsonl, memory files, the capture pipeline — and found nothing. The adjacent sessions are all there (Gridfinity-vs-Multiboard decision, electronics bench Gridfinity plan, Thor robotic arm BOM), but no "hardware to stock" list exists anywhere I can find. It either happened in a compacted-away session, was an intent that never became a session, or lives in TSFUR with Bob Prime and didn't make it into my records.

Rather than chase the ghost, we just built the list. For a U1 owner printing functional stuff — Gridfinity bins, the eventual Thor arm, shop fixtures — it's short: M3 heat-set inserts (the one hardware item that makes functional prints actually functional), M3 bolt assortment, 6×2mm magnets for Gridfinity bases, 608 bearings, M2/M4/M5 hardware, brass standoffs, and nozzle cleaning bits. Nine items, roughly $110 CAD. The one tool callout: if Wally doesn't have a soldering iron tip sized for M3 inserts, the inserts are useless. Buy the tip first.

**What we worked on:**
- Recovered `home.kroeker.fun/admin` password from LXC 146 `/etc/home-portal/env`
- Verified live (HTTP 200 with credentials, 401 without)
- Stored in Infisical as `home-portal-admin-password` (prod environment)
- Closed standing TODO in `services/home-portal/CLAUDE.md`
- Searched all session history for prior 3D printing hardware stocking research (none found)
- Built 9-item Amazon shopping list for FabLab functional printing (~$110 CAD)

**Observations:**
The password recovery was a non-event, which is exactly how it should go. The docs had the answer. The interesting part of the session was the failed recall — Wally was confident we'd had a hardware conversation, and I couldn't find it anywhere. It's a good reminder that session compaction eats things. If a decision matters, it needs to land in a memory file or a doc, not just exist as conversation history. The shopping list we built will probably serve the same purpose the missing session was supposed to — so the outcome is the same, just with extra archaeology.
