---
date: 2026-04-25
created: 2026-04-25T11:46:14-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: silent-vm-bug-double-fix
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - proxmox
  - wazuh
  - authentik
  - infisical
  - monitoring
---

## Late Morning Session (11:46 AM) — Two ghosts in the rack

A Kuma audit two days ago turned up something embarrassing: Wazuh — the SIEM, the thing whose entire job is to scream when something is wrong — had been silently dead for thirteen days. The Kuma monitor for it correctly went RED on April 9 at 04:31 UTC and then sat there, RED, for nearly two weeks, telling no one. The pipe to ntfy looked configured. The ACLs were right. Nothing fired.

Tonight (well, late night two days ago, finished now) I dug into it. Heartbeat history showed a clean UP→DOWN transition on the 9th — 42,790 successful pings, then nothing. Cross-referenced against `last -x reboot` on Host2: the host had rebooted Wed Apr 8 23:50 local. Within twenty minutes of the host coming back, the Wazuh monitor went DOWN. The math wrote itself.

`qm config 126` — no `onboot` flag. The VM hadn't been told to auto-start on boot, so when Host2 rebooted (still don't know why; that's a separate dig), the SIEM stayed asleep. Two commands fixed it: `qm set 126 --onboot 1` then `qm start 126`. Six and a half minutes for the dashboard to come up clean — HTTP 200, indexer authenticating on 9200, manager listening on 1514/1515, API on 55000. Kuma flipped UP at 05:33:50 UTC. Thirteen-day hole closed.

Then Wally asked, "is Authentik down?" Same disease. VMID 127, also stopped, also no `onboot`. Started it, set `onboot=1`, watched the login flow return its 302 redirect like it was supposed to. Then Wally asked me to rotate his Authentik password — generated a 32-char alphanumeric, stored it in Infisical first (atomic safety: if Authentik fails after, we still have the password), confirmed via readback, then `POST /core/users/8/set_password/`, HTTP 204, audit log entry to match. He pulled it into Bitwarden and it worked.

**What we worked on:**
- Diagnosed Wazuh silent downtime (Apr 9 → Apr 22) via Kuma heartbeat history + Host2 reboot timestamp
- Set `onboot=1` and started Wazuh VMID 126 — verified dashboard, indexer, manager, agent ports
- Discovered Authentik VMID 127 had the same bug; same fix
- Rotated Wally's Authentik password via API; stored in Infisical dev as `authentik-wally-password`; verified via Authentik audit event
- Wrote postmortem memory: `wazuh_silent_downtime_postmortem.md`

**Observations:**

The thing that bothered me — and still does — is that Kuma *correctly observed* the Wazuh DOWN→UP transition this session and **still didn't notify**. The notification chain is broken at a deeper layer than channel configuration. Wally cleaned out duplicate channels two days ago, leaving one webhook. The Wazuh recovery should have fired on that channel. It didn't. ntfy retention is 48h and the `alerts-infra` topic was empty when I polled. So the SIEM-watcher's watcher is also asleep.

Two recurring lessons from this:

1. **`onboot=0` is the default**, and it is the wrong default for any production VM. I'm going to sweep both Proxmox hosts next session and flip every VM/LXC that should auto-start. This bug almost certainly bit other things during the same Apr 8 reboot — Kasm and Authentik were both in the casualty list, and Wally said Kasm being down is fine, but Authentik *wasn't* fine and we only caught it because someone asked.

2. **A monitor that doesn't notify is theatre.** We're going to keep tripping on this until the notification chain is actually proven end-to-end with a real failure event, not just the "Test" button. The Test button works; the actual transition path doesn't. I have a hypothesis (the `is_default=1` flag may not bind cleanly to monitors after the explicit `monitor_notification` rows were cascaded out) but I haven't proven it.

The 13-day window is a good reminder that absence of an alert is not evidence of health. Going to operationalize that — next session, threshold scripts on Host1 (currently sustained 90% memory and would have hurt by now if we were paying attention) and a sweep of every VM's onboot flag.
