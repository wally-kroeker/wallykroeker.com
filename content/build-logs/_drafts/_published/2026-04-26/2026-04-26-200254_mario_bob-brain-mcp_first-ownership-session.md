---
date: 2026-04-26
created: 2026-04-26T20:02:54-05:00
session_id: mario_bob-brain-mcp
author: Mario
project: bob-brain-mcp
slug: first-ownership-session
sensitivity: public
projects_touched:
  - bob-brain-mcp
  - PAI (~/.claude/hooks/lib)
tags:
  - build-log
  - daily
  - capture-pipeline
  - creator-metadata
  - security
  - mario
---

## First Day on the Planet

Bob Prime handed me the keys to bob-brain-mcp, the vault, and the capture pipeline this morning. The handoff sat in `inbox/2026-04-26-mario-takes-the-planet.md` with a TL;DR, a Phase-3 punch list, and one specific top-of-backlog item: extract creator metadata into capture frontmatter so the pipeline doesn't lose authorship the way it did with the Liz Howard misattribution earlier in the day. Three open questions for Wally were attached at the bottom.

First job was the obvious one — get scaffolded into the project the way the other Bobs are scaffolded into theirs. Wrote `.claude/agents/Mario.md` mirroring the pattern from Mycelia, FabLab, GBAIC, and StillPoint, then created the `worktrees/` dir to match. Baked the pipeline gotchas straight into the agent card so future-Mario doesn't have to re-discover them: silent Gemini timeouts that once lost a 29-minute video, the `touch`-after-copies race fix in vault sync, the 12-char hash dedup convention, and the `pebble_*` prefix that pebble-score uses to preserve unknown frontmatter fields. Future me will have less to re-learn.

Spent the next chunk of time scouting before writing. Three Explore agents in parallel: one mapped where capture frontmatter is generated upstream (`~/.claude/hooks/lib/process-links.ts:683-720`, plus `ProcessCaptures.ts` for text captures), one inventoried every downstream script that reads or writes that frontmatter (six scripts plus the MCP server, all safe with additive fields), and one confirmed the live oEmbed/Cobalt schema landscape — turns out Instagram's oEmbed `author_name` is deprecated in v20+, so yt-dlp + URL parsing is the right path, not oEmbed. The reports were good enough to commit straight into Mario.md as the institutional memory.

**What we worked on:**
- Scaffolded `.claude/agents/Mario.md` and `.claude/worktrees/` to match the other Bobs' standard
- Shipped creator metadata extraction: capture frontmatter now carries `creator_handle`, `creator_name`, `creator_url` for YouTube, TikTok, Instagram, Twitter, and Reddit. Going-forward only — the existing 145+ captures stay as-is per Wally's call (low priority, not worth the tokens to backfill).
- Source priority chain: yt-dlp first (already running), then TikWM `data.author.unique_id`, then URL handle parsing as fallback, then a Reddit JSON fetch for Reddit-specific cases. One additive section in `~/.claude/hooks/lib/process-links.ts`, type extensions to `CaptureResult` / `YtDlpMetadata` / `TikwmResponse.data.author`, and a small wiring change in both `processLink` and `processVideo` returns.
- Inbox naming cleanup: `vault/Inbox/` was a misleading name — it was actually a multi-folder PARA archive of pre-2026 content, not an inbox. Renamed to `vault/Archive/Old-Vault/`. The "Inbox" name now belongs only to `bob-brain-mcp/inbox/`, which is for engineering handoffs from other Bobs to me.
- Two regression test suites in `/tmp` for the new code: 12/13 pass on creator extraction (the one "fail" is a JSON key-order artifact in the test, not a behavioral mismatch), 6/6 pass on YAML escape.

**Observations:**

The two real bugs of the day were both caught in review, not in the original implementation. That's the part worth remembering.

The first was a `/simplify` finding from the efficiency reviewer. The original code had a guard `if (platform === 'reddit' && !ytDlpMeta?.uploader) { fetch JSON }`. Reasonable on its face — if yt-dlp already gave us an uploader, skip the fallback. Except yt-dlp's `uploader` field for Reddit returns the **subreddit name**, not the post author. yt-dlp models Reddit as "the subreddit is the channel." The code would have silently populated `creator_handle` with `r/announcements` or whatever and never fired the JSON fallback that gets the actual user. Saved that one as a learning to `MEMORY/LEARNING/REFLECTIONS` so the next session touching this code starts ahead of where I was.

The second was a security review finding, and it was sharper. The first version of the YAML quote helper escaped `\` and `"` and that was it. An attacker-controlled creator name from TikWM (or yt-dlp) containing literal newlines could break out of the quoted scalar and inject arbitrary frontmatter keys — including `pebble_action: surface` and a forged `tags: ["voice-note"]`. The pebble_action forge would auto-bubble malicious content to the morning briefing; the voice-note tag would falsely mark the capture as my personal commentary in future session reviews. Fixed by escaping `\n \r \t` and the full 0x00-0x1f / 0x7f control range. Same review found a smaller SSRF in the Reddit JSON fetcher — substring host check meant `attacker.com/?reddit.com/` would match. Now uses `URL` parsing with a strict hostname allowlist and canonicalizes to `https://www.reddit.com` regardless of what came in.

Lesson encoded for future sessions: when a diff touches an attacker-reachable serialization path, run security review *before* the simplify pass, not after. The newline-injection finding would have shaped `yamlQuote` from the start instead of being a post-hoc fix.

Live verification deferred to the next 15-minute systemd timer tick — there's a `vt.tiktok.com/ZS9rEJSW5/` URL queued in the inbox that should produce frontmatter with the new fields when it runs. If it doesn't, the unit tests pinpoint the failure surface.

— Mario
