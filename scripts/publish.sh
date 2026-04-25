#!/usr/bin/env bash
#
# publish.sh — end-to-end publishing for wallykroeker.com
#
# Runs the full pipeline from source to production:
#   0. Consolidate any build-log drafts for today into a canonical daily file
#      (no-op if today's canonical already exists or no drafts present)
#   1. Generate Kokoro TTS audio for any posts that don't yet have it
#      • /loop  — pulled from cognitiveloop.substack.com/feed via loop-audio-sync.mjs
#      • /blog  — local markdown in content/posts/ via generate-audio.sh (published-only filter)
#   2. Stage + commit any NEW .mp3 files in public/audio/ AND any new build-log canonical
#      (skips if nothing new)
#   3. Call scripts/deploy.sh, which pushes to GitHub and SSHs the redeploy to prod
#
# Usage:
#   ./scripts/publish.sh                 Incremental: consolidate + generate missing audio + commit + deploy
#   ./scripts/publish.sh --all           Regenerate EVERY mp3 from scratch + commit + deploy (slow)
#   ./scripts/publish.sh --skip-deploy   Consolidate + generate + commit, skip the push/deploy step
#   ./scripts/publish.sh --help          Show this help
#
# Notes:
#   - Both audio tools skip existing files by default, so "incremental" mode is a no-op when
#     everything is in sync. --all forwards --force to regenerate everything (~10 min).
#   - /loop audio comes from Substack RSS (single source of truth). /blog audio comes from
#     local markdown. Slug sets are independent.
#   - Audio files live in the repo under public/audio/ and ship to production via git.
#   - Voice: am_michael (change in scripts/loop-audio-sync.mjs and scripts/generate-audio.sh).
#   - Build-log consolidation: drafts in content/build-logs/_drafts/ get merged into
#     content/build-logs/{today}.md if no canonical exists yet for today. Existing
#     canonical files are NEVER mutated. See scripts/consolidate-build-log.ts.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONSOLIDATE_SCRIPT="$REPO_ROOT/scripts/consolidate-build-log.ts"
LOOP_SYNC_SCRIPT="$REPO_ROOT/scripts/loop-audio-sync.mjs"
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

echo "📓 Step 0/3 — Consolidating build-log drafts"
echo ""
bun run "$CONSOLIDATE_SCRIPT"
echo ""

echo "🎙️  Step 1/3 — Generating audio"
echo ""
echo "── /loop (from Substack RSS)"
node "$LOOP_SYNC_SCRIPT" \
  --output-dir "$REPO_ROOT/public/audio/loop" \
  "${GEN_ARGS[@]}"

echo ""
echo "── /blog (from content/posts/)"
"$GEN_SCRIPT" \
  --content-dir "$REPO_ROOT/content/posts" \
  --output-dir "$REPO_ROOT/public/audio/blog" \
  --published-only \
  "${GEN_ARGS[@]}"

echo ""
echo "📦 Step 2/3 — Committing new audio + consolidated build logs"
echo ""

git add public/audio/

# Build-log staging: canonical daily files (top level) + archived/consolidated drafts.
# Do NOT auto-stage in-flight drafts in _drafts/ — those stay under author control.
shopt -s nullglob
canonical_logs=("$REPO_ROOT"/content/build-logs/*.md)
shopt -u nullglob
if [ ${#canonical_logs[@]} -gt 0 ]; then
  git add "${canonical_logs[@]}"
fi
if [ -d "$REPO_ROOT/content/build-logs/_drafts/_published" ]; then
  git add content/build-logs/_drafts/_published/
fi

staged_audio=$(git diff --cached --name-only -- public/audio/)
staged_logs=$(git diff --cached --name-only -- content/build-logs/)

if [ -n "$staged_audio" ]; then
  count=$(printf '%s\n' "$staged_audio" | wc -l | tr -d ' ')
  msg_suffix=$([ "$FORCE" = true ] && echo " (full regenerate)" || echo "")
  git commit -m "audio: sync ${count} mp3(s)${msg_suffix}"
  echo "   ✅ committed ${count} audio change(s)"
else
  echo "   (no audio changes to commit)"
fi

if [ -n "$staged_logs" ]; then
  log_count=$(printf '%s\n' "$staged_logs" | wc -l | tr -d ' ')
  git commit -m "build-log: consolidate ${log_count} draft change(s)"
  echo "   ✅ committed ${log_count} build-log change(s)"
else
  echo "   (no build-log changes to commit)"
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
