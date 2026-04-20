#!/usr/bin/env bash
# Generate Kokoro TTS audio for markdown posts.
# Usage:
#   ./scripts/generate-audio.sh [flags] [slug]
#
# Flags:
#   --content-dir PATH     Directory of .md sources (default: content/loop)
#   --output-dir PATH      Directory for .mp3 output (default: public/audio/loop)
#   --voice VOICE          Kokoro voice id (default: am_michael)
#   --max-chars N          Upper bound on text sent to TTS (default: 40000)
#   --force                Regenerate even if .mp3 already exists
#   --published-only       Skip posts whose frontmatter has status!=published, reviewed=false, or sensitivity!=public

set -euo pipefail

TTS_HOST="walub.kroeker.fun:8880"
TTS_VOICE="am_michael"
TTS_MODEL="kokoro"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTENT_DIR="$REPO_ROOT/content/loop"
OUTPUT_DIR="$REPO_ROOT/public/audio/loop"
MAX_CHARS=40000
FORCE=false
PUBLISHED_ONLY=false
SINGLE_SLUG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --content-dir) CONTENT_DIR="$2"; shift 2 ;;
    --output-dir) OUTPUT_DIR="$2"; shift 2 ;;
    --voice) TTS_VOICE="$2"; shift 2 ;;
    --max-chars) MAX_CHARS="$2"; shift 2 ;;
    --force) FORCE=true; shift ;;
    --published-only) PUBLISHED_ONLY=true; shift ;;
    --*) echo "Unknown option: $1"; exit 1 ;;
    *) SINGLE_SLUG="$1"; shift ;;
  esac
done

mkdir -p "$OUTPUT_DIR"

# Matches lib/markdown.ts:isPublic() semantics (defaults: published/reviewed/public).
is_published() {
  local file="$1"
  local status reviewed sensitivity
  status=$(awk '/^---$/{fm++; next} fm==1 && /^status:/{gsub(/["'"'"']/, "", $2); print $2; exit}' "$file")
  reviewed=$(awk '/^---$/{fm++; next} fm==1 && /^reviewed:/{gsub(/["'"'"']/, "", $2); print $2; exit}' "$file")
  sensitivity=$(awk '/^---$/{fm++; next} fm==1 && /^sensitivity:/{gsub(/["'"'"']/, "", $2); print $2; exit}' "$file")

  status="${status:-published}"
  reviewed="${reviewed:-true}"
  sensitivity="${sensitivity:-public}"

  [[ "$status" == "published" && "$reviewed" == "true" && "$sensitivity" == "public" ]]
}

# Strip frontmatter + markdown syntax to get plain text for TTS.
strip_markdown() {
  local file="$1"
  awk 'BEGIN{fm=0; in_code=0}
       /^---$/{fm++; next}
       fm<2{next}
       /^```/{in_code=!in_code; next}
       in_code{next}
       {print}' "$file" \
    | sed -E 's/^#{1,6} //' \
    | sed -E 's/\*\*([^*]*)\*\*/\1/g' \
    | sed -E 's/\*([^*]*)\*/\1/g' \
    | sed -E 's/`[^`]*`//g' \
    | sed -E 's/!\[[^]]*\]\([^)]*\)//g' \
    | sed -E 's/\[([^]]*)\]\([^)]*\)/\1/g' \
    | sed -E 's/^> //' \
    | sed -E 's/^[-*] //' \
    | grep -v '^$' \
    | head -c "$MAX_CHARS"
}

generate_one() {
  local slug="$1"
  local md_file="$CONTENT_DIR/$slug.md"
  local out_file="$OUTPUT_DIR/$slug.mp3"

  if [ ! -f "$md_file" ]; then
    echo "  ⚠️  Not found: $md_file"
    return 1
  fi

  if [ "$PUBLISHED_ONLY" = true ] && ! is_published "$md_file"; then
    echo "  🚫 Skipping $slug (not published / not reviewed / not public)"
    return 0
  fi

  if [ -f "$out_file" ] && [ "$FORCE" = false ]; then
    echo "  ⏭️  Skipping $slug (exists, use --force to regenerate)"
    return 0
  fi

  echo "  🎙️  Generating: $slug ($TTS_VOICE)..."
  local text
  text=$(strip_markdown "$md_file")

  local char_count
  char_count=$(printf '%s' "$text" | wc -c)
  echo "     chars: $char_count"

  local json_text
  json_text=$(printf '%s' "$text" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))')

  local http_code
  http_code=$(curl -s -w "%{http_code}" \
    -X POST "http://$TTS_HOST/v1/audio/speech" \
    -H "Content-Type: application/json" \
    -d "{\"model\":\"$TTS_MODEL\",\"input\":$json_text,\"voice\":\"$TTS_VOICE\",\"response_format\":\"mp3\"}" \
    --output "$out_file" \
    --connect-timeout 30 \
    --max-time 300)

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

echo "🎙️  Kokoro TTS"
echo "   Content: $CONTENT_DIR"
echo "   Output:  $OUTPUT_DIR"
echo "   Voice:   $TTS_VOICE"
echo "   Max:     $MAX_CHARS chars"
echo "   Filter:  $([ "$PUBLISHED_ONLY" = true ] && echo 'published only' || echo 'all')"
echo ""

if [ -n "$SINGLE_SLUG" ]; then
  generate_one "$SINGLE_SLUG"
else
  for md_file in "$CONTENT_DIR"/*.md; do
    [ -f "$md_file" ] || continue
    slug=$(basename "$md_file" .md)
    generate_one "$slug" || true
  done
fi

echo ""
echo "Done."
