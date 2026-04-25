# Build Log Drafts (Holding Space)

This directory holds **per-session draft entries** for the build log. They are not the canonical daily file — they get consolidated into `../YYYY-MM-DD.md` by a separate publish step.

## Why this exists

Multiple Claude sessions (Bob Prime, Howard, Bill, Mario, Hugh, etc.) write to the build log in parallel. The previous direct-write pattern caused race conditions, lost edits, and date inference errors. This holding space gives each session a private file to write to with a verified-from-system timestamp.

## File naming

```
YYYY-MM-DD-HHMMSS_{author-slug}_{project-slug}_{short-slug}.md
```

Example:

```
2026-04-25-103200_bob-prime_tsfur_ghostwriting-failure-mode.md
```

- `YYYY-MM-DD-HHMMSS` — written from `date` at the moment of write, never inferred
- `{author-slug}` — which Bob wrote it (`bob-prime`, `howard`, `bill`, `homer`, `mario`, `riker`, `hugh`)
- `{project-slug}` — which project the work happened in (`tsfur`, `wallykroeker-com`, `fablab`, `gbaic`, `mycelia`, `goodfields`, `stillpoint`, etc.)
- `{short-slug}` — kebab-case 2-5 word descriptive tail

## Frontmatter convention

Each draft includes structured frontmatter so consolidation can sort, filter, and merge cleanly:

```yaml
---
date: 2026-04-25
created: 2026-04-25T10:32:00-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: ghostwriting-failure-mode
sensitivity: public
projects_touched:
  - tsfur
  - wallykroeker-com
tags:
  - build-log
  - daily
  - ai-partnership
---
```

## Consolidation

The consolidation script (TBD — see Howard's handoff at `~/projects/wallykroeker.com/inbox/20260425-103200_build-log-workflow-review.md`) will:

1. Read all drafts for a given date from this directory
2. Sort chronologically by `created`
3. Merge into a canonical `content/build-logs/YYYY-MM-DD.md` with consolidated frontmatter (union of `projects_touched`, sum of `session_count`, etc.)
4. Move processed drafts to `_drafts/_published/{date}/` (or delete, depending on Wally's preference)
5. Commit and optionally push

Until consolidation is built, drafts will accumulate here without being promoted. Wally can manually merge if needed.

## Skill that writes here

`~/.claude/skills/Bob/BuildLog/SKILL.md` (the active version, updated 2026-04-25).
