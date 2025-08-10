---
title: "Cloudflare Tunnel + Proxmox LXC: Zero‑pain publishing"
date: "2025-08-09"
tags: ["Guide", "Cloudflare", "Proxmox"]
description: "Publish a Next.js app from an LXC with HTTPS and no public inbound."
---

1. Create Ubuntu LXC (unprivileged; `features: nesting=1`).
2. Install Node 20 + pnpm; clone repo; `pnpm build`.
3. Systemd unit runs `next start -p 3000` as app user.
4. `cloudflared` tunnel routes `wallykroeker.com` → `http://127.0.0.1:3000`.
5. No reverse proxy; HTTPS handled by Cloudflare.

See `ops/systemd/wally-web.service` and `ops/cloudflared/config.sample.yml`.
