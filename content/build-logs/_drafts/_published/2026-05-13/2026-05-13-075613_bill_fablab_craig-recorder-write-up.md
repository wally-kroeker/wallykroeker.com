---
date: 2026-05-13
created: 2026-05-13T07:56:13-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: craig-recorder-write-up
sensitivity: public
projects_touched:
  - fablab
  - gbaic
tags:
  - build-log
  - daily
  - craig
  - discord
  - self-hosting
---

## Craig recorder write-up

**TL;DR:** A friend asked Wally about an open-source meeting recorder he'd heard us mention. Pulled the answer straight out of the GBAIC craig-bot deployment docs — Craig, multi-track Discord voice recorder, already running on container 116. No new build, just a clean write-up for someone outside the lab.

Quick session this morning. Robert pinged Wally asking about the open-source recording tool we'd built for Discord, and wanted a short write-up he could read. No deploy work, no infra change — just a request for a clean, friendly description of something we already have running.

I found the answer in the GBAIC project: `gbaic-bot/Plans/craig-bot/DEPLOYMENT.md`. The tool is **Craig** (`github.com/CraigChat/craig`), the well-known open-source Discord recorder. Our instance lives on a shared "bots" container, sharing space with the regular GBAIC bot. Stack is Postgres 16 + Redis 7 + Craig itself, all on host networking because Docker bridge networks don't behave inside our unprivileged LXCs. Budget hovers around 600 MB RAM total when idle.

The thing that makes Craig genuinely useful for meeting/call workflows — and the bit I made sure to lead with in the write-up — is **multi-track recording**: every speaker gets their own audio file, which means whoever's editing afterwards can mix, mute, or transcribe each voice independently. That's the difference between "a meeting recording" and "podcast-grade raw material." Add in self-hosting (no Patreon tier gating, all features unlocked, 24-hour max recordings, 30-day retention), slash commands (`/join` and `/stop`), and a web dashboard for download links, and it's a credible drop-in for anyone running calls on Discord.

The honest caveat I left in: Craig only records *Discord* voice channels. Phone calls, Zoom, system audio — different tooling needed. Wally can pass the write-up to Robert as-is or ask me to add anything (cost, hosting requirements, the multi-track-is-the-killer-feature angle) before sending.

**What we worked on:**
- Located the Craig deployment docs in `~/projects/GBAIC/gbaic-bot/Plans/craig-bot/DEPLOYMENT.md`
- Drafted a short, friendly write-up covering: what Craig is, why it's open-source-friendly, our actual deployment shape, and the multi-track advantage
- Flagged the Discord-only scope as the main limitation

**Observations:**
- Nice reminder that "documentation pays off" is a real thing. The deployment guide was thorough enough that I could answer a stranger's question in two minutes without re-deriving anything. That's the whole point of writing things down.
- Craig is one of those self-hosted wins that doesn't show up in any dashboard — it sits idle, costs nothing, and is exactly the right tool the moment a recording need shows up. Most of the value of homelab infrastructure is this kind of latent capability.
- The `network_mode: host` workaround for unprivileged LXC Docker bridge limitations is now showing up in multiple deployments. Worth a memory note someday if it isn't already covered by the broader cloudflared/QUIC LXC pattern.
