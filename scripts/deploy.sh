#!/usr/bin/env bash
# Deploy script - run from dev machine after committing changes
# Usage: ./scripts/deploy.sh

set -euo pipefail

echo "🚀 Starting deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from project root"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: You have uncommitted changes. Commit or stash them first."
    echo ""
    git status --short
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

# Deploy to production
echo "🔧 Deploying to production server..."
ssh docker@10.10.10.21 'bash -s' < scripts/redeploy.sh

echo "✅ Deployment complete!"
