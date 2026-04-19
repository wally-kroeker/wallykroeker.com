#!/usr/bin/env bash
# Generate Kokoro TTS audio for all Cognitive Loop posts
# Usage: ./scripts/generate-loop-audio.sh [--voice VOICE] [--force] [slug]
# Default voice: am_michael

set -euo pipefail

TTS_HOST="walub.kroeker.fun:8880"
TTS_VOICE="am_michael"
TTS_MODEL="kokoro"
CONTENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/content/loop"
OUTPUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/audio/loop"
FORCE=false
SINGLE_SLUG=""

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --voice) TTS_VOICE="$2"; shift 2 ;;
    --force) FORCE=true; shift ;;
    --*) echo "Unknown option: $1"; exit 1 ;;
    *) SINGLE_SLUG="$1"; shift ;;
  esac
done

mkdir -p "$OUTPUT_DIR"

# Strip markdown to plain text for TTS
strip_markdown() {
  local file="$1"
  # Remove YAML frontmatter
  awk 'BEGIN{fm=0} /^---$/{fm++; next} fm<2{next} {print}' "$file" \
    | sed 's/^#{1,6} //' \
    | sed 's/\*\*\([^*]*\)\*\*/\1/g' \
    | sed 's/\*\([^*]*\)\*/\1/g' \
    | sed 's/`[^`]*`//g' \
    | sed 's/\[[^]]*\]([^)]*)//g' \
    | sed 's/\[[^]]*\]//g' \
    | sed 's/^> //' \
    | sed 's/^[-*] //' \
    | grep -v '^$' \
    | head -c 8000
}

generate_one() {
  local slug="$1"
  local md_file="$CONTENT_DIR/$slug.md"
  local out_file="$OUTPUT_DIR/$slug.mp3"

  if [ ! -f "$md_file" ]; then
    echo "  ⚠️  Not found: $md_file"
    return 1
  fi

  if [ -f "$out_file" ] && [ "$FORCE" = false ]; then
    echo "  ⏭️  Skipping $slug (exists, use --force to regenerate)"
    return 0
  fi

  echo "  🎙️  Generating: $slug ($TTS_VOICE)..."
  local text
  text=$(strip_markdown "$md_file")

  local json_text
  json_text=$(echo "$text" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))')

  local http_code
  http_code=$(curl -s -w "%{http_code}" \
    -X POST "http://$TTS_HOST/v1/audio/speech" \
    -H "Content-Type: application/json" \
    -d "{\"model\":\"$TTS_MODEL\",\"input\":$json_text,\"voice\":\"$TTS_VOICE\",\"response_format\":\"mp3\"}" \
    --output "$out_file" \
    --connect-timeout 30 \
    --max-time 120)

  if [ "$http_code" = "200" ]; then
    local size
    size=$(ls -lh "$out_file" | awk '{print $5}')
    echo "  ✅  $slug → $size"
  else
    echo "  ❌  $slug failed (HTTP $http_code)"
    rm -f "$out_file"
    return 1
  fi
}

echo "🎙️  Kokoro TTS — Cognitive Loop Audio"
echo "   Host:  $TTS_HOST"
echo "   Voice: $TTS_VOICE"
echo "   Out:   $OUTPUT_DIR"
echo ""

if [ -n "$SINGLE_SLUG" ]; then
  generate_one "$SINGLE_SLUG"
else
  for md_file in "$CONTENT_DIR"/*.md; do
    slug=$(basename "$md_file" .md)
    generate_one "$slug"
  done
fi

echo ""
echo "Done."
