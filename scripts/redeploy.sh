#!/usr/bin/env bash
set -euo pipefail

# Export NVM node/pnpm to PATH for non-interactive SSH sessions
export PATH=/home/docker/.nvm/versions/node/v22.18.0/bin:$PATH

cd /home/docker/wallykroeker.com
git fetch origin
git reset --hard origin/main
pnpm install
NODE_OPTIONS="--max-old-space-size=512" pnpm build
sudo systemctl restart wally-web
echo "Redeployed successfully."
