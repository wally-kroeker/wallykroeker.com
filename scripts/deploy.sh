#!/usr/bin/env bash
# Deploy script — push to GitHub and redeploy production in one pass.
# Usage: ./scripts/deploy.sh
#
# Steps:
#   1. Refuse to proceed if there are uncommitted changes (tracked).
#   2. Push main to origin.
#   3. SSH into the production host and run, inline:
#      - git fetch + hard reset to origin/main
#      - clear Next.js fetch cache (forces fresh RSS fetches on this build)
#      - pnpm install
#      - pnpm build (capped at 512MB heap for the 1GB LXC)
#      - systemctl restart wally-web
#
# The fetch-cache clear is important: without it, pnpm build re-uses cached
# Substack RSS responses and /loop listing can lag behind newly-published posts.
# Webpack cache under .next/cache/webpack is preserved to keep build times fast.

set -euo pipefail

PROD_HOST="docker@wallykroeker.apps.kroeker.fun"
PROD_DIR="/home/docker/wallykroeker.com"
PROD_PATH="/home/docker/.nvm/versions/node/v22.18.0/bin"

# Lock guard — refuse to run if another deploy is already in progress.
# The 1GB LXC will OOM if two pnpm builds run concurrently (each capped at
# --max-old-space-size=512MB plus base OS + sshd). Incident 2026-04-26 took
# the site down for ~10 minutes after two backgrounded publish.sh invocations
# raced into deploy.sh at the same time. Use flock with -n (non-blocking) so
# the second invocation fails fast with a clear message instead of waiting.
LOCK_FILE="/tmp/wallykroeker-deploy.lock"
exec {LOCK_FD}>"$LOCK_FILE"
if ! flock -n "$LOCK_FD"; then
    echo "❌ Error: Another deploy is already running (lock: $LOCK_FILE)"
    echo "   Wait for it to finish, or if you're sure it's hung:"
    echo "   pgrep -af 'scripts/deploy.sh' && rm -f $LOCK_FILE"
    exit 1
fi

echo "🚀 Starting deployment..."

if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from project root"
    exit 1
fi

if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: You have uncommitted changes. Commit or stash them first."
    echo ""
    git status --short
    exit 1
fi

echo "📤 Pushing to GitHub..."
git push origin main

echo "🔧 Deploying to production server..."
ssh "$PROD_HOST" bash <<EOF
set -euo pipefail
export PATH=$PROD_PATH:\$PATH
cd $PROD_DIR
git fetch origin
git reset --hard origin/main
rm -rf .next/cache/fetch-cache
pnpm install
NODE_OPTIONS="--max-old-space-size=512" pnpm build
sudo systemctl restart wally-web
echo "Redeployed successfully."
EOF

echo "✅ Deployment complete!"
