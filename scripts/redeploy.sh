#!/usr/bin/env bash
set -euo pipefail

# Export NVM node/pnpm to PATH for non-interactive SSH sessions
export PATH=/home/docker/.nvm/versions/node/v22.18.0/bin:$PATH

cd /home/docker/wallykroeker.com
git pull origin main
pnpm install
pnpm build
echo "Ra2Ra331234" | sudo -S systemctl restart wally-web
echo "Redeployed successfully."
