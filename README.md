# WallyKroeker.com

Dark-first, minimal, privacy-conscious personal site. Built with Next.js + Tailwind. Content in Markdown.

## Quick Start
```bash
pnpm install
pnpm dev
```

## Build & Run (prod)
```bash
pnpm build
pnpm start -p 3000
```

## Deploy on LXC + Cloudflare Tunnel (summary)
1. Create Ubuntu LXC (unprivileged; `features: nesting=1`).
2. Install Node 20 + pnpm. Copy `.env.example` → `.env.local` and fill values.
3. `pnpm build` → `systemctl enable --now wally-web` (see `ops/systemd/wally-web.service`).
4. Install `cloudflared`; create tunnel; configure `ops/cloudflared/config.sample.yml` and install as a service.
5. Route DNS for `wallykroeker.com` and `www` to the tunnel.
