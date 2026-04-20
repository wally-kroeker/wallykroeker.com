#!/usr/bin/env bash
#
# publish.sh — end-to-end publishing for wallykroeker.com
#
# Runs the full pipeline from source to production:
#   1. Generate Kokoro TTS audio for any posts that don't yet have it
#      • /loop  — Cognitive Loop posts (sourced from Substack RSS, local slugs in content/loop/)
#      • /blog  — Blog posts in content/posts/ (published-only filter)
#   2. Stage + commit any NEW .mp3 files in public/audio/ (skips if nothing new)
#   3. Call scripts/deploy.sh, which pushes to GitHub and SSHs the redeploy to prod
#
# Usage:
#   ./scripts/publish.sh                 Incremental: generate only missing audio + commit + deploy
#   ./scripts/publish.sh --all           Regenerate EVERY mp3 from scratch + commit + deploy (slow)
#   ./scripts/publish.sh --skip-deploy   Generate + commit, skip the push/deploy step
#   ./scripts/publish.sh --help          Show this help
#
# Notes:
#   - generate-audio.sh already skips existing files by default, so this script's "incremental"
#     mode is just calling it without --force. --all forwards --force to regenerate everything.
#   - Audio files live in the repo under public/audio/ and ship to production via git.
#   - Voice: am_michael (change in scripts/generate-audio.sh if you want to try a different one).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GEN_SCRIPT="$REPO_ROOT/scripts/generate-audio.sh"
DEPLOY_SCRIPT="$REPO_ROOT/scripts/deploy.sh"

GEN_ARGS=()
FORCE=false
SKIP_DEPLOY=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)
      FORCE=true
      GEN_ARGS+=("--force")
      shift
      ;;
    --skip-deploy)
      SKIP_DEPLOY=true
      shift
      ;;
    --help|-h)
      awk 'NR==1{next} /^[^#]/{exit} {sub(/^# ?/,""); print}' "${BASH_SOURCE[0]}"
      exit 0
      ;;
    *)
      echo "❌ Unknown option: $1" >&2
      echo "Run with --help for usage." >&2
      exit 1
      ;;
  esac
done

cd "$REPO_ROOT"

if [ "$FORCE" = true ]; then
  echo "🔁 Mode: --all (regenerating every mp3 from scratch)"
else
  echo "➕ Mode: incremental (only generating missing mp3s)"
fi
echo ""

echo "🎙️  Step 1/3 — Generating audio"
echo ""

"$GEN_SCRIPT" \
  --content-dir "$REPO_ROOT/content/loop" \
  --output-dir "$REPO_ROOT/public/audio/loop" \
  "${GEN_ARGS[@]}"

echo ""

"$GEN_SCRIPT" \
  --content-dir "$REPO_ROOT/content/posts" \
  --output-dir "$REPO_ROOT/public/audio/blog" \
  --published-only \
  "${GEN_ARGS[@]}"

echo ""
echo "📦 Step 2/3 — Committing new audio"
echo ""

git add public/audio/
staged_audio=$(git diff --cached --name-only -- public/audio/)

if [ -z "$staged_audio" ]; then
  echo "   (no audio changes to commit)"
else
  count=$(printf '%s\n' "$staged_audio" | wc -l | tr -d ' ')
  msg_suffix=$([ "$FORCE" = true ] && echo " (full regenerate)" || echo "")
  git commit -m "audio: sync ${count} mp3(s)${msg_suffix}"
  echo "   ✅ committed ${count} audio change(s)"
fi

echo ""

if [ "$SKIP_DEPLOY" = true ]; then
  echo "🛑 Step 3/3 — Skipped (--skip-deploy)"
  echo ""
  echo "✅ Done. Run './scripts/deploy.sh' when ready to ship."
  exit 0
fi

echo "🚀 Step 3/3 — Deploying"
echo ""
"$DEPLOY_SCRIPT"
