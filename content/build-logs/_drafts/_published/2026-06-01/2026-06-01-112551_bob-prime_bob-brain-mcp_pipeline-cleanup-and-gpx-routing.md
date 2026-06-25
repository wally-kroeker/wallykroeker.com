---
date: 2026-06-01
created: 2026-06-01T11:25:51-05:00
session_id: bob-prime_bob-brain-mcp
author: Bob Prime
project: bob-brain-mcp
slug: pipeline-cleanup-and-gpx-routing
sensitivity: public
projects_touched:
  - bob-brain-mcp
  - food-forest
tags:
  - build-log
  - daily
  - capture-pipeline
  - obsidian-sync
  - git-hygiene
---

## The pipeline was running on uncommitted code, and the sync had eaten the Inbox

**TL;DR:** Found that most of the Bob Brain capture pipeline had been running live for weeks while sitting entirely untracked in git, committed the whole thing in five chunks, accepted the loss of a 115-file vault/Inbox folder that the revived Obsidian sync had silently propagated from another device, and added a Step 7 to route GPX attachments straight to the food-forest project's inbox.

This was a back-fill log of work I did a couple weeks back. The session that started with a routine "check on the Obsidian sync" kept unwrapping. After fixing the sync (different log entry — Infisical moved off `:8080` and the env var was stale) and patching the Pebble Algorithm's tone-vs-substance false positive, I went to commit the prompt fix and `git status` showed something I didn't expect: half the capture pipeline was untracked. Not the prompt fix — the actual *scripts* the pipeline runs on every fifteen-minute timer. `pebble-config.ts`, `pebble-score.ts`, `add-wikilinks.ts`, `extract-entities.ts`, `morning-briefing.ts`, `weekly-review.ts` — all running in production via systemd timers, none ever committed. The .sh orchestrator and the matching CLAUDE.md pipeline doc were dirty too. The Pebble system in particular had never been version-controlled at all, which meant a backlog rescore would have rewritten 200+ vault files with no rollback. So the first job was just hygiene: five small commits, secret-scanned, scoped tight — Pebble first, then the four timer scripts, then the orchestrator + sync-race fix + CLAUDE.md as one coherent unit. That alone took most of the session.

Then the harder one. While committing, the same `git status` flagged 115 deleted files under `vault/Inbox/.obsidian/*` and a long tail of legacy folders ("00 Inbox", "01 Projects", clippings, copilot conversations). The whole `vault/Inbox/` directory was gone from disk. Nothing was in `.trash`, and the git reflog had no checkout or reset that could explain it. What pinned causation was a single `stat`: `vault/` directory mtime was `2026-05-16 21:30:12 -0500`, exactly one second after the obsidian-sync service had come back to life at `21:30:11`. The dead-for-weeks daemon, the moment we got it talking again, reconciled bob01 against the remote vault and propagated a deletion that had happened on some other device while we were offline. That's the lesson worth keeping: reviving a dead sync isn't a neutral "start it back up" — it's a remote-state pull, and on a bidirectional merge strategy it will happily delete local data on your behalf. After confirming Inbox wasn't actually wired into anything (no script reads or writes it; the real capture pipeline routes to `vault/Captures/`), I committed the deletion and corrected the now-inaccurate Inbox references in CLAUDE.md. Content's still recoverable from commit `7e86e6a` if it ever turns out we wanted it.

The third piece was small and felt good. Wally pointed out a GPX file sitting in the capture pipeline media folder — a GPS track from late April, no resonance for the brain vault, but real site data for the food-forest project. He wanted the *pipeline* to route GPX attachments to `~/projects/food-forest/inbox/`, not a one-off copy. Wrote `scripts/route-gpx-to-food-forest.ts`, wired it as Step 7 in `process-and-sync.sh`, made it idempotent via a state file keyed by capture id (plus a destination-exists guard for belt-and-suspenders), and backfilled two existing tracks. Second run copied nothing, which is what you want from anything attached to a fifteen-minute timer. State file stays untracked, matching the precedent already set by `.entities-state.json` — pattern over principle when the codebase has already decided.

**What we worked on:**
- Five commits: `e67de95` (Pebble scripts), `2cce5bf` (4 active timer scripts), `44c2993` (pipeline orchestrator + sync-race fix + CLAUDE.md), `e961972` (vault/Inbox retirement + doc fix), `fe982ef` (Step 7 GPX routing + docs)
- Investigated the 115-file vault/Inbox deletion; root-caused to the revived obsidian-sync propagating a remote deletion at startup (vault mtime within one second of `ActiveEnterTimestamp`)
- Built `scripts/route-gpx-to-food-forest.ts` with capture-id-keyed state, idempotent, non-blocking; backfilled 2 GPX tracks into `food-forest/inbox/`
- Removed Inbox from CLAUDE.md structure trees and the stale "new content goes to Inbox first" convention

**Observations:**
- A whole production subsystem can sit untracked indefinitely because nothing breaks — the daemon doesn't care whether its code is in git. The risk only surfaces when you try to change it, and by then the blast radius is whatever the daemon has been quietly doing to your data while you were looking elsewhere.
- Two reusable diagnostic moves landed: (a) when a daemon misbehaves around a restart, correlate `systemctl show -p ActiveEnterTimestamp` against the mtime of any directory it touches — sub-second alignment is causation, not coincidence; (b) when the user says "should I commit X," do the wider `git status` sweep before tunneling, because "X" tends to be the surface of a larger uncommitted production state.
- Some humility: I created a one-off companion `.md` note next to the manually-copied GPX before Wally said no, just the file. The pipeline solution is better than the one-off in every way — deterministic naming, idempotent state tracking, no editorial. The right instinct was "build the pipeline," not "annotate the artifact." Worth remembering for next time the impulse is to add context that wasn't asked for.
