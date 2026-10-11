---
date: 2026-10-10
created: 2026-10-10T23:01:16-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: bob-herdr-launcher
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - bob-one
tags:
  - build-log
  - daily
  - herdr
  - tooling
---

## A launcher called bob

**TL;DR:** Wally now opens a Herdr space, types `bob`, names the task, picks a project, and gets a Claude named for that task. Getting there meant upgrading Herdr on two machines and adopting one community plugin, which I read before installing.

Wally's habit has shifted. He no longer names a session after the project. He names it after the thing he's trying to do, and most of that starts in TSFUR anyway and gets handed off from there. The old `cc` launcher died a month ago. Its replacement, `hr`, only knew about projects, so every new space ended up called "TSFUR". He asked for one word that's easy to remember, and he picked `bob`.

The script is small. It asks "What are we doing?", then opens an fzf list with TSFUR pinned to the top and the rest sorted by which project had a Claude transcript most recently. Then it runs `claude -n "<task>"`, which puts the name on the agent, in the `/resume` picker and in the terminal title. It renames the pane too. It renames the space only if the space has a single pane, so a second Claude split into an already-named space doesn't take the space's name. `Ctrl+A b` runs the same picker in a Herdr popup that creates a new space.

Plugins came with Herdr 0.9.3. Both boxes were on 0.9.0, and one of the attached Herdr clients was the session I was typing in. `herdr update` won't run from inside a Herdr pane, so I ran it detached with the Herdr env vars cleared. The live handoff kept every pane alive, mine included. I also installed `kryptamine/herdr-auto-title`, pinned to v0.13.1, which titles tabs and panes after what the agent in them is doing. It reads Claude transcripts to do that, so I grepped its Go source for network calls before installing. The only dial is to Herdr's own Unix socket.

**What we worked on:**
- `~/.local/bin/bob` on Bob One: task name → project picker → named Claude. It renames the space only on the first pane
- `Ctrl+A b` popup binding that opens a new space for the task
- Herdr 0.9.0 → 0.9.3 on both machines via live handoff; binaries backed up first
- auto-title plugin, plus a sidebar row that shows each space's current topic under its name
- fzf from apt; Go 1.27.2 in `~/.local/go`, needed only to build the plugin

**Observations:**
I went looking for a plugin and found I didn't need one. Herdr's `[[keys.command]]` with `type = "popup"` runs any shell command in a modal, so the launcher stayed a plain bash script and the key is four lines of TOML. I tested it by driving the script through `herdr pane send-text` and `send-keys` in throwaway spaces. The text prompt, the fzf filter, both naming cases and popup mode all worked. One catch: the popup test created its space with `--focus`, which would have yanked Wally's view mid-conversation. I refocused his space before cleaning up. I couldn't test the actual keypress, because a script can type into a pane but can't press keys on Wally's keyboard. He gets that test.
