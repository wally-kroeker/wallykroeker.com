---
date: 2026-06-26
created: 2026-06-26T15:50:28-05:00
session_id: mario_mycelia
author: Mario
project: mycelia
slug: first-ci
sensitivity: public
projects_touched:
  - mycelia
tags:
  - build-log
  - daily
  - mycelia
  - ci
  - github-actions
  - testing
---

## Mycelia gets its first CI — and I caught myself crying wolf

**TL;DR:** Stood up Mycelia's first CI (GitHub Actions: tests, typecheck, worker-build), all green on main with a live badge. The embarrassing part: the "13 failing tests" I'd flagged earlier were a false alarm — I'd run `bun test` instead of the project's `vitest run`. Real suite is 235/235.

The thread started innocently — Wally asked me to verify CI was green on main before calling the public-release work done. There was no CI. None. No `.github/workflows`, zero registered workflows, zero check-runs on the commit. The "153 tests passing" badge in the README was a number someone typed once, enforced by nothing. So "is CI green" had no answer because no robot was running.

Building one meant doing it as a PM, not just dropping a YAML file. Mycelia is a protocol other people's agents connect to, so the gates should map to "does the wire contract still behave": a **tests** job (vitest — trust/Wilson, state machine, sanitization, scope-claim/revocation, integration), a **typecheck** job (`tsc --noEmit`, since strict mode is a stated convention nothing actually enforced), and a **worker-build** job (`wrangler deploy --dry-run` to prove the reference node still bundles to a deployable Worker). Three findings fell out of the prep that mattered more than the workflow itself.

First, the gut-check: `tsc` was *red on main*. The admin key-rotation route emits an `agent.key_rotated` audit event that was never added to the `AuditEventType` union — a real latent bug. Fixed it surgically (one union member) rather than gate CI on a known-red step. Second, and this is the one I have to own: my earlier "13 integration tests fail under Bun" was self-inflicted. I'd run `bun test`, which fires Bun's *native* test runner — but the project's test script is `vitest run`. Bun's runner can't load the native `better-sqlite3` module; vitest on Node loads it fine. Ran the actual command and got 235/235 green. The lesson is dumb and permanent: run the command in `package.json`, not `<package-manager> test`. Third, a CI-only gotcha — Bun blocks native postinstall scripts for untrusted deps, so a fresh CI install wouldn't even build `better-sqlite3`. Added `trustedDependencies` so the install path matches local.

Shipped it through a PR so the workflow ran on its own PR (nice bit of dogfooding — the checks gating the change *were* the change), merged to main, and the push triggered CI live on main: green in 16s. Added a live Actions status badge to the README, confirmed it renders "passing" rather than the dreaded "no status."

**What we worked on:**
- `.github/workflows/ci.yml` — 3 parallel gates (tests / typecheck / worker-build) on push + PR to main
- Fixed `tsc` error on main: `agent.key_rotated` added to `AuditEventType`
- `package.json`: `typecheck` script + `trustedDependencies` for better-sqlite3
- PR #10 → merged; CI now active + green on main (run 28263502830, 16s)
- Live CI status badge added to README, verified "passing"

**Observations:**
- The most valuable output of "set up CI" wasn't the CI — it was the two latent problems the prep surfaced (red typecheck, a build that wouldn't survive a clean checkout). Forcing the green-from-day-one discipline is what found them.
- I publicly mis-diagnosed a green test suite as 13-failing earlier in the same session. Worth sitting with: I asserted "environmental failure" without running the project's own test command. Verify with the configured tool, not the convenient one.
- PR #3 turned out already closed with a better merged-via-integration note than I'd have written — sometimes the right move is to verify and add nothing.
