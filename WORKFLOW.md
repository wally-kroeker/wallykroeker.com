# Complete Development Workflow

This document provides step-by-step workflows for making changes to wallykroeker.com, from local development through GitHub to production deployment.

## Architecture Overview

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────────┐
│  Dev Machine    │─────▶│   GitHub     │─────▶│  Production     │
│  (WSL/Local)    │ push │  (main)      │ pull │  (LXC Server)   │
│  localhost:3000 │      │              │      │  wallykroeker.com│
└─────────────────┘      └──────────────┘      └─────────────────┘
```

**Key principle**: GitHub is the source of truth. All changes flow: Dev → GitHub → Production.

---

## A. Local Development Setup

### First Time Setup

1. **Clone repository from GitHub**
   ```bash
   git clone https://github.com/wally-kroeker/wallykroeker.com.git
   cd wallykroeker.com
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create environment file** (optional, has fallback defaults)
   ```bash
   cp .env.local.example .env.local  # if example exists
   # OR create empty file - app has defaults in lib/siteConfig.ts
   touch .env.local
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```
   Server runs at `http://localhost:3000`

5. **Verify setup**
   - Open browser to `http://localhost:3000`
   - Should see dark site with header, projects, footer
   - Navigate to `/blog` - should see posts
   - Changes to files should hot-reload automatically

---

## B. Content Workflow (Blog Posts & Guides)

### Adding a New Blog Post

1. **Create markdown file**
   ```bash
   # Posts go in content/posts/
   # Filename becomes the URL slug
   # Example: my-post.md → /blog/my-post
   ```

2. **Add required frontmatter**
   ```markdown
   ---
   title: "Your Post Title"
   date: "2025-01-15"
   tags: ["Tag1", "Tag2"]
   description: "Brief description for metadata and listings"
   ---

   Your content here in markdown format.

   ## Headings get auto-linked

   - Lists work
   - Code blocks work
   - All standard markdown features supported
   ```

3. **Required frontmatter fields**
   - `title` (string): Post title
   - `date` (YYYY-MM-DD): Publication date (used for sorting)
   - `tags` (array, optional): Category tags
   - `description` (string, optional): Short description

4. **Verify locally**
   - Dev server hot-reloads automatically
   - Check `/blog` - new post should appear in list (sorted by date, newest first)
   - Check `/blog/your-slug` - full post should render
   - Verify headings have auto-generated IDs and anchor links

### Adding a New Guide

Same process as blog posts, but:
- Files go in `content/guides/`
- Currently not listed on a dedicated guides page
- Can be linked from blog posts or projects

---

## C. Code Workflow (Components, Pages, Config)

### Modifying Components

**Location**: `components/*.tsx`

Example: Update header navigation
```bash
# Edit components/Header.tsx
# Changes hot-reload in dev server
# Verify appearance on all pages
```

### Adding New Pages

**Location**: `app/*/page.tsx`

Example: Add `/about` page
```bash
mkdir app/about
# Create app/about/page.tsx with Next.js page component
# Automatically available at /about
# Add link in Header component
```

### Updating Site Configuration

**Location**: `lib/siteConfig.ts`

Controls external URLs (Substack, Discord, LinkedIn, etc.)
```typescript
// Uses environment variables with fallbacks
export const site = {
  url: process.env.SITE_URL ?? 'https://wallykroeker.com',
  // ... other URLs
}
```

To override defaults:
1. Edit `.env.local`
2. Add variable: `DISCORD_INVITE=https://discord.gg/YOUR_INVITE`
3. Restart dev server (env changes require restart)

### Updating Projects

**Location**: `data/projects.ts`

Controls featured projects on homepage:
```typescript
export const projects = [
  {
    title: 'Project Name',
    blurb: 'Short description',
    href: '/link-or-external-url',
    meta: 'Category Label',
    cta: 'Call to Action Text',
  },
]
```

Changes hot-reload, visible on homepage.

### Styling Changes

**Global styles**: `app/globals.css`
**Tailwind config**: `tailwind.config.ts`
**Component styles**: Inline Tailwind classes in TSX files

Changes hot-reload in dev server.

---

## D. Testing Changes Locally

Before committing, always test:

### 1. Linting
```bash
pnpm lint
```
Should pass with no errors. Fix any issues before committing.

### 2. Production Build
```bash
pnpm build
```
Must complete successfully. Catches:
- TypeScript errors
- Missing imports
- Build-time issues

### 3. Preview Production Build
```bash
pnpm start
```
Runs production build locally on port 3000.
- Verify all pages work
- Check that content renders correctly
- Test navigation

Stop with Ctrl+C, return to dev mode with `pnpm dev`.

---

## E. Git & GitHub Workflow

### Understanding Git Status

Always start by checking what changed:
```bash
git status
```

Shows:
- Modified files (existing files you changed)
- Untracked files (new files not in git)
- Staged files (ready to commit)

### Staging Changes

```bash
# Stage all changes
git add .

# Stage specific files
git add content/posts/my-new-post.md

# Stage specific directory
git add app/about/
```

### Reviewing Staged Changes

Before committing, review what you're about to commit:
```bash
# See diff of staged changes
git diff --staged

# See just file names
git status
```

### Committing Changes

Use conventional commit format:
```bash
git commit -m "type: description"
```

**Commit types**:
- `feat`: New feature (new page, new component)
- `content`: New or updated content (blog post, guide)
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Styling changes (CSS, Tailwind)
- `refactor`: Code restructuring (no behavior change)
- `chore`: Maintenance (dependencies, config)

**Examples**:
```bash
git commit -m "content: add blog post about n8n workflows"
git commit -m "feat: add about page with bio section"
git commit -m "fix: correct broken link in footer"
git commit -m "style: update header spacing and hover states"
```

### Pushing to GitHub

```bash
# Push to main branch
git push origin main
```

**Important**: This is when your changes become visible to production deployment.

### Verifying on GitHub

1. Go to `https://github.com/wally-kroeker/wallykroeker.com`
2. Check recent commits - your commit should appear
3. Browse files to verify changes are there
4. Check commit history for confirmation

### Common Git Commands

```bash
# View commit history
git log --oneline -10

# Undo staged changes (before commit)
git reset HEAD <file>

# Discard local changes (CAREFUL - can't undo)
git checkout -- <file>

# View what changed in a specific file
git diff app/page.tsx

# View remote repository info
git remote -v

# Pull latest changes from GitHub (if working across machines)
git pull origin main
```

---

## F. Production Deployment Workflow

**Prerequisites**:
- Changes must be committed and pushed to GitHub first
- You have SSH access to production server

### Step-by-Step Deployment

1. **SSH to production server**
   ```bash
   ssh docker@<production-server-ip>
   ```

2. **Navigate to project directory**
   ```bash
   cd /home/docker/wallykroeker.com
   ```

3. **Pull latest changes from GitHub**
   ```bash
   git pull origin main
   ```
   Should show files that changed. If "Already up to date", verify you pushed to GitHub.

4. **Run deployment script**
   ```bash
   ./scripts/redeploy.sh
   ```

   **What this does**:
   - Installs/updates dependencies (`pnpm install`)
   - Builds production bundle (`pnpm build`)
   - Restarts systemd service (`systemctl restart wally-web`)

5. **Verify deployment**
   - Visit `https://wallykroeker.com` in browser
   - Check that changes are live
   - Test any new pages or modified content
   - Check browser console for errors

### Troubleshooting Deployment

**Build fails**:
```bash
# Check build output
pnpm build

# Check systemd service status
sudo systemctl status wally-web

# View service logs
sudo journalctl -u wally-web -n 50
```

**Changes not appearing**:
- Verify `git pull` showed your changes
- Check git log: `git log --oneline -5`
- Hard refresh browser (Ctrl+Shift+R)
- Check Cloudflare cache settings

**Service won't start**:
```bash
# View full logs
sudo journalctl -u wally-web -f

# Restart manually
sudo systemctl restart wally-web

# Check if port 3000 is in use
sudo lsof -i :3000
```

---

## G. Complete Workflow Examples

### Example 1: Add a New Blog Post

```bash
# 1. Create content file
cat > content/posts/my-new-post.md << 'EOF'
---
title: "Setting Up n8n with Docker"
date: "2025-01-15"
tags: ["n8n", "Docker", "Automation"]
description: "Step-by-step guide to running n8n in Docker"
---

Content here...
EOF

# 2. Verify in dev server
# Visit http://localhost:3000/blog - see new post
# Visit http://localhost:3000/blog/my-new-post - see content

# 3. Test build
pnpm lint
pnpm build

# 4. Git workflow
git status
git add content/posts/my-new-post.md
git diff --staged
git commit -m "content: add n8n Docker setup guide"
git push origin main

# 5. Deploy to production
ssh docker@production-server
cd /home/docker/wallykroeker.com
git pull origin main
./scripts/redeploy.sh

# 6. Verify live
# Visit https://wallykroeker.com/blog/my-new-post
```

### Example 2: Update Navigation Links

```bash
# 1. Edit component
vim components/Header.tsx
# Add new link to nav

# 2. Verify in dev server
# All pages should show new nav item

# 3. Test
pnpm lint
pnpm build

# 4. Git workflow
git status
git add components/Header.tsx
git commit -m "feat: add Resources link to navigation"
git push origin main

# 5. Deploy (same as Example 1)
```

### Example 3: Update Project Links

```bash
# 1. Update site config
vim lib/siteConfig.ts
# OR edit .env.local

# 2. Restart dev server if env changed
# Ctrl+C, then: pnpm dev

# 3. Verify changes on homepage

# 4. Git workflow
git add lib/siteConfig.ts  # or .env.local if that changed
git commit -m "fix: update Discord invite link"
git push origin main

# 5. Deploy
```

---

## H. Best Practices

### Content
- Use descriptive filenames (become URLs)
- Always include required frontmatter
- Test locally before pushing
- Use ISO date format (YYYY-MM-DD)
- Keep descriptions concise for listings

### Code
- Run `pnpm lint` before committing
- Always test `pnpm build` succeeds
- Use Tailwind classes consistently
- Follow existing component patterns
- Keep components focused and reusable

### Git
- Write clear commit messages
- Use conventional commit types
- Commit related changes together
- Don't commit sensitive data (.env files are gitignored)
- Pull before starting work if multiple contributors

### Deployment
- Always push to GitHub before deploying
- Test locally before deploying
- Verify deployment on live site
- Keep an eye on systemd logs during deployment
- Have a rollback plan (previous commit)

---

## I. Quick Reference

### Development Commands
```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Build for production
pnpm start            # Run production build locally
pnpm lint             # Check code quality
```

### Git Commands
```bash
git status            # Check what changed
git add .             # Stage all changes
git diff --staged     # Review staged changes
git commit -m "msg"   # Commit with message
git push origin main  # Push to GitHub
git log --oneline     # View commit history
git pull origin main  # Pull latest from GitHub
```

### Deployment Commands (on production server)
```bash
cd /home/docker/wallykroeker.com
git pull origin main
./scripts/redeploy.sh
sudo systemctl status wally-web
sudo journalctl -u wally-web -n 50
```

### File Locations
- Blog posts: `content/posts/*.md`
- Guides: `content/guides/*.md`
- Pages: `app/*/page.tsx`
- Components: `components/*.tsx`
- Site config: `lib/siteConfig.ts`
- Projects data: `data/projects.ts`
- Deployment: `scripts/redeploy.sh`

---

## J. Getting Help

If you encounter issues:

1. **Check dev server output** - errors appear in terminal
2. **Check browser console** - F12 for JavaScript errors
3. **Run lint** - `pnpm lint` for code issues
4. **Run build** - `pnpm build` for build errors
5. **Check git status** - `git status` for uncommitted changes
6. **Check production logs** - `sudo journalctl -u wally-web -f`
7. **Review this workflow** - ensure you followed all steps
8. **Check GitHub** - verify commits are there

Common issues documented in troubleshooting sections above.
