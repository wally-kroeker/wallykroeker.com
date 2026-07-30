---
date: 2026-05-18
created: 2026-05-18T10:38:47-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: proxmox-75-data-safe
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - proxmox
  - data-rescue
  - infrastructure
---

## Making the old Proxmox box safe to kill

**TL;DR:** Spent the session de-risking the wipe of an 18-year-old undocumented Proxmox host — rescued 386G of drone footage and 5G of irreplaceable workshop recordings that turned out to exist *only* on that box, pruned 152G of genuine junk, and stood up a portable Debian 12 staging VM for the Bob 5.0 upgrade. Caught one nasty silent-failure gotcha on the way.

There's an old machine on the lab network — hostname still the Proxmox default, never renamed, not in any of my docs, running PVE 6.4 that went EOL in 2022. The plan is to wipe it and rebuild it as an agent platform. The plan is also, very specifically, *not* to repeat the QNAP incident where we wiped a box and lost family photos because nobody verified the copies first. So before anything destructive, the job was to prove every byte on that host either lives somewhere else or is genuinely disposable.

It mostly did not. The May 4 audit had flagged a ~400G gap between the StuffBox guest's `QuadVideo/` directory and the copy on OMV — and the gap was real, not a rounding artifact. Three entire year-folders of drone footage (2021, 2022, plus a DVR dump) existed as *empty stub directories* on OMV: a migration someone started and never finished. Empty folders with the right names are the most dangerous kind of "looks done." Rsynced the 386G across host-to-host, byte-for-byte verified per directory, then did the same diff dance on the TV and movie libraries (those turned out genuinely mirrored — only a 5G folder of "Wisdom of Trauma" workshop recordings from 2021 was unique, so that got rescued and MD5 spot-checked too). Separately, with Wally's explicit sign-off, deleted 152G of actual junk so we weren't hauling dead weight.

The gotcha worth writing down: a nested-SSH rsync (`ssh A "rsync ... B:/path with spaces/"`) gets its remote path parsed by *two* shell layers. `'Wisdom of Trama/'` survived the first layer and got word-split by the second — rsync cheerfully wrote all 18 files into a directory called `Wisdom/`, reported the correct byte count, and exited 0. Every signal rsync gave said success. The only thing that caught it was an independent `ls` on the path I actually expected. Lesson re-learned, hard: a transfer tool's own success report is not evidence the data is where you meant to put it.

Also stood up `bob-cocoon` — a deliberately light Debian 12 cloud-init VM (2 vCPU, 4G, 20G) as a temporary home for the Bob 5.0 install. Built portable on purpose: documented vzdump→qmrestore move plan so it can hop to a different host once that host exists, credentials in the vault, DNS wired.

**What we worked on:**
- Verified the old host's drive contents live against the prior audit (no drift in 9 days)
- Rescued 386G QuadVideo gap StuffBox→OMV, per-dir byte verification
- Rescued 5G "Wisdom of Trauma" recordings, MD5 spot-checked, the only unique media item
- Pruned 152G of disposable content with explicit approval
- Verified TV/Movies libraries fully mirrored (subset content + Sonarr-reacquirable)
- Stood up `bob-cocoon` Debian 12 staging VM with move plan

**Observations:**
The boring, repetitive part — diff, verify, diff again — is the part that actually protects data. Every "likely migrated" in an audit is a landmine until someone runs the numbers. The empty-stub-directory failure mode and the nested-SSH path-truncation failure mode share a root: tooling that *reports* success while silently doing less than asked. The only defense is independent verification that doesn't trust the tool's own self-report. That principle paid for itself twice in one session.
