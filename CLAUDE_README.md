# WallyKroeker.com Project Overview for AI Agent

This document provides a comprehensive guide for managing the wallykroeker.com project. It covers the project's purpose, architecture, development workflow, and deployment procedures.

## 1. Project Purpose & Philosophy

- **Purpose**: A public workshop and personal hub for sharing open, useful systems.
- **Philosophy**: Openness, usefulness, community, privacy-conscious, and minimal.
- **Key Sections**: Home, Projects, Cognitive Loop, Blog, Community, Work With Me.
- **Content**: Managed via Markdown files in the `/content` directory.

## 2. System Architecture & Technology

- **Frontend**: Next.js 14 (App Router) with React and Tailwind CSS.
- **Backend**: Node.js 20.
- **Package Manager**: pnpm.
- **Content**: Markdown processed with `gray-matter` and `remark`.
- **Production Host**: Deployed in a Proxmox LXC container.
- **Process Manager**: `systemd` manages the Next.js application as a service (`wally-web.service`).
- **Networking**: Cloudflare Tunnel provides secure, public access to the application without exposing the server to inbound traffic. HTTPS is handled by Cloudflare.

## 3. Development Workflow

This project uses a two-server model: a **Development Server** (where you operate) and a **Production Server**. The production server details (IP, user) should be managed securely and provided to the development agent out-of-band.

### Step 1: Setup the Development Environment
The remote repository on GitHub is now seeded with the production code and is ready to be cloned.

1.  **Clone the Repository**: On your development machine, clone the repository:
    ```bash
    git clone https://github.com/wally-kroeker/wallykroeker.com.git
    ```
2.  **Install Dependencies**: `pnpm install`
3.  **Run the Dev Server**: `pnpm dev`. The site will be available at `http://localhost:3000`.

### Step 2: Making Changes
- **Code**: Modify files in `app/`, `components/`, `lib/`, etc.
- **Content**: Add or edit Markdown files in `content/posts/` or `content/guides/`.
- **Dependencies**: Use `pnpm add <package>` to add new packages.

### Step 3: Testing Changes Locally
1.  **Linting**: Run `pnpm lint` to check for code quality issues.
2.  **Production Build**: Run `pnpm build` to ensure the project builds without errors.
3.  **Preview**: Run `pnpm start` to preview the production build locally.

## 4. Deployment to Production

Deployment is handled by pushing changes from the development environment to the production server via a Git-based workflow and then running a redeployment script on the production machine.

### Step 1: Commit and Push Changes
1.  **Commit**: `git add .` and `git commit -m "feat: your descriptive commit message"`.
2.  **Push**: `git push origin main` (or the relevant branch).

### Step 2: Deploy on the Production Server
1.  **SSH into Production**: Connect to the production server.
2.  **Navigate to Project Directory**: `cd /path/to/wallykroeker.com`
3.  **Run Redeploy Script**: Execute the script `scripts/redeploy.sh`.

### What the `redeploy.sh` script does:
- Pulls the latest changes from the Git remote.
- Installs dependencies (`pnpm install`).
- Builds the Next.js application (`pnpm build`).
- Restarts the `systemd` service (`sudo systemctl restart wally-web.service`) to apply the changes.

## 5. Key Files and Directories

- `app/`: Page routes and layouts.
- `components/`: Reusable React components.
- `content/`: Markdown content for blog posts and guides.
- `lib/`: Utility functions (e.g., `markdown.ts`).
- `ops/`: Operational configuration.
  - `ops/systemd/wally-web.service`: The systemd service unit file.
  - `ops/cloudflared/`: Configuration for Cloudflare Tunnel.
- `scripts/`:
  - `scripts/redeploy.sh`: The production deployment script.
- `package.json`: Project scripts and dependencies.

## 6. Branding & Style Guidelines

### GrayBeard AI Collective Branding
**CRITICAL**: The official branding is **GrayBeard** (capital G, capital B), not "greybeard" or "Greybeard".

**Correct usage:**
- **Proper name**: "GrayBeard AI Collective"
- **Tag/slug**: `graybeard-collective` (lowercase, hyphenated)
- **Descriptive adjective**: "graybeard" (lowercase when used as an adjective, e.g., "graybeard infrastructure practitioner")

**Examples:**
- ✅ "Join the GrayBeard AI Collective"
- ✅ "A peer learning community for graybeards"
- ✅ Tags: `graybeard-collective`
- ❌ "Greybeard AI Collective"
- ❌ "greybeard-ai-collective"

**When editing content:**
Always use Find & Replace to ensure consistency across:
- Article content (`content/posts/`)
- App pages (`app/**/*.tsx`)
- Tags and metadata
- Documentation

This document should provide all the necessary context for managing the project.