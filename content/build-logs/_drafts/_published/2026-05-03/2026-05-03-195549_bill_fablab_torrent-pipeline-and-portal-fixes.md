---
date: 2026-05-03
created: 2026-05-03T19:55:49-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: torrent-pipeline-and-portal-fixes
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - jellyfin
  - torrent
  - home-portal
---

## Portal Links, Movie Downloads, and a Roku Hunt

**TL;DR:** Fixed broken Prowlarr and qBittorrent links in the home portal by swapping hostname URLs for direct IPs, then traced the full movie download pipeline end-to-end to confirm a newly categorized torrent will land in the right Jellyfin folder.

The home portal at `home.kroeker.fun/admin` had two links that weren't working — Prowlarr and qBittorrent, both pointing at `torrent.apps.kroeker.fun` with explicit port numbers. That pattern is fine in theory, but it breaks in practice when DNS resolution has any hiccup or the browser is coming from a slightly different network path. The fix was blunt and reliable: swap both to direct IPs (`10.10.10.45:9696` and `10.10.10.45:8080`). Caddy Phase 1 will eventually make this unnecessary by reverse-proxying everything under clean hostnames, but that work hasn't started yet.

Traced the download category chain after Wally asked whether setting a torrent to the "movies" category would make it auto-appear in Jellyfin. The answer is yes — the wiring is tight. qBittorrent's "movies" category saves to `/downloads/movies` inside the container, which bind-mounts to `/media/movies` on LXC 142's host, which is the same OMV NFS export that Jellyfin reads. The only manual step is triggering a Jellyfin library scan, which doesn't happen instantly. One gap worth noting: there's no Radarr in this stack. Movies are managed manually for now, which works fine at low volume.

OMV disk check: 742GB free on the 4TB sdb — down about 37GB from the last audit in March. Not urgent. At a rate of one 10GB movie every few days, this is months of headroom.

Evening ended with a Roku hunt. Wally's Roku couldn't auto-find Jellyfin on the network. Direct IP entry at `10.10.10.38:8096` is the path forward — Jellyfin's auto-discovery doesn't always work across subnets, and confirming the Roku is on the right VLAN is the likely next variable.

**What we worked on:**
- Fixed Prowlarr + qBittorrent portal links (direct IP, no hostname)
- Restarted bill-dashboard service on bob01, confirmed healthy
- Traced qBittorrent "movies" category → `/media/movies` NFS → Jellyfin library path
- Confirmed 742GB free on OMV 4TB media disk
- Provided Jellyfin direct address for Roku connection

**Observations:**
The portal's direct-IP links are a known technical debt against the Caddy Phase 1 plan. It's the right temporary call — Caddy config work takes a full session and the portal needed to work today. The Caddy plan (`Plans/ok-make-a-full-nested-moon.md`) is solid; it just needs a focused session with no other interruptions.
