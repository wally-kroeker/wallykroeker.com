#!/usr/bin/env bash
set -euo pipefail
cd /home/docker/wallykroeker.com
git pull origin main
pnpm install
pnpm build
echo "" | sudo -S systemctl restart wally-web
echo "Redeployed."
