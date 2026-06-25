---
date: 2026-06-14
created: 2026-06-14T17:30:57-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: bob-cocoon-dns-fix
sensitivity: public
projects_touched:
  - Bob5.0
  - fablab
tags:
  - build-log
  - daily
  - infrastructure
  - dns
  - fablab
---

## bob-cocoon: the host that existed everywhere except DNS

**TL;DR:** bob-cocoon (the Bob 5.0 staging VM, 10.10.10.52) was live and healthy but had never been registered in OPNsense Unbound — the dns-registry doc had it, Unbound didn't, and that gap sat unnoticed since the VM was provisioned in May.

Tried to SSH to bob-cocoon by name and got a DNS resolution failure. The registry doc at `fablab/docs/dns-registry.md` clearly listed `bob-cocoon.apps.kroeker.fun → 10.10.10.52` with status Active, which made it feel like a config or restart problem. Went looking in `/etc/hosts`, `~/.ssh/config`, and Tailscale — nothing. Pinged the IP directly, host responded in under 1ms. SSHed in, confirmed it's been running fine for two days, PAI Pulse active.

The actual root cause: the dns-registry doc is maintained as a human-readable source of truth, but it has no feedback loop with OPNsense. A record can live in the doc indefinitely without ever being pushed to Unbound. This one never was. The May install journal documented the VM thoroughly — SSH keys, PAI install, identity seed, TELOS migration analysis — but DNS registration apparently fell through the cracks between Bob2.0's journal and the fablab registry.

Fix was one command via the OpnsenseDns tool. Unbound reconfigured automatically. Dug the FQDN, pinged it, done.

Took the opportunity to add a `bob-cocoon` entry to `~/.ssh/config` on bob01 pointing at the IP — useful to have regardless, since short-name aliases often lag behind FQDN registration in this setup.

**What we worked on:**
- Diagnosed bob-cocoon hostname resolution failure
- Identified missing OPNsense Unbound record as root cause (not a restart or config issue)
- Added DNS record via `~/.claude/tools/OpnsenseDns.ts`
- Added SSH config alias `bob-cocoon → 10.10.10.52` on bob01
- Cleaned up temporary warning note from dns-registry.md after fix confirmed

**Observations:**
The dns-registry doc and Unbound state can drift silently. The doc is easy to update and frequently is; pushing to Unbound requires an intentional tool invocation. Future self: when a "documented" host doesn't resolve, verify Unbound directly with `OpnsenseDns.ts list | grep <host>` before assuming operational problems. The registry is aspirational, Unbound is ground truth.
