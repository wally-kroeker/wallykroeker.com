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

This project uses a two-server model: a **Development Server** (where you operate) and a **Production Server**.  the production server lives at 10.10.10.21 in the docker users home/WALLYKROEKER.COM  You can ssh to the server ssh docker@10.10.10.21

### Step 1: Setup the Development Environment
1.  **Clone the Repository**: `git clone https://github.com/wally-kroeker/wallykroeker.com.git`
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

### Initial Production Server Setup

Before you can deploy for the first time, you need to authorize the development environment to connect to the production server via SSH.

1.  **Copy the Setup Script to Production**: Transfer the `scripts/prepare-prod-server.sh` file from this repository to the `docker` user's home directory on the production server (`10.10.10.21`). You can use `scp` for this:
    ```bash
    scp scripts/prepare-prod-server.sh docker@10.10.10.21:~/
    ```

2.  **Execute the Script on Production**: SSH into the production server and run the script:
    ```bash
    ssh docker@10.10.10.21
    chmod +x ~/prepare-prod-server.sh
    ~/prepare-prod-server.sh
    ```
This script adds the necessary public key to `~/.ssh/authorized_keys`, allowing passwordless deployments from the development environment. This only needs to be done once.

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

This document should provide all the necessary context for managing the project.