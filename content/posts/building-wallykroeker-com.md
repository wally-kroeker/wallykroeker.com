# Building WallyKroeker.com: From Local Dev to Production

**Date:** 2025-10-14
**Tags:** Build Log, AI-Assisted Development, Next.js, Proxmox, Cloudflare Tunnel
**Description:** A full walkthrough of how I built and deployed my personal site using Claude Code, WSL, and a Proxmox LXC container—with a focus on transparent, repeatable workflows.

> **Raw note:** “I’m figuring out Wally Kroeker. I’m crafting my online presence. I want everyone to thrive, not just me. The site should reflect that philosophy and make it easy for others to reuse what I build.”

---

## Building in Public with AI

This isn’t a generic “I built a website” story—it’s about co-building with AI in an open, reproducible way.
The process emphasized **flow, documentation, and learning by doing**, using real tools that anyone can replicate.

**The setup**

* WSL 2 (Ubuntu) for local development
* Claude Code in the terminal as an AI pair programmer
* VS Code when a GUI was helpful
* A lightweight LXC container on my Proxmox homelab for production
* Cloudflare Tunnel for secure, public access—no port forwarding needed

---

## Why This Build Matters

WallyKroeker.com is meant to be more than a portfolio—it’s a public workshop.
Every technical and design choice follows one compass: **build open, useful systems so more people can thrive**.
Everything here can be forked, remixed, or adapted for your own site.

---

## Tech Stack Overview

### Frontend: Next.js 14 + Tailwind CSS

* **Why:** Modern SSR performance, clean developer experience, minimal JavaScript.
* **Style:** Dark-first (`zinc-950` background), minimal animations, zero trackers.
* **Extras:** `@tailwindcss/typography` for rich markdown rendering.

### Content: Markdown + Frontmatter

* Simple version-controlled posts—no CMS or database.
* Markdown files live under `content/posts/`, parsed with `gray-matter`, `remark`, and `rehype`.
* Auto-generated heading anchors via `rehype-slug` and `rehype-autolink-headings`.

```markdown
---
title: "Your Post Title"
date: "2025-10-14"
tags: ["Build Log"]
description: "Short description"
---

Your content here…
```

### Deployment: Proxmox LXC + Cloudflare Tunnel

* **Why:** Full control without public ports or vendor lock-in.
* **How:** Cloudflare Tunnel provides encrypted outbound connectivity; Cloudflare handles HTTPS and DNS.

---

## Development Workflow with AI

### Phase 1 – Setup & Architecture

Claude generated the base Next.js structure, Tailwind config, and markdown pipeline.
I focused on architecture and style decisions while AI handled boilerplate.

### Phase 2 – Content & Routing

Dynamic routes for posts (`/blog/[slug]`), project listings, and static generation were built collaboratively.
Deep-linking came from adding the `rehype` plugins.

### Phase 3 – Production Setup

#### Creating the LXC Container

1. Spun up an unprivileged Ubuntu container (with `nesting=1`).
2. Installed Node 22 via NVM and `pnpm` globally.
3. Cloned the repository and built the app.

**Why LXC?**

* Uses a fraction of the RAM of a full VM
* Starts in seconds
* Still isolated and easy to back up

#### Systemd Service

`/etc/systemd/system/wally-web.service`:

```ini
[Unit]
Description=WallyKroeker Next.js
After=network.target

[Service]
Type=simple
User=docker
WorkingDirectory=/home/docker/wallykroeker.com
Environment=NODE_ENV=production
ExecStart=/home/docker/.nvm/versions/node/v22.18.0/bin/node node_modules/next/dist/bin/next start -p 3000
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
ProtectSystem=full

[Install]
WantedBy=multi-user.target
```

Commands:

```bash
sudo systemctl enable wally-web
sudo systemctl start wally-web
sudo systemctl status wally-web
```

#### Cloudflare Tunnel

```bash
# install & authenticate
cloudflared tunnel login
cloudflared tunnel create wallykroeker
sudo cloudflared service install
sudo systemctl start cloudflared
```

Then, in the Cloudflare dashboard, route `wallykroeker.com` → the tunnel.
Result: public HTTPS with no open firewall ports.

---

## Git Workflow

### Local (WSL)

```bash
pnpm dev
pnpm build
git add .
git commit -m "content: new post"
git push origin main
```

### Production (LXC)

```bash
cd ~/wallykroeker.com
./scripts/redeploy.sh
```

`redeploy.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
git pull origin main
pnpm install
pnpm build
sudo systemctl restart wally-web
echo "Redeployed."
```

---

## Troubleshooting Highlights

### 1 – Module Not Found

Reinstall `pnpm`, clear and rebuild.
Check logs with `journalctl -u wally-web -n 50`.

### 2 – Port Mismatch

Ensure Cloudflare tunnel config matches the app’s port (`3000`).

### 3 – Deployment Script Skipped Pull

Always confirm `git pull` isn’t commented out—simple oversight, big effect.

---

## Working with AI as a Coding Partner

AI accelerated setup, documentation, and debugging.
It produced full workflows and testing checklists on command, while I supplied environment-specific details (network, permissions, etc.).
The collaboration felt like pairing with a fast, knowledgeable teammate who never gets tired.

---

## What’s Live

[**WallyKroeker.com**](https://wallykroeker.com)

* Home with compass-style principles and featured projects
* Blog listing with build logs like this
* Projects page linking to Cognitive Loop, StillPoint, and community spaces
* Dark, tracker-free design
* <100 KB JS footprint and lightning-fast static rendering

---

## Stack Diagram

```
Local Dev (WSL2)
│  ├── Claude Code (AI pair)
│  ├── VSCode
│  ├── pnpm dev
│  └── git push → GitHub
      ↓
GitHub (source of truth)
      ↓
Proxmox Host
│  └── Ubuntu LXC Container
│      ├── Node 22 + pnpm
│      ├── systemd (wally-web.service)
│      └── cloudflared (tunnel)
      ↓
Cloudflare Edge → wallykroeker.com
```

---

## Files You Can Reuse

* `WORKFLOW.md` – complete dev/deploy docs
* `workflow-test.md` – end-to-end validation steps
* `ops/systemd/wally-web.service` – systemd unit
* `ops/cloudflared/config.sample.yml` – tunnel template
* `scripts/redeploy.sh` – one-command deploy

Clone:

```bash
git clone https://github.com/wally-kroeker/wallykroeker.com.git
```

---

## Key Takeaways

1. **AI excels at scaffolding and documentation**—let it handle repetition.
2. **Local-first infrastructure** with Proxmox + Cloudflare Tunnel is practical and secure.
3. **Git-based deployment** keeps everything auditable and simple.
4. **Systemd** is rock-solid for running Node apps in production.
5. **Document as you go**—future you will be grateful.
6. **Test the full workflow**, not just the app.

---

## Next Steps

Coming soon:

* More build logs (n8n automation, MCP servers, AD security audits)
* Practical field guides and templates
* Reusable starter stacks for local hosting
* Cognitive Loop posts on human + AI workflows

---

## Reflection

This site isn’t an endpoint—it’s a living workspace.
Every improvement and experiment gets documented so others can adapt it.
The compass remains clear: **usefulness over perfection, transparency over mystique, community over ego.**

Now the server is quietly running, the tunnel is live, and you’re reading this on the real site.
That’s something worth celebrating.

---

**Tools**

* WSL 2 (Ubuntu 22.04)
* Claude Code (Sonnet 4.5)
* VS Code
* Next.js 14.2.5
* Tailwind CSS 3.4.7
* Proxmox VE + Ubuntu LXC
* Cloudflare Tunnel
* systemd + GitHub

**Total time:** ≈ 7 hours (build + deploy)
**Coffee:** 3 cups
**Satisfaction level:** High ✨
