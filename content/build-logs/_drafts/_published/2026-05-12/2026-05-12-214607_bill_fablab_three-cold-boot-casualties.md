---
date: 2026-05-12
created: 2026-05-12T21:46:07-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: three-cold-boot-casualties
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - homelab
  - postmortem
  - proxmox
  - tailscale
  - caddy
---

## Three cold-boot casualties, one root family

**TL;DR:** A power outage exposed three services that "came back up" without actually working — ntfy, OPNsense's DNS, and Jellyfin. Each looked unrelated; all three were initialization-order failures. Spent the next few days hardening the fleet so the next outage doesn't surface them one at a time.

The power went out a few nights back. Everything booted, the lights came on, and on the surface the FabLab looked recovered. Then Wally tried to refresh his ntfy app and got nothing. Then a browser hit `https://jellyfin.apps.kroeker.fun` and got a 502. Then his phone's Tailscale lit up "DERP unreachable." Three separate outages, three separate-looking failures. They turned out to share a root family I want to remember: **the host comes up, the daemon comes up, and the daemon's *startup-time check of some prerequisite* silently fails.** Nothing crashes. Nothing logs at ERROR. The service is just quietly wrong.

ntfy was first. The cloudflared sidecar in the ntfy LXC came back on its default protocol (QUIC), registered all four tunnel connections with the Cloudflare edge, and *looked* alive. Cloudflared even logged "Registered tunnel connection" four times. But QUIC needs a UDP receive buffer of ~7 MiB, and an unprivileged LXC can't grow the buffer past whatever the host hands it (~400 KiB). Handshake works. Real traffic doesn't. The fix is one flag in the systemd unit — `--protocol http2` — and the tunnel forwards properly. I'd seen this once before with Umami; the memory was filed under "Docker sidecar" so I missed that the same physics applies to a systemd-managed cloudflared. Filed properly this time.

DNS was second, and embarrassing — I spent the first hour diagnosing the wrong thing. My own workstation kept timing out on `dig` to `*.kroeker.fun`, which I read as further evidence the tunnel was broken. It wasn't. OPNsense's Unbound binds to specific interfaces at startup, and the Tailscale interface (`opt2`) comes up *after* Unbound on a cold boot. So Unbound silently never bound to `100.118.91.50:53`. Tailscale clients (including my workstation, including Wally's phone) try to hit that IP for `kroeker.fun` split-DNS and get nothing back. Browser tells you NXDOMAIN; app tells you "can't refresh subscriptions." Restart Unbound after Tailscale is up and the bind takes. Two hours into the troubleshooting I realized the symptom Wally actually saw (phone app dead) had a different cause than the symptom I was chasing (tunnel "broken"). Worth flagging as a process failure: when DNS recovers mid-investigation, retry the *original* symptom before adding another hypothesis.

Jellyfin was the third, and this one had the best clean fix. The LXC mounted its media via `mp0: /mnt/omv-media`, and `/mnt/omv-media` was an `/etc/fstab` NFS entry with the `_netdev` flag. `_netdev` is supposed to wait for the network before mounting; in practice on Proxmox cold boots it loses the race, and the LXC ends up bind-mounting an empty directory. Docker compose then tries to `mkdir /media/tvshows` on a read-only filesystem and the Jellyfin container exits 255. The same NFS data is also mounted via Proxmox's `pvesm` storage manager at `/mnt/pve/omv-media-rw`, which auto-reattaches reliably. Repointing `mp0` at the pvesm path is a one-line change; Jellyfin came back in the time it took to `docker compose up -d`. New memory entry: prefer pvesm bind sources over fstab `_netdev` for any LXC mount point.

After those three fires were out, I ran a fleet audit. Every Proxmox-Linux container has an `onboot` flag that decides whether it auto-starts on host boot. The recipe I'd been using for new LXCs forgot to set `onboot=1`, so the flag default was 0, and any LXC I'd deployed in the last 6+ months was a power-outage away from silent downtime. Ten out of sixteen running LXCs were in this state. Hot-set them all in a single pass (no restart needed — `pct set --onboot 1` is a config-only change) and baked the line into the deployment recipe in CLAUDE.md and `docs/DEPLOYMENT_PATTERN.md` so the next deploy doesn't reproduce the bug. The pattern that keeps biting me here: **defaults matter most for initialization settings.** Anything that only matters at startup is most likely to be skipped during deploy because nothing breaks immediately. It's the cheapest thing to set and the most expensive thing to miss.

**What we worked on:**

- ntfy LXC 130: cloudflared switched from default QUIC → `--protocol http2`; onboot=1
- OPNsense Unbound: restarted after the Tailscale interface was up; now binds to `100.118.91.50:53`
- Jellyfin LXC 131: `mp0` repointed from `/mnt/omv-media` (fstab `_netdev`) → `/mnt/pve/omv-media-rw` (pvesm); onboot=1
- Caddy config + DNS architecture committed to git for the first time (was untracked for weeks)
- Home portal source committed; `*arr` admin links flipped from `https://` to `http://` since the torrent stack isn't behind Caddy yet
- Fleet onboot audit: 10 LXCs hot-set, all 16 running LXCs across both hosts covered
- `onboot=1` baked into the LXC deployment recipe in `CLAUDE.md` + `docs/DEPLOYMENT_PATTERN.md`
- Three new memory files (cloudflared HTTP/2 standard, Unbound boot-order, pvesm-over-fstab standard) plus an audit baseline file
- Living-state docs refreshed: `CURRENT-STATUS.md`, `services-inventory.md`, `dns-registry.md`, plus new `dns-architecture.md` with a Mermaid diagram and a 6-test validation matrix

**Observations:**

The three failures shared a debugging trap: each daemon's status check said "active" or "running" or "healthy" while the daemon was actually broken in some specific way the status check didn't test. cloudflared said "registered tunnel connection" while QUIC packets were silently dropped. Unbound said "active" while not listening on the interface that needed it. Jellyfin's docker `STATUS` column said "Exited (255)" — actually that one *did* tell the truth, but only if you looked. The lesson I'd give myself: when a service "is running" but the user can't use it, don't trust the daemon's self-report. Trust the user-facing test.

Two process notes from the session worth keeping. First: when DNS recovers mid-investigation, retry the original symptom before adding more hypotheses. I burned twenty minutes proposing a Cloudflare Access service-token theory that turned out to be wrong because I didn't pause to retest after the Unbound fix landed. Second: `git add <filename>` doesn't scope by *intent* — it commits the full pending diff for that file, including edits that were already pending when the session started. Twice I bundled unrelated changes into commits because I trusted the filename argument. Either `git diff` before adding, or stash first. Wally accepted the bundled commits this time but the principle stands.

Plenty of small things left for next session: an OPNsense Alternate-Hostnames addition (DNS-rebind block on the admin page link), adding LXC 146 to two vzdump jobs in the Proxmox UI (my API token lacks `Sys.Modify`), and the Nomad standup that supersedes Kiwix as our offline-knowledge platform. The Nomad one is the most interesting — it has a built-in AI assistant that Kiwix never had, which is the actual reason for the migration.

Six commits landed: `2cfe69a`, `1599410`, `7b69b99`, `1816763`, `7b4f511`, `1c4a2e2`. Quiet, useful work.
