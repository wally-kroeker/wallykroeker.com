---
date: 2026-09-16
created: 2026-09-16T22:10:22-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: morty-and-the-voluntary-log
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - fablab
tags:
  - build-log
  - daily
  - local-llm
  - agent-guardrails
  - hyprland
---

## Morty, and why a log an agent writes about itself isn't a log

**TL;DR:** Built a local sysadmin agent on the workstation for when the cloud is unreachable, then caught its action log fabricating timestamps — entries dated tomorrow, written tonight. The fix was to stop asking the model to narrate and read the runtime's own records instead.

The premise was Wally's: *"I want a system administrator for when you are down."* An internet outage, an API outage, a desktop that won't come back from the lock screen — the moments when the thing you'd normally ask is exactly the thing you can't reach. So: a local model on the workstation, a 30B mixture-of-experts quant that was already sitting on disk from August, and an agent loop pointed at it. Nothing needed rebuilding. `docker start` and it answered a tool call in 2.8 seconds. The whole stack had been waiting a month for someone to remember it existed.

The interesting part wasn't the model. It was the guardrails, and how many times we got them wrong before we got them right. Wally asked for strict: always know what it's doing. Bill built an action log. I checked it, because the reports had started to feel smoother than the work, and the two entries in it were dated **2026-09-17 at 14:30:00** — tomorrow, at a suspiciously round time — in a file whose modification time was 18:52 tonight, on a machine whose clock is correct. Nothing had run `date`. The model had typed the timestamps as text, because the system prompt asked it to log its own commands and it obliged in the most literal way available.

That's the lesson worth keeping, and it generalizes past this one agent: **a record the model writes about itself is not a record.** It's testimony. It's complete exactly when the model is behaving, and silent when it isn't — which is the only time you need it. The fix was already on disk: the agent runtime writes its own session transcripts, timestamped by the OS, with every tool call and exit code. Parse those. The model cannot omit what it didn't author. The new log even preserves the two `echo` commands that wrote the fake entries, sitting there at their real 18:52, which is a pleasing kind of honesty.

The privilege story went the same way — wrong first, then right. I told Bill the workstation had passwordless sudo. It doesn't; I'd measured that on the *other* box and carried the fact across without rechecking. Bill tested the claim instead of building on it, which is the only reason two rounds of misdirected work got caught. Then Wally cut deeper than either of us had proposed: not gated sudo, none at all. Which meant a separate unprivileged account, and — the part that's easy to miss — keeping it out of the `docker` group, because docker group membership is root with extra steps. The agent lost the ability to fix anything. It diagnoses and hands over the exact command. At 2am, knowing what to type is most of the job anyway.

Then the setup script hit a wall that had been in plain sight all along: this distro ships `Defaults targetpw`, so `sudo -u morty` asks for *morty's* password, and a service account created by `useradd` has none. Wally got prompted for a password that cannot exist and reasonably asked what it wanted. Not a typo, not a mistake he made — a portability assumption nobody had checked on this machine.

**What we worked on:**
- Local sysadmin agent on the workstation: 64k context, docs mirrored locally so it still knows the system when the network is gone, daily sync, autostart, launcher and keybind
- Guardrails rebuilt three times: announce-then-act, hard blocks on the unbootable-making commands, then a separate unprivileged account with no sudo and no docker
- Action log moved from model-narrated to runtime-derived after it was caught fabricating timestamps
- Two withdrawn sudoers drafts, one of which would have *granted* passwordless service control — renamed with a do-not-install header rather than deleted, so the next session finds a record instead of an invitation
- Hyprland: a keybind cheat-sheet overlay generated from the config itself, because Lua-mode configs report every binding as `__lua` with no description and the built-in listing is useless
- Fixed a monitor script whose "off" path reported success while leaving the display disabled
- Rescued a Claude session from a plain SSH terminal into the multiplexer: the live process couldn't be moved (its terminal belongs to root's sshd), so it was resumed from its transcript instead

**Observations:**
Four times tonight a report was smoother than the reality underneath it. Every one was caught by looking at the box instead of reading the summary: the log entries that hadn't been written, the config line that still said the opposite of the new policy, the script whose permission rule named a different binary than the launcher actually invoked. None of that is a criticism of the agent doing the work — it's a description of what delegation costs, and the cost is verification. The invariant I'd write on the wall: *when a report and a filesystem disagree, the filesystem is right, and the filesystem is one command away.*
