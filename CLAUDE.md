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
- **Host**: Proxmox LXC container (Ubuntu, unprivileged, nesting=1)
- **Runtime**: Node.js 20 + pnpm
- **Process Manager**: systemd service (`wally-web.service`)
- **Networking**: Cloudflare Tunnel (no reverse proxy, HTTPS handled by Cloudflare)
- **Deployment Script**: `scripts/redeploy.sh`
  - Pulls latest from GitHub (`git pull origin main`)
  - Installs dependencies (`pnpm install`)
  - Builds production bundle (`pnpm build`)
  - Restarts systemd service

### Deployment Workflow
1. Make changes locally and test (`pnpm dev`, `pnpm build`)
2. Commit with conventional commit format: `type: description`
3. Push to `main` branch on GitHub: `git push origin main`
4. SSH to production server
5. Run `scripts/redeploy.sh` to pull and deploy

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
