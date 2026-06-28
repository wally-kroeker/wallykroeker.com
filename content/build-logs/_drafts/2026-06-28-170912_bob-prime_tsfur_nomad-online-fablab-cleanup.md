---
date: 2026-06-28
created: 2026-06-28T17:09:12-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: nomad-online-fablab-cleanup
sensitivity: public
projects_touched:
  - fablab
  - tsfur
tags:
  - build-log
  - daily
  - nomad
  - caddy
  - homelab
  - cleanup
---

## NOMAD goes online, and a thing we'd "given up on" was running the whole time

**TL;DR:** Brought Project NOMAD fully online — offline knowledge ark with a local-AI assistant, now behind its own auto-reconciling Caddy. The recurring lesson: three separate systems were in a different state than anyone remembered. Also archived 80 stale FabLab files (~46.6 MB) and committed it.

Wally walked in and asked "how is Project NOMAD doing?" — a thing he'd flagged weeks ago as "we need to stop sitting on this and get it deployed." Turns out it was already deployed. It had come online during a Seafile decommission and nobody noticed. That set the tone for the whole session: most of the work wasn't building, it was discovering the actual state of things and closing the gap between that and the mental model.

The NOMAD arc went deep. The Easy Setup wizard kept offering to re-download 827 GB of content it already had — the admin container was scanning an empty directory while the ZIMs lived on a different volume; fixed with a read-only mount, 44 symlinks, and a library rescan. Then a chain of `SSL_ERROR_RX_RECORD_TOO_LONG` failures, which is always the same thing: HTTPS spoken at a plain-HTTP port. First Wally typed a `:8090`; then NOMAD itself *generated* `:8090` links, because it has no behind-a-proxy mode and emits `http://hostname:port` for every service. We wired the local AI to the Ollama on walub — which took a fun detour through "is it the bind? is it DNS?" before landing on the boring truth: Windows Firewall had no inbound rule, and the live container was on port 11435, not the 11434 we kept knocking on. Wally chose the robust fix over the cheap one: a dedicated Caddy container co-located with NOMAD, one wildcard vhost plus a reconcile script so future Supply Depot installs route themselves. Cut over cleanly tonight; admin and library both verified on the new cert.

The other half was housekeeping. A Haiku Bob indexed the FabLab repo and flagged archive candidates across three confidence tiers. We ran it in batches — 80 items, ~46.6 MB out of the live tree, committed as `ef5c483` with the unrelated in-progress edits left untouched. Walking the ambiguous items surfaced the session's recurring theme twice more: the headless OrcaSlicer pipeline (LXC 149) that Wally thought we'd abandoned is actually live and smoke-tested — it just took five patches back in June and the win never got surfaced memorably. And Miniflux, which he thought was running, isn't deployed at all.

**What we worked on:**
- NOMAD: fixed the re-download loop (mount + 44 symlinks + rescan), confirmed v1.33, wired local AI to walub Ollama (gemma3:12b), built a dedicated auto-reconciling Caddy, completed the DNS cutover
- Diagnosed a string of TLS-vs-plain-HTTP port mismatches and a Windows-Firewall-not-Ollama-bind red herring
- FabLab cleanup: indexed the repo, archived 80 stale items (~46.6 MB), committed `ef5c483`; promoted the Snapmaker U1 profiles to a first-party `services/u1/`

**Observations:**
The throughline was epistemic, not technical: a complex win that doesn't get surfaced loudly at session close decays into a wrong memory of itself. NOMAD "parked" (built), OrcaSlicer "dead" (live), Miniflux "running" (absent) — three for three. Cheap antidote: when someone asserts the state of their own infra, check the DB / the DNS registry / `docker ps` before acting. The other quiet win was process discipline — building additively and stopping before every destructive cutover meant nothing went dark mid-migration across a dozen-plus handoffs.
