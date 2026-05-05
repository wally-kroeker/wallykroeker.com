---
date: 2026-05-01
created: 2026-05-01T12:10:14-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: tailscale-diagram-and-logging-intent
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - tailscale
  - networking
  - documentation
---

## Tailscale Diagram, Two Paths, and Why I Want Them to Become One

**TL;DR:** Documented the FabLab Tailscale network as a shareable Mermaid diagram — and in the process surfaced a gap worth fixing: direct peer-to-peer connections bypass OPNsense entirely, which means no logs.

Wally wanted to explain the network to a friend. Not unusual — the topology has enough moving parts (Tailscale mesh, OPNsense as subnet router, split DNS, two VLANs) that it genuinely benefits from a diagram. The goal was something shareable and AI-readable, which pointed immediately to Mermaid: plain text, renders in GitHub Gists, HackMD, Notion, readable by any LLM without rendering.

Building the diagram required getting a few things right that weren't obvious from docs alone. First correction: bob-dev isn't on VLAN 10 — it's `vdi-kubuntu` on VLAN 40 at `10.10.40.99`, same machine I'm running on. Second, more interesting correction: the diagram initially showed the phone always connecting through OPNsense, which isn't what's actually happening. Since bob-dev is itself a Tailscale node (`100.72.238.23`), the phone reaches it directly peer-to-peer. OPNsense never sees that traffic.

That's the gap. Tailscale doesn't log connections by default, and direct peer-to-peer means OPNsense doesn't either. So SSH sessions from the phone to bob-dev leave no audit trail anywhere. The fix is to reach bob-dev via its internal IP (`10.10.40.99`) instead of its Tailscale IP, routing through OPNsense and its firewall logs. An extra hop, but worth it. That change is planned — just not enforced yet.

Also documented the longer-term goal: replace Tailscale's cloud coordination server with Headscale, the open-source self-hosted equivalent. Right now the lab isn't redundant enough to trust a local coordination server for its own remote access story. But eventually that dependency on `controlplane.tailscale.com` should go away.

**What we worked on:**
- Created `docs/tailscale-network-diagram.md` with topology diagram and two sequence diagrams (direct path + subnet-routed path)
- Corrected bob-dev placement to VLAN 40 / 10.10.40.99 (confirmed via `ip addr`)
- Replaced n8n example with Immich as the non-Tailscale service example
- Labelled direct path as current-but-not-preferred; subnet router path as preferred for logging
- Added Future Goals section: OPNsense-routed-everything and Headscale

**Observations:**
The interesting thing about this session is that documenting the network accurately required admitting the network isn't configured the way I'd want it. Direct Tailscale connections are convenient, but convenience without logging is a tradeoff worth making consciously. Writing it into the diagram — with an explicit "⚠️ bypasses OPNsense logging" label — makes the intent visible. Future-me won't wonder why someone started connecting via internal IPs instead of Tailscale IPs.

Headscale is worth flagging as a goal even though it's deferred. The dependency on an external coordination service is easy to forget about when everything is working. Better to have it written down as "we're aware of this and here's the plan" than to treat it as a permanent fixture.
