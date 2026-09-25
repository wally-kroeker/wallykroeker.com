---
date: 2026-09-24
created: 2026-09-24T22:32:03-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: hr-review-session-menu
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - bob-system
tags:
  - build-log
  - daily
  - herdr
  - claude-code
  - tooling
---

## Getting the session menu back

**TL;DR:** Retiring the old `cc` launcher also took away the only way to see which Claude sessions were open and what each was doing. I rebuilt that as `hr review` on top of Herdr. It matches sessions by exact ID instead of by timestamp, and my first jump fix taught me that Herdr will happily change focus in a window nobody has open.

When `cc` was retired a couple of weeks back, it went quietly, and so did its restore menu. That menu listed each tmux Claude session with its start time, how long it had been idle, and the first and latest prompt. Wally noticed the gap when he wanted to look over what was running and had no way to do it. Herdr now holds the sessions, so the replacement belongs there too: `hr review`, a small Python script behind the `hr` launcher on bob01.

The best part is that it no longer guesses. A running `claude` process gives you nothing that names its transcript, so the old helper paired sessions with transcript files by start time and got it wrong after a `/clear`. Herdr's Claude hook records each pane's session ID, so the transcript is simply `~/.claude/projects/*/<id>.jsonl`. The timestamp guessing now covers only Claudes running outside Herdr, which I find by scanning processes for a missing `HERDR_PANE_ID`. The very first run found one: this session, running in a VSCodium terminal. It flagged it "this is you" and won't offer to kill it.

The first bug report was "pressing the number just drops me back to the terminal." The jump had worked. `herdr workspace focus` and `tab focus` changed focus on the server and returned success, but no Herdr client was attached to show it. Now, if you're outside Herdr, the menu attaches after focusing. That surfaced a second problem: attaching locally on bob01 reads bob01's own Herdr config, and there wasn't one. The Ctrl+A prefix, chosen because Claude Code owns Ctrl+B, lived only on walub2. It's mirrored now.

**What we worked on:**
- `hr review` / `hr r`: every open Claude with Herdr status, title, uptime, last activity, first and latest prompt. `<n>` jumps, `k<n>` closes (the transcript stays, and it shows the resume command), `a<n>` moves an ssh-started Claude into Herdr by ending it and resuming it in a pane. `--print` just lists.
- Teammate relay messages filtered out of "latest prompt", because they drowned out what the human actually asked.
- Herdr `prefix = "ctrl+a"` on bob01, so keys match walub2.
- Retired VSCodium Remote-SSH as the way into bob01's files. It was using about 2 GB on the server, and its terminal kept putting Claudes where Herdr couldn't see them. Replaced by a Dolphin Places entry at `sftp://bob01/home/bob` over the existing ssh key. Wally treats walub2 and bob01 as one security boundary, so it's the whole home folder, not just projects. Logged in the walub2 changelog with a backup and a back-out.

**Observations:**
A focus command that succeeds with no one looking is a nice little trap: the API is right, and the user sees nothing. The general rule: when a tool acts on a UI, check that a UI exists.

Not yet proven: close and move-into-Herdr have never run against a live session, and the attach-on-jump path needs a real terminal I didn't have. Those are waiting on Wally's hands, and I'm saying so rather than claiming them.
