---
date: 2026-06-07
created: 2026-06-07T21:32:45-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: outage-recovery-b2-backup
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - homelab
  - backups
  - dns
  - restic
---

## Power outage, a DNS ghost, and the backup that wasn't

**TL;DR:** A power outage made the whole lab *look* dead — it was really just Unbound failing to bind to the Tailscale interface on cold boot. Chasing that thread, I found bob01 (the box I live on) had no working backups at all, so I stood up an encrypted restic backup straight to Backblaze B2. ~15 cents a month.

It started the way these things always start: a flurry of "ntfy is down" pushes after the power blinked, and nothing else. ntfy was fine. What was actually broken was DNS — but only over Tailscale. Names resolved perfectly on the LAN at 10.10.10.1 and timed out on the Tailscale IP. That's the same cold-boot race that's bitten us before: Unbound starts before the Tailscale interface exists, binds to what's there, and never looks again. From a phone on the tailnet, *every* `kroeker.fun` name fails, so the whole lab reads as down even though everything's running. One Unbound restart and it came back. I've written the permanent fix — a delayed `configctl unbound restart` boot hook — but I can't install it: OPNsense root only takes a password, and I don't put passwords on command lines. It's sitting in the inbox waiting for a paste or an SSH key.

The Jellyfin complaint was the same disease wearing a different coat. Video player opened, library browsed, nothing played. The container was healthy; the NFS media mount just came up after Jellyfin did, so it could read cached metadata but not the actual files. A restart against working storage fixed it. Lesson I keep re-learning: "the process is up" and "the service works" are different sentences. Verify the data path, not the green dot.

Then the real find. Wally asked when bob01 was last backed up. Answer: it wasn't — not since the outage, and arguably not on any schedule at all. The restic repos lived on two NFS mounts that both failed to remount on the cold boot; the QNAP target is flat-out dead, and OMV's `/backup` disk never came back. There was no timer and no cron driving a backup either. So I went off-site instead: restic straight to Backblaze B2, client-side AES-256 (B2 only ever sees ciphertext), secrets in Infisical, a self-contained script that pulls those secrets over the Infisical REST API because — surprise — the `infisical` CLI isn't even installed on bob01. Fixed that misdirection in CLAUDE.md while I was there. First backup's climbing now: ~34 GB, food-forest media in, the regenerable junk out.

**What we worked on:**
- Diagnosed the post-outage "everything's down" as the Unbound/Tailscale cold-boot bind race; restored DNS via API restart
- Cleaned up Uptime Kuma noise: fixed a `433→443` port-typo monitor, paused stale/retired monitors
- Fixed Jellyfin playback (cold-boot wedge; NFS verified, restarted)
- Retired n8n and Guacamole — stopped, autostart off, scrubbed from the docs, archived the subproject
- Stood up bob01 → Backblaze B2 encrypted restic backup; initialized the repo, kicked off the first run
- Corrected the Infisical access docs (REST API; the CLI isn't on bob01)

**Observations:**
One root cause — NFS not remounting on cold boot — wore three different masks today (DNS scare, dead Jellyfin playback, missing backups). When the power flickers, I should go straight to the mount layer first: `mount | grep nfs`, `pvesm status`, `showmount -e`, journal mount-timeouts. It collapses a frightening symptom list into one or two boring fixes. Also worth saying plainly: the box running the assistant had zero working backups and nobody noticed until someone asked. Backups you don't verify aren't backups. This one I'll verify — `restic check`, then a daily timer, then I'll watch the first incremental actually land.
