# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WallyKroeker.com is a dark-first, minimal, privacy-conscious personal site built with Next.js 14 (App Router) and Tailwind CSS. It serves as a public workshop for sharing projects, build logs, guides, and Cognitive Loop posts.

**Philosophy**: Openness, usefulness, community, privacy-conscious, minimal. No heavy JS, no trackers, no vendor lock-in.

## Development Commands

### Install dependencies
```bash
pnpm install
```

### Run development server
```bash
pnpm dev
```
Site runs at `http://localhost:3000`

### Lint code
```bash
pnpm lint
```

### Build for production
```bash
pnpm build
```

### Run production build locally
```bash
pnpm start
```
Runs on port 3000

## Architecture

### Content Management
- **Markdown-based**: All blog posts and guides are stored as Markdown files with frontmatter
- **Posts**: `content/posts/*.md` - Blog posts and build logs
- **Guides**: `content/guides/*.md` - Technical guides and tutorials
- **Content Processing**: `lib/markdown.ts` handles parsing (gray-matter) and conversion to HTML (unified/remark/rehype)
  - Automatic slug generation from headings
  - Auto-linking of headings
  - Frontmatter schema: `title`, `date`, `tags`, `description`

### Page Structure
- **App Router**: Next.js 14 App Router with TypeScript
- **Key Routes**:
  - `/` - Home
  - `/blog` - Blog listing
  - `/blog/[slug]` - Individual posts
  - `/projects` - Projects showcase
  - `/loop` - Cognitive Loop section
  - `/community` - Community page
  - `/work` - Work With Me page
  - `/colophon` - Site details
  - `/privacy` - Privacy policy
  - `/rss` - RSS feed

### Component Architecture
- **Layout Components**: `Header`, `Footer`, `Container` - Shared across all pages
- **Typography**: `Prose` component for consistent text styling
- **Dark-first**: Site hardcoded to dark mode (`html.dark` class in layout)
- **Styling**: Tailwind CSS with zinc color palette (zinc-950 bg, zinc-100 text)

### Configuration
- **Site Config**: `lib/siteConfig.ts` centralizes all external URLs and contact info
  - Uses environment variables with fallback defaults
  - Controls links to Substack, Discord, LinkedIn, etc.
- **Environment**: `.env.local` for sensitive values (not in repo)

## Deployment Architecture

**Two-Server Model**: Development machine and production LXC container

**Workflow**: Dev → GitHub → Production (GitHub is the source of truth)

### Production Stack
- **Host**: Proxmox LXC container at 10.10.10.21 (Ubuntu, unprivileged, nesting=1)
- **User**: `docker` (SSH: `ssh docker@10.10.10.21`)
- **Sudo Password**: `Ra2Ra331234`
- **Runtime**: Node.js 22.18.0 (installed via NVM at `/home/docker/.nvm/versions/node/v22.18.0`)
- **Package Manager**: pnpm (installed globally via npm)
- **Process Manager**: systemd service (`wally-web.service`) running on port 3000
- **Networking**: Cloudflare Tunnel (routes to localhost:3000, HTTPS handled by Cloudflare)
- **Project Path**: `/home/docker/wallykroeker.com`

### Deployment Workflow
1. Make changes locally and test (`pnpm dev`, `pnpm build`)
2. Commit with conventional commit format: `type: description`
3. Push to `main` branch on GitHub: `git push origin main`
4. SSH to production server
5. Run deployment manually with PATH set:
   ```bash
   ssh docker@10.10.10.21 'export PATH=/home/docker/.nvm/versions/node/v22.18.0/bin:$PATH && cd /home/docker/wallykroeker.com && git pull origin main && pnpm install && pnpm build && echo "Ra2Ra331234" | sudo -S systemctl restart wally-web'
   ```

**Known Issue**: `scripts/redeploy.sh` fails because pnpm is not in PATH for non-interactive SSH sessions (NVM only loads in .bashrc). Must use explicit PATH export as shown above.

### Git Workflow
- **Branch**: `main` (single branch, direct commits)
- **Remote**: `https://github.com/wally-kroeker/wallykroeker.com`
- **Commit format**: `type: description` (e.g., `feat:`, `content:`, `fix:`, `docs:`, `style:`)
- **Before committing**: Run `pnpm lint` and `pnpm build` to ensure no errors
- **Review changes**: Use `git diff --staged` before committing

### Operational Files
- `ops/systemd/wally-web.service` - Systemd unit file
- `ops/cloudflared/config.sample.yml` - Cloudflare Tunnel config template
- `scripts/servicectl.sh` - Service management helper
- `scripts/redeploy.sh` - Deployment script (pull → install → build → restart)

## Content Guidelines

### Adding New Posts
1. Create `content/posts/your-slug.md`
2. Add frontmatter:
   ```yaml
   ---
   title: Your Post Title
   date: 2025-01-15
   tags: [tag1, tag2]
   description: Brief description
   ---
   ```
3. Write content in Markdown
4. No build step needed - parsed at runtime

### Adding New Guides
Same as posts but in `content/guides/*.md`

## Publishing Loop System

### Content Structure

Three content types with distinct purposes:

1. **Blog Posts** (`content/posts/*.md`) → `/blog`
   - Daily overviews, announcements, time-based updates
   - Can reference projects via `projects: ["slug"]` array

2. **Standalone Guides** (`content/guides/*.md`) → `/guides/[slug]` (future)
   - Tutorials, how-tos, deployment guides
   - Not tied to specific projects

3. **Project Hubs** (`content/projects/<slug>/`) → `/projects/<slug>`
   - `index.md` - Project overview and status
   - `build-log.md` - Living milestone log (H2 sections)
   - Timeline aggregates: blog posts referencing project + build log milestones

### Frontmatter Schemas

#### Daily Overview Post
```yaml
---
title: "Daily overview – YYYY-MM-DD"
date: "YYYY-MM-DD"
projects: ["slug1", "slug2"]  # optional, links post to project timelines
tags: ["build-log", "ai"]
status: "draft" | "published"
reviewed: true | false
sensitivity: "public" | "internal" | "client"
description: "Brief summary"
---
```

#### Project Hub Index
```yaml
---
title: "Project Name"
project: "slug"
type: "project"
status: "active" | "paused" | "done"
stage: "Prototype" | "MVP" | etc
links:
  repo: "https://github.com/..."
  docs: "/projects/slug/build-log"
  demo: "https://..."
reviewed: true
sensitivity: "public"
---

One paragraph describing what this project is and why it exists.
```

#### Project Build Log
```yaml
---
title: "Build Log – Project Name"
project: "slug"
type: "project-log"
reviewed: true
sensitivity: "public"
---

## YYYY-MM-DD — Milestone title
- **Summary:** One paragraph.
- **Why it matters:** Bullets.
- **Commits:** List of commit subjects.
- **Artifacts:** Links to repos/PRs.
- **Next steps:** Bullets.
```

### Visibility Rules

**Three-gate system**: Content only appears publicly when ALL are true:
- `status === "published"`
- `reviewed === true`
- `sensitivity === "public"`

**Defaults** (for existing content): `status=published`, `reviewed=true`, `sensitivity=public`

### Timeline Aggregation

Project hubs (`/projects/<slug>`) show a unified timeline of:
1. Blog posts where `projects` array includes the slug (filtered by public gates)
2. H2 sections from `build-log.md` (each H2 is a milestone, parsed for dates)

Sorted by date descending. Implemented in `lib/projectUpdates.ts`.

### n8n Integration Points

The publishing agent (n8n workflow) should:
1. Scan configured project repos for commits
2. Parse commit conventions: `type(project/<slug>): subject #tags !milestone`
3. Generate daily overview posts in `content/posts/YYYY-MM-DD-overview.md`
4. Append milestones to `content/projects/<slug>/build-log.md` when `!milestone` detected
5. Always set `status: "draft"`, `reviewed: false` for generated content
6. Never modify `reviewed` or `status` fields - user controls publishing

### Commit Conventions

```
type(project/<slug>): subject #tags !milestone

Types: feat, fix, chore, docs, refactor, perf, test
Tags: #build-log #how-to #postmortem #release #architecture #philosophy #ai
Flags: !milestone (triggers build-log append)
```

## Design Constraints

- **Performance**: Target <100KB page weight
- **Privacy**: No trackers, no analytics by default
- **Accessibility**: Semantic HTML, proper heading hierarchy
- **Dark-first**: Design for dark mode as primary
- **Minimal JavaScript**: Avoid heavy client-side interactions

## Tech Stack Details

- **Framework**: Next.js 14.2.5 (React 18.3.1)
- **Styling**: Tailwind CSS 3.4.7 + @tailwindcss/typography
- **Content**: gray-matter 4.0.3 for frontmatter
- **Markdown**: unified/remark/rehype pipeline
- **TypeScript**: 5.5.4
- **Package Manager**: pnpm (specified in README, not npm/yarn)

## Workflow Documentation

For complete workflow instructions see:
- **WORKFLOW.md** - Complete end-to-end workflow guide (development, git, deployment)
- **workflow-test.md** - Step-by-step test script to validate workflow
- Covers: content addition, code changes, git operations, testing, deployment

## Known Issues & Workarounds

### ESLint Interactive Prompt
Running `pnpm lint` triggers an interactive ESLint configuration prompt. For automated workflows, skip linting or use non-interactive alternatives.

### NVM PATH Issue on Production
NVM node/pnpm binaries are not in PATH for non-interactive SSH sessions because .bashrc only loads for interactive shells.

**Workaround**: Always export PATH before running node/pnpm commands via SSH:
```bash
export PATH=/home/docker/.nvm/versions/node/v22.18.0/bin:$PATH
```

### Port Conflicts in Development
If `pnpm dev` finds port 3000 in use, it automatically selects port 3001. Check terminal output for the actual port.
