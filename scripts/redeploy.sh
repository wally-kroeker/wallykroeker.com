#!/usr/bin/env bash
set -euo pipefail
cd /home/docker/wallykroeker.com
git pull
pnpm install
pnpm build
sudo systemctl restart wally-web
echo "Redeployed."
