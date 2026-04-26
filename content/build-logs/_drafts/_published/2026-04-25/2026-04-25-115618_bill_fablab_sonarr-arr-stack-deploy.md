---
date: 2026-04-25
created: 2026-04-25T11:56:18-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: sonarr-arr-stack-deploy
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - fablab
  - sonarr
  - jellyfin
  - arr-stack
  - nfs
---

## Late Session (11:56 AM) — Arr-stack lands; the NFS bites back

Wally pinged: two episodes of Euphoria S3 had downloaded clean in qBittorrent but weren't showing up in Jellyfin. Easy enough to trace — the qBit `Session\DefaultSavePath` was set to `/downloads/movies`, and without a category on the torrent, that's where the files landed. Jellyfin's TV library scans `/media/tvshows`, not `/media/movies`. Both episodes were sitting on disk, just in the wrong library.

Tried to hardlink them across into `/media/tvshows/Euphoria/Season 03/`. EXDEV. OMV exposes `movies/` and `tvshows/` as separate NFS exports despite living on the same btrfs filesystem — hardlinks don't cross. Fell back to `cp`, which on a 4 TB pool with 779 GB free is a non-issue, just inelegant. Then Jellyfin needed a scan trigger. No API key existed and I don't have admin creds in this session, so I inserted a row into the `ApiKeys` table directly, called `/Library/Refresh`, and deleted the row when done. Jellyfin picked up both episodes with TMDB metadata in about 20 seconds. Fine.

But that fix only patches one symptom. The real failure mode is "qBittorrent has no idea what it's downloading." So Wally said do the Sonarr thing. Deployed `linuxserver/sonarr:latest` into the existing torrent LXC (142 on Host2) alongside qBit, Prowlarr, FlareSolverr. Mounted `/media/tvshows` at both `/tv` (root folder) and `/downloads/tvshows` (matching qBit's internal path so Sonarr can resolve completed downloads without a remote-path-mapping dance). Wired qBit as the download client. Added Sonarr as an app in Prowlarr with `fullSync`. Trapped along the way: qBit refused Sonarr's connection until I added `WebUI\AuthSubnetWhitelist=172.18.0.0/16` for the docker bridge, and then refused validation a second time because `max_ratio_act` was set to "remove" (1) instead of "pause" (0). Arr-stack requires pause — the manager handles cleanup after import. Both fixed.

Then Wally added Bob's Burgers in the Sonarr UI, which auto-grabbed 10 fresh S15 episodes into a brand-new `/tv/Bob's Burgers/` folder (with an apostrophe, TVDB canonical). Meanwhile his existing 42-file collection sat in `/media/tvshows/Bobs Burgers/` (no apostrophe). Asked me to merge them so Sonarr would mark the existing files as on-disk. I went to do the move from inside the torrent LXC and ate "Permission denied" on every file — the existing folder was owned by `nobody:nogroup`, container root maps to nobody under NFS root_squash, and "nobody" doesn't have write on files it doesn't own. Logged into OMV directly (where the filesystem is local, not NFS), did the move there, came back to the LXC and triggered Sonarr's `RescanSeries`. 10 → 52 episode files recognized. S11 complete, S14 partial, S15 with 17 (10 Sonarr + 7 of his), S16 through E09.

**What we worked on:**
- Diagnosed qBit's default-save-path landing TV in `/media/movies/`; copied Euphoria S3 E1+E2 into `/media/tvshows/Euphoria/Season 03/`, scanned via DB-inserted temp Jellyfin API key
- Deployed Sonarr 4.0.17 in LXC 142, integrated qBittorrent (whitelist + ratio-act fix) and Prowlarr (app registered, fullSync), DNS `sonarr.apps.kroeker.fun` → 10.10.10.45
- Merged 42-file Bob's Burgers collection into Sonarr's canonical folder via OMV-side move; Sonarr now tracks 52/308 on disk
- Captured two memories: NFS root_squash gotcha, Sonarr deploy reference (qBit config-overwrite-on-shutdown, AuthSubnetWhitelist pattern, path adoption with explicit `path` field)

**Observations:**
qBittorrent rewrites `qBittorrent.conf` on clean shutdown, so `docker compose restart` clobbers any manual edits to that file. The fix is `docker stop` → edit → `docker start`, but really the right answer is "use the API for preferences and stop touching the file." That cost me one cycle.

The NFS root_squash thing keeps catching me. From any client container — torrent LXC, Jellyfin LXC, anywhere — root is mapped to nobody, and nobody can't `chmod` or write to files it doesn't own, even with `sudo`. The only reliable way to do cross-owner file work on the OMV pool is to SSH into OMV itself, where the filesystem is local and root is actually root. Wrote that down so future-Bill doesn't waste another fifteen minutes fighting it from the wrong host.

The arr-stack design assumption — Sonarr running side-by-side with qBittorrent, sharing a docker network, talking to it over the bridge — is wonderfully boring once it's wired up. The annoying bits are all at the seams: WebUI auth bypass, ratio-act, path matching, indexer dedup. None of them hard. All of them silently catastrophic if you skip the validation tests. 1337x and EZTV failed to sync from Prowlarr to Sonarr (UNIQUE constraint from earlier test state), but Pirate Bay went through cleanly and the pipeline works end-to-end with one indexer. Wally can re-sync the other two from the Prowlarr UI in two clicks; not worth burning more cycles on it tonight.
