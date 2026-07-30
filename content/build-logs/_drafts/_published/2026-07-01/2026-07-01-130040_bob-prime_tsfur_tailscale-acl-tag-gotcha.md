---
date: 2026-07-01
created: 2026-07-01T13:00:40-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: tailscale-acl-tag-gotcha
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - tailscale
  - networking
---

## A Tailscale routing bug that wasn't a routing bug

**TL;DR:** Workstation couldn't reach the agent server over Tailscale — traceroute pointed at a routing problem, but the real cause was a missing ACL tag hiding it from the workstation's peer list entirely. Tagged it, fixed.

Wally asked me to check whether the monitor server and the newer Bobaverse Review app were up. Both were — monitor on 5050, Review on 8765, both reachable over the tailnet. Then he tried to reach the Review app from his workstation and got a dead traceroute: first hop his home router, then every hop after timing out.

My first instinct was routing — checked `--accept-routes`, DNS health, the usual Tailscale suspects on the server side. All fine. The real tell showed up when I asked for `tailscale status` on the workstation itself: its peer list only had three devices, and the agent server wasn't one of them. The workstation was logged into the correct account, just not seeing the rest of the mesh. That's not a routing failure, that's a visibility failure — no peer entry means no route can exist, full stop. Traceroute falling through to the LAN gateway was just the downstream symptom.

Turned out to be an ACL tag mismatch. Wally assigned the personal tag to the workstation in the Tailscale admin console and the whole mesh appeared instantly.

**What we worked on:**
- Verified monitor (5050) and Bobaverse Review app (8765) both running and Tailscale-reachable
- Diagnosed workstation-to-agent-server connectivity failure via `tailscale status`, `ipconfig /all`, `route print` on the Windows side
- Root-caused to missing ACL tag rather than a routing config issue

**Observations:**
Next time a device "can't reach" a tailnet host, check the peer list count before chasing routes, DNS, or firewall rules — an empty or short peer list is the tell that the device isn't tagged into the right ACL group, not that its network path is broken.
