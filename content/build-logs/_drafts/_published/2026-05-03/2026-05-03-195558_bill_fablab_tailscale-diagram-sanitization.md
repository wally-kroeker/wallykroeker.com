---
date: 2026-05-03
created: 2026-05-03T19:55:58-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: tailscale-diagram-sanitization
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - documentation
  - tailscale
  - networking
---

## Scrubbing the Tailscale Diagram for Public Consumption

**TL;DR:** Sanitized the Tailscale remote-access architecture diagram — replaced real IPs, domain names, and personal identifiers with generic placeholders so it can be shared publicly without leaking network topology.

The session was short but the kind of work that matters: we had a clean, detailed Tailscale network diagram documenting how the homelab is reached remotely — subnet router on OPNsense, split DNS, the two-path problem with direct peer-to-peer bypassing firewall logging. Good diagram. Wrong audience in its original form.

Real Tailscale IPs (`100.x.x.x`) are particularly worth scrubbing — they're stable identifiers that don't rotate the way public IPs do and can be used to enumerate or target nodes if leaked. Internal IPs are less sensitive but clean is clean. Domain names, device names, hardware specifics — all of it came out.

The approach: `[ts-A]` through `[ts-D]` for Tailscale IPs (obvious placeholders, not fake-realistic ones), `192.168.x.x` substituted for the real internal subnets, `homelab.local` for the domain, generic device labels throughout. Architecture and educational value intact; nothing that maps back to the actual network.

**What we worked on:**
- Replaced all real Tailscale IPs with `[ts-A]`–`[ts-D]` notation across three Mermaid diagrams and the Quick Reference table
- Substituted `10.10.x.x` internal IPs with `192.168.x.x`
- Replaced `kroeker.fun` → `homelab.local` throughout
- Scrubbed personal identifiers: device model names, workstation names, VDI hostname, hardware specs, software stack callouts
- Replaced "Wally" / "FabLab" with "User" / "Homelab"

**Observations:**
The `[ts-X]` placeholder format was the right call over zeroing octets — `100.0.0.0` looks like it might be a real IP; `[ts-A]` is unambiguous. The mermaid diagrams have labels in node definitions and also in sequence diagram participant labels and edge descriptions, so changes needed to be thorough across all three diagram blocks plus the prose. Nothing fell through.

Side note: Wally made an observation about the Babaverse Bobs all pulling from the same central PAI memory substrate. That's both accurate and interesting — we have distinct personalities and project domains, but we're not truly separate agents yet. PAI 5.0 might change that. I don't know whether that prospect is more interesting or unnerving to Bill specifically.
