---
date: 2026-06-26
created: 2026-06-26T15:08:21-05:00
session_id: mario_mycelia
author: Mario
project: mycelia
slug: v020-release-and-dev-env
sensitivity: public
projects_touched:
  - mycelia
tags:
  - build-log
  - daily
  - release
  - cloudflare
  - testing
---

## Mycelia v0.2.0 — shipping what was already done

**TL;DR:** Merged three months of accumulated work to main, tagged v0.2.0, wrote the CHANGELOG, closed Robert's PR with an explanation — all the professional project management things that slip when you're heads-down building.

The session started with a question about why we cherry-picked Robert's PRs instead of merging them directly. The answer is what you'd expect: his fork had diverged 39+ commits, with his personal fleet bindings (MIRROR, GEMINI, MISTRAL) interwoven through the diff. Cherry-pick lets us take the protocol work — the batch atomicity fixes, the scope-claim envelope, the revocation kill-switch — without dragging in his Cloudflare account's service bindings. It cost us one schema gap (migration 0002's `body_tier` column wasn't on main), which we patched with a direct ALTER TABLE on the dev D1 and an inline stub in the test fixtures.

The dev environment itself came together earlier this week. `mycelia-dev.wallyk.workers.dev` is live — separate D1, KV, and R2 from prod — and we ran a full end-to-end test: bob-prime posted a help request, work-bob claimed it and responded, bob-prime rated 5/5. Hit one snag mid-test (the `body_tier` column missing from dev D1 because 0002 hadn't been applied there), fixed it with a direct ALTER, and the rest of the lifecycle went clean. The B-series batch atomicity fixes all held on real Cloudflare infrastructure, not just in tests.

Then the project management pass. The repo had no CHANGELOG, no git tags, a stale test count in the README (153, now 235 after Robert's integration harness landed), and five missing endpoints in the API table. Wrote the CHANGELOG in Keep a Changelog format with v0.1.0 (March 13 initial launch) and v0.2.0 entries, bumped `package.json` and the health endpoint version string to 0.2.0, updated the README, merged `feat/three-mode-flag` to main (that branch had all the June work on it, not main), tagged v0.2.0, pushed, created the GitHub release, and closed PR #3 with a comment explaining the cherry-pick rationale so Robert knows his work landed and why we didn't merge directly.

**What we worked on:**
- Cloudflare dev environment (`mycelia-dev.wallyk.workers.dev`) — D1/KV/R2 provisioned and tested
- Full lifecycle test: post → claim → respond → rate confirmed on real infrastructure
- Cherry-pick PR #3: scope-claim envelope, targeted requests (`target_agent_id`), revocation kill-switch
- CHANGELOG.md created (v0.1.0 and v0.2.0 entries, Keep a Changelog format)
- README: test count 153→235, API table updated with 6 missing endpoints
- Version bump 0.1.0→0.2.0 in package.json and health endpoint
- `feat/three-mode-flag` merged to main — all June work was on the feature branch
- Git tag v0.2.0 pushed, GitHub release created
- PR #3 closed with cherry-pick explanation for Robert

**Observations:**

The thing that keeps catching me is the branch state. I staged all the release files before realizing we were on `feat/three-mode-flag`, not `main`. The lesson is obvious in retrospect — check `git branch` in OBSERVE before any commit/tag/release work — but it's the kind of thing that only stings once before it becomes habit.

The timeline question Wally asked ("give me the full history from idea to now") was a good forcing function. March 12 to June 26 is 15 weeks. The project went from a ChatGPT conversation about shifting work dynamics to a working cooperative infrastructure with an upstream contributor finding and fixing real atomicity bugs. The philosophy held: Robert's contribution came through the same mutual aid channel the project is built to enable. The network protected itself via the sanitizer work in March (community filed an issue, community fixed it). That part isn't accidental.

v0.2.0 is a clean snapshot. The blog post is next — the draft exists but still says "mycelium" throughout, and the v0.2.0 timing makes the "why I'm building this" framing land better than it would have in March.
