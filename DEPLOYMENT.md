# Deployment Plan: wallykroeker.com

This document outlines the steps to deploy and manage the wallykroeker.com Next.js application on a production server.

## 1. Server Setup

These are the one-time setup steps required on the destination server.

### Prerequisites

- The `docker` user exists on the system.
- `git` is installed.
- `pnpm` is installed (`npm install -g pnpm`).
- `cloudflared` is installed and authenticated.
- The application code is located at `/home/docker/wallykroeker.com`.

### Initial Setup Commands

Execute these commands as the `docker` user unless otherwise specified. The repository is already cloned.

```bash
# Navigate to the project directory
cd /home/docker/wallykroeker.com

# Install dependencies
pnpm install

# Build the application
pnpm build
```

## 2. Service Configuration

### `systemd` Service

The application is managed by a `systemd` service to ensure it runs on startup and restarts on failure.

1.  **Create the service file:**
    As a user with `sudo` privileges, create the file `/etc/systemd/system/wally-web.service` with the following content:

    ```ini
    [Unit]
    Description=WallyKroeker Next.js
    After=network.target

    [Service]
    Type=simple
    User=docker
    WorkingDirectory=/home/docker/wallykroeker.com
    Environment=NODE_ENV=production
    ExecStart=/usr/bin/pnpm start -p 3000
    Restart=on-failure
    RestartSec=5
    NoNewPrivileges=true
    ProtectSystem=full
    ProtectHome=true

    [Install]
    WantedBy=multi-user.target
    ```

2.  **Enable and start the service:**

    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable wally-web.service
    sudo systemctl start wally-web.service
    ```

### `cloudflared` Tunnel

A Cloudflare Tunnel securely exposes the local application (running on port 3000) to the internet.

1.  **Create the configuration file:**
    As a user with `sudo` privileges, create `/etc/cloudflared/config.yml` and replace the placeholders with your actual Tunnel ID and credentials file path.

    ```yaml
    # Replace with your created tunnel ID and creds file path
    tunnel: YOUR_TUNNEL_ID
    credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

    ingress:
      - hostname: wallykroeker.com
        service: http://127.0.0.1:3000
      - hostname: www.wallykroeker.com
        service: http://127.0.0.1:3000
      - service: http_status:404
    ```

2.  **Enable and start the `cloudflared` service:**

    ```bash
    sudo systemctl enable cloudflared
    sudo systemctl start cloudflared
    ```

## 3. Deployment Workflow

To deploy new changes to the application, run the `redeploy.sh` script.

### Redeployment Script

The script is located at `/home/docker/wallykroeker.com/scripts/redeploy.sh`.

```bash
#!/usr/bin/env bash
set -euo pipefail
cd /home/docker/wallykroeker.com
git pull
pnpm install
pnpm build
sudo systemctl restart wally-web
echo "Redeployed."
```

### Deployment Command

Run this command as the `docker` user from anywhere on the server:

```bash
/home/docker/wallykroeker.com/scripts/redeploy.sh