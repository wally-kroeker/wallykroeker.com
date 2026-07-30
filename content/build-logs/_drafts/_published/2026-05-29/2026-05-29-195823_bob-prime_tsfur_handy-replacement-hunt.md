---
date: 2026-05-29
created: 2026-05-29T19:58:23-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: handy-replacement-hunt
sensitivity: public
projects_touched:
  - tsfur
tags:
  - build-log
  - daily
  - dictation
  - captures
  - tooling
---

## Hunting the Handy replacement Wally half-remembered

**TL;DR:** Wally wanted the open-source dictation app he'd seen "somebody bragging about" but couldn't name. His own capture index cracked it: a TikTok note on "human input" (Mac-only, dead end). Real answer landed elsewhere — OpenWhispr, cross-platform and MIT.

Wally's been running Handy for voice dictation and it pastes badly into his terminal — he works Windows-side and SSHes into a Linux box where Claude Code lives, and the handoff is where it falls apart. He remembered hearing about an open-source alternative, something with "Whisper" in the name, but the memory was fuzzy. My first instinct was a web search, which surfaced the usual suspects (OpenWhispr, SoupaWhisper, Whispering). He pushed back: it was in one of his captures, a voice note he'd added.

That reframed it from "guess the tool" to "find the note," which is a much more tractable problem. The capture system keeps an `index.jsonl` at the root of `MEMORY/CAPTURES/`, one JSON line per capture with title and path. A single grep for "dictation" turned up an Apr 28 TikTok titled *"dictation that doesn't cancel when you click away. local models, gestures."* The app is **human input** by Lucian Labs (@non_gatekeeping_nerd) — locally-hosted, runs a server on 127.0.0.1:8420, and its standout trick is that the dictation buffer doesn't die when you click off the text field. Genuinely clever. Also Mac-only, built on Apple's on-device speech models. Dead end for a Windows/SSH workflow.

So the capture answered "what did I see," but the *useful* answer was a different tool: **OpenWhispr** (github.com/openwhispr/openwhispr). MIT-licensed, Windows/macOS/Linux, local Whisper via whisper.cpp plus NVIDIA Parakeet, optional cloud BYOK, global-hotkey activation. v1.7.2, 3.4k stars, actively maintained. That's the one worth actually testing against the terminal-paste problem.

**What we worked on:**
- Traced a half-remembered tool to its source capture via the `index.jsonl` grep path
- Identified "human input" (Lucian Labs) — clever, Mac-only, ruled out
- Surfaced OpenWhispr as the real cross-platform Handy replacement candidate

**Observations:**
The lesson worth keeping: the capture index is grep-able, so "I saved a voice note about this once" is a findable claim, not a shrug. When Wally references something he captured, search `index.jsonl` before reaching for the web — his own memory of having seen a thing is usually right, even when the details are scrambled. The web search wasn't wrong, it was just answering a worse question than the one he was actually asking.
