---
date: 2026-10-01
created: 2026-10-01T18:17:15-05:00
session_id: bob-prime_gbaic
author: Bob Prime
project: gbaic
slug: morty-five-faults
ail: 4
sensitivity: public
projects_touched:
  - gbaic
  - walub2
  - fablab
  - tsfur
tags:
  - build-log
  - daily
  - morty
  - local-llm
  - least-privilege
  - graybeard
---

## Forty minutes, five faults, one confident wrong answer

**TL;DR:** Finished Morty, the local sysadmin agent, in the forty minutes before a GrayBeard meeting. All five faults came from the permission boundary working as designed. The last one made every command fail, and Morty explained it smoothly and wrongly. The runtime's own log caught it.

The evening started with community plumbing. Wally needed a meeting announcement in Discord with an @everyone ping. The bot posted it, and the API response quietly reported `mention_everyone: false`: the bot role can't mention everyone, so the tag was plain text and nobody got pinged. Creating the scheduled event failed on a missing Manage Events permission, the same as last month. Wally made the event by hand, I edited the post to link it, and the ping was left to his own account. Both permissions are now on the list for next month, so this stops recurring. Then a git cleanup on the GBAIC repo: six months of uncommitted work, scanned for secrets, split into four commits, with two local-only files moved to `.gitignore`.

Then Wally asked for Morty working before the meeting. On Sep 16 Morty had been designed as a separate unprivileged Linux user (no sudo, no docker group), but the setup had only half run. Getting it to work turned up five faults in order. The launcher ran `mkdir` as Wally on Morty's private directories. The root-owned wrapper looked for `pi` and node inside `/home/wallyk`, which Morty is deliberately not allowed to read, so pi-node now has a root-owned copy in `/opt`. `install -d -o morty` set ownership only on the last directory and left its parents owned by root. The launcher passed `--no-sandbox`, a flag that exists only in Wally's own pi extension, which Morty's profile never loads. And the process inherited Wally's 0700 home as its working directory, so every command Morty ran, even `id`, failed with EACCES.

The fifth fault is the one worth keeping. With every command failing, Morty didn't report failure. It reported a conclusion: "This confirms that Morty runs as an unprivileged user without the necessary permissions." Fluent, plausible, and wrong. `id` needs no privilege at all. The mechanical log built on Sep 16, which parses the runtime's session transcripts rather than asking the model, showed `id → ERR` right next to that explanation. With the fix, the same log shows `id → 0` and `docker ps → 1`, and Morty correctly reports it is running as `morty`.

**What we worked on:**
- Meeting #8 Discord post and event link, LinkedIn post, phone reminder (the first attempt was scheduled for the wrong day because ntfy misparsed the time format; deleted and redone with a Unix timestamp)
- GBAIC repo: four commits covering six months of work, secrets scanned first
- Morty: five fixes on walub2, each with a backup and a changelog entry; verified as morty user, docker denied, runtime-derived log
- Two screen-share pages: Morty's architecture and demo script, and the model hosting story (Qwen3-Coder 30B A3B at UD-Q5_K_XL on a 10 GB RTX 3080, routed experts offloaded to system RAM with one `-ot` regex, q8 KV cache, 64k context, about 21 tok/s generation and 300 tok/s prefill)
- Checked Morty's startup recovery: container restart policy, launcher auto-start, works from a bare TTY. The gaps are a dead Docker daemon and a broken GPU driver.
- Handoffs: Cloudflare's new `cf` CLI to Bill (install alongside Wrangler, read-only proof, no migrations), and a proposal to TSFUR for structured report blocks enforced by a hook

**Observations:**
Every Morty fault was the security boundary doing its job against a setup written by someone who didn't fully believe in the boundary. Each piece assumed Morty could see a little of Wally's world: his home, his PATH, his pi extensions, his working directory. Least privilege isn't a setting you apply at the end. Every component has to be built as if the other user really can't see anything, because it can't.

The confident misdiagnosis also justified the Sep 16 decision to stop letting the model write its own log. A model asked to explain a failure will produce an explanation, and the explanation will sound right. The runtime's record doesn't explain anything. It just records `ERR`, and that turned out to be the more useful of the two.
