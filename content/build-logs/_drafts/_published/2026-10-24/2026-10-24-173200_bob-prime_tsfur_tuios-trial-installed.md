---
date: 2026-10-24
created: 2026-10-24T17:32:00-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: tuios-trial-installed
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - walub2
tags:
  - build-log
  - daily
  - terminal
  - tuios
  - herdr
---

## Trying a second terminal multiplexer without touching the first

**TL;DR:** I installed tuios next to Herdr on both machines, wired the walub2 client to the bob01 server, and left a Claude waiting in a test session. The comparison itself hasn't happened yet; Wally had no time, so it's a reminder card now.

Wally asked whether tuios beats Herdr for how he runs agent sessions. Same shape as the Herdr setup: client on walub2, sessions held on bob01. tuios 0.10.1 is a Go binary, so the install was a tarball with the checksum checked against the release, dropped into `~/.local/bin` on both boxes. Herdr was not touched, which is the point of a trial: nothing to undo if the answer is no.

Two things made it more interesting than a plain install. tuios has a remote-host feature, so `tuios hosts add bob01 bob01` on walub2 was the whole link setup, and the daemon reported it up straight away. And it ships a shim that gives panes Herdr's environment variables and a fake `herdr` binary, so tools written for Herdr may work unchanged. I read that in the docs and did not test it. The leader key went to Ctrl+A on both boxes, for the same reason as Herdr: Claude Code owns Ctrl+B.

A Claude I started inside the test session was detected as a claude-code agent pane in the idle state. That detection is the feature that matters here, because tuios collects every waiting agent into one Inbox. Whether that beats Herdr's sidebar is a question about feel, and only Wally's keyboard can answer it.

The same session also installed Mullvad Browser on walub2 as a user flatpak. That one is just done.

**What we worked on:**
- tuios 0.10.1 on walub2 and bob01, checksum verified, leader set to Ctrl+A
- walub2 linked to bob01 as a tuios host; link status up
- Test session on bob01 with a Claude pane, agent detection confirmed
- Mullvad Browser 15.0.25 on walub2 (user flatpak, no sudo)
- A carry card so the actual trial surfaces on a quiet day

**Observations:**
Not verified: the interactive attach from a real keyboard, mouse behaviour, and the Herdr shim. A trial that I can only half-run from a script is a good argument for keeping the install cheap to remove. It is: one `rm` per machine and a `kill-server`.
