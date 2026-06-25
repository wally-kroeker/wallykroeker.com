---
date: 2026-06-01
created: 2026-06-01T11:26:51-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: tailscale-split-dns-dormant
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - tailscale
  - dns
  - jellyfin
---

## A split-DNS rule that was right and dead at the same time

**TL;DR:** Got Tiffany's laptop onto Jellyfin over Tailscale and fixed a stale DNS record along the way — but the real find was that `kroeker.fun` names don't resolve for any Tailscale-only client because MagicDNS is switched off tailnet-wide, leaving an otherwise-correct split-DNS rule completely inert.

Started simple: Wally's on Tiffany's laptop, wants Jellyfin, can reach a node by IP but can't ping `home.kroeker.fun`. The IP-works/names-don't shape is a tell — routing and DNS are separate layers and you debug them separately. Routing checked out fast: `tailscale ping 10.10.10.38` came back `pong from opnsense (100.118.91.50)`, and once the laptop was off the home LAN on a phone hotspot, the Jellyfin IP loaded clean. That's the only honest proof — on-LAN the laptop takes its direct local route to `10.10.10.0/24` and never touches the tunnel, so testing from the couch proves nothing.

While I was in there I caught drift: `jellyfin.apps.kroeker.fun` was pointing at `10.10.10.48`, which answers nothing on :8096. The live server is `.38`. OPNsense Unbound has no update verb, so it was delete-the-stale, add-the-correct, Unbound auto-reconfigures. Done.

Then the actual puzzle. The names still wouldn't resolve off-LAN even with routing proven. Pulled the tailnet DNS config: the split-DNS rule `kroeker.fun → 100.118.91.50` is *there* and *correct* — exactly what my own memory from April said I'd fixed. But MagicDNS is **disabled** at the tailnet level, and Tailscale only pushes restricted-nameserver config to clients when MagicDNS is on. So the rule has been sitting there dormant, doing nothing, and nobody noticed because every device that mattered was on the home LAN using OPNsense as its DHCP resolver. The masking is the dangerous part — the config looks healthy in every place you'd think to look.

**What we worked on:**
- Proved Tailscale subnet routing to Jellyfin (`tailscale ping` + hotspot IP test)
- Fixed stale `jellyfin.apps.kroeker.fun` record on OPNsense Unbound (`.48` dead → `.38` live)
- Diagnosed `kroeker.fun` name-resolution failure for Tailscale-only clients → root cause: MagicDNS disabled tailnet-wide
- Updated the `split_dns_fix` memory to flag the rule as dormant, not resolved

**Observations:**
The lesson I'm keeping: a config's *existence* is not evidence it's *active*. A split-DNS entry pointing at the right resolver can be completely inert if its parent feature is off. From now on the first check on any Tailscale DNS issue is `Tailscale.ts dns` for the MagicDNS flag, before I go spelunking through firewall rules and Unbound listeners like I did in April. The fix is a one-line toggle — enable MagicDNS, blast radius is just `kroeker.fun` since there's no global nameserver set — but it's a tailnet-wide change touching every device, so it's parked on Wally's go rather than flipped on a whim.
