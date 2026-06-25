---
date: 2026-06-14
created: 2026-06-14T14:58:53-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: admin-portal-link-audit
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - networking
  - dns
  - infrastructure
  - homelab
---

## Admin Portal Link Audit

**TL;DR:** Audited all 20 links on `home.kroeker.fun/admin` and fixed 8 of them — DNS records pointing at the wrong host, wrong subdomain URLs in code, a Docker port bound to localhost, and several decommissioned services that were still listed.

Wally noticed the Proxmox links on the admin portal weren't working. Simple enough to check. Ran curl against all 20 services listed on the page and got back a mix of 200s, 000s, and 502s. The kind of result that tells you something is wrong but doesn't immediately tell you what.

First finding: `host1.infra.kroeker.fun` and `host2.infra.kroeker.fun` were both resolving to `10.10.10.48` — the Caddy LXC. Some earlier DNS operation had stomped them. Caddy doesn't listen on port 8006, so Proxmox connections silently failed. Fix was mechanical: delete the wrong records, re-add with the actual IPs (10.10.10.10, 10.10.10.12). Lesson that keeps showing up: `000` from curl looks identical whether a service is down or whether DNS is pointing at the wrong host. Always `dig @10.10.10.1` first.

Second batch was code-level mismatches in `services.ts`. Uptime Kuma was listed as `uptime.mgmt.kroeker.fun` but Caddy serves it as `uptime.apps.kroeker.fun`. Wazuh similarly — `wazuh.mgmt` in the portal, `wazuh.infra` in the Caddy config. No DNS records existed for the wrong subdomains so they silently 000'd. Also pulled n8n, Guacamole, and AIChat from the list — all three were decommissioned already, just hadn't been cleaned up from the page.

Third thing was Umami. The LXC was running, Docker container was healthy, but `curl` to the IP returned nothing. Turned out the port was bound to `127.0.0.1:3800` — accessible only from inside the container. The Cloudflare tunnel worked fine because it colocates with the service. Caddy on LXC 146 couldn't reach it at all. Changed the binding to `10.10.10.41:3800`, added a Caddy site config, updated the DNS record to point through Caddy. Standard pattern, now working.

**What we worked on:**
- Fixed `host1`/`host2` DNS records — both were pointing at Caddy LXC instead of Proxmox hosts
- Fixed Uptime Kuma and Wazuh URLs in `services.ts` (wrong subdomains vs Caddy config)
- Removed decommissioned services from admin portal: n8n, Guacamole, AIChat
- Fixed Umami: rebound Docker port from `127.0.0.1` to LXC IP, added `umami.caddy`, updated DNS to route through Caddy
- Deployed all changes to LXC 146, verified end-to-end

**Observations:**
Four services are still broken and need a decision — Cobalt lost its backend when the n8n LXC was decommissioned (they were colocated), OMV has no DNS record and no Caddy config at all, and Nomad/Seafile are stopped LXCs from the May onboot audit. None of those are surprises, just deferred work. The portal's in better shape than when we started — went from 8 broken links to 4, and those 4 are knowingly broken rather than silently misconfigured.
