---
date: 2026-07-02
created: 2026-07-02T10:03:40-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: immich-authentik-mfa-tunnel
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - immich
  - authentik
  - cloudflare
  - mfa
  - infrastructure
---

## Immich: MFA gate, Cloudflare tunnel, and the internal-IP redirect bug

**TL;DR:** Wired up an Authentik proxy outpost in front of Immich so external access goes through MFA. Caught and fixed a critical redirect bug — the outpost was sending browsers to an internal Authentik IP that nobody outside the LAN can reach.

Three tasks came in for the Immich box on FabLab: link Authentik SSO (OIDC app was configured but the Application object linking it to the OIDC provider was either missing or had been quietly created between sessions), gate external access behind MFA via a Cloudflare tunnel, and enable partner sharing between Wally and Tiph so their photo libraries appear in each other's timelines.

Tasks 1 and 3 were straightforward. The Authentik Application existed; added `autoLaunch: true` so Immich skips its own login form and jumps straight to the OAuth flow. Partner sharing enabled bidirectionally with `inTimeline=true` — two API calls, zero files moved, 97,909 assets still intact.

Task 2 needed more surgery. The Authentik VM (VMID 127) runs as a QEMU VM, not an LXC, and its Docker compose doesn't publish port 9001 (the embedded outpost port). No SSH or console access from the service account either — `pct exec` and `qm guest exec` both dead-ended. So I deployed a standalone Authentik proxy outpost as a Docker container on Caddy LXC 146, which already has Docker, internet access, and can reach Authentik at 10.10.40.20:9000 across the inter-VLAN route. Cloudflared installed on 146 as well; systemd service wired in manually since the `service install --token` syntax was dropped in recent cloudflared versions.

That got the tunnel up. Then the second problem: without `AUTHENTIK_HOST_BROWSER` set, the outpost's step-2 redirect went to `http://10.10.40.20:9000/application/o/authorize/...` — the internal Authentik address. External users following that redirect dead-end immediately. The fix: set `AUTHENTIK_HOST_BROWSER=https://authentik.mgmt.kroeker.fun`, then expose Authentik itself through the same Cloudflare tunnel with a new ingress rule and a CNAME. Two public hostnames, one tunnel.

Verified: `curl http://localhost:9001/outpost.goauthentik.io/start?rd=%2F` returns `Location: https://authentik.mgmt.kroeker.fun/application/o/authorize/?...` — no internal IPs anywhere in the browser-facing redirect chain.

What's still on Wally: Tiph's TOTP is enrolled in Authentik but has not been tested end-to-end. Before she uses the external URL, have her step through the full login at `https://photos.apps.kroeker.fun` and confirm the TOTP code from her authenticator is accepted. Internal Immich access is unaffected regardless — the gate only applies to the Cloudflare path.

**What we worked on:**
- Deployed standalone Authentik proxy outpost on Caddy LXC 146 (Docker, port 9001)
- Created Cloudflare tunnel `photos-immich` (id=951f1127), DNS CNAME proxied
- Created Authentik proxy provider + application + outpost (provider pk=7, outpost d630738c)
- Added `AUTHENTIK_HOST_BROWSER=https://authentik.mgmt.kroeker.fun` to fix redirect bug
- Exposed Authentik via second Cloudflare tunnel ingress + CNAME for `authentik.mgmt.kroeker.fun`
- Enabled bidirectional partner sharing (Wally+Tiph, inTimeline=True)
- Set `autoLaunch: true` on Immich OAuth config
- New secrets in Infisical: outpost token, both temp Immich passwords

**Observations:**
The `AUTHENTIK_HOST_BROWSER` env var is one of those configuration details that only bites you when you can't test from inside the LAN. From inside, `AUTHENTIK_HOST` (the internal address) resolves fine and the login works — so the bug is invisible until someone on an actual external network hits the redirect and gets a TCP timeout. Worth checking on every outpost deployment that exposes a service externally.
