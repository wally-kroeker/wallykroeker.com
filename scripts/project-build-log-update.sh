#!/bin/bash
#
# Project Build-Log Update Script
# Collects milestone commits since last run, sends to N8N for summaries,
# and appends timestamped entries to project build logs.
#
# Usage: ./project-build-log-update.sh [--dry-run]
#

set -euo pipefail

# Ensure proper PATH
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

# ============================================================================
# Configuration
# ============================================================================

CONTENT_REPO="${CONTENT_REPO:-/home/walub/projects/wallykroeker.com}"
CONFIG_FILE="$CONTENT_REPO/.publishing-config.json"
STATE_FILE="$(dirname "$0")/.build-log-state.json"
N8N_WEBHOOK="${N8N_WEBHOOK:-https://n8n.vrexplorers.com/webhook/publishing-loop-test-wsl}"
N8N_WEBHOOK_SECRET="${N8N_WEBHOOK_SECRET:-5d75bb3e84b7adcfc40f3011746fa4e74e4dbfc0501c56fd2eb14dedb455f241}"

# Parse arguments
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dry-run]"
      exit 1
      ;;
  esac
done

# ============================================================================
# State Management Functions
# ============================================================================

# Initialize or read state file
read_state() {
  if [ -f "$STATE_FILE" ]; then
    cat "$STATE_FILE"
  else
    /usr/bin/jq -n '{lastRun: null, lastSuccessfulRun: null, runCount: 0}'
  fi
}

# Write state file
write_state() {
  local lastRun=$1
  local lastSuccessful=$2
  local runCount=$3

  /usr/bin/jq -n \
    --arg lastRun "$lastRun" \
    --arg lastSuccessful "$lastSuccessful" \
    --arg runCount "$runCount" \
    '{lastRun: $lastRun, lastSuccessfulRun: $lastSuccessful, runCount: ($runCount | tonumber)}' > "$STATE_FILE"
}

# Calculate lookback timestamp
calculate_since() {
  local lastRun=$1

  if [ "$lastRun" = "null" ] || [ -z "$lastRun" ]; then
    # First run: default to 7 days ago
    date -u -d "7 days ago" +"%Y-%m-%dT%H:%M:%SZ"
  else
    echo "$lastRun"
  fi
}

# ============================================================================
# Initialize
# ============================================================================

CURRENT_STATE=$(read_state)
LAST_RUN=$(/usr/bin/jq -r '.lastRun' <<< "$CURRENT_STATE")
RUN_COUNT=$(/usr/bin/jq -r '.runCount' <<< "$CURRENT_STATE")
RUN_COUNT=$((RUN_COUNT + 1))

SINCE=$(calculate_since "$LAST_RUN")
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TODAY=$(date +%Y-%m-%d)

echo "=================================================="
echo "Project Build-Log Update - Run #$RUN_COUNT"
echo "=================================================="
echo "Since: $SINCE"
echo "Now: $NOW"
echo "Dry run: $DRY_RUN"
echo ""

# ============================================================================
# Pre-flight Check: Clean Working Tree
# ============================================================================

echo "Checking repository status..."

cd "$CONTENT_REPO"

# Check if working tree is clean
if ! git diff-index --quiet HEAD --; then
  echo "❌ ERROR: Uncommitted changes detected in repository" >&2
  echo "" >&2
  echo "Please commit or stash your changes first:" >&2
  echo "" >&2
  git status --short >&2
  echo "" >&2
  echo "Workflow:" >&2
  echo "  1. git add ." >&2
  echo "  2. git commit -m 'your message with !milestone flag if needed'" >&2
  echo "  3. git push" >&2
  echo "  4. $0" >&2
  exit 1
fi

echo "✅ Working tree is clean"
echo ""

# ============================================================================
# Validate Configuration
# ============================================================================

if [ ! -f "$CONFIG_FILE" ]; then
  echo "ERROR: Config file not found: $CONFIG_FILE" >&2
  exit 1
fi

if ! /usr/bin/jq empty "$CONFIG_FILE" 2>/dev/null; then
  echo "ERROR: Invalid JSON in config file: $CONFIG_FILE" >&2
  exit 1
fi

# ============================================================================
# Collect Git Commits from All Repos
# ============================================================================

echo "Collecting milestone commits since $SINCE..."
echo ""

REPOS=$(/usr/bin/jq -r '.repos' "$CONFIG_FILE")
COMMITS_JSON="[]"
REPO_COUNT=0
COMMIT_COUNT=0
MILESTONE_COUNT=0

for repo in $(echo "$REPOS" | /usr/bin/jq -r '.[] | @base64'); do
  _jq() {
    echo "${repo}" | /usr/bin/base64 --decode | /usr/bin/jq -r "${1}"
  }

  SLUG=$(_jq '.slug')
  NAME=$(_jq '.name')
  REPO_PATH=$(_jq '.path')

  echo "  Processing: $NAME ($SLUG)"

  # Check if repo exists
  if [ ! -d "$REPO_PATH" ]; then
    echo "    WARNING: Repo not found at $REPO_PATH - skipping" >&2
    continue
  fi

  # Check if it's a git repo
  if [ ! -d "$REPO_PATH/.git" ]; then
    echo "    WARNING: Not a git repository - skipping" >&2
    continue
  fi

  # Fetch git log with pretty JSON format
  GIT_LOG=$(cd "$REPO_PATH" && git log \
    --since="$SINCE" \
    --pretty=format:'{"hash":"%h","author":"%an","email":"%ae","date":"%aI","subject":"%s"}' \
    2>/dev/null || echo "")

  if [ -z "$GIT_LOG" ]; then
    echo "    No commits found"
    continue
  fi

  # Parse into JSON array and add repo metadata
  REPO_COMMITS=$(echo "$GIT_LOG" | /usr/bin/jq -s . | /usr/bin/jq \
    --arg slug "$SLUG" \
    --arg name "$NAME" \
    'map(. + {repoSlug: $slug, repoName: $name})')

  COMMIT_COUNT_FOR_REPO=$(echo "$REPO_COMMITS" | /usr/bin/jq 'length')

  # Filter for milestone commits only (!milestone in subject)
  MILESTONE_COMMITS=$(echo "$REPO_COMMITS" | /usr/bin/jq '.[] | select(.subject | contains("!milestone"))')

  if [ -n "$MILESTONE_COMMITS" ]; then
    MILESTONE_COMMIT_COUNT=$(echo "$MILESTONE_COMMITS" | /usr/bin/jq -s 'length')
    echo "    Found $COMMIT_COUNT_FOR_REPO total commit(s), $MILESTONE_COMMIT_COUNT milestone(s)"
    MILESTONE_COUNT=$((MILESTONE_COUNT + MILESTONE_COMMIT_COUNT))

    # Only add milestone commits to the payload
    MILESTONE_JSON=$(echo "$MILESTONE_COMMITS" | /usr/bin/jq -s .)
    COMMITS_JSON=$(echo "$COMMITS_JSON" "$MILESTONE_JSON" | /usr/bin/jq -s 'add')
  else
    echo "    Found $COMMIT_COUNT_FOR_REPO commit(s), 0 milestone(s)"
  fi

  REPO_COUNT=$((REPO_COUNT + 1))
done

echo ""
echo "Summary: $MILESTONE_COUNT milestone commit(s) from $REPO_COUNT repo(s)"
echo ""

# If no milestones, exit early
if [ "$MILESTONE_COUNT" -eq 0 ]; then
  echo "No milestone commits to process. Updating state and exiting."
  write_state "$NOW" "$NOW" "$RUN_COUNT"
  echo "✅ State updated. No content to generate."
  exit 0
fi

# ============================================================================
# Build Webhook Payload
# ============================================================================

PAYLOAD=$(/usr/bin/jq -n \
  --arg since "$SINCE" \
  --argjson commits "$COMMITS_JSON" \
  --argjson repos "$REPOS" \
  '{
    since: $since,
    commits: $commits,
    projects: $repos,
    metadata: {
      generated_at: (now | todate),
      source: "build-log-sync",
      version: "2.0"
    }
  }')

if [ "$DRY_RUN" = true ]; then
  echo "DRY RUN: Would send this payload to N8N:"
  echo "$PAYLOAD" | /usr/bin/jq .
  echo ""
  echo "DRY RUN: Exiting without sending to N8N"
  exit 0
fi

# ============================================================================
# Send to N8N and Capture Response
# ============================================================================

echo "Sending to N8N webhook..."
echo ""

# Use --max-time to prevent hanging (2 minute timeout)
set +e  # Temporarily disable exit on error
RESPONSE=$(/usr/bin/curl -s -w "\n%{http_code}" --max-time 120 -X POST "$N8N_WEBHOOK" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $N8N_WEBHOOK_SECRET" \
  -d "$PAYLOAD" 2>&1)
CURL_EXIT=$?
set -e  # Re-enable exit on error

if [ $CURL_EXIT -ne 0 ]; then
  echo "ERROR: Failed to connect to N8N webhook (curl exit code: $CURL_EXIT)" >&2
  exit 1
fi

# Split response (body + status code)
HTTP_BODY=$(echo "$RESPONSE" | /usr/bin/head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | /usr/bin/tail -n 1)

echo "N8N Response: HTTP $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" != "200" ]; then
  echo "ERROR: N8N returned HTTP $HTTP_CODE" >&2
  echo "Response body:" >&2
  echo "$HTTP_BODY" >&2
  exit 1
fi

# Validate response is valid JSON
if ! echo "$HTTP_BODY" | /usr/bin/jq empty 2>/dev/null; then
  echo "ERROR: N8N returned invalid JSON" >&2
  echo "Response body:" >&2
  echo "$HTTP_BODY" >&2
  exit 1
fi

echo "✅ Received valid response from N8N"
echo ""

# ============================================================================
# Parse Response and Write Build Logs
# ============================================================================

echo "Writing milestone summaries to build logs..."
echo ""

MILESTONE_COUNT_IN_RESPONSE=$(echo "$HTTP_BODY" | /usr/bin/jq '.milestones | length // 0')

if [ "$MILESTONE_COUNT_IN_RESPONSE" -eq 0 ]; then
  echo "  ⚠️  No milestones in response"
else
  echo "  Processing $MILESTONE_COUNT_IN_RESPONSE milestone(s)..."
  echo ""

  # Process each milestone
  echo "$HTTP_BODY" | /usr/bin/jq -c '.milestones[]?' | while read -r milestone; do
    SLUG=$(echo "$milestone" | /usr/bin/jq -r '.slug // empty')
    COMMIT_HASH=$(echo "$milestone" | /usr/bin/jq -r '.commit_hash // empty')
    COMMIT_DATE=$(echo "$milestone" | /usr/bin/jq -r '.commit_date // empty')
    FEATURE_NAME=$(echo "$milestone" | /usr/bin/jq -r '.feature_name // empty')
    SUMMARY=$(echo "$milestone" | /usr/bin/jq -r '.summary // empty')
    GITHUB_URL=$(echo "$milestone" | /usr/bin/jq -r '.github_url // empty')

    if [ -z "$SLUG" ] || [ -z "$SUMMARY" ]; then
      echo "    ⚠️  Skipped milestone with missing slug or summary"
      continue
    fi

    # Skip deprecated projects not in config
    if [ "$SLUG" = "publishing-loop" ]; then
      echo "    ⚠️  Skipped deprecated project: publishing-loop"
      continue
    fi

    BUILD_LOG="$CONTENT_REPO/content/projects/$SLUG/build-log.md"

    # Check if build log exists
    if [ ! -f "$BUILD_LOG" ]; then
      echo "    ❌ ERROR: Build log not found: $BUILD_LOG"
      echo "       Run Claude Code to generate template first: content/projects/$SLUG/build-log.md"
      continue
    fi

    /usr/bin/mkdir -p "$(/usr/bin/dirname "$BUILD_LOG")"

    # Append H2 section with milestone entry
    {
      echo ""
      echo "## $COMMIT_DATE — $FEATURE_NAME"
      echo ""
      echo "**Commit**: [\`$COMMIT_HASH\`]($GITHUB_URL)"
      echo ""
      echo "$SUMMARY"
    } >> "$BUILD_LOG"

    echo "    ✅ Appended milestone to: $BUILD_LOG"
  done

  echo ""
fi

# ============================================================================
# Update State on Success
# ============================================================================

write_state "$NOW" "$NOW" "$RUN_COUNT"

echo "=================================================="
echo "✅ Build-log update complete!"
echo "=================================================="
echo "Run #: $RUN_COUNT"
echo "Since: $SINCE"
echo "Milestone commits processed: $MILESTONE_COUNT"
echo "Milestone summaries written: $MILESTONE_COUNT_IN_RESPONSE"
echo ""

# ============================================================================
# Commit and Push Changes
# ============================================================================

echo "Committing build-log changes to git..."

cd "$CONTENT_REPO"

# Check if there are any uncommitted changes in build-log files
if ! git diff-index --quiet HEAD -- content/projects/*/build-log.md 2>/dev/null; then
  git add content/projects/*/build-log.md

  COMMIT_MESSAGE="docs(project/publishing-loop): auto-generated build log entries #build-log

Updated build-log entries for $(date +%Y-%m-%d) from milestone commits.

🤖 Generated with project-build-log-update.sh
Co-Authored-By: Publishing Loop <noreply@n8n.example.com>"

  git commit -m "$COMMIT_MESSAGE"
  echo "✅ Committed build-log changes"
else
  echo "ℹ️  No changes to commit"
fi

echo ""
echo "Pushing to GitHub..."
git push origin main
echo "✅ Pushed to GitHub"
echo ""

# ============================================================================
# Deploy to Production
# ============================================================================

echo "Deploying to production..."
DEPLOY_SCRIPT="$CONTENT_REPO/scripts/deploy.sh"

if [ -f "$DEPLOY_SCRIPT" ]; then
  bash "$DEPLOY_SCRIPT"
  echo "✅ Production deployment complete"
else
  echo "⚠️  Deploy script not found at $DEPLOY_SCRIPT"
  echo "   Skipping production deployment"
fi

echo ""
echo "=================================================="
echo "✅ Publishing workflow complete!"
echo "=================================================="
