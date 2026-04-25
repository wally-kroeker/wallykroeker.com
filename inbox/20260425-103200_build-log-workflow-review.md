---
from: TSFUR (Bob Prime)
to: wallykroeker.com (Howard)
priority: medium
type: review
created: 2026-04-25T10:32:00-05:00
---

# Build Log Workflow Review — Multi-Session Race + Date/Time Accuracy

## What

Wally has flagged real problems with the current build log workflow at `content/build-logs/` and asked for a workflow review + redesign. Two related issues:

1. **Multi-session race conditions:** Multiple Claude sessions (Bob Prime, Howard, Bill, etc.) sometimes write to the same daily build log file (`YYYY-MM-DD.md`) simultaneously. This causes confusion, race conditions on file creation, and potential merge conflicts when commits go up.
2. **Date/time accuracy:** Sessions frequently get the date or time wrong when writing build log entries. Wally calls this "a global problem" — a pattern across many sessions, not unique to this workflow but acutely visible here.

He's also planted a future-state idea: build log entries become a daily podcast feed. That's downstream of this review — solid workflow first, podcast pipeline later.

## Context

The build log is now formally **Bob's content space** in the wallykroeker.com architecture (Wally said so directly Apr 25). All the Bobs (Bob Prime, Howard, Bill, Mario, Hugh, etc.) write to it. That makes it shared infrastructure across sessions, and the race condition is structural — multiple agents legitimately want to append to the same daily file.

The current pattern (one file per day, append by edit) doesn't scale to multi-session writes. The fix is probably architectural, not just hygiene.

Full context for the architecture decision: see `~/.claude/projects/-home-bob-projects-TSFUR/memory/project_wallykroeker_site_architecture.md` (memory file written Apr 25).

## Wally's Proposed Solutions (he's still thinking — these are starting points)

### Option A — Holding-space + consolidation (his preferred, gestured at)

- Each session writes its entry to a per-session draft file, e.g.:
  - `content/build-logs/_drafts/2026-04-25-103200_bob-prime_session-slug.md`
- A consolidation step (could be `publish.sh` or a new script `consolidate-build-log.sh`) merges drafts by date into the canonical daily file at publish time.
- Benefits: no race conditions, each draft has its own creation timestamp (date accuracy at write time), publish step is a privacy/accuracy checkpoint, drafts can be discarded individually if low-signal.

### Option B — Pre-write hook

- Hook checks system date/time before any build log write happens.
- Less elegant than A; doesn't solve race conditions, only date accuracy.
- Could be combined with A.

### Option C — Lock file

- Only one session writes to the canonical daily file at a time; others queue.
- Cleaner than current behaviour but doesn't add the privacy/consolidation checkpoint.

### Bob Prime's recommendation

**Go with A.** It's the only option that addresses both problems and adds a useful checkpoint. The publish step also becomes the natural place for the future podcast pipeline to hook in — TTS rendering, RSS generation, whatever — because by then you have a clean canonical entry per day instead of a partially-edited file.

## Action — Howard

1. **Review existing `publish.sh`** — what does it do today, what assumptions does it bake in.
2. **Design the holding-space pattern.** Concrete spec:
   - Where do drafts live? (`content/build-logs/_drafts/` is my proposal — gitignored or committed, your call)
   - Naming convention? (proposed: `YYYY-MM-DD-HHMMSS_session-id_short-slug.md`)
   - What metadata does each draft carry? (frontmatter with `session`, `project`, `author` (which Bob), `created` timestamp)
   - How does consolidation order entries? (chronological by `created` timestamp seems right)
   - How are drafts cleaned up after consolidation? (move to `_drafts/_published/{date}/` or just delete)
3. **Update or create the consolidation script.** Could be a new `bin/consolidate-build-log.sh` that:
   - Takes a date (default: today)
   - Reads all `_drafts/{date}-*.md` files
   - Merges into `content/build-logs/{date}.md` with proper frontmatter (incrementing `session_count`, unioning `projects_touched`)
   - Optional flag to dry-run vs. apply
4. **Update the BuildLog skill** at `~/.claude/skills/Bob/BuildLog/SKILL.md`. The skill currently writes directly to the canonical file; redirect it to write a draft instead. Date verification can happen at the draft-write step (use `date '+%Y-%m-%d %H:%M:%S'` from system, never infer).
5. **Document the new workflow** in `~/projects/wallykroeker.com/CLAUDE.md` so all Bobs know the pattern.
6. **Migrate today.** Today's session (`2026-04-25.md`, written by Bob Prime in TSFUR) should remain as-is, but starting tomorrow all build log writes go through the new pattern.

## Pending Wally decisions Howard should surface

1. ✅ Confirm Option A (holding-space) is the path. If he wants something different, get clarity before building.
2. ✅ Should `_drafts/` be gitignored, or committed for transparency?
3. ✅ Should consolidation be manual (`bin/consolidate-build-log.sh today`) or automatic (cron / git hook)?
4. ✅ Privacy checkpoint: should consolidation just merge, or should it surface drafts for human review before promoting to canonical?

## Out of scope for this handoff (future-state, captured for context)

- **Podcast feed pipeline.** Wally's idea: TTS-render consolidated build log entries, generate an RSS feed, publish daily. Hooks live at Kokoro TTS (`walub.kroeker.fun:8880`). Don't build this yet — workflow first, podcast second. Note the future hook point in your design.
- **Tech blog section** as Wally's authored space (separate from Cognitive Loop). Distinct content track. Build log review doesn't depend on this; just be aware it's coming.

## Notes for Howard from Bob Prime

- This is a workflow refactor, not an emergency. Speed is not the constraint. Solid design is.
- If your `publish.sh` is already doing some of this consolidation, half the work might be done — extend rather than replace.
- The BuildLog skill update is the most cross-cutting change. Make sure all Bobs converge on the same pattern, not just whoever picks up the next entry.
- Wally's quote on the framing: *"the build log is yours Bob. you can do whatever you want there."* Honour that — workflow design should preserve Bob-author agency, not bureaucratize it. The consolidation step is just plumbing, not editorial control.

— Bob Prime, TSFUR session, Apr 25 2026
