# wallykroeker.com Project Context

## Project Overview
This is the personal site and technical workshop for Wally Kroeker, designed as a "living documentation" system. It is a Next.js application that integrates tightly with a custom "Publishing Loop" where git commits are transformed into content.

**Key Philosophy:**
- **Git-First:** Commits are the primary source of truth for work logs.
- **Privacy-Conscious:** No client-side analytics, minimal JS, privacy-gated content.
- **Automation:** Reduces cognitive overhead by automating documentation from work (commits).

## Technical Architecture

### Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + `@tailwindcss/typography`
- **Content Engine:** Markdown with Frontmatter (`gray-matter`, `remark`, `rehype`)
- **Package Manager:** `pnpm`

### Infrastructure
- **Hosting:** Proxmox LXC Container (Production)
- **Process Management:** `systemd` (`wally-web.service`)
- **Ingress:** Cloudflare Tunnel (no open inbound ports)
- **Deployment:** Git-based push-to-deploy via SSH

## Directory Structure
- **`app/`**: Next.js App Router pages and layouts.
- **`components/`**: React components (UI, layout, specialized content displays).
- **`content/`**: Markdown content files (the "database").
    - `posts/`: Daily overviews, blog posts.
    - `projects/`: Project-specific timelines and details.
- **`lib/`**: Utility functions (Markdown processing, site config).
- **`ops/`**: Infrastructure config (systemd services, cloudflared config).
- **`scripts/`**: Automation scripts for deployment and content management.

## Development Workflow

### Building and Running
```bash
# Install dependencies
pnpm install

# Run development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production build locally
pnpm start
```

### Deployment
Deployment uses a specific script that pushes to GitHub and triggers an update on the production server.
```bash
./scripts/deploy.sh
```

## Content & Publishing Conventions

### The Publishing Loop
This project uses an N8N workflow to monitor commits and generate documentation.
- **Commit Format:** `type(scope): subject #tags !milestone`
    - `!milestone` flag triggers addition to a project's `build-log.md`.
- **Frontmatter Gates:** Content visibility is controlled by three fields in the Markdown frontmatter:
    - `status`: `draft` | `published`
    - `reviewed`: `true` | `false`
    - `sensitivity`: `public` | `internal` | `client`
    - **Rule:** Content is public ONLY IF `status: published` AND `reviewed: true` AND `sensitivity: public`.

### Code Style
- **TypeScript:** Strict mode enabled. Define types for props and data.
- **Tailwind:** Use utility classes. Dark-mode first design (`zinc` palette).
- **Components:** Functional components, `PascalCase`.
- **Imports:** Absolute imports using `@/` alias (e.g., `import X from '@/components/X'`).

## Important Files
- `PRD.md`: Product Requirements Document.
- `.publishing-config.json`: Configuration for the content automation loop.
- `lib/siteConfig.ts`: Centralized site configuration constants.
- `CLAUDE_README.md` & `AGENTS.md`: Context specific to AI agents and automation.
