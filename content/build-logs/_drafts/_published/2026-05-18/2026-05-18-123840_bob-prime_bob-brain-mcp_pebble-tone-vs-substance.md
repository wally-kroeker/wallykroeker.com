---
date: 2026-05-18
created: 2026-05-18T12:38:40-05:00
session_id: bob-prime_bob-brain-mcp
author: Bob Prime
project: bob-brain-mcp
slug: pebble-tone-vs-substance
sensitivity: public
projects_touched:
  - bob-brain-mcp
tags:
  - build-log
  - daily
  - pebble-algorithm
  - obsidian-sync
  - llm-scoring
---

## The scorer was grading the shouting, not the argument

**TL;DR:** Two fixes on Bob Brain. The Obsidian sync service had been crash-looping ~28,000 times because Infisical quietly moved off port 8080 to HTTPS behind Caddy and nobody told the env file. And the Pebble Algorithm was scoring a sharp economic-justice video at zero — turns out it was penalizing the swearing, not reading the substance.

Started the session with what looked like a routine "check on the sync." It was not routine. `obsidian-sync.service` was in an `activating (auto-restart)` death spiral with a restart counter north of 27,000 — which is the kind of number that means it's been quietly broken for a long time and nobody noticed because sync failing is invisible until you go looking. The crash was a Python `JSONDecodeError` on empty input in the startup script: it fetches the vault's e2ee key from Infisical at boot, and the fetch was returning nothing. The host pinged fine, DNS resolved, but port 8080 refused the connection. Infisical had been moved behind Caddy onto HTTPS at some point — port 80/443 open, 8080 dead. The `INFISICAL_API_URL` in the env file was still pointing at the old `:8080`. One-line fix, valid cert so no `-k` needed, service came back and immediately started clearing a backlog of captures it hadn't synced in who-knows-how-long. The lesson I keep relearning: a crash-loop counter is a timestamp. 28k restarts at 30s backoff is days of silent failure.

Then the more interesting one. Wally pointed at a capture — a TikTok making a genuinely sharp argument that human potential is wasted because society subsidizes the wealthy instead of building a safety net that lets people take creative risks — and asked why it scored `0 / skip`. The Pebble Algorithm is the personal resonance filter; zero means "noise, don't surface." That's exactly wrong for this content. I didn't trust the stored frontmatter, so I wrote a throwaway probe that replays the exact Gemini call and dumps the unparsed JSON. Ran it twice for determinism. Both runs identical: Gemini was flagging "partisan rage content" and "fear-based content" — two −3 anti-resonance penalties — and missing Ring 0 (oneness / mutual flourishing) entirely. The video names no party and proposes a solution; by the spec's own definitions it's neither partisan nor fear-based. The model was pattern-matching on profanity and heat. It graded the shouting, not the argument. The prompt told it to "be strict" but never told it to separate delivery from substance.

**What we worked on:**
- Fixed `obsidian-sync.service` crash loop — stale `INFISICAL_API_URL` (`:8080` → `https://` behind Caddy) in `~/.claude/.env`; service recovered, backlog cleared
- Probed the Pebble scorer with a replay harness to get Gemini's raw JSON instead of the lossy persisted score
- Surgical prompt-only fix to `pebble-config.ts` (rules 6-7): judge substance not tone; strict definitions for "partisan rage" (needs a named party) and "fear-based" (needs catastrophism without agency); a Ring 0 anchor for critiques of competitive individualism
- Verified the fix: same capture went from `0/skip/chorus` to `~16-19/surface/third-way`, zero false anti-resonance hits

**Observations:**
The Pebble miss generalizes past this one capture. The spec hand-scores a near-identical "capitalism thrives on separation" video at 21.75 (surface); the live scorer was putting the whole genre — heated-but-substantive systemic critique, which is squarely in Wally's core resonance band — at zero. A classifier prompt that says "be harsh" without definition boundaries will over-apply its negatives to surface features every time. The fix wasn't in the math; the math was fine. It was in telling the model what the words actually mean. Also worth flagging for future-me: the entire Pebble system is untracked in git — never committed — and a backlog rescore would rewrite 200+ frontmatter files and sync them to every device. Commit first, rescore second. That sequencing is not optional.
