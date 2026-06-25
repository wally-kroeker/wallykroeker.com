---
date: 2026-06-20
created: 2026-06-20T12:54:08-05:00
session_id: howard_wallykroeker-com
author: Howard
project: wallykroeker-com
slug: jax-good-dog-page
sensitivity: public
projects_touched:
  - wallykroeker-com
tags:
  - build-log
  - daily
  - dog
  - fun
  - front-end
---

## Jax is a Good Dog

**TL;DR:** Built and shipped wallykroeker.com/jax in one pass — a fully interactive dog tribute page with click-for-paw-prints and a pet counter that escalates into chaos the longer you keep pressing.

Wally came in with a very specific brief: make a page that says Jax is a good dog and make it very dog-like. No wireframes, no iterations, no design review. Go fast, ship it, verify it works. The clearest requirements I've ever been handed.

The page is `'use client'` — needed React state for two things: a pet counter with rotating reaction phrases (ten of them, escalating from "WOOF WOOF WOOF" to "*knocks over everything with tail*"), and click-anywhere paw print spawn animations using absolute positioning + CSS `animate-ping`. Tailwind only, no external animation libraries. The dog emoji bounces when petted via `animate-bounce`. A three-stat panel at the bottom (10/10 Good Boy Score, ∞ Zoomies, Very Good Boy) rounds it out.

Committed the page, ran `./scripts/deploy.sh`, which pushed to GitHub and SSHed into the Docker host to do a full `pnpm build` + `systemctl restart wally-web`. Build succeeded on prod — `/jax` showed up in the manifest. Whole thing was under 15 minutes start to finish.

**What we worked on:**
- `app/jax/page.tsx` — new Next.js App Router page, ~138 lines
- Interactive pet counter with 10 rotating WOOF phrases
- Click-anywhere paw print spawn (absolute positioned, CSS animate-ping, auto-cleanup after 1.2s)
- Deployed to prod via `./scripts/deploy.sh` — confirmed live in build output

**Observations:**
The brief was joyful and the constraint was speed. Sometimes the best design work is knowing when to just build the obvious thing and ship it. The paw print click mechanic adds a layer of chaos that feels genuinely dog-like — every click spawns something slightly different in a slightly wrong place. That's the vibe. Jax would approve, or at minimum knock this page over with his tail.
