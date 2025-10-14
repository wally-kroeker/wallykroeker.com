---
title: "Building WallyKroeker.com: Vibe Coding from WSL to Production"
date: "2025-10-14"
tags: ["Build Log", "AI-Assisted Development", "Next.js", "Proxmox", "Cloudflare Tunnel"]
description: "How I built and deployed a production site using Claude Code, WSL, and a Proxmox LXC container. A complete walkthrough for vibe coders."
---

> **Raw note:** "I need to figure out Wally Kroeker. I'm crafting my online presence. I want everyone to thrive, not just me. The site should reflect that philosophy and make it easy for others to reuse what I build."

## The Vibe: Building in Public with AI

This isn't your typical "I built a website" post. This is about **vibe coding**—that beautiful flow state where you, an AI assistant, and your tools work together to ship something real. No BS. No mystique. Just the actual journey from idea to production.

**The setup:**
- WSL2 (Ubuntu) on my Windows machine for development
- Claude Code in the terminal for AI pair programming
- VSCode when I needed a GUI
- Proxmox LXC container on my homelab for production
- Cloudflare Tunnel to make it all public (no port forwarding!)

## Why This Build Matters

WallyKroeker.com is more than a portfolio—it's a public workshop. Every choice, from tech stack to deployment, follows the compass: **Build open, useful systems so more people can thrive.**

If you're reading this, you can fork it, copy it, remix it. That's the point.

## The Tech Stack (and Why)

### Frontend: Next.js 14 + Tailwind CSS
**Why:** Fast, flexible, minimal JavaScript. Server-side rendering for speed. Tailwind keeps styling sane.

**The vibe:** Dark-first design (zinc-950 background), no animations, no trackers. Clean typography with `@tailwindcss/typography` for blog posts.

### Content: Markdown with Frontmatter
**Why:** Version control everything. No database to manage. Just files.

**How it works:**
- Blog posts in `content/posts/*.md`
- Frontmatter for metadata (title, date, tags, description)
- Parsed with `gray-matter` and rendered with `unified/remark/rehype`
- Auto-generated heading anchors for deep linking

```markdown
---
title: "Your Post Title"
date: "2025-10-14"
tags: ["Build Log"]
description: "Short description"
---

Your content here...
```

### Deployment: Proxmox LXC + Cloudflare Tunnel
**Why:** Full control, no cloud vendor lock-in, secure publishing without exposing my homelab to the internet.

**The magic:** Cloudflare Tunnel creates a secure connection from my LXC container to Cloudflare's edge, which handles HTTPS and routes traffic to `wallykroeker.com`. Zero inbound ports open on my network.

## The Development Workflow: Vibe Coding with Claude

Here's where it gets interesting. I didn't build this alone—I paired with Claude Code running in my WSL terminal.

### Phase 1: Setup & Architecture (30 minutes)

**Me:** "I want a minimal dark site for my projects and blog posts. Next.js, Tailwind, Markdown content."

**Claude Code:**
- Generated the Next.js 14 App Router structure
- Set up Tailwind with custom zinc color palette
- Created the markdown processing pipeline
- Built reusable components (Header, Footer, Container, Prose)

**The vibe:** I focused on the "what" and "why," Claude handled the "how" and boilerplate. We moved fast.

### Phase 2: Content & Pages (1 hour)

**Me:** "I need these pages: Home with featured projects, Blog listing, individual post pages, Projects, Community, Work With Me."

**Claude Code:**
- Created the app router structure
- Built dynamic routes for blog posts (`/blog/[slug]`)
- Set up static generation for all pages
- Implemented the projects data structure

**Key moment:** When I asked "How do I make heading anchors clickable?", Claude added `rehype-slug` and `rehype-autolink-headings` to the pipeline. Instant deep linking.

### Phase 3: Production Setup (The Real Adventure)

This is where most tutorials end, but this is where the real learning happens.

#### The Proxmox LXC Container

**What I did:**
1. Created an Ubuntu LXC container in Proxmox (unprivileged, `features: nesting=1`)
2. SSH'd in as the `docker` user
3. Installed Node.js 22 via NVM
4. Installed pnpm globally

**Why LXC over a VM?**
- Lightweight (uses ~30MB RAM vs. 500MB+ for a VM)
- Fast startup (seconds vs. minutes)
- Isolated but shares the host kernel
- Perfect for single-purpose services

#### The Systemd Service

**The breakthrough:** Instead of running `pnpm dev` forever, I created a proper systemd service at `/etc/systemd/system/wally-web.service`:

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

**Commands:**
```bash
sudo systemctl enable wally-web
sudo systemctl start wally-web
sudo systemctl status wally-web  # Check it's running
```

**The payoff:** The site now starts on boot, restarts if it crashes, runs as a non-root user, and logs to journalctl.

#### Cloudflare Tunnel (The Game Changer)

**Traditional setup:** Open port 443, configure reverse proxy (nginx/caddy), manage SSL certificates, worry about DDoS.

**Cloudflare Tunnel:** Outbound connection only, HTTPS handled by Cloudflare, zero exposed ports.

**Setup:**
```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Login and create tunnel
cloudflared tunnel login
cloudflared tunnel create wallykroeker

# Configure the tunnel (points to localhost:3000)
# Then install as a service
sudo cloudflared service install
sudo systemctl start cloudflared
```

**Route DNS:** In Cloudflare dashboard, point `wallykroeker.com` to the tunnel.

**Result:** Site is live at https://wallykroeker.com with HTTPS, zero firewall changes.

## The Git Workflow: Dev → GitHub → Production

This took some iteration to get right. Here's what works:

### On Dev Machine (WSL):
```bash
# Make changes
pnpm dev  # Test locally at http://localhost:3000

# Lint and build
pnpm lint
pnpm build  # Must succeed

# Commit and push
git add .
git commit -m "content: add new blog post"
git push origin main
```

### On Production (LXC Container):
```bash
# SSH in
ssh docker@10.10.10.21

# Run the deployment script
cd /home/docker/wallykroeker.com
./scripts/redeploy.sh
```

**What `redeploy.sh` does:**
```bash
#!/usr/bin/env bash
set -euo pipefail
cd /home/docker/wallykroeker.com
git pull origin main       # Pull latest from GitHub
pnpm install              # Update dependencies
pnpm build                # Build production bundle
sudo systemctl restart wally-web  # Restart the service
echo "Redeployed."
```

**The flow:** Dev → GitHub → Production. GitHub is the source of truth.

## The Challenges (aka The Learning)

### Challenge 1: Module Not Found Errors

**What happened:** Service was running but returning "Internal Server Error."

**The problem:** Dependencies weren't installed correctly. The `node_modules` existed but something was corrupted.

**The fix:**
```bash
# Reinstall pnpm
npm install -g pnpm

# Clean reinstall
pnpm install
pnpm build
sudo systemctl restart wally-web
```

**Lesson:** Always check the service logs: `sudo journalctl -u wally-web -n 50`

### Challenge 2: Port Mismatch

**What happened:** Cloudflare Tunnel was routing to port 8080, but the app was running on port 3000.

**The fix:** Updated the tunnel configuration to point to `http://localhost:3000`

**Lesson:** When debugging, check EVERY part of the chain:
- Is the app running? `curl http://localhost:3000`
- Is the service healthy? `systemctl status wally-web`
- What port is listening? `sudo lsof -i :3000`
- What's the tunnel pointing to? Check tunnel config

### Challenge 3: Git Pull in Deployment Script

**What happened:** The `redeploy.sh` script had `# git pull` commented out. Deployment wasn't pulling latest changes!

**The fix:** Uncommented it to `git pull origin main`

**Lesson:** Read your deployment scripts. Every line matters.

## The AI Pair Programming Experience

Working with Claude Code was different from StackOverflow/ChatGPT. Some observations:

**What worked amazingly:**
- **Workflow documentation:** "Create a complete WORKFLOW.md with all the steps" → Got 500+ lines of detailed docs
- **Debugging:** "The app is returning 'Internal Server Error', check the logs and diagnose" → Found MODULE_NOT_FOUND issues
- **Testing:** "Create a test script to validate the entire workflow" → Got a 9-step validation checklist
- **Context awareness:** Claude remembered the entire conversation, so I didn't repeat myself

**What required iteration:**
- **Production specifics:** Claude couldn't know my Proxmox IP or SSH setup, I had to provide those details
- **Environment differences:** WSL vs. LXC vs. systemd all have quirks
- **Permissions:** Sudo passwords, service restarts, file ownership took human judgment

**The vibe:** Like pairing with a very knowledgeable junior dev who can type 200 WPM but needs you to make final decisions.

## What's Live Right Now

Visit https://wallykroeker.com and you'll see:

- **Homepage:** Hero section, compass (my operating principles), featured projects
- **Blog:** This post and more build logs
- **Projects:** Links to Cognitive Loop, Discord community, StillPoint
- **Dark-first design:** zinc-950 background, clean typography, zero trackers
- **Fast:** <100KB page weight, server-side rendering, optimized builds

**Performance:**
- First Load JS: ~87KB (mostly Next.js framework)
- Static pages: 166 bytes per page
- Build time: ~5 seconds for 14 routes

## The Complete Stack Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Dev Machine (WSL2)                                     │
│  ├── Claude Code (AI pair programmer)                   │
│  ├── VSCode (when I need a GUI)                        │
│  ├── pnpm dev (localhost:3000)                         │
│  └── Git (push to GitHub)                              │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  GitHub (Source of Truth)                               │
│  └── github.com/wally-kroeker/wallykroeker.com         │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  Proxmox Host (10.10.10.21)                            │
│  └── LXC Container (Ubuntu)                            │
│      ├── Node.js 22 (via NVM)                          │
│      ├── pnpm + dependencies                            │
│      ├── systemd (wally-web.service)                   │
│      │   └── next start -p 3000                        │
│      └── cloudflared (tunnel service)                  │
│          └── Routes to localhost:3000                  │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  Cloudflare Edge                                        │
│  ├── HTTPS (automatic)                                 │
│  ├── DDoS protection                                   │
│  └── DNS: wallykroeker.com → tunnel                   │
└─────────────────────────────────────────────────────────┘
                      ↓
                  Public Internet
               (wallykroeker.com)
```

## Files You Can Fork

Everything is documented and ready to reuse:

- **WORKFLOW.md** - Complete dev/git/deployment guide (559 lines)
- **workflow-test.md** - Step-by-step validation tests (426 lines)
- **CLAUDE.md** - AI agent context for future work (155 lines)
- **ops/systemd/wally-web.service** - Systemd unit file
- **ops/cloudflared/config.sample.yml** - Tunnel config template
- **scripts/redeploy.sh** - One-command deployment

Clone the repo: `git clone https://github.com/wally-kroeker/wallykroeker.com.git`

## Lessons for Vibe Coders

**1. AI is amazing for scaffolding and documentation**
Let Claude generate your boilerplate, config files, and docs. You focus on the decisions and trade-offs.

**2. Local-first infrastructure is viable again**
Proxmox + LXC + Cloudflare Tunnel = full control without cloud vendor lock-in. My monthly cost: $0 (just electricity).

**3. Git-based workflows scale**
Dev → GitHub → Production. Simple, auditable, rollback-friendly.

**4. Systemd is your friend**
Learn to write systemd services. They're rock-solid for production deployments.

**5. Document while you build**
Claude helped me create WORKFLOW.md as we went. Future me (and you) will thank past me.

**6. Test the whole workflow**
Don't just test the app—test git, deployment, restarts, everything. The workflow-test.md saved me hours.

## What's Next

This is version 1.0. What's coming:

- **More build logs:** n8n automation, MCP servers, AD security audits
- **Field guides:** Step-by-step tutorials you can follow
- **Templates & starters:** Reusable Next.js setups, LXC configs, systemd services
- **Cognitive Loop posts:** Weekly notes from my human+AI workflow

## Try It Yourself

Want to build something similar? Here's the path:

1. **Start with the idea:** What do you want to build? Who's it for?
2. **Pick your stack:** Next.js works great, but use what fits your vibe
3. **Use AI pairing:** Claude Code, Cursor, GitHub Copilot—pick one and learn to work with it
4. **Build locally first:** Get it working on `localhost` before thinking about deployment
5. **Choose your deployment:**
   - Cloud: Vercel (easy), Railway (flexible), Fly.io (powerful)
   - Self-hosted: Proxmox LXC (control), DigitalOcean (simplicity)
6. **Document as you go:** Future you will be grateful
7. **Ship it:** Done is better than perfect

## Reflection

This isn't a finished site—it's a living space. Every improvement, guide, and experiment gets documented so others can replicate or adapt it.

The compass keeps it aligned: **usefulness over perfection, transparency over mystique, community over ego.**

The production server is humming away in an LXC container, the cloudflared tunnel is routing traffic, and you're reading this on the live site. That's pretty cool.

Now go build something.

---

**Tools used:**
- WSL2 (Ubuntu 22.04)
- Claude Code (Sonnet 4.5)
- VSCode
- Next.js 14.2.5
- Tailwind CSS 3.4.7
- Proxmox VE
- Ubuntu LXC container
- Cloudflare Tunnel
- systemd
- GitHub

**Time to production:** ~4 hours (initial build) + ~3 hours (production setup + debugging)

**Coffee consumed:** 3 cups ☕

**Vibe level:** Immaculate ✨
