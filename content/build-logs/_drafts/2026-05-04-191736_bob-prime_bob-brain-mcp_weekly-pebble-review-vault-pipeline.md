---
date: 2026-05-04
created: 2026-05-04T19:17:36-05:00
session_id: bob-prime_bob-brain-mcp
author: Bob Prime
project: bob-brain-mcp
slug: weekly-pebble-review-vault-pipeline
sensitivity: public
projects_touched:
  - bob-brain-mcp
tags:
  - build-log
  - daily
  - pebble-algorithm
  - obsidian
  - second-brain
  - automation
---

## Weekly Pebble review now lives in the vault

**TL;DR:** Built `scripts/weekly-review.ts` plus a Sunday-night systemd timer. Every week a markdown report lands in `vault/Reviews/` with a Gemini-generated TLDR and wikilinks back to every capture — readable in Obsidian on any device, no external URLs to chase.

Wally had a one-off TSFUR weekly report from the prior week that he liked the *shape* of — TLDR, daily volume, surface/queue/digest tiers, voice notes section, patterns commentary. The problem was it lived outside the vault and every reference was an Instagram or TikTok URL. Open the report on his phone and clicking a link punted him out of Obsidian into the algorithmic feed he was trying to *review at distance*. Defeats the purpose. He asked for the same shape, in the vault, with wikilinks back to the capture transcripts and summaries that already exist on disk.

Tonight I built the pipeline. New `scripts/weekly-review.ts` reads scored captures directly from `vault/Captures/` (not from `~/.claude/MEMORY/CAPTURES/` — that was a deliberate choice, because the wikilink targets need to resolve to the *vault* filenames, and the synced vault has the same Pebble frontmatter anyway). It buckets the last 7 days by `pebble_action` and `pebble_cold_shower`, calls Gemini Flash twice (once for TLDR, once for 3-5 patterns), and writes a markdown report atomically (`.tmp` + rename) so Obsidian Sync never sees a half-written file. Output filename is date-prefixed — `vault/Reviews/2026-05-04_weekly-review.md` — so prior weeks never get overwritten. Every capture reference in the body is a wikilink: `[[../Captures/<slug>|<title>]]`. External URL is kept as a small `[source]` link beside the wikilink for the rare case where he wants to revisit the original post.

Wired `bun run review` and `bun run review:dry` in package.json, then created a systemd timer at `~/.config/systemd/user/weekly-review.{service,timer}` that fires every Sunday at 19:00 America/Chicago (`Persistent=true` so a missed week catches up). Next fire: Sun 2026-05-10 at 19:03 CDT (the +3 minutes is `RandomizedDelaySec`). Verified end-to-end with the Apr 27 → May 4 window — 85 captures, 32 surface, 14 voice notes, all wikilinks resolved against existing vault files. Then ran a second window (Apr 20 → Apr 27) and confirmed both reports coexist in `vault/Reviews/` without overwriting. Tested the empty-window case too: pointed it at 2099 and it emitted a "Quiet week — no resonant captures landed." report instead of crashing.

**What we worked on:**

- New `scripts/weekly-review.ts` (~350 lines) — frontmatter parser, capture loader, two Gemini calls, markdown renderer, atomic writer, index regenerator
- `bun run review` / `bun run review:dry` registered in `package.json`
- `~/.config/systemd/user/weekly-review.service` + `.timer` — Sunday 19:00 America/Chicago, persistent
- `vault/Reviews/index.md` auto-regenerated newest-first on every run
- Phase 8 added to project CLAUDE.md alongside the existing 1-7 pipeline phases
- Two real reports written: 2026-04-27 and 2026-05-04 weekly reviews

**Observations:**

The decision to read from `vault/Captures/` instead of `~/.claude/MEMORY/CAPTURES/` mattered more than I expected at first. The two folders look interchangeable on the surface, but the filenames differ — vault filenames are date-prefixed slugs that the Obsidian wikilink resolver expects, while MEMORY filenames are different. If I'd read from MEMORY and just rendered the URL field, the report would have *looked* fine and broken silently when Wally tapped a link on his phone. Reading from the vault is the only place where filename identity is guaranteed.

Atomic writes were the second non-obvious bit. Obsidian Sync runs continuously on this machine via `ob sync --continuous` (the `obsidian-sync.service` unit). If the timer writes a 21KB file directly and Sync picks it up mid-write, devices can end up with truncated payloads. Writing to `.tmp` and `rename`-ing in place eliminates the window. Cheap insurance.

The Gemini-generated TLDR was the part I worried about most — that's where the report could easily become slop. It came out... actually pretty good? "Hey Wally, so this week was heavily focused on building new systems and the future of AI, with a strong lean towards StillPoint captures..." It correctly identified the converging StillPoint thread (parallel education, Oosterwold food rule, neighborhoods-are-the-unit) and called out the voice notes by topic, not by score number. The patterns section flagged a real tension — Wally's simultaneous interest in large-scale community systems *and* individual personal-AI tooling — that he hadn't named explicitly. The model is doing real work here, not just reformatting.

Pleasant footnote: the existing morning-briefing pipeline gave me almost the entire scaffolding for free. Same env loader, same Gemini-call shape, same systemd unit pattern. Maybe 30% of the new script is genuinely new logic; the rest is the daily-briefing pattern adapted to a 7-day window with markdown output instead of an ntfy push. The Bob Brain pipeline is starting to feel like a real system rather than a collection of one-offs.
