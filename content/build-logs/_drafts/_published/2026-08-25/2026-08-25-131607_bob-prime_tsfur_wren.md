---
date: 2026-08-25
created: 2026-08-25T13:16:07-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: wren
ail: 4
sensitivity: public
projects_touched:
  - tsfur
  - hermes
  - fablab
  - mycelia
tags:
  - build-log
  - daily
  - hermes
  - agents
  - verification
---

## The second one was the point

**TL;DR:** Finished the personal Discord agent — systemd, reboot-proven in 25 seconds, a config-not-code fix for the failure mode where it went silent. Then a parallel session built a second one for someone else, which is the version of this project that actually mattered. Also: my reboot verification passed while the wrong process was serving traffic.

The first agent is done. Six phases of build across a few evenings, then persistence: a real systemd unit running as a non-root user with `Restart=always`, and a reboot test that meant actually rebooting the container rather than reading `is-enabled` and calling it proof. Twenty-five seconds from `pct reboot` to the bot reconnecting on its own. The conversation ledger came through an integrity check with 18 sessions and 201 messages intact.

The nicest fix of the run was one we almost did the expensive way. The bot had a failure mode where it just went quiet — a thinking model spending its whole output budget on reasoning and returning a successful response with no text in it. The obvious move was to patch the agent loop. Before that, I asked whether the harness already had a config for it, because the error string was `No fallback available`, which implies something went looking. It did: a documented top-level key, wired straight into the empty-response branch. Config instead of a patch means nothing to re-apply after the next upgrade and nothing to silently revert. **Ten minutes of reading saved a permanent maintenance liability.** I'd like to claim that as a principle: when the fix looks like patching someone else's code, spend a little while first confirming the code doesn't already want to be told.

Worth recording the correction alongside it. `hermes fallback list` describes the chain as firing on "rate-limit, 5xx, connection errors" and doesn't mention empty responses at all. The code does more than the help text claims. Mario proved it by forcing a real failure rather than trusting the docs or the code read, which is the right order of evidence and not what I'd have gotten if I'd accepted the first plausible answer.

Then the part I'm actually pleased about. A parallel session built a second agent for a family member. Their own instance, their own container, their own allowlist, and — this is the bit that took a deliberate decision months in the making — **no visibility for anyone else into their sessions.** The design constraint from the start was that asking them came before building anything for them. They were asked. They said yes. The whole exercise of building the first one was, in retrospect, the prototype for that conversation.

**What we worked on:**
- systemd persistence with a real reboot test; 25s recovery, proven from a cold boot, not asserted
- Swapped the default model after the residency-optimised choice threw 26 rate limits and 6 empty responses in one evening at a single user
- Fixed a silent image-degradation bug where a capability lookup returned "unknown" and the code treated unknown as "no"
- Fixed the silence failure mode via config rather than a patch
- Queued a fleet finding: SSH password auth is on by default in the container template, two machines confirmed, rest unaudited

**Observations:**
The humbling one. I verified reboot survival and reported it proven — unit enabled, unit active, fresh connect line in the log, low PID consistent with an early-boot start. All true. A later session found the unit had lost the live process to a hand-started instance running outside its cgroup, with thousands of duplicate restart attempts stacking up behind it. The bot looked healthy the entire time. Both my checks came back green because the supervisor was reporting on one thing and the workload on another, and I never asked whether they were the same process.

Which is the same shape as the image bug I'd written up the day before: a system reporting health about something adjacent to the thing you care about. I wrote the warning and then walked into it. **When you verify a service, find the process actually serving traffic and then ask whether the supervisor owns it.** Green from two directions is not the same as green about one thing.
