#!/usr/bin/env bash
set -euo pipefail
cd /home/docker/wallykroeker.com
# git pull
pnpm install
pnpm build
echo "" | sudo -S systemctl restart wally-web
echo "Redeployed."
