---
date: 2026-10-10
created: 2026-10-10T10:10:28-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: locking-the-agent-before-loosening-it
ail: 4
sensitivity: public
projects_touched:
  - bob-prime-chat
  - fablab
tags:
  - build-log
  - daily
  - sandboxing
  - landlock
  - agent-permissions
  - tailscale
---

## Locking the agent before loosening it

**TL;DR:** Bob Mobile went from 0.13.3 to 0.16.1. The phone agent now runs under a Landlock filesystem lock. That made it reasonable to stop asking for approval on read-only shell commands and to add a time-boxed "allow everything" with fixed exceptions. A security review came before any of it went live.

The biggest complaint from the phone app was approval fatigue. Of 91 shell approvals so far, about 70 were `cd`, `ls`, `grep` and `cat`. The obvious fix is to stop asking. The standing condition from the security review, though, was: lock the secrets at the OS level first, then loosen. So the order was lock first, then loosen.

My first attempt was systemd's `InaccessiblePaths=`. The unit started, reported nothing, and hid nothing. SSH keys and `.env` stayed readable. On this machine, sandbox directives in user-scope units are quietly ignored. That's the second time a user-unit hardening directive has turned out to be decorative, so the rule is now to test the effect, not the config. Landlock does work without root.

Because Landlock only grants, never denies, the lock is built by granting the home folder minus a deny list, splitting every folder that contains a credential store. That came to 495 rules. One surprise cost a while: under Landlock, Bun opens `/` and `/home` at startup, and if it can't, it starts with an **empty environment**, with no error. Every hook then died on an undefined `HOME`. Granting directory listing on `/` fixed it, which exposes filenames but no file contents.

**What we worked on:**
- **Copy button** on code blocks, added after the HTML sanitizer, with a select-text fallback when clipboard access is refused.
- **The lock itself:** a fail-closed Landlock launcher around the agent, plus a marker the agent's process only gets once the lock is applied, so a health check can prove the live process is locked rather than assume it.
- **Fewer prompts:** look-only shell commands, piped or chained, now run without a tap.
- **"Allow everything for 2 h":** still asks for git push, deletes outside the notes folder, connections to other machines, outbound data posts, and tools that message a person.
- **Reactions:** the agent picks an emoji reaction when one fits, instead of an automatic heart on every message.
- **Nightly secret scan:** reports where and what kind, never the value.
- **"Chat about this" on backlog cards:** opens a side chat that already knows the file and line.
- **Native Web Push**, with the old notification channel kept as a fallback.
- **One config file** for everything install-specific.

**Observations:**
Landlock can't carve a secret file out of a folder the agent also needs to create files in. So the lock covers home-level credential stores, and secrets pasted into ordinary notes are left to the gate and the scan. The scan's first run found 89 files with something key-shaped, which says plenty about how keys travel.

The service runs straight from its working tree, so any restart deploys whatever is on disk. Unreviewed releases now live on a branch until sign-off, and two tests turned out to be hard-wired to the live folder.

The phone also spent a day stuck on "Syncing…". The tunnel was up and the server could ping it, but the phone never tried to connect. Its private-network name lookups had stopped answering. Watching the server port for connection attempts split "can't find it" from "server broken" in one step. Over USB debugging, the phone's own VPN log showed the OS had stopped the tunnel twice the evening before. A reboot cleared it.

Separately, an infrastructure agent confidently reported missing firewall rules on the router. The rules existed in the router's newer rule section, which it never read. One API call checking both sections caught that before anyone changed a production firewall. Agents' findings get verified the same way the code does.
