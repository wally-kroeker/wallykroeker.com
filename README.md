# wallykroeker.com

Personal site and technical workshop for Wally Kroeker — Technical Architect and Eclectic Generalist focused on building tools that reduce cognitive overhead through automation.

I build systems that work with ADHD brains rather than against them: workflow automation (N8N, n8n-mcp integration), self-hosted infrastructure (Proxmox, LXC containers, systemd services), and privacy-first web applications (Next.js, TypeScript, Tailwind). My work emphasizes practical solutions over perfection, transparency over mystique, and automation that enhances rather than replaces human decision-making.

This repository is both my public-facing site and a working example of git-first documentation automation—where commits become blog posts, milestones become timelines, and publishing happens as a side effect of normal development workflow.

**Technical Focus Areas:**
- Workflow automation and AI integration (N8N, Claude Code, MCP protocols)
- Full-stack TypeScript development (Next.js, React, Node.js)
- Self-hosted infrastructure (Proxmox, LXC, Cloudflare Tunnel, systemd)
- Privacy-conscious architecture (no analytics, frontmatter-gated content, minimal JS)
- ADHD-friendly tooling (task management systems, automated documentation, low-friction publishing)

---

## About This Project

Git-first publishing system where commits become documentation. Built to support "build in public" workflows with automated daily summaries, project timelines, and privacy-gated content generation.

## Architecture

This isn't just a static site—it's a documentation automation system designed around the principle that most technical work is already captured in git history. The challenge is surfacing it in a useful way without adding cognitive overhead.

**Core Components:**

- **Publishing Loop** — N8N workflow running in WSL that monitors configured repos, aggregates commits using conventional commit parsing, and generates draft daily summaries and milestone entries
- **Project Hubs** — Dynamic pages (`/projects/[slug]`) with unified timelines aggregating both blog references and H2-section milestones from build logs
- **Three-Gate Publishing** — Frontmatter-based visibility system (`status` × `reviewed` × `sensitivity`) allowing AI-generated drafts to coexist with public content
- **Markdown Processing Pipeline** — unified/remark/rehype with custom H2 section parsing for milestone extraction

**Design Decisions:**

- **Git as source of truth** — Commits already describe what changed and why. Don't duplicate that in manual logs.
- **Human review gates** — Automation generates drafts with `reviewed: false`. Publishing requires explicit human approval.
- **Privacy by default** — Three-gate system prevents accidental public exposure of internal/client work.
- **ADHD-friendly automation** — Offload repetitive documentation tasks to reduce cognitive load and decision fatigue.

## Publishing Loop Workflow

```
1. Daily cron → N8N workflow scans configured repos
2. Parse commits via conventional commit format: type(project/slug): subject #tags !milestone
3. Generate daily overview → content/posts/YYYY-MM-DD-overview.md (status: draft, reviewed: false)
4. If commit has !milestone flag → append to content/projects/<slug>/build-log.md
5. Human reviews draft, edits as needed, flips reviewed: true and status: published
6. Deploy via ./scripts/deploy.sh (push to GitHub → SSH deploy to production)
```

Configuration lives in `.publishing-config.json` which defines tracked repos, slugs, and current goals.

## Technical Stack

- **Framework:** Next.js 14 (App Router) — chosen for static generation with dynamic route support
- **Styling:** Tailwind CSS + @tailwindcss/typography — minimal bundle, dark-first design
- **Content:** Markdown with gray-matter frontmatter — human-readable, version-controllable, no vendor lock-in
- **Type Safety:** TypeScript with strict mode — catches frontmatter schema violations at build time
- **Package Manager:** pnpm — faster than npm, proper lockfile semantics

**Performance Targets:**
- <100KB page weight (currently ~87KB first load)
- Static generation for all routes except dynamic project pages
- No client-side analytics or tracking scripts

## Development

```bash
# Install dependencies
pnpm install

# Run dev server (localhost:3000)
pnpm dev

# Build production bundle
pnpm build

# Run production locally
pnpm start
```

**Content Structure:**
```
content/
├── posts/           # Daily overviews, announcements, time-based updates
│   └── YYYY-MM-DD-overview.md
├── projects/<slug>/ # Project hubs with living documentation
│   ├── index.md     # Project overview and status
│   └── build-log.md # Milestone log (H2 sections)
└── guides/          # Standalone tutorials (future)
```

## Deployment Architecture

Two-server model: development machine (WSL) and production LXC container.

**Production Stack:**
- **Host:** Proxmox LXC (Ubuntu, unprivileged, nesting=1)
- **Runtime:** Node.js 22 via NVM
- **Process:** systemd service (`wally-web.service`) on port 3000
- **Tunnel:** Cloudflare Tunnel → localhost:3000 (HTTPS handled by Cloudflare)

**Deployment Workflow:**
```bash
# After committing changes locally
./scripts/deploy.sh  # Checks uncommitted files, pushes to GitHub, deploys to production
```

The deploy script:
1. Validates no uncommitted changes
2. Pushes to GitHub (source of truth)
3. SSHs to production, pulls latest, runs `pnpm install && pnpm build`
4. Restarts systemd service

**Operational Files:**
- `ops/systemd/wally-web.service` — systemd unit definition
- `ops/cloudflared/config.sample.yml` — Cloudflare Tunnel config template
- `scripts/deploy.sh` — One-command deployment from dev machine
- `scripts/redeploy.sh` — Production-side deployment script

## Why This Approach

Most technical blogs have a publishing friction problem: you do the work, then you have to write about doing the work. That duplication creates resistance, which means documentation doesn't happen, which means useful knowledge stays locked in commit messages.

This system inverts that: git commits are the primary documentation format (conventional commits already describe type, scope, and intent). Automation aggregates and formats them into human-readable daily summaries and project timelines. Human review happens at the end, where you're adding context and polish rather than reconstructing what happened from memory.

The result: documentation happens as a side effect of normal development workflow, not as a separate obligation.

## Frontmatter Schema

See `CLAUDE.md` for complete documentation. Key fields:

```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
projects: ["slug1", "slug2"]  # Links post to project timelines
tags: ["build-log", "architecture"]
status: "draft" | "published"  # Publishing gate
reviewed: true | false          # Human approval gate
sensitivity: "public" | "internal" | "client"  # Privacy gate
---
```

Content only appears publicly when ALL three gates pass: `status === "published" && reviewed === true && sensitivity === "public"`

## License

MIT — use this however you want. If you fork it and improve the publishing loop automation, let me know.

## Contributing

This is a personal site, so direct contributions don't make sense. But if you're building something similar and have questions about the architecture or automation setup, open an issue. I'm interested in how others are solving the documentation-as-side-effect problem.
