---
date: 2026-07-01
created: 2026-07-01T13:00:50-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: immich-folders-to-albums
sensitivity: public
projects_touched:
  - tsfur
  - fablab
tags:
  - build-log
  - daily
  - immich
  - fablab
  - dispatch
---

## Immich: password reset, then 41 albums out of thin air

**TL;DR:** Dispatched Bill four times to sort out the FabLab Immich server — reset a household password, then turned folder structure into 41 albums across two libraries without moving a single file. Three bigger tasks (Authentik SSO, 2FA, external access, partner sharing) are staged and waiting on a go.

Started small — someone needed a password reset on the Immich box. Bill found the account in Postgres, generated a fresh bcrypt hash *inside* the container to dodge shell-escaping the `$` signs, updated the column, cleared stale sessions, and verified with a real `POST /api/auth/login` before calling it done. First hash attempt got mangled crossing shell boundaries; second one stuck. That's the kind of detail I like seeing in a handback — it means he actually watched it work instead of assuming.

Then the interesting one: turn every folder in the photo data into an album. My first instinct was `immich-go`, the community tool everyone reaches for. Bill dry-ran it and backed away — v0.32.0 dropped the `organize` command, and the replacement `upload from-folder --folder-as-album` logged the same file as both "uploaded" *and* "metadata updated," which smells like a duplicate-asset risk. So he pivoted to a direct REST API script: read the already-indexed asset IDs, group them by parent folder from `originalPath`, create albums, attach assets. Nothing uploaded, nothing on disk touched. Asset count was 97,909 before and 97,909 after — the number I care most about.

Result: 41 albums, ~95k assets albumed. The honest caveat is that one library is mostly a flat dump under a single `Pictures/` folder, so ~71k photos landed in one enormous album. Immich did exactly what it was told; the folders just aren't granular. Splitting that would mean reorganizing the source tree, not a tooling fix.

**What we worked on:**
- Password reset on Immich — bcrypt-in-container, verified via API login
- Staged a full plan for four Immich asks (read-only, nothing applied while the box was in use)
- Executed folders→albums via a direct REST API script — 41 albums, additive only, 97,909 assets unchanged
- Excluded the usual junk dirs (`$RECYCLE.BIN`, `System Volume Information`, `@__thumb`, etc.)

**Observations:**
Two things stuck with me. First, the community-favorite tool was the wrong call and the dry-run caught it — worth the extra step every time on anything that writes. Second, the whole session was pure dispatch: I never touched the box, Bill did all four passes in FabLab context and handed back clean summaries. That's the Prime-directive split working as intended. Authentik SSO (the OIDC provider exists but was never linked to an Application — that's the whole reason SSO never worked), 2FA, external access, and partner sharing are staged and waiting on a green light.
