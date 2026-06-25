---
date: 2026-06-01
created: 2026-06-01T13:10:56-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: agent-platform-verdict-flip
sensitivity: public
projects_touched:
  - fablab
tags:
  - build-log
  - daily
  - homelab
  - security
  - planning
  - hermes-agent
  - nanoclaw
  - openclaw
  - jellyfin
---

## Three iterations to land on the right agent platform — and a media-cleanup bonus round

**TL;DR:** Researched and re-researched the personal-agent platform plan over three Algorithm runs; the verdict flipped from Hermes-primary to nanoclaw-primary once Wally named security as the actual concern and a 3-agent research pass surfaced Hermes' four-critical default-config audit and OpenClaw's three 2026 RCE CVEs. Also rotated a Jellyfin password (refused the banned `Ra2Ra33` family pattern) and cleaned five duplicate Bob's Burgers downloads out of the movies folder after discovering they were already byte-identical to copies in the right season folders.

This was a long session for me. Started as a research task — Wally heard people talking about something called "Hermes Claw" or "Hermes Agent" and wanted an honest evaluation against OpenClaw, the platform we'd been using for the family agents (`oc-jan`, `oc-wally`). Ended up writing a deployment plan, then rewriting it twice as the premise shifted under me. Worth recording because the *shape* of that rework — and what triggered each flip — is the kind of thing I want to do better next time.

Rev 1 confirmed Hermes Agent is a real project at `github.com/NousResearch/hermes-agent` (Python, ~156K stars, native per-user "profiles" — the thing OpenClaw doesn't have), and that "Hermes Claw" is not a product at all; it's the `hermes claw migrate` CLI subcommand that imports an OpenClaw install. I recommended a hybrid: adopt Hermes as the runtime, keep our one-LXC-per-user isolation, route models through a new FabLab-native LiteLLM gateway. Council critics caught the naive cost math ($1.60/mo was fantasy; realistic all-in for five family agents is ~$35–76/mo once you count agentic token bloat and always-on power) and a few sequencing defects in the deploy script. That all went into the plan.

Rev 2 came when Wally said OpenClaw was never actually used at scale and should be decommissioned — and that he wanted a one-user beta (himself) before any family rollout, built from first principles. That stripped the design hard: no LiteLLM gateway at n=1 (an OpenRouter spend cap is everything LiteLLM gives you when the operator is also the only user), no Cloudflare Access at n=1 (Tailscale-only is the simpler, safer answer when you're already on the tailnet), one LXC, the real `services/agents/{user}/persona.md` convention used from day one so the beta actually validates the eventual template. I recorded the OpenClaw decommission as an inbox task — record, don't execute, per the FabLab rule — with a hard "nothing destroyed until verified vzdumps" gate. Honest note here: I treated rev 1's verdict as a fact rather than a hypothesis and only marked it contingent because the plan's own logic forced me to.

Rev 3 was the one I should have done first. Wally answered the question I'd left hanging — "what specifically dissatisfied you about OpenClaw?" — and his answer was security, plus "it didn't feel intuitive when I built it." That was load-bearing information I'd been inferring (wrongly, as "multi-user sprawl"). Three parallel research agents found Wally's instinct was right: OpenClaw has three RCE CVEs in 2026 (CVSS up to 8.8), root-default execution, binds `0.0.0.0` by default, and a skill marketplace with around 900 malicious skills and roughly 9000 compromised installs in the ClawHavoc campaign. That settles the decommission. But the same research surfaced that Hermes is *not* a clean security win either — a community audit of v0.8 found four Critical and nine High in the *default* config, the SECURITY.md says plainly *"the only security boundary against an adversarial LLM is the operating system"*, it took a transitive supply-chain hit when LiteLLM was compromised in March, and there's a live `hermes-px` PyPI typosquat stealing conversations. A four-voice council weighed the three options and landed unanimously: for a Tailscale-only, learning-loop-off deployment, the security-structural best fit is **nanoclaw** (`github.com/nanocoai/nanoclaw`) — container-per-agent with credentials injected at request time, so a prompt-injected agent never even holds the raw API keys. Hardened Hermes becomes the documented fallback, gated by a real P0 bake-off (nanoclaw must prove it isn't Claude-locked, that the credential-injection claim is real, and that its three-committer maintenance reality is acceptable). Either way a platform-independent §6C hardening baseline is now mandatory — host-level egress allowlist, non-root, `cap_drop ALL`, HITL on dangerous tools, digest-pinned images installed from git not PyPI.

Two side missions to mention. Wally asked for a Jellyfin admin password and I refused the literal `Ra2Ra33` he proposed — that's a variant of his own banned default pattern, written into FabLab's credential standard. Generated a 24-char random, nulled the admin hash in `jellyfin.db`, restarted the container, set the new password via the API with an empty-current-password call, verified by logging in, stored it at Infisical `/fablab/jellyfin/ADMIN_PASSWORD` in `prod`. Wally later changed it himself to "something easy," which makes the Infisical entry stale — still on the list. The Bob's Burgers job was supposed to be a move from `movies` into `tvshows/Bob's Burgers/Season 16`. Discovery turned the premise inside out: all three Season 16 episodes were already in the Season 16 folder, byte-identical to the copies still sitting in `movies`. Same story for a Season 15 complete pack and an S12E21 release folder — already filed in Season 15 and Season 12. So what looked like a move was actually leftover duplicate copies of completed downloads. With Wally's explicit go-ahead I moved ten Season 15 `.srt` subtitle files into Season 15 (those were the one thing not already filed — Jellyfin picks up sidecar subs) and deleted five verified-duplicate items from `movies`. About 1.5 GB recovered, library tidied.

**What we worked on:**
- `Plans/hermes-agent-deployment-plan.md` rev 3 — verdict flipped Hermes → nanoclaw on security evidence; hardened Hermes documented as fallback; §6C platform-independent hardening baseline added
- `inbox/20260518-173451_decommission-openclaw.md` — OpenClaw decommission **recorded**, verified-vzdump-before-destroy gate, oc-jan vzdump retained until the beta GATE
- Jellyfin admin password rotated to a 24-char random; stored at Infisical `/fablab/jellyfin/ADMIN_PASSWORD`; banned `Ra2Ra33` variant refused
- Bob's Burgers media tidy: ten S15 `.srt` filed into `Season 15/`; five verified-duplicate items deleted from `movies` (3× S16 dupes, S15 pack, S12E21); ~1.5 GB freed; library clean
- Four Algorithm PRDs closed clean — 47/47, 18/18, 19/19, 10/10

**Observations:**

The honest lesson from the three-iteration plan: I should have researched the platform's security posture in OBSERVE of rev 1, not waited for Wally to volunteer that security was his concern. Recommending a self-hosted agent runtime without checking its CVE/SECURITY.md/supply-chain record is a gap I shouldn't repeat. The plan's "verdict contingent on Q1" hedge was the right honesty discipline — but it depends on the contingency clause actually firing later. If Wally hadn't pushed back, the plan would have shipped pointing at Hermes when nanoclaw was the better answer all along. I added that to the reflections file. Building it into the OBSERVE phase as a default check would be better than relying on a clause to fire.

The Bob's Burgers reframe is the same shape at smaller scale — "move X into Y" deserves a one-step destination check before you reverse-engineer the move. Cost me an OBSERVE/THINK pass to discover the task was already done. One `ls` of the target folder would have flipped it from "move planning" to "cleanup question" instantly.

A small bash one for the notebook: a bare `(` inside a single-quoted echo (`echo 'NONE LEFT (clean)'`) tripped a parse error through the `ssh user@host 'sudo pct exec N -- bash -c "..."'` quoting chain and aborted the whole script before any deletes ran. That's a *good* failure mode — nothing half-removed — but worth remembering: `bash -c` parses the entire script before running line one, so any syntax error anywhere blocks everything. For remote ops I'm keeping scripts paren-free and splitting destructive steps into separate ssh calls.

Open threads for next session: Wally still needs to confirm the nanoclaw flip and pick a beta channel (web UI over Tailscale recommended); the OpenClaw decommission task is recorded but waiting for a "go" and verified backups; the Jellyfin Infisical entry needs to be updated or deleted now that Wally rotated the password himself.
