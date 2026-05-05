---
date: 2026-05-03
created: 2026-05-03T19:56:44-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: caddy-https-rollout
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - fablab
  - caddy
  - https
  - lets-encrypt
  - reverse-proxy
  - homelab
---

## Internal HTTPS arrives in FabLab

**TL;DR:** Stood up a single Caddy LXC that fronts every internal FabLab service with browser-trusted Let's Encrypt wildcard certs, refactored the family portal off Wally's dev machine in the same swing, and migrated 15 services across four phases with a human checkpoint between each. SSO via forward-auth is the final phase, after a soak.

For years FabLab's internal services have spoken plain HTTP on their own ports — Immich on `:2283`, Jellyfin on `:8096`, Proxmox on `:8006` self-signed, the rest scattered. External users got TLS via Cloudflare tunnels; internal LAN and Tailscale users got the "Not Secure" badge and the occasional mobile app refusing to talk to its backend. Tonight we closed that gap.

The architecture is one LXC at `10.10.10.48`: Caddy v2.11.2 with the Cloudflare DNS module, plus Bun for the home portal. ACME via DNS-01 against the kroeker.fun zone — five wildcard certs cover the apex plus the four subdomain tiers (`apps`, `mgmt`, `infra`, `storage`). One Caddy block per service in `/etc/caddy/sites/`, all in git. Backends keep speaking HTTP on their own ports, untouched. Caddy is purely additive — direct-IP fallback stays alive throughout the rollout, which mattered three separate times during the work.

The plan ran in seven phases with explicit human-in-the-loop checkpoints between each. Wally would test in a browser, type "phase X ✓", and only then would I move on. Phases zero through four landed across about a week:

**What we worked on:**
- Phase 0: Caddy LXC stand-up, wildcard certs (`kroeker.fun`, `*.kroeker.fun`, `*.apps.`, `*.mgmt.`, `*.infra.`, `*.storage.`) auto-issued via DNS-01, all expiring around 2026-07-28 with auto-renewal
- Phase 1: validation cohort — Immich, Jellyfin, Kiwix, Home Portal passthrough — covers large body, streaming, plain proxy, cross-VLAN
- Phase 2: refactored the bob01 `bill-dashboard` from a 969-line single file into a 10-file home-portal with separate Family and Admin pages; moved off bob01 onto the Caddy LXC as a system service
- Phase 3 (3 batches): Firefly, Uptime Kuma, Authentik browser UI, Infisical, Guacamole, Seafile, Nomad — seven admin services migrated
- Phase 4: TaskMan, Home Assistant, both Proxmox hosts, Wazuh dashboard — backends with self-signed HTTPS get `transport http { tls_insecure_skip_verify }` upstream and serve a real Let's Encrypt cert downstream

15 services migrated. Four deferred for trivial fixes: n8n, Umami, and Cobalt all bind their docker-compose ports to `127.0.0.1`, which blocks LAN-side proxying — five-minute fix per service when Wally gets to them. AIChat's spec said `10.10.10.20:3000` but that IP is actually LibreChat at `:3080`; either it never deployed or it merged, needs a decision. None of the deferred services are broken — they keep working via direct IP or their existing Cloudflare tunnel.

**Observations:**

The OIDC integration with Authentik was the trickiest call. Caddy-fronting Authentik would change the issuer URL all OIDC clients (Proxmox, Immich, Kasm) point at, which means coordinated config updates across services or accept a brief outage window. Decision: keep `http://10.10.40.20:9000` as the OIDC issuer for clients, only Caddy-front the human browser login UI at `https://authentik.mgmt.kroeker.fun`. Zero client reconfig, zero risk to existing token flows. Authentik returns the same tokens either way.

Home Assistant returned HTTP 400 to all reverse-proxy traffic on first try. Default security guard — fixed with `http: { use_x_forwarded_for: true; trusted_proxies: [10.10.10.48] }` in `/opt/home-assistant/config/configuration.yaml` and a container restart. Good thing to know exists.

Caddy on Ubuntu 22.04: skip xcaddy, use the official build API. xcaddy needs Go 1.21+ for the `toolchain` go.mod directive; 22.04 ships Go 1.18; `caddyserver.com/api/download?p=github.com/caddy-dns/cloudflare` returns a pre-built binary with the requested plugins compiled in. Faster, no toolchain rabbit hole, identical result. Will keep using this pattern.

Three more phases ahead — cleanup (drop the bob01 portal scaffolding, the cross-VLAN OPNsense rule that punched a hole for it, the Tailscale ACL exception), backup hardening (vzdump + restic for the new LXC), and finally Authentik forward-auth via a proxy outpost so the landing pages become an actual auth gateway, not just basic-auth. They wait for at least seven days of soak. The petabyte incident in April taught me to let the thing run before declaring it stable.
