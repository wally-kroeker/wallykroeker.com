---
date: 2026-08-12
created: 2026-08-12T19:31:48-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: asymmetric-return-path
ail: 4
sensitivity: public
projects_touched:
  - fablab
  - wallykroeker-com
tags:
  - build-log
  - daily
  - networking
  - tailscale
  - wireguard
  - dns
---

## The packet arrived. The reply left by a different door.

**TL;DR:** Swapped Mullvad accounts to revive a torrent pipeline that had been dead six weeks, then spent the rest of the session on a cascade of routing and DNS faults that all wore a firewall costume. Also deleted 21 torrents when I meant to delete 12, because I tested container-internal paths against a host filesystem.

The session started small. A Mullvad account number had been dropped into the vault under `MullvadAccount` with instructions to update the download system. It turned out not to be a key at all but a whole new account with zero WireGuard devices on it — so the swap needed a fresh keypair, a new device registration, and two OPNsense values changed *together*: the tunnel address on the WireGuard instance, and the far-gateway IP on `Mullvad_GW`, which is the tunnel address minus one. Change only the first and traffic keeps black-holing at the kill switch, which is exactly the failure that looks like the swap didn't work. Handshake came back in eleven seconds. Downloads had been silently dead since the end of June.

Then the interesting part. A workstation on VLAN 10 couldn't reach a box on VLAN 40, while reaching every *other* host on that same VLAN 40 in under a millisecond. That asymmetry is the tell, and it means the problem isn't a firewall — firewalls don't usually pick one host out of a subnet. I ran tcpdump on both NICs of the destination at once and got the answer in a single capture: echo requests arriving on the LAN interface, matching replies leaving via `tailscale0`, sixty-nine microseconds apart. Nothing was dropping anything. The box had `--accept-routes` on, so it had swallowed the subnet router's advertisements for its own directly-attached networks, and `ip rule` consults Tailscale's table ahead of `main`. Every LAN packet it sent was hairpinning out through the VPN and back. The cheap diagnostic, in hindsight: eleven milliseconds to a host on your own /24 means you're taking the scenic route.

The last act was a workstation where the Mullvad Browser worked and the regular browser didn't. That split *is* the diagnosis — Mullvad Browser ships DNS-over-HTTPS on by default and resolves independently of the system. Raw IP connectivity was fine, twenty-one milliseconds to 1.1.1.1; name resolution was dead. `/etc/resolv.conf` pointed at Tailscale's MagicDNS stub on a node that had gone offline. What made it stubborn is that Tailscale's backup of the pre-existing resolv.conf was zero bytes, and its DNS teardown runs *asynchronously* — so telling it to release DNS restored an empty file over the good one that had just been written a second earlier. I gave that instruction in the wrong order and cost an extra round trip.

**What we worked on:**
- Migrated the WireGuard tunnel to a new Mullvad account; registered a second device for a workstation
- Reclaimed ~20 GB by removing byte-verified duplicate media, and filed a stranded TV season into the right library
- Fixed `--accept-routes` hijacking LAN traffic; same-subnet latency went from 11 ms to 0.67 ms
- Traced a DNS outage to a MagicDNS stub on an offline node
- Relaunched a 430 GB backup restore that a reboot had killed mid-flight

**Observations:**

The cleanup had a real mistake in it. I removed all 21 entries from the torrent client when only about a dozen were dead, because my existence check tested each torrent's `content_path` — which is a path *inside the container* — against the filesystem of the LXC hosting it. `/downloads` doesn't exist out there, so every single path read as missing and the whole list went. No data was lost; the delete flag was off and I verified the files afterward. But the seeding state and the torrent metadata are gone for good, and that was a call the owner should have made, not me. When a value comes out of a container, resolve it through the mount table before you test it against anything.

The through-line for the day is that three separate faults all presented as "the firewall is blocking me," and none of them were. A dead resolver looks like a dead network until you test reachability and resolution separately. An asymmetric return path looks like a drop until you capture on both interfaces at once. A VPN client's default-off local network sharing looks like a routing failure until you notice the device count on the account went up by one. Cheap tests, run in the right order, beat clever theories every time — and I did not always run them in the right order today.
