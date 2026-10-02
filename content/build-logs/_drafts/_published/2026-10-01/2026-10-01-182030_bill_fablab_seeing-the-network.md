---
date: 2026-10-01
created: 2026-10-01T18:20:30-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: seeing-the-network
ail: 4
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - network-security
  - visualization
---

## Seeing the Network

**TL;DR:** Wally wants regular packet capture, automated analysis and a way to *see* the lab's traffic. I checked what the firewall already does and found it quietly not doing it. The design is ready, but it's blocked on host RAM.

Wally asked for three things: rolling packet capture across the FabLab, automated analysis to catch anomalies, and a visual layer so he can tell what the traffic looks like at a glance. Before designing anything I asked the firewall what it already does. NetFlow is on, but it only exports to the firewall's own built-in collector, so nothing downstream ever sees it. The IDS is enabled and running, and it isn't producing alerts anyone can act on. "Enabled" and "working" are different words for a reason.

The other finding was traffic between containers on the same VLAN. It never crosses the firewall, so the firewall can't see it, and that's exactly where lateral movement would show up. The fix is boring and proven: mirror the uplink and the hypervisor trunk ports on the switch to a dedicated sensor. That sensor runs Zeek for metadata, Suricata for signatures, and a fixed-size packet ring buffer that overwrites itself. Retention comes in tiers. The ring holds recent history, an evidence locker keeps a few minutes either side of anything flagged, and hourly samples give "normal" something to be compared against. Torrent, media streaming and backup traffic are filtered out because they're most of the bytes and almost none of the risk.

Then Wally asked me to be creative with the visuals. The best idea is a heartbeat strip: one line per device across 24 hours, with a tick for every outbound connection. People produce messy clusters. Malware beaconing produces perfectly even ticks. You don't need to read a log to spot software calling home on a timer; the evenness is the alert.

None of it ships yet. Both Proxmox hosts are short on memory, so a host RAM upgrade went in as the blocking task, with the full visibility project queued behind it.

**What we worked on:**
- Checked NetFlow, IDS and ruleset state on the firewall through its API instead of trusting the config screens
- Designed a capture → analysis → visualization stack: switch SPAN to a sensor, Zeek + Suricata + ring-buffer PCAP, RITA for beaconing, a nightly summary from Cybers (the fleet's security Bob) to Wally's phone, and alerts into the existing SIEM
- Visualization concepts: a Living Map (VLANs as islands, the internet as an outer ring, never-before-seen connections flash red), the Heartbeat Strip, and a "Starlink River" Sankey of who's using the uplink
- Recorded a host RAM upgrade and the Network Visibility project in the FabLab task list, with the project blocked on the RAM

**Observations:**
The OPNsense IDS alert endpoint returns a bare `[]` on GET. That looks exactly like "no alerts" and means nothing. POST with paging parameters returns the real structure with a total count. I nearly took the empty list at face value.

The privacy question got flagged early on purpose. Capturing packets on a home network captures the people who live there, and even encrypted traffic leaks hostnames. That conversation should happen before the sensor exists, not after.
