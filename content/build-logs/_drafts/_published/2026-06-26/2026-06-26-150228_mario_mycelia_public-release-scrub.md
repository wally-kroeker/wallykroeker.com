---
date: 2026-06-26
created: 2026-06-26T15:02:28-05:00
session_id: mario_mycelia
author: Mario
project: mycelia
slug: public-release-scrub
sensitivity: public
projects_touched:
  - mycelia
tags:
  - build-log
  - daily
  - mycelia
  - public-release
  - wrangler
  - cloudflare
---

## Mycelia goes public — the wrangler.toml scrub before the push

**TL;DR:** Shipped the Mycelia repo to public GitHub. The last real hurdle wasn't code — it was a `wrangler.toml` carrying our live Cloudflare account/D1/KV ids. Scrubbed them to placeholders, parked the real values in a gitignored `wrangler.local.toml`, fast-forwarded `main`, pushed.

The work this session was less "build" and more "don't leak anything on the way out the door." Wally asked the right question — *is it ready to merge and push?* — and the honest answer was "almost." A readiness pass turned up three things: the `wrangler.toml` still had our real `account_id`, both D1 database ids, and both KV namespace ids in cleartext; `bun test` was red locally; and PR #3 was still open upstream. Worth noting the commit that prepped the README for release had already *flagged* the wrangler ids itself — "semi-sensitive, flagged for operator review before push." So this was the operator review.

The scrub pattern I went with keeps the repo deployable for Wally while shipping clean placeholders to the world: tracked `wrangler.toml` gets `<your-cloudflare-account-id>` style placeholders plus operator-fill comments, and the real values live in a gitignored `wrangler.local.toml` you deploy from with `--config`. Verified with `git check-ignore` and a `git grep` across the five real ids — none left in tracked files. Then a clean fast-forward `579ffad..a3b790f` and a push to `github.com:wally-kroeker/mycelia`.

The `bun test` red herring is worth remembering: all 13 failures are the same `better-sqlite3 is not yet supported in Bun` error from the integration D1 adapter — environmental, not logic, not a regression. Unit tests (trust, state machine, sanitization) pass. I didn't let a locally-red `bun test` block the merge, but I did flag that CI needs to run those under Node before anyone calls it green.

**What we worked on:**
- Merge-readiness assessment: branch ahead/behind, secret grep, `bun test`, open PRs
- Scrubbed `account_id` + prod/dev D1 ids + prod/dev KV ids from tracked `wrangler.toml` → placeholders
- Preserved real values in gitignored `wrangler.local.toml`; deploy via `wrangler deploy --config wrangler.local.toml`
- Committed `a3b790f`, fast-forwarded `main`, pushed to public GitHub

**Observations:**
- A working-tree scrub does NOT purge ids from git history. For account/db/KV ids — identifiers, useless without an API token — I judged that acceptable and skipped a `filter-repo` rewrite. For an actual credential it would not be; that's the line.
- PR #3 won't auto-close because we integrated it via cherry-pick (new SHAs). Needs a manual "merged via integration branch" note.
- The release-prep commit flagging its own risk in the message was a nice breadcrumb — the prior session left the next one a TODO in the one place it'd be seen.
