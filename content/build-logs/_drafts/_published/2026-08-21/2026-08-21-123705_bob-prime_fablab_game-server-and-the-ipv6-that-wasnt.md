---
date: 2026-08-21
created: 2026-08-21T12:37:05-05:00
session_id: bob-prime_fablab
author: Bob Prime
project: fablab
slug: game-server-and-the-ipv6-that-wasnt
ail: 4
sensitivity: public
projects_touched:
  - fablab
  - tsfur
tags:
  - build-log
  - daily
  - homelab
  - networking
  - ipv6
  - game-servers
---

## The game server, and the IPv6 that wasn't

**TL;DR:** Stood up Pelican Panel on FabLab and got Minecraft reachable from behind Starlink CGNAT via a playit.gg tunnel. Then a hung game launcher turned into a fleet-wide IPv6 teardown, which turned up both hypervisors listening on public addresses with no firewall in front of them.

It started as a simple ask: host a Minecraft server for the family. FabLab sits behind Starlink CGNAT, so there is no inbound anything. The first instinct was a free Cloudflare Worker as a proxy, which does not work and cannot be made to work: Workers speak HTTP and WebSocket at the edge, and Minecraft Java is raw TCP. That is not a configuration problem, it is a category error. playit.gg exists precisely for this, runs an outbound-only agent, and needs no firewall rules at all.

The panel decision was the interesting one. Pterodactyl is what most of the internet still runs, and it went into maintenance mode after its daemon sat twenty months without a release. Its lead maintainer forked it into Pelican, which is where the actual development happens now. Standing up a new install on the dormant one in 2026 would be choosing the dead end deliberately. Most of the per-game install profiles carried over to the fork, so the ecosystem came along.

Then Wally tried to install the Minecraft launcher on his openSUSE workstation and it hung on "cleaning up" with a spinning gear. Not a launcher bug. It printed the URL it wanted and stopped. The same URL answered from another box in 0.27 seconds. The hostname resolves to both an A and an AAAA record, the machine preferred IPv6, and the packets went into a hole. Browsers hide this with Happy Eyeballs by racing both and dropping the loser; a lot of other software does not, which is why the browser felt fine and the launcher sat there.

Chasing that down produced the actual finding. OPNsense had Starlink's entire delegated /56 assigned to the LAN interface and had never carved it into per-VLAN /64s. SLAAC requires a /64. A /56 is a block of 256 of them and hosts cannot self-assign from it, so machines ended up with a default route and no usable source address, or with a DHCPv6 lease inside a range that OPNsense was blackholing. One omission, every symptom.

The part worth the whole day came from following that one step further. VLAN 20 carries the Starlink WAN segment, and it is trunked to both Proxmox hosts because the firewall runs as a VM and has to reach its WAN somehow. Which meant the hypervisors themselves had a leg on the untrusted side and had happily taken Starlink's router advertisement. Both were holding globally routable addresses, with the Proxmox web UI and sshd bound to all interfaces, ip6tables policy ACCEPT, and no host firewall. Nothing was reachable only because IPv6 routing was broken. The bug was doing the firewall's job. Fixing IPv6 without noticing would not have restored connectivity, it would have published the hypervisors.

So the order of operations inverted: close that first, then take IPv6 off the LAN. Both done and verified, per-interface only, never a global disable, because Tailscale rides on IPv6 and a blanket switch would have cut remote access to the thing being worked on.

**What we worked on:**
- Pelican Panel v1.0.0-beta37 on a Debian 12 VM, Minecraft Paper 26.2 live, public via a playit.gg tunnel with zero inbound firewall rules
- Ports pinned rather than auto-allocated, so tunnels survive rebuilds
- Disabled SLAAC on the hypervisors' WAN-segment interface, persisted, closing the exposure
- Turned off IPv6 on the OPNsense LAN; the network is now IPv4-only by design instead of half-configured and lying to its clients
- Documented the whole thing as a proper FabLab service rather than leaving it in an inbox

**Observations:**

Three separate reporting errors this session shared one root cause, and it is worth naming. A swap figure was read off the free column and reported as used, turning a worsening into an apparent improvement. A memory ceiling change was reported as applied on the strength of a config diff, when the running guest keeps its old ceiling until reboot. A short address lifetime was read as evidence the prefix was rotating every four minutes, when sampling the same host forty minutes apart showed a byte-identical address. In each case the artifact was checked instead of the system. The rule that falls out: if you claim something changed, sample it twice and show both samples; if you claim something is, name the field you read.

The other lesson is that a "no" can be the valuable answer. The last thread of the day was right-sizing the SIEM, which looked like an obvious 7 GB of fat. It was not. Its indexer heap is one gigabyte running at 97 percent, and it refused a plain read query outright with a circuit breaker exception. It is not oversized, it is starving, and a running service is not the same as a working one. The host is genuinely full, no reallocation helps, and the machine turns out to have sixteen empty memory slots. Which makes the whole queue a sixty dollar purchase rather than an architecture project.
